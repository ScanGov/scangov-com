/**
 * Run: npm test  (node --test test/*.test.mjs)
 * The good bot scan page's markup for each verdict, from the auditor's job shape.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveStatusCode, refusalPhrases, describeStep, renderStepsTable, renderAttribution,
  operatorAsk, blockSummary, renderResults, renderProgress, renderTooLong, renderError, escapeHtml, SCANGOV_IP,
} from '../public/js/scan-check-render.js';

const DOMAIN = 'www.contracosta.ca.gov';
const step = (over) => ({ ran: true, success: true, statusCode: 200, finalUrl: `https://${DOMAIN}/`, challenge: null, error: null, headers: {}, cookieNames: [], blockPage: null, durationMs: 100, ...over });
const notRun = { ran: false, success: null, statusCode: null, finalUrl: null, challenge: null, error: null, durationMs: 0 };
const robotsOk = { allowed: true, crawlDelay: null, crawlDelayBlocked: false, fetchStatus: 'success', statusCode: 200, challenge: null };
const ATTRIBUTION = {
  edge: { vendor: 'Cloudflare', confidence: 'high', evidence: ['server: cloudflare', 'cf-ray: a54789c37f63138a-SJC', 'block page "Sorry, you have been blocked"'] },
  operator: { name: 'CivicPlus', zone: 'civicplus.io', confidence: 'high', evidence: ['block page: unable to access civicplus.io', 'CNAME pt-west-001.civicplus.io'] },
  platform: { vendor: 'CivicPlus', confidence: 'high', evidence: ['www.contracosta.ca.gov CNAME pt-west-001.civicplus.io'] },
  network: { asn: 13335, org: 'Cloudflare, Inc.', ptr: null },
  dns: { cname: ['pt-west-001.civicplus.io'], a: ['172.64.146.52'] },
};
const STATUS_999 = { code: 999, label: 'Request Denied', problem: 'The site is actively blocking automated tools.', recommendation: 'Ask whoever set that up to let good bots through.', recommendationTechnical: 'Allow the ScanGovBot user agent, or allowlist 44.236.34.143.' };

// 2026-11-02: plain fetch 403, Playwright 200, Lighthouse 200
const WITH_REFUSALS = {
  status: 'done', url: `https://${DOMAIN}/`, verdict: 'allowed-with-refusals', canScan: true, refusals: ['plainFetch', 'robots'], code: null, reason: null, blockedBy: null,
  robots: { ...robotsOk, fetchStatus: 'error', statusCode: 403 },
  steps: { plainFetch: step({ success: false, statusCode: 403, error: 'failed fetch, response status 403', blockPage: { title: 'Attention Required! | Cloudflare', snippet: 'Sorry, you have been blocked' } }), playwright: step({}), lighthouse: step({}) },
  attribution: ATTRIBUTION,
};
// 2026-10-28: plain fetch 200, Lighthouse Chrome 403
const BLOCKED_999 = {
  status: 'done', url: `https://${DOMAIN}/`, verdict: 'blocked', canScan: false, refusals: [], code: 999, blockedBy: 'lighthouse',
  reason: 'Connection refused to ScanGovBot (Site refused Lighthouse Chrome with HTTP 403 while the plain ScanGovBot fetch got the page)',
  robots: robotsOk,
  steps: { plainFetch: step({}), playwright: { ...notRun }, lighthouse: step({ success: false, statusCode: null, runtimeError: { code: 'ERRORED_DOCUMENT_REQUEST', message: 'Lighthouse was unable to reliably load the page you requested. (Status code: 403)' }, error: 'Lighthouse failed with code 1.' }) },
  attribution: ATTRIBUTION,
};
const ALLOWED = { status: 'done', url: 'https://example.gov/', verdict: 'allowed', canScan: true, refusals: [], code: null, robots: robotsOk, steps: { plainFetch: step({}), playwright: { ...notRun }, lighthouse: step({}) }, attribution: { edge: { vendor: null, rawServer: 'nginx', confidence: 'low', evidence: ['server: nginx'] }, operator: null, platform: null, network: { asn: 16509, org: 'Amazon.com, Inc.', ptr: 'ec2-1-2-3-4.compute.amazonaws.com' }, dns: { cname: [], a: ['1.2.3.4'] } } };
const FAILED = { status: 'done', url: 'https://slow.gov/', verdict: 'failed', canScan: false, refusals: [], code: 994, reason: 'Audit timeout', robots: robotsOk, steps: { plainFetch: step({}), playwright: { ...notRun }, lighthouse: step({ success: false, statusCode: null, timedOut: true, error: 'Audit timeout' }) } };
const ROBOTS_BLOCKED = { status: 'done', url: 'https://x.gov/', verdict: 'blocked', canScan: false, refusals: [], code: 998, blockedBy: 'robots', robots: { ...robotsOk, allowed: false }, steps: { plainFetch: step({}), playwright: { ...notRun }, lighthouse: step({}) } };

test('resolveStatusCode: the auditor code wins; older shapes still map', () => {
  assert.equal(resolveStatusCode(BLOCKED_999), 999);
  assert.equal(resolveStatusCode(WITH_REFUSALS), null);
  assert.equal(resolveStatusCode({ blockedBy: 'robots' }), 998);
  assert.equal(resolveStatusCode({ blockedBy: 'crawl-delay' }), 997);
  assert.equal(resolveStatusCode({ challenge: 'cloudflare' }), 996);
  assert.equal(resolveStatusCode({ steps: { lighthouse: { ran: true, statusCode: 503 } } }), 503);
});

test('refusalPhrases: plain words with the HTTP code, robots included', () => {
  assert.deepEqual(refusalPhrases(WITH_REFUSALS), ['turned away our basic request (HTTP 403)', 'turned away our request for robots.txt (HTTP 403)']);
  assert.deepEqual(refusalPhrases({ refusals: ['playwright'], steps: { playwright: { challenge: 'cloudflare', statusCode: 403 } } }), ['served a challenge page to our headless browser (HTTP 403)']);
  assert.deepEqual(refusalPhrases({ refusals: [] }), []);
});

test('describeStep: every state has words', () => {
  assert.equal(describeStep('plainFetch', step({})).result, 'Got the page');
  assert.equal(describeStep('plainFetch', step({ success: false, statusCode: 403 })).result, 'Refused');
  assert.equal(describeStep('plainFetch', step({ success: false, statusCode: 202, challenge: 'captcha' })).result, 'Challenge page');
  assert.equal(describeStep('lighthouse', step({ success: false, timedOut: true })).result, 'Timed out');
  assert.equal(describeStep('lighthouse', { ...notRun }).result, 'Waiting');
  assert.equal(describeStep('playwright', { ran: false, success: null, skipped: true }).result, 'Not needed');
  assert.equal(describeStep('robots', null, undefined).result, 'Waiting');
  assert.equal(describeStep('robots', null, { fetchStatus: 'not_found', statusCode: 404 }).result, 'No robots.txt (allowed)');
  assert.equal(describeStep('robots', null, { fetchStatus: 'error', statusCode: 403 }).result, 'Refused');
  assert.equal(describeStep('robots', null, { fetchStatus: 'error', statusCode: null }).result, 'Not readable (allowed)');
  assert.equal(describeStep('robots', null, { fetchStatus: 'success', allowed: false }).result, 'Disallowed');
  assert.equal(describeStep('robots', null, { fetchStatus: 'success', allowed: true, crawlDelayBlocked: true, crawlDelay: 30 }).result, 'Crawl-delay too long');
  assert.equal(describeStep('robots', null, { fetchStatus: 'error', challenge: { kind: 'cloudflare' }, statusCode: 403 }).result, 'Challenge page');
});

test('renderStepsTable: four rows, headless browser "Not needed" when the basic request got in, components table markup', () => {
  const html = renderStepsTable(ALLOWED, 'example.gov');
  assert.match(html, /<table class="table">/);
  assert.match(html, /<caption class="visually-hidden">Good bot scan steps for example.gov<\/caption>/);
  assert.equal((html.match(/<th scope="row">/g) || []).length, 4);
  assert.match(html, /Headless browser<\/th>\s*<td>Not needed<\/td>/);
  assert.match(html, /Scan browser \(Lighthouse\)<\/th>\s*<td>Got the page<\/td>/);
  const progress = renderProgress({ steps: {}, robots: null }, 'example.gov');
  assert.equal((progress.match(/<td>Waiting<\/td>/g) || []).length, 4);
});

test('renderAttribution: names the vendor, the account and the host with evidence; unknowns said plainly', () => {
  const html = renderAttribution(WITH_REFUSALS);
  assert.match(html, /<strong>Cloudflare<\/strong> answered the refused request\./);
  assert.match(html, /belong to <strong>CivicPlus<\/strong> for <code>civicplus.io<\/code>/);
  assert.match(html, /<strong>CivicPlus<\/strong> hosts this site\./);
  assert.match(html, /<strong>Cloudflare, Inc.<\/strong>'s network \(AS13335\)/);
  assert.match(html, /<details class="mt-1"><summary>Evidence<\/summary><ul class="mb-0"><li><code>server: cloudflare<\/code><\/li>/);
  const plain = renderAttribution(ALLOWED);
  assert.match(plain, /No security service we recognize answered. The server header says <code>nginx<\/code>/);
  assert.match(plain, /named <code>ec2-1-2-3-4.compute.amazonaws.com<\/code>/);
  assert.doesNotMatch(plain, /hosts this site/);
  assert.equal(renderAttribution({}), '');
  const medium = renderAttribution({ attribution: { edge: { vendor: 'Akamai', confidence: 'medium', evidence: [] } } });
  assert.match(medium, /<strong>Akamai<\/strong> \(likely\) answered\./);
  assert.match(medium, /We can't tell whose account holds the Akamai rules\./);
});

test('operatorAsk: only at high confidence', () => {
  assert.match(operatorAsk(WITH_REFUSALS), new RegExp(`Ask <strong>CivicPlus</strong> to allow the ScanGovBot user agent, or the address <code>${SCANGOV_IP}</code>, in the Cloudflare rules for <code>civicplus.io</code>.`));
  assert.equal(operatorAsk({ attribution: { ...ATTRIBUTION, operator: { ...ATTRIBUTION.operator, confidence: 'medium' } } }), '');
  assert.equal(operatorAsk(ALLOWED), '');
});

test('blockSummary: the browser-only denial, robots, crawl-delay and challenge cases', () => {
  assert.equal(blockSummary(BLOCKED_999), 'Our basic request got the page, but the site refused the browser that runs the scan (HTTP 403). The site tells an identified bot and an identified browser apart, and refuses the browser.');
  assert.match(blockSummary(ROBOTS_BLOCKED), /robots.txt tells ScanGovBot to stay out/);
  assert.match(blockSummary({ blockedBy: 'crawl-delay', robots: { crawlDelay: 30 } }), /30s wait/);
  assert.match(blockSummary({ steps: { plainFetch: step({ success: false, challenge: 'captcha' }), playwright: step({ success: false, challenge: 'captcha' }), lighthouse: { ...notRun } } }), /Both of our requests got a challenge page/);
  assert.match(blockSummary({ steps: { lighthouse: step({ success: false, challenge: 'cloudflare' }), plainFetch: step({ success: false, challenge: 'cloudflare' }) } }), /sent to a challenge page/);
});

test('renderResults: allowed', () => {
  const html = renderResults(ALLOWED, undefined, 'example.gov');
  assert.match(html, /alert alert-success/);
  assert.match(html, /ScanGov can scan <a href="https:\/\/example.gov"/);
  assert.match(html, /Every request we made got the page/);
  assert.match(html, /id="report-url"/);
  assert.match(html, /id="new-check-btn"/);
  assert.doesNotMatch(html, /Recommendation/);
});

test('renderResults: allowed with refusals is a warning that names the refused requests and who to ask', () => {
  const html = renderResults(WITH_REFUSALS, undefined, DOMAIN);
  assert.match(html, /alert alert-warning/);
  assert.match(html, /but the site turns away part of our traffic/);
  assert.match(html, /But the site turned away our basic request \(HTTP 403\) and turned away our request for robots.txt \(HTTP 403\)\./);
  assert.match(html, /whose scans fail at times/);
  assert.match(html, /Ask <strong>CivicPlus<\/strong>/);
  assert.match(html, /Who answered/);
  assert.match(html, /Basic request<\/th>\s*<td>Refused<\/td>\s*<td>403<\/td>\s*<td>Page title: Attention Required! \| Cloudflare<\/td>/);
});

test('renderResults: blocked uses the status.json copy with the operator ask first', () => {
  const html = renderResults(BLOCKED_999, STATUS_999, DOMAIN);
  assert.match(html, /alert alert-danger/);
  assert.match(html, /We can't scan <a/);
  assert.match(html, /refused the browser that runs the scan \(HTTP 403\)/);
  assert.match(html, /<h2 class="h3">Problem<\/h2><p>The site is actively blocking automated tools.<\/p>/);
  assert.match(html, /<h2 class="h3">Recommendation<\/h2><p>Ask <strong>CivicPlus<\/strong>/);
  assert.match(html, /Technical recommendation/);
  assert.match(html, /Scan browser \(Lighthouse\)<\/th>\s*<td>Failed<\/td>\s*<td>—<\/td>\s*<td>Lighthouse was unable to reliably load/);
});

test('renderResults: failed is not called a block; too long is not a verdict; errors are escaped', () => {
  const failed = renderResults(FAILED, { code: 994, problem: 'p', recommendation: 'r' }, 'slow.gov');
  assert.match(failed, /We couldn't finish checking/);
  assert.match(failed, /This doesn't look like a bot block. Audit timeout/);
  assert.match(failed, /Timed out/);
  const tooLong = renderTooLong('slow.gov');
  assert.match(tooLong, /This is not a verdict/);
  assert.match(renderError('<img src=x onerror=1>'), /&lt;img src=x onerror=1&gt;/);
  assert.equal(escapeHtml(`a<b>&"'`), 'a&lt;b&gt;&amp;&quot;&#39;');
  const evil = renderResults({ ...ALLOWED, url: 'x' }, undefined, '<script>');
  assert.doesNotMatch(evil, /<script>/);
});
