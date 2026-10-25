
function shareLink(site) {
  return `${location.origin}${location.pathname}?url=${encodeURIComponent(site)}`;
}

function wireCopyButtons(site, ari, fk, info) {
  const status = document.getElementById('copy-status');
  const copy = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = message;
    } catch {
      status.textContent = 'Could not copy.';
    }
  };
  document.getElementById('copy-text').addEventListener('click', () => {
    const text = [
      'Readability scan',
      `URL: ${site}`,
      `Automated Readability Index (ARI): ${isNaN(ari) ? '--' : ari} (goal: 8 or below)`,
      `Flesch-Kincaid (FK): ${isNaN(fk) ? '--' : fk} (goal: 8 or below)`,
      `Characters: ${info.characters}`,
      `Words: ${info.words}`,
      `Sentences: ${info.sentences}`,
      `Text length: ${info.textLength}`,
      `Details: ${shareLink(site)}`,
    ].join('\n');
    copy(text, 'Copied the results.');
  });
  document.getElementById('copy-link').addEventListener('click', () => {
    copy(shareLink(site), 'Copied the link.');
  });
}

const form = document.getElementById('readability-form');
const formSection = document.getElementById('scan-form');

function resetScan() {
  const resultsEl = document.getElementById('scan_results');
  const siteInput = document.querySelector('input[name="site"]');
  resultsEl.innerHTML = '';
  form.reset();
  siteInput.value = '';
  formSection.classList.remove('d-none');
  siteInput.focus();
  history.replaceState(null, '', location.pathname);
}
form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const site = document.querySelector('input[name="site"]').value;
  const submitButton = document.getElementById('submitbutton');
  const resultsEl = document.getElementById('scan_results');
  submitButton.innerHTML = 'Checking...'

  if (/localhost|127\.0\.0\.1/.test(site)) {
    resultsEl.innerHTML = `
      <div class="alert alert-warning">
        <strong>Public URL required.</strong> <p>Enter a publicly accessible URL. Local addresses cannot be scanned.</p>
      </div>`;
    submitButton.innerHTML = 'Check';
    return;
  }

  try {
    const readabilityReq = await fetch(`https://my.scangov.com/tools/readabilityreview?url=${site}`);
    const readabilityInfo = await readabilityReq.json();

    // Round the way the ScanGov scan does (Math.round(ARI) <= 8 passes), so this
    // tool agrees with the public scorecards.
    const ari = Math.round(readabilityInfo.automatedReadabilityIndex);
    const fk = Math.round(readabilityInfo.fleschKincaidGrade);

    let cardClass = 'warning';
    if (ari > 9) cardClass = 'danger';
    else if (ari <= 8) cardClass = 'success';

    let fleschKCardClass = 'warning';
    if (fk > 9) fleschKCardClass = 'danger';
    else if (fk <= 8) fleschKCardClass = 'success';

    if (readabilityInfo.status === 'error' || isNaN(ari)) {
      const reason = readabilityInfo.message
        ? `<p>${readabilityInfo.message}</p>`
        : `<p>The website may block external tools from analyzing pages. Try a different page or website.</p>`;
      resultsEl.innerHTML = `
        <div class="alert alert-danger">
          <svg class="fa-solid fa-face-frown" aria-hidden="true"><use href="#fas-fa-face-frown"></use></svg> <strong>Scan error.</strong> ${reason}
        </div>`;
    } else {
      resultsEl.innerHTML = `
        <h2>Grade</h2>
        <div class="row">
          <div class="col-12 col-sm-12 col-md-6 col-lg-5 d-flex align-items-stretch">
            <div class="card mb-3 text-bg-${cardClass}">
              <div class="card-header">
                Automated Readability Index (ARI) <a href="https://standards.scangov.org/automated-readability-index/" class="cardlink"><svg class="fa-solid fa-circle-question" aria-hidden="true"><use href="#fas-fa-circle-question"></use></svg></a>
              </div>
              <span class="card-body d-flex align-items-center justify-content-center text-decoration-none">
                <div class="display-1">${isNaN(ari) ? '--' : ari}</div>
              </span>
              <span class="card-footer cardlink">Goal: 8 (or below)</span>
            </div>
          </div>
          <div class="col-12 col-sm-12 col-md-6 col-lg-5 d-flex align-items-stretch">
            <div class="card mb-3 text-bg-${fleschKCardClass}">
              <div class="card-header">
                Flesch-Kincaid (FK) <a href="https://standards.scangov.org/flesch-kincaid/" class="cardlink"><svg class="fa-solid fa-circle-question" aria-hidden="true"><use href="#fas-fa-circle-question"></use></svg></a>
              </div>
              <span class="card-body d-flex align-items-center justify-content-center text-decoration-none">
                <div class="display-1">${isNaN(fk) ? '--' : fk}</div>
              </span>
              <span class="card-footer cardlink">Goal: 8 (or below)</span>
            </div>
          </div>
        </div>
        <h2>Page</h2>
        <ul>
          <li>URL: <a href="${site}">${site}</a></li>
          <li>Characters: ${readabilityInfo.characters}</li>
          <li>Words: ${readabilityInfo.words}</li>
          <li>Sentences: ${readabilityInfo.sentences}</li>
          <li>Text length: ${readabilityInfo.textLength}</li>
        </ul>
        <div class="accordion mt-4">
          <div class="accordion-item">
            <h2 class="accordion-header" id="scanned-heading">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#scanned-collapse" aria-expanded="false" aria-controls="scanned-collapse">
                <svg class="fa-solid fa-file-lines me-2" aria-hidden="true"><use href="#fas-fa-file-lines"></use></svg>What we scanned
              </button>
            </h2>
            <div id="scanned-collapse" class="accordion-collapse collapse" aria-labelledby="scanned-heading">
              <div class="accordion-body">
                <div id="scanned-text" style="white-space: pre-line"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-wrap gap-2 mt-3">
          <button type="button" class="btn btn-outline-primary" id="reset-scan"><svg class="fa-solid fa-rotate-left" aria-hidden="true"><use href="#fas-fa-rotate-left"></use></svg> Reset</button>
          <button type="button" class="btn btn-outline-primary" id="copy-link"><svg class="fa-solid fa-link" aria-hidden="true"><use href="#fas-fa-link"></use></svg> Copy link</button>
          <button type="button" class="btn btn-outline-primary" id="copy-text"><svg class="fa-solid fa-copy" aria-hidden="true"><use href="#fas-fa-copy"></use></svg> Copy text</button>
          <span id="copy-status" class="align-self-center" role="status"></span>
        </div>`;
      document.getElementById('scanned-text').textContent = readabilityInfo.textContent;
      wireCopyButtons(site, ari, fk, readabilityInfo);
      formSection.classList.add('d-none');
      document.getElementById('reset-scan').addEventListener('click', resetScan);
    }
  } catch {
    resultsEl.innerHTML = `
      <div class="alert alert-danger">
        <svg class="fa-solid fa-face-frown" aria-hidden="true"><use href="#fas-fa-face-frown"></use></svg> Scan error: Unable to connect. Please try again.
      </div>`;
  } finally {
    submitButton.innerHTML = 'Check';
  }
})

// A shared link carries the page in ?url=. Fill the field and run the check.
const sharedUrl = new URLSearchParams(location.search).get('url');
if (sharedUrl) {
  document.querySelector('input[name="site"]').value = sharedUrl;
  form.requestSubmit();
}
