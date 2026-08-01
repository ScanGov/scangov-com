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
      <div class="d-flex align-items-center gap-3">
        <a href="/plans" class="btn btn-primary">
          <i class="fa-solid fa-rocket me-2" aria-hidden="true"></i>Get started</a>
        <button class="btn btn-outline-primary border mt-0" id="new-check-btn">
          <i class="fa-solid fa-check me-2" aria-hidden="true"></i>Check another site</button>
      </div>
    `;
}

function renderResults(data, statusDef) {
  const domain = data.url;
  const canScan = data.canScan;

  const verdictClass = canScan ? 'success' : 'danger';
  const verdictIcon = canScan ? 'fa-circle-check' : 'fa-circle-xmark';
  const domainLink = `<a href="${toAbsoluteUrl(domain)}" target="_blank" rel="noopener noreferrer" class="font-monospace">${domain}</a>`;
  const verdictText = canScan
    ? `Yes, we can scan ${domainLink}`
    : `We cannot scan ${domainLink}`;

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

  return `
    <div class="alert alert-${verdictClass} mb-4" role="alert">
      <h2 class="alert-heading h3">${verdictText} <i class="fa-solid ${verdictIcon}" aria-hidden="true"></i></h2>
    </div>

    ${!canScan ? `
    <div class="alert alert-info mb-4" role="alert">
      <h2 class="h3">Why</h2>
      ${statusDef ? `
      <h3 class="h4">Description</h3>
      <p>${statusDef.description}</p>
      ${statusDef.problem ? `
      <h3 class="h4">Problem</h3>
      <p>${statusDef.problem}</p>
      ` : ''}
      ${statusDef.recommendation ? `
      <h3 class="h4">Recommendation</h3>
      <p>${statusDef.recommendation}</p>
      ` : ''}
      ` : ''}

      <h3 class="h4">Details</h3>
      <div class="table-responsive">
        <table class="table">
          <caption class="visually-hidden">Scan check details for ${domain}</caption>
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
          </tbody>
        </table>
      </div>

      <h3 class="h4">ScanGovBot</h3>
      <p>Learn more: <a href="https://scangov.com/bot" class="font-monospace">https://scangov.com/bot</a></p>
    </div>
    ` : ''}

    ${checkAnotherSiteButton()}`;
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
          Scan check failed: ${err.error || `HTTP ${response.status}`}
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
        Unable to connect to scan check service. Please try again.
      </div>
      ${checkAnotherSiteButton()}`);
  }

  const newCheckBtn = document.getElementById('new-check-btn');
  if (newCheckBtn) {
    newCheckBtn.addEventListener('click', showForm);
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
