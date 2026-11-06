/*
 * Good bot scan: turn the auditor's /scan-check job into page markup. Pure
 * functions, no DOM access, so they can be tested with node:test
 * (test/scan-check-render.test.mjs). public/js/scan-check.js wires them to the page.
 *
 * The job (auditor GET /scan-check?jobId=, plan: auditor
 * docs/good-bot-scan-lighthouse-plan.md):
 *   status    'running' | 'done' | 'error'
 *   verdict   'allowed' | 'allowed-with-refusals' | 'blocked' | 'failed' | null while running
 *   code      the status code the audit would have stored (996-999, an HTTP code, 994)
 *   reason    the audit's reason text
 *   refusals  steps the site turned away although the scan browser got the page:
 *             'plainFetch' | 'playwright' | 'robots'
 *   steps     { plainFetch, playwright, lighthouse }, each { ran, success, statusCode,
 *             finalUrl, challenge, error, blockPage, ... }
 *   robots    { allowed, crawlDelay, crawlDelayBlocked, fetchStatus, statusCode, challenge }
 *   attribution { edge, operator, platform, network, dns } with evidence and confidence
 */

export const SCANGOV_IP = '44.236.34.143';

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function toAbsoluteUrl(domain) {
  return /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
}

// The status.json entry to explain the result with. The auditor sends the code the
// audit would have stored; older responses are mapped the old way.
export function resolveStatusCode(data) {
  if (Number.isInteger(data?.code)) return data.code;
  if (data?.blockedBy === 'robots') return 998;
  if (data?.blockedBy === 'crawl-delay') return 997;
  if (data?.blockedBy === 'challenge' || data?.challenge) return 996;
  const lh = data?.steps?.lighthouse;
  if (lh?.ran && Number.isInteger(lh.statusCode) && lh.statusCode !== 200) return lh.statusCode;
  return null;
}

// What the page calls each request
export const STEP_LABELS = {
  plainFetch: 'Basic request',
  playwright: 'Headless browser',
  lighthouse: 'Scan browser (Lighthouse)',
  robots: 'robots.txt',
};

const REFUSAL_WORDS = {
  plainFetch: 'our basic request',
  playwright: 'our headless browser',
  robots: 'our request for robots.txt',
};

function httpNote(statusCode) {
  return Number.isInteger(statusCode) ? ` (HTTP ${statusCode})` : '';
}

// One plain sentence fragment per refused step: "turned away our basic request (HTTP 403)"
export function refusalPhrases(data) {
  const out = [];
  for (const key of data?.refusals || []) {
    const what = REFUSAL_WORDS[key];
    if (!what) continue;
    if (key === 'robots') {
      const r = data.robots || {};
      out.push(r.challenge ? `served a challenge page for ${what}` : `turned away ${what}${httpNote(r.statusCode)}`);
      continue;
    }
    const step = data.steps?.[key] || {};
    out.push(step.challenge ? `served a challenge page to ${what}${httpNote(step.statusCode)}` : `turned away ${what}${httpNote(step.statusCode)}`);
  }
  return out;
}

function joinList(items) {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

// How a step reads in the table
export function describeStep(key, step, robots) {
  if (key === 'robots') {
    const r = robots;
    if (!r) return { result: 'Waiting', code: '', note: '' };
    if (r.fetchStatus === 'not_found') return { result: 'No robots.txt (allowed)', code: r.statusCode ?? '', note: 'A missing robots.txt lets every bot in.' };
    if (r.challenge) return { result: 'Challenge page', code: r.statusCode ?? '', note: 'The site served a challenge page instead of robots.txt.' };
    if (r.fetchStatus !== 'success') {
      const refused = [401, 403, 429].includes(Number(r.statusCode));
      return { result: refused ? 'Refused' : 'Not readable (allowed)', code: r.statusCode ?? '', note: refused ? 'The site turned away the request for robots.txt. We treat an unreadable file as allowing bots, but a refusal here is a block of its own.' : 'We could not read robots.txt, so we treat it as allowing bots.' };
    }
    if (!r.allowed) return { result: 'Disallowed', code: r.statusCode ?? '', note: 'robots.txt tells ScanGovBot to stay out.' };
    if (r.crawlDelayBlocked) return { result: 'Crawl-delay too long', code: r.statusCode ?? '', note: `robots.txt asks for a ${r.crawlDelay}s wait between visits, above our limit.` };
    return { result: 'Allowed', code: r.statusCode ?? '', note: r.crawlDelay ? `Crawl-delay ${r.crawlDelay}s.` : '' };
  }
  const s = step || {};
  if (!s.ran) {
    if (key === 'playwright' && s.success === null && s.skipped) return { result: 'Not needed', code: '', note: 'The basic request got the page.' };
    return { result: 'Waiting', code: '', note: '' };
  }
  const code = Number.isInteger(s.statusCode) ? s.statusCode : '';
  const where = s.finalUrl && s.finalUrl !== s.requestedUrl ? '' : '';
  if (s.success) return { result: 'Got the page', code, note: where };
  if (s.timedOut) return { result: 'Timed out', code, note: 'The page did not finish loading in time.' };
  if (s.challenge) return { result: 'Challenge page', code, note: s.blockPage?.title ? `Page title: ${s.blockPage.title}` : (s.error || '') };
  if ([401, 403, 429].includes(Number(s.statusCode))) return { result: 'Refused', code, note: s.blockPage?.title ? `Page title: ${s.blockPage.title}` : '' };
  if (s.runtimeError?.code) return { result: 'Failed', code, note: s.runtimeError.message || s.runtimeError.code };
  return { result: 'Failed', code, note: s.error || '' };
}

export function renderStepsTable(data, domain) {
  const steps = data?.steps || {};
  // The headless browser only runs when the basic request failed
  const playwright = steps.playwright?.ran ? steps.playwright
    : (steps.plainFetch?.ran && steps.plainFetch.success) ? { ran: false, success: null, skipped: true }
    : steps.playwright;
  const rows = [
    ['plainFetch', steps.plainFetch],
    ['playwright', playwright],
    ['lighthouse', steps.lighthouse],
    ['robots', null],
  ].map(([key, step]) => {
    const d = describeStep(key, step, key === 'robots' ? data?.robots : undefined);
    return `
            <tr>
              <th scope="row">${STEP_LABELS[key]}</th>
              <td>${escapeHtml(d.result)}</td>
              <td>${escapeHtml(d.code === '' ? '—' : d.code)}</td>
              <td>${d.note ? escapeHtml(d.note) : '—'}</td>
            </tr>`;
  }).join('');
  return `
      <div class="table-responsive">
        <table class="table">
          <caption class="visually-hidden">Good bot scan steps for ${escapeHtml(domain)}</caption>
          <thead>
            <tr>
              <th scope="col">Request</th>
              <th scope="col">Result</th>
              <th scope="col">Code</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>${rows}
          </tbody>
        </table>
      </div>`;
}

function evidenceList(evidence) {
  const items = (evidence || []).filter(Boolean);
  if (!items.length) return '';
  return `<details class="mt-1"><summary>Evidence</summary><ul class="mb-0">${items.map(e => `<li><code>${escapeHtml(e)}</code></li>`).join('')}</ul></details>`;
}

function confidenceWord(confidence) {
  return confidence === 'high' ? '' : confidence === 'medium' ? ' (likely)' : '';
}

// Who answered: one sentence per fact, the evidence a click away, unknowns said plainly
export function renderAttribution(data) {
  const a = data?.attribution;
  if (!a) return '';
  const refused = (data.refusals || []).length > 0 || data.verdict === 'blocked';
  const items = [];
  if (a.edge?.vendor && a.edge.confidence !== 'low') {
    items.push(`<li><strong>${escapeHtml(a.edge.vendor)}</strong>${confidenceWord(a.edge.confidence)} answered${refused ? ' the refused request' : ''}.${evidenceList(a.edge.evidence)}</li>`);
  } else if (a.edge?.rawServer) {
    items.push(`<li>No security service we recognize answered. The server header says <code>${escapeHtml(a.edge.rawServer)}</code>.${evidenceList(a.edge.evidence)}</li>`);
  }
  if (a.operator?.name && a.operator.confidence !== 'low') {
    const where = a.operator.zone ? ` for <code>${escapeHtml(a.operator.zone)}</code>` : '';
    items.push(`<li>The rules${a.edge?.vendor ? ` at ${escapeHtml(a.edge.vendor)}` : ''} belong to <strong>${escapeHtml(a.operator.name)}</strong>${confidenceWord(a.operator.confidence)}${where}.${evidenceList(a.operator.evidence)}</li>`);
  } else if (a.edge?.vendor) {
    items.push(`<li>We can't tell whose account holds the ${escapeHtml(a.edge.vendor)} rules.${evidenceList(a.operator?.evidence)}</li>`);
  }
  if (a.platform?.vendor && a.platform.confidence !== 'low') {
    items.push(`<li><strong>${escapeHtml(a.platform.vendor)}</strong>${confidenceWord(a.platform.confidence)} hosts this site.${evidenceList(a.platform.evidence)}</li>`);
  } else if (a.dns?.cname?.length) {
    items.push(`<li>Hosting platform unknown. DNS points the site at <code>${escapeHtml(a.dns.cname.join(' → '))}</code>.</li>`);
  }
  if (a.network?.org) {
    items.push(`<li>The address that answered is on <strong>${escapeHtml(a.network.org)}</strong>'s network${a.network.asn ? ` (AS${escapeHtml(a.network.asn)})` : ''}${a.network.ptr ? `, named <code>${escapeHtml(a.network.ptr)}</code>` : ''}.</li>`);
  }
  if (!items.length) return '';
  return `
      <h2 class="h3">Who answered</h2>
      <ul>${items.join('')}</ul>`;
}

// A recommendation that names the party to ask, when the evidence supports it
export function operatorAsk(data) {
  const a = data?.attribution;
  if (!a?.operator?.name || a.operator.confidence !== 'high') return '';
  const rules = a.edge?.vendor ? `the ${escapeHtml(a.edge.vendor)} rules` : 'the security rules';
  const zone = a.operator.zone ? ` for <code>${escapeHtml(a.operator.zone)}</code>` : '';
  return `<p>Ask <strong>${escapeHtml(a.operator.name)}</strong> to allow the ScanGovBot user agent, or the address <code>${SCANGOV_IP}</code>, in ${rules}${zone}.</p>`;
}

// The sentence under a blocked verdict: which request got through and which did not
export function blockSummary(data) {
  const s = data?.steps || {};
  const lh = s.lighthouse || {};
  const plain = s.plainFetch || {};
  if (data?.blockedBy === 'robots') return "The site's robots.txt tells ScanGovBot to stay out, so we don't scan it.";
  if (data?.blockedBy === 'crawl-delay') return `The site's robots.txt asks for a ${data.robots?.crawlDelay ?? ''}s wait between visits, longer than we support.`;
  if (lh.ran && !lh.success && plain.ran && plain.success) {
    return `Our basic request got the page, but the site refused the browser that runs the scan${httpNote(lh.statusCode ?? lhStatusFromError(lh))}. The site tells an identified bot and an identified browser apart, and refuses the browser.`;
  }
  if (lh.ran && lh.challenge) return 'The browser that runs the scan was sent to a challenge page instead of your site.';
  if (!lh.ran && (plain.challenge || s.playwright?.challenge)) return 'Both of our requests got a challenge page instead of your site, so we did not try the scan browser.';
  return data?.reason ? escapeHtml(data.reason) : 'The site turned our requests away.';
}

function lhStatusFromError(lh) {
  const m = /Status code:\s*(\d{3})/i.exec(String(lh?.runtimeError?.message || lh?.error || ''));
  return m ? Number(m[1]) : null;
}

function statusDefBlock(statusDef, data) {
  if (!statusDef) return '';
  const ask = operatorAsk(data);
  return `
      ${statusDef.problem ? `<h2 class="h3">Problem</h2><p>${statusDef.problem}</p>` : ''}
      ${(statusDef.recommendation || ask) ? `<h2 class="h3">Recommendation</h2>${ask}${statusDef.recommendation ? `<p>${statusDef.recommendation}</p>` : ''}` : ''}
      ${statusDef.recommendationTechnical ? `<h2 class="h3">Technical recommendation</h2><p>${statusDef.recommendationTechnical}</p>` : ''}`;
}

export function checkAnotherSiteButton() {
  return `
      <button class="btn btn-outline-primary border mt-0" id="new-check-btn">
        <i class="fa-solid fa-check me-2" aria-hidden="true"></i>Check another site</button>
    `;
}

function reportBlock() {
  return `
      <h2 class="h3">Report</h2>
      <p>Copy this link to share these results:</p>
      <div class="input-group">
        <label for="report-url" class="visually-hidden">Report link</label>
        <input type="text" class="form-control font-monospace" id="report-url" readonly>
        <button class="btn btn-outline-primary border mt-0" type="button" id="copy-report-btn">
          <i class="fa-solid fa-copy me-2" aria-hidden="true"></i>Copy</button>
      </div>`;
}

// While the job runs: the table filling in, no verdict yet
export function renderProgress(data, domain) {
  return `
    <p class="mt-3">Checking whether <a href="${escapeHtml(toAbsoluteUrl(domain))}" target="_blank" rel="noopener noreferrer" class="font-monospace">${escapeHtml(domain)}</a> lets ScanGovBot in. The scan browser step takes 10 to 30 seconds.</p>
    ${renderStepsTable(data, domain)}`;
}

export function renderResults(data, statusDef, domain) {
  const verdict = data?.verdict || (data?.canScan ? 'allowed' : 'blocked');
  const domainLink = `<a href="${escapeHtml(toAbsoluteUrl(domain))}" target="_blank" rel="noopener noreferrer" class="font-monospace">${escapeHtml(domain)}</a>`;
  let alertClass;
  let icon;
  let heading;
  let lead;
  let explain = '';

  if (verdict === 'allowed') {
    alertClass = 'success'; icon = 'fa-circle-check';
    heading = `ScanGov can scan ${domainLink}`;
    lead = 'Every request we made got the page, and robots.txt lets ScanGovBot in.';
  } else if (verdict === 'allowed-with-refusals') {
    alertClass = 'warning'; icon = 'fa-triangle-exclamation';
    heading = `ScanGov can scan ${domainLink}, but the site turns away part of our traffic`;
    const phrases = refusalPhrases(data);
    lead = `The browser that runs the scan got the page, so a scan works today. But the site ${escapeHtml(joinList(phrases))}. A site that treats the same identified bot differently from one request to the next is the kind whose scans fail at times.`;
    explain = `
      <h2 class="h3">Recommendation</h2>
      ${operatorAsk(data) || `<p>Ask whoever manages your security settings to allow the ScanGovBot user agent, or the address <code>${SCANGOV_IP}</code>, for every kind of request. <a href="/bot">Learn more</a> about what to allow.</p>`}`;
  } else if (verdict === 'failed') {
    alertClass = 'danger'; icon = 'fa-circle-xmark';
    heading = `We couldn't finish checking ${domainLink}`;
    lead = `This doesn't look like a bot block. ${escapeHtml(data?.reason || 'The page did not load in the browser that runs the scan.')}`;
    explain = statusDefBlock(statusDef, data);
  } else {
    alertClass = 'danger'; icon = 'fa-circle-xmark';
    heading = `We can't scan ${domainLink}`;
    lead = blockSummary(data);
    explain = statusDefBlock(statusDef, data);
  }

  return `
    <div class="alert alert-${alertClass} mb-4" role="alert">
      <h2 class="alert-heading h3"><i class="fa-solid ${icon} me-2" aria-hidden="true"></i>${heading}</h2>
      <p class="mb-0">${lead}</p>
    </div>

    <div class="alert alert-info mb-4" role="alert">
      ${explain}
      ${renderAttribution(data)}
      <h2 class="h3">Details</h2>
      ${renderStepsTable(data, domain)}
      ${reportBlock()}
    </div>

    ${checkAnotherSiteButton()}`;
}

export function renderError(message) {
  return `
      <div class="alert alert-danger" role="alert">
        ${escapeHtml(message)}
      </div>
      ${checkAnotherSiteButton()}`;
}

export function renderTooLong(domain) {
  return `
      <div class="alert alert-warning" role="alert">
        <h2 class="alert-heading h3"><i class="fa-solid fa-triangle-exclamation me-2" aria-hidden="true"></i>The check of <span class="font-monospace">${escapeHtml(domain)}</span> is taking too long</h2>
        <p class="mb-0">This is not a verdict. The site may be slow to answer, or our scanner may be busy. Try again in a minute.</p>
      </div>
      ${checkAnotherSiteButton()}`;
}
