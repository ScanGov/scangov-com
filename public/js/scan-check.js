const API_BASE = 'https://audits.my.scangov.com';

const form = document.getElementById('scan-check-form');
const formSection = document.getElementById('scan-form');
const loadingSection = document.getElementById('scan-loading');
const resultsSection = document.getElementById('scan-results');
const siteInput = document.getElementById('site');

function showForm() {
  formSection.classList.remove('d-none');
  loadingSection.classList.add('d-none');
  resultsSection.classList.add('d-none');
  siteInput.value = '';
  siteInput.focus();
  location.hash = '';
}

function showLoading() {
  formSection.classList.add('d-none');
  loadingSection.classList.remove('d-none');
  resultsSection.classList.add('d-none');
}

function showResults(html) {
  formSection.classList.add('d-none');
  loadingSection.classList.add('d-none');
  resultsSection.innerHTML = html;
  resultsSection.classList.remove('d-none');
}

function statusBadge(success) {
  if (success) {
    return '<span class="badge text-bg-success">Success</span>';
  }
  return '<span class="badge text-bg-danger">Failed</span>';
}

function renderResults(data) {
  const domain = data.url;
  const canScan = data.canScan;

  const verdictClass = canScan ? 'success' : 'danger';
  const verdictText = canScan
    ? 'Yes, we can scan this site'
    : 'We cannot scan this site';

  let fetchDetail = '';
  if (data.fetch) {
    fetchDetail = `
      <tr>
        <td>HTTP fetch</td>
        <td>${statusBadge(data.fetch.success)}</td>
        <td>${data.fetch.statusCode || '--'}</td>
        <td>${data.fetch.error || '--'}</td>
      </tr>`;
  }

  let playwrightDetail = '';
  if (data.playwright === null) {
    playwrightDetail = `
      <tr>
        <td>Playwright browser</td>
        <td><span class="badge text-bg-secondary">Not needed</span></td>
        <td>--</td>
        <td>--</td>
      </tr>`;
  } else if (data.playwright) {
    playwrightDetail = `
      <tr>
        <td>Playwright browser</td>
        <td>${statusBadge(data.playwright.success)}</td>
        <td>${data.playwright.statusCode || '--'}</td>
        <td>${data.playwright.error || '--'}</td>
      </tr>`;
  }

  return `
    <div class="card text-bg-${verdictClass} mb-4">
      <div class="card-body text-center py-4">
        <h2 class="card-title h4 mb-1">${verdictText}</h2>
        <p class="card-text mb-0">${domain}</p>
      </div>
    </div>

    <h3>Details</h3>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Result</th>
            <th>Status code</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>
          ${fetchDetail}
          ${playwrightDetail}
        </tbody>
      </table>
    </div>

    <div class="mt-3">
      <button class="btn btn-primary me-2" id="retry-btn">Run again</button>
      <button class="btn btn-outline-secondary" id="new-check-btn">Check another site</button>
    </div>`;
}

async function runScan(domain) {
  showLoading();
  location.hash = domain;

  try {
    const response = await fetch(`${API_BASE}/scan-check?url=${encodeURIComponent(domain)}`);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      showResults(`
        <div class="alert alert-danger">
          Scan check failed: ${err.error || `HTTP ${response.status}`}
        </div>
        <div class="mt-3">
          <button class="btn btn-primary me-2" id="retry-btn">Run again</button>
          <button class="btn btn-outline-secondary" id="new-check-btn">Check another site</button>
        </div>`);
    } else {
      const data = await response.json();
      showResults(renderResults(data));
    }
  } catch {
    showResults(`
      <div class="alert alert-danger">
        Unable to connect to scan check service. Please try again.
      </div>
      <div class="mt-3">
        <button class="btn btn-primary me-2" id="retry-btn">Run again</button>
        <button class="btn btn-outline-secondary" id="new-check-btn">Check another site</button>
      </div>`);
  }

  const retryBtn = document.getElementById('retry-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => runScan(domain));
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
