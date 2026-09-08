const API_BASE = 'https://audits.my.scangov.com';
const STATUS_DEFS_URL = 'https://raw.githubusercontent.com/ScanGov/data/refs/heads/main/status.json';

let statusDefsPromise = null;
function getStatusDefs() {
  if (!statusDefsPromise) {
    statusDefsPromise = fetch(STATUS_DEFS_URL).then((r) => r.json()).catch(() => []);
  }
  return statusDefsPromise;
}

function resolveStatusCode(data) {
  // robots.txt blocks map to the "Request Denied" definition
  if (data.blockedBy === 'robots' || data.blockedBy === 'crawl-delay') return 999;
  if (data.fetch && data.fetch.statusCode) return data.fetch.statusCode;
  if (data.playwright && data.playwright.statusCode) return data.playwright.statusCode;
  return null;
}

const form = document.getElementById('scan-check-form');
const formSection = document.getElementById('scan-form');
const loadingSection = document.getElementById('scan-loading');
const resultsSection = document.getElementById('scan-results');
const siteInput = document.getElementById('site');
const loadingDomain = document.getElementById('loading-domain');

function showForm() {
  formSection.classList.remove('d-none');
  loadingSection.classList.add('d-none');
  resultsSection.classList.add('d-none');
  siteInput.value = '';
  siteInput.focus();
  location.hash = '';
}

function showLoading(domain) {
  formSection.classList.add('d-none');
  loadingSection.classList.remove('d-none');
  resultsSection.classList.add('d-none');
  loadingDomain.textContent = domain;
}

function showResults(html) {
  formSection.classList.add('d-none');
  loadingSection.classList.add('d-none');
  resultsSection.innerHTML = html;
  resultsSection.classList.remove('d-none');
}

function statusText(success) {
  return success ? 'Success' : 'Failed';
}

function toAbsoluteUrl(domain) {
  return /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
}

function checkAnotherSiteButton() {
  return `
      <button class="btn btn-outline-primary border mt-0" id="new-check-btn">
        <i class="fa-solid fa-check me-2" aria-hidden="true"></i>Check another site</button>
    `;
}

function renderResults(data, statusDef) {
  const domain = data.url;
  const canScan = data.canScan;

  const verdictClass = canScan ? 'success' : 'danger';
  const verdictIcon = canScan ? 'fa-circle-check' : 'fa-circle-xmark';
  const domainLink = `<a href="${toAbsoluteUrl(domain)}" target="_blank" rel="noopener noreferrer" class="font-monospace">${domain}</a>`;
  const verdictText = canScan
    ? `ScanGov can scan ${domainLink}`
    : `We can't scan ${domainLink}`;

  let fetchDetail = '';
  if (data.fetch) {
    fetchDetail = `
      <tr>
        <td>HTTP fetch</td>
        <td>${statusText(data.fetch.success)}</td>
        <td>${data.fetch.statusCode || '—'}</td>
        <td>${data.fetch.error || '—'}</td>
      </tr>`;
  }

  let playwrightDetail = '';
  if (data.playwright === null) {
    playwrightDetail = `
      <tr>
        <td>Playwright browser</td>
        <td>Not needed</td>
        <td>—</td>
        <td>—</td>
      </tr>`;
  } else if (data.playwright) {
    playwrightDetail = `
      <tr>
        <td>Playwright browser</td>
        <td>${statusText(data.playwright.success)}</td>
        <td>${data.playwright.statusCode || '—'}</td>
        <td>${data.playwright.error || '—'}</td>
      </tr>`;
  }

  let robotsDetail = '';
  if (data.robots) {
    const r = data.robots;
    const result = r.fetchStatus !== 'success' ? 'No robots.txt (allowed)'
      : !r.allowed ? 'Disallowed for ScanGovBot'
      : r.crawlDelayBlocked ? `Crawl-delay too long (${r.crawlDelay}s)`
      : 'Allowed';
    robotsDetail = `
      <tr>
        <td>robots.txt</td>
        <td>${result}</td>
        <td>${r.crawlDelay ? `delay ${r.crawlDelay}s` : '—'}</td>
        <td>${!r.allowed ? 'ScanGovBot is disallowed by the site\'s robots.txt' : r.crawlDelayBlocked ? 'Requested crawl-delay is above our limit' : '—'}</td>
      </tr>`;
  }

  const robotsBlocked = data.blockedBy === 'robots' || data.blockedBy === 'crawl-delay';

  return `
    <div class="alert alert-${verdictClass} mb-4" role="alert">
      <h2 class="alert-heading h3"><i class="fa-solid ${verdictIcon} me-2" aria-hidden="true"></i>${verdictText}</h2>
    </div>

    <div class="alert alert-info mb-4" role="alert">
      ${!canScan ? `
      ${statusDef ? `
      ${statusDef.problem ? `
      <h2 class="h3">Problem</h2>
      <p>${statusDef.problem}</p>
      ` : ''}
      ${statusDef.recommendation ? `
      <h2 class="h3">Recommendation</h2>
      <p>${statusDef.recommendation}</p>
      ` : ''}
      ${statusDef.recommendationTechnical ? `
      <h2 class="h3">Technical recommendation</h2>
      <p>${statusDef.recommendationTechnical}</p>
      ` : ''}
      ` : ''}

      ${robotsBlocked ? `
      <p>The site loads, but its <code>robots.txt</code> tells ScanGovBot not to crawl it. ScanGov honours robots.txt, so this site is not scanned until the file allows <code>ScanGovBot</code>.</p>
      ` : ''}

      <h2 class="h3">Details</h2>
      <div class="table-responsive">
        <table class="table">
          <caption class="visually-hidden">Good bot scan details for ${domain}</caption>
          <thead>
            <tr>
              <th scope="col">Method</th>
              <th scope="col">Result</th>
              <th scope="col">Code</th>
              <th scope="col">Error</th>
            </tr>
          </thead>
          <tbody>
            ${fetchDetail}
            ${playwrightDetail}
            ${robotsDetail}
          </tbody>
        </table>
      </div>
      ` : ''}

      <h2 class="h3">Report</h2>
      <p>Copy this link to share these results:</p>
      <div class="input-group">
        <label for="report-url" class="visually-hidden">Report link</label>
        <input type="text" class="form-control font-monospace" id="report-url" readonly>
        <button class="btn btn-outline-primary border mt-0" type="button" id="copy-report-btn">
          <i class="fa-solid fa-copy me-2" aria-hidden="true"></i>Copy</button>
      </div>

    </div>

    ${checkAnotherSiteButton()}`;
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

async function runScan(domain) {
  showLoading(domain);
  location.hash = domain;

  try {
    const [response, statusDefs] = await Promise.all([
      fetch(`${API_BASE}/scan-check?url=${encodeURIComponent(domain)}`),
      getStatusDefs(),
    ]);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      showResults(`
        <div class="alert alert-danger" role="alert">
          Good bot scan failed: ${err.error || `HTTP ${response.status}`}
        </div>
        ${checkAnotherSiteButton()}`);
    } else {
      const data = await response.json();
      const statusDef = statusDefs.find((s) => s.code === resolveStatusCode(data));
      showResults(renderResults(data, statusDef));
    }
  } catch {
    showResults(`
      <div class="alert alert-danger" role="alert">
        Unable to connect to the good bot scan service. Please try again.
      </div>
      ${checkAnotherSiteButton()}`);
  }

  const newCheckBtn = document.getElementById('new-check-btn');
  if (newCheckBtn) {
    newCheckBtn.addEventListener('click', showForm);
  }

  wireReportLink(domain);
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
