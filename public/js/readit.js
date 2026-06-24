const form = document.querySelector('.input-validation-required');
form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const site = document.querySelector('input[name="site"]').value;
  const submitButton = document.getElementById('submitbutton');
  const resultsEl = document.getElementById('scan_results');
  submitButton.innerHTML = 'Scanning...'

  if (/localhost|127\.0\.0\.1/.test(site)) {
    resultsEl.innerHTML = `
      <div class="alert alert-warning">
        <strong>Public URL required.</strong> <p>Enter a publicly accessible URL. Local addresses cannot be scanned.</p>
      </div>`;
    submitButton.innerHTML = 'Scan';
    return;
  }

  try {
    const readabilityReq = await fetch(`https://my.scangov.com/tools/readabilityreview?url=${site}`);
    const readabilityInfo = await readabilityReq.json();

    const ari = parseInt(readabilityInfo.automatedReadabilityIndex);
    const fk = parseInt(readabilityInfo.fleschKincaidGrade);

    let cardClass = 'warning';
    if (readabilityInfo.automatedReadabilityIndex > 9) cardClass = 'danger';
    else if (readabilityInfo.automatedReadabilityIndex <= 8) cardClass = 'success';

    let fleschKCardClass = 'warning';
    if (readabilityInfo.fleschKincaidGrade > 9) fleschKCardClass = 'danger';
    else if (readabilityInfo.fleschKincaidGrade <= 8) fleschKCardClass = 'success';

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
                Automated Readability Index (ARI) <a href="https://standards.scangov.org/readability" class="cardlink"><svg class="fa-solid fa-circle-question" aria-hidden="true"><use href="#fas-fa-circle-question"></use></svg></a>
              </div>
              <span class="card-body text-center pt-5 text-decoration-none">
                <p class="display-1">${isNaN(ari) ? '--' : ari}</p>
              </span>
              <span class="card-footer text-center cardlink">Goal: 8 (or below)</span>
            </div>
          </div>
          <div class="col-12 col-sm-12 col-md-6 col-lg-5 d-flex align-items-stretch">
            <div class="card mb-3 text-bg-${fleschKCardClass}">
              <div class="card-header">
                Flesch-Kincaid (FK) <a href="https://standards.scangov.org/readability" class="cardlink"><svg class="fa-solid fa-circle-question" aria-hidden="true"><use href="#fas-fa-circle-question"></use></svg></a>
              </div>
              <span class="card-body text-center pt-5 text-decoration-none">
                <p class="display-1">${isNaN(fk) ? '--' : fk}</p>
              </span>
              <span class="card-footer text-center cardlink">Goal: 8 (or below)</span>
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
        <h2>Content</h2>
        <label>What we scanned:</label>
        <textarea class="form-control">${readabilityInfo.textContent}</textarea>
        <h2>Method</h2>
        <p>We use the public equations for the <a href="https://standards.scangov.org/automated-readability-index/">Automated Readability Index (ARI)</a> and <a href="https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests">Flesch Kincaid</a> to determine these grades. The ARI counts characters, words, and sentences in the text. Flesch Kincaid takes syllable counts into account as well. We reviewed the webpage and pulled out the main content. Some parts of the page, like headers, didn't have punctuation marks. We added these sections to the end of the main text and put periods at the end of them. This lets the ARI program grade all the content fairly.</p>`;
    }
  } catch {
    resultsEl.innerHTML = `
      <div class="alert alert-danger">
        <svg class="fa-solid fa-face-frown" aria-hidden="true"><use href="#fas-fa-face-frown"></use></svg> Scan error: Unable to connect. Please try again.
      </div>`;
  } finally {
    submitButton.innerHTML = 'Scan';
  }
})
