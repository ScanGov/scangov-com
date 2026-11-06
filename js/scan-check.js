/*
 * Good bot scan page: start a scan-check job on the auditor, poll it, and show
 * each step as it lands. Rendering lives in scan-check-render.js (tested).
 *
 * Flow (auditor docs/good-bot-scan-lighthouse-plan.md): GET /scan-check?url=
 * starts the job and returns { jobId, status, robots }; GET /scan-check?jobId=
 * returns the job with steps, verdict, code, reason, refusals and attribution.
 * The job runs the same requests the audit runs, Lighthouse's Chrome included,
 * so the verdict is what an audit of this site would conclude today.
 */
import {
  resolveStatusCode, renderProgress, renderResults, renderError, renderTooLong,
} from './scan-check-render.js';

const API_BASE = 'https://audits.my.scangov.com';
// Published at build time from ScanGov/data status.json (see _data/statusDefs.js).
const STATUS_DEFS_URL = '/data/status.json';
const POLL_INTERVAL_MS = 4000;
const GIVE_UP_AFTER_MS = 90000;

let statusDefsPromise = null;
function getStatusDefs() {
  if (!statusDefsPromise) {
    statusDefsPromise = fetch(STATUS_DEFS_URL).then((r) => r.json()).catch(() => []);
  }
  return statusDefsPromise;
}

const form = document.getElementById('scan-check-form');
const formSection = document.getElementById('scan-form');
const loadingSection = document.getElementById('scan-loading');
const progressSection = document.getElementById('scan-progress');
const resultsSection = document.getElementById('scan-results');
const siteInput = document.getElementById('site');

let activeRun = 0; // a new check abandons the polling of the previous one

function showForm() {
  activeRun++;
  formSection.classList.remove('d-none');
  loadingSection.classList.add('d-none');
  resultsSection.classList.add('d-none');
  siteInput.value = '';
  siteInput.focus();
  location.hash = '';
}

function showLoading(html) {
  formSection.classList.add('d-none');
  resultsSection.classList.add('d-none');
  progressSection.innerHTML = html;
  loadingSection.classList.remove('d-none');
}

function showResults(html) {
  formSection.classList.add('d-none');
  loadingSection.classList.add('d-none');
  resultsSection.innerHTML = html;
  resultsSection.classList.remove('d-none');
  const newCheckBtn = document.getElementById('new-check-btn');
  if (newCheckBtn) newCheckBtn.addEventListener('click', showForm);
}

function wireReportLink(domain) {
  const input = document.getElementById('report-url');
  const button = document.getElementById('copy-report-btn');
  if (!input || !button) return;

  input.value = `${location.origin}${location.pathname}#${encodeURIComponent(domain)}`;

  button.addEventListener('click', async () => {
    input.select();
    try {
      await navigator.clipboard.writeText(input.value);
      const original = button.innerHTML;
      button.innerHTML = '<i class="fa-solid fa-check me-2" aria-hidden="true"></i>Copied';
      setTimeout(() => {
        button.innerHTML = original;
      }, 2000);
    } catch {
      // Clipboard unavailable - the link stays selected for a manual copy.
    }
  });
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readJson(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
  return body;
}

async function runScan(domain) {
  const run = ++activeRun;
  location.hash = domain;
  showLoading(renderProgress({ steps: {}, robots: null }, domain));

  let job;
  try {
    const [started, statusDefs] = await Promise.all([
      fetch(`${API_BASE}/scan-check?url=${encodeURIComponent(domain)}`).then(readJson),
      getStatusDefs(),
    ]);
    job = started;
    if (run !== activeRun) return;
    showLoading(renderProgress(job, domain));

    const startedAt = Date.now();
    while (job.status === 'running') {
      if (Date.now() - startedAt > GIVE_UP_AFTER_MS) {
        showResults(renderTooLong(domain));
        return;
      }
      await wait(POLL_INTERVAL_MS);
      if (run !== activeRun) return;
      job = await fetch(`${API_BASE}/scan-check?jobId=${encodeURIComponent(job.jobId)}`).then(readJson);
      if (run !== activeRun) return;
      if (job.status === 'running') showLoading(renderProgress(job, domain));
    }

    if (job.status === 'error') {
      showResults(renderError(`Good bot scan failed: ${job.error || 'the check did not finish'}`));
      return;
    }
    const statusDef = statusDefs.find((s) => s.code === resolveStatusCode(job));
    showResults(renderResults(job, statusDef, domain));
    wireReportLink(domain);
  } catch (error) {
    if (run !== activeRun) return;
    showResults(renderError(error.message && !/fetch/i.test(error.message)
      ? `Good bot scan failed: ${error.message}`
      : 'Unable to connect to the good bot scan service. Please try again.'));
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const domain = siteInput.value.trim();
  if (domain) {
    runScan(domain);
  }
});

// Auto-scan if hash is present on page load
const hash = location.hash.slice(1);
if (hash) {
  siteInput.value = decodeURIComponent(hash);
  runScan(decodeURIComponent(hash));
}
