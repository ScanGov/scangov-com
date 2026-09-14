---
draft: false
date: 2026-09-15
author: ScanGov
title: "One in ten county websites blocks good bots"
description: "We asked all 2,858 US county websites for their homepage as a well-behaved, identified bot. 284 turned us away. Here is who, how, and why it matters."
topics:
  - bots
---

<style>
.viz { margin: 2rem 0; --viz-bar: #2a78d6; --viz-muted: #8a8986; --viz-grid: rgba(128,128,128,.25); }
@media (prefers-color-scheme: dark) { .viz { --viz-bar: #3987e5; } }
[data-bs-theme="dark"] .viz { --viz-bar: #3987e5; }
.viz svg { width: 100%; height: auto; display: block; font-family: inherit; font-size: 13px; }
.viz figcaption { margin-bottom: .5rem; }
.viz figcaption .sub { opacity: .75; font-size: .9em; }
.viz .grid { stroke: var(--viz-grid); stroke-width: 1; }
.viz .bar { fill: var(--viz-bar); }
.viz .muted .bar { fill: var(--viz-muted); }
.viz .lbl, .viz .val { fill: currentColor; }
.viz .val { font-variant-numeric: tabular-nums; }
.viz .note { font-size: .9em; opacity: .8; margin: .5rem 0 0; }
.viz details { font-size: .9em; margin-top: .5rem; }
.viz table { margin-top: .5rem; border-collapse: collapse; }
.viz td, .viz th { padding: .2rem .8rem .2rem 0; text-align: left; }
.viz td:nth-child(n+2), .viz th:nth-child(n+2) { text-align: right; font-variant-numeric: tabular-nums; }
@media (max-width: 600px) { .viz svg { font-size: 15px; } }
</style>

Last week we introduced the [good bot scan](/tools/good-bot-scan/), a tool that tells you whether your website lets a well-behaved bot in. This is the follow-up we promised: what happens when that bot knocks on the door of every county government website in the United States.

We keep a list of 2,858 county, parish and borough homepages. Every one of them is scanned by [ScanGovBot](https://scangov.com/bot/), which follows robots.txt, waits between visits, and identifies itself on every single request, including the Lighthouse run. Nothing we send looks like a person's browser. In September 2026 we went back through the whole list to answer one question: does the front door open?

## The short version

- **85.2% of county websites let the bot in.** That is 2,435 of 2,858. Most of the country is doing fine.
- **284 county websites (9.9%) turn an identified, polite bot away** with a firewall, a CDN rule or a captcha.
- **Another 107 (3.7%) ask bots to stay out in robots.txt.** That is the site's call and we honor it, but it has the same effect on the public.
- Put together, **391 county websites (13.7%) cannot be read by a well-behaved bot.**
- Most of the blocking is not a decision a county made. **A handful of hosting platforms and CDN defaults account for most of it.**

<figure class="viz" id="chart-outcomes">
<figcaption><strong>What happens when ScanGovBot asks for a county homepage</strong><br><span class="sub">2,858 US county websites, September 2026</span></figcaption>
<svg viewBox="0 0 680 208" role="img" aria-label="What happens when ScanGovBot asks for a county homepage. Lets the bot in 2435, Turns away the basic request only 100, Turns away basic request and headless browser 153, Turns away everything, including Lighthouse 31, robots.txt asks the bot to stay out 107, Broken or unreachable for any visitor 32." xmlns="http://www.w3.org/2000/svg"><line x1="312" y1="4" x2="312" y2="200" class="grid"/><line x1="384" y1="4" x2="384" y2="200" class="grid"/><line x1="455" y1="4" x2="455" y2="200" class="grid"/><line x1="527" y1="4" x2="527" y2="200" class="grid"/><line x1="598" y1="4" x2="598" y2="200" class="grid"/><g class="row muted"><title>Lets the bot in: 2,435 counties (85.2%)</title><text x="302" y="17" class="lbl" text-anchor="end" dominant-baseline="middle">Lets the bot in</text><path d="M312,8 h275 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-275 z" class="bar"/><text x="599" y="17" class="val" dominant-baseline="middle">2,435</text></g><g class="row block"><title>Turns away the basic request only: 100 counties (3.5%)</title><text x="302" y="49" class="lbl" text-anchor="end" dominant-baseline="middle">Turns away the basic request only</text><path d="M312,40 h7 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-7 z" class="bar"/><text x="331" y="49" class="val" dominant-baseline="middle">100</text></g><g class="row block"><title>Turns away basic request and headless browser: 153 counties (5.4%)</title><text x="302" y="81" class="lbl" text-anchor="end" dominant-baseline="middle">Turns away basic request and headless browser</text><path d="M312,72 h14 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-14 z" class="bar"/><text x="338" y="81" class="val" dominant-baseline="middle">153</text></g><g class="row block"><title>Turns away everything, including Lighthouse: 31 counties (1.1%)</title><text x="302" y="113" class="lbl" text-anchor="end" dominant-baseline="middle">Turns away everything, including Lighthouse</text><path d="M312,104 h4 v18 h-4 z" class="bar"/><text x="324" y="113" class="val" dominant-baseline="middle">31</text></g><g class="row muted"><title>robots.txt asks the bot to stay out: 107 counties (3.7%)</title><text x="302" y="145" class="lbl" text-anchor="end" dominant-baseline="middle">robots.txt asks the bot to stay out</text><path d="M312,136 h8 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-8 z" class="bar"/><text x="332" y="145" class="val" dominant-baseline="middle">107</text></g><g class="row muted"><title>Broken or unreachable for any visitor: 32 counties (1.1%)</title><text x="302" y="177" class="lbl" text-anchor="end" dominant-baseline="middle">Broken or unreachable for any visitor</text><path d="M312,168 h4 v18 h-4 z" class="bar"/><text x="324" y="177" class="val" dominant-baseline="middle">32</text></g></svg>
<p class="note">Blue bars are firewall or CDN blocks. Gray bars are not blocks: an open site, a robots.txt choice we honor, or a site with a certificate, DNS or server problem.</p>
<details><summary>Data table</summary><table><thead><tr><th>Category</th><th>Counties</th><th>Share of 2,858</th></tr></thead><tbody><tr><td>Lets the bot in</td><td>2,435</td><td>85.2%</td></tr><tr><td>Turns away the basic request only</td><td>100</td><td>3.5%</td></tr><tr><td>Turns away basic request and headless browser</td><td>153</td><td>5.4%</td></tr><tr><td>Turns away everything, including Lighthouse</td><td>31</td><td>1.1%</td></tr><tr><td>robots.txt asks the bot to stay out</td><td>107</td><td>3.7%</td></tr><tr><td>Broken or unreachable for any visitor</td><td>32</td><td>1.1%</td></tr></tbody></table></details>
</figure>

## What "blocked" means here

An audit makes up to three kinds of request, all with the same ScanGovBot identity:

1. **A basic request.** The kind of HTTP request any script, feed reader, link checker or accessibility tool makes. We use it to read the page's title, description, social tags and reading level.
2. **A headless browser.** If the basic request is refused, we try again with a headless Chromium browser, still identified as ScanGovBot.
3. **Lighthouse.** Google's page-quality tool, running in headless Chrome, which produces the accessibility, performance and best-practice scores.

All three requests carry the same name. The basic request and the headless browser send `Mozilla/5.0 (compatible; ScanGovBot/1.0; +https://scangov.com/bot)`, and Lighthouse sends the same string with ` Lighthouse` appended. Anyone reading a server log can see exactly who visited and follow the link to [our bot page](https://scangov.com/bot/), which explains what the bot does, how often it visits, and how to keep it out if you want to. That is the whole point of a good bot: you never have to guess.

That gives us four outcomes for the 284 sites that block something:

| Outcome | Counties | What the visitor sees |
|---|---|---|
| Turns away the basic request only | 100 | A script or feed reader gets a 403 or a challenge page. A browser gets through. |
| Turns away the basic request and the headless browser | 153 | Only a full browser gets in. For a plain 403 we still get a Lighthouse score, with no title, description or social tags; for a challenge page we now stop there and record a block. |
| Turns away everything | 31 | Even Lighthouse's Chrome is refused. We cannot score the site at all. |
| robots.txt asks the bot to stay out | 107 | We never request the page. 74 counties disallow the bot outright; 33 set a crawl-delay longer than we are willing to wait. |

The remaining 32 counties are not blocking anyone: they have an expired or misissued certificate, a DNS problem, or a server that times out or errors for every visitor.

## How the block happens

<figure class="viz" id="chart-how">
<figcaption><strong>How the blocked sites turn the bot away</strong><br><span class="sub">284 county sites that block ScanGovBot</span></figcaption>
<svg viewBox="0 0 680 144" role="img" aria-label="How the blocked sites turn the bot away. Plain 403 Forbidden 169, Cloudflare challenge page 78, Captcha page (HTTP 202) 33, Other 4." xmlns="http://www.w3.org/2000/svg"><line x1="312" y1="4" x2="312" y2="136" class="grid"/><line x1="384" y1="4" x2="384" y2="136" class="grid"/><line x1="455" y1="4" x2="455" y2="136" class="grid"/><line x1="527" y1="4" x2="527" y2="136" class="grid"/><line x1="598" y1="4" x2="598" y2="136" class="grid"/><g class="row block"><title>Plain 403 Forbidden: 169 counties (5.9%)</title><text x="302" y="17" class="lbl" text-anchor="end" dominant-baseline="middle">Plain 403 Forbidden</text><path d="M312,8 h238 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-238 z" class="bar"/><text x="562" y="17" class="val" dominant-baseline="middle">169</text></g><g class="row block"><title>Cloudflare challenge page: 78 counties (2.7%)</title><text x="302" y="49" class="lbl" text-anchor="end" dominant-baseline="middle">Cloudflare challenge page</text><path d="M312,40 h108 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-108 z" class="bar"/><text x="432" y="49" class="val" dominant-baseline="middle">78</text></g><g class="row block"><title>Captcha page (HTTP 202): 33 counties (1.2%)</title><text x="302" y="81" class="lbl" text-anchor="end" dominant-baseline="middle">Captcha page (HTTP 202)</text><path d="M312,72 h43 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-43 z" class="bar"/><text x="367" y="81" class="val" dominant-baseline="middle">33</text></g><g class="row block"><title>Other: 4 counties (0.1%)</title><text x="302" y="113" class="lbl" text-anchor="end" dominant-baseline="middle">Other</text><path d="M312,104 h2 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-2 z" class="bar"/><text x="326" y="113" class="val" dominant-baseline="middle">4</text></g></svg>

<details><summary>Data table</summary><table><thead><tr><th>Category</th><th>Counties</th><th>Share of 2,858</th></tr></thead><tbody><tr><td>Plain 403 Forbidden</td><td>169</td><td>5.9%</td></tr><tr><td>Cloudflare challenge page</td><td>78</td><td>2.7%</td></tr><tr><td>Captcha page (HTTP 202)</td><td>33</td><td>1.2%</td></tr><tr><td>Other</td><td>4</td><td>0.1%</td></tr></tbody></table></details>
</figure>

Three mechanisms cover nearly all of it:

- **A plain "403 Forbidden."** 169 sites. The server looks at the user agent string, sees it is not a mainstream browser, and refuses. In our earlier probe of these sites, the same request with a browser user agent got a 200. This is user-agent sniffing, not bot detection: it stops the bots that identify themselves and lets through the ones that lie.
- **A Cloudflare challenge page.** 78 sites. Cloudflare serves a "checking your browser" interstitial to every visitor it does not recognize. A real browser passes it in a second. A basic request cannot. Headless browsers usually cannot either.
- **A captcha page.** 33 sites. The server answers with HTTP 202 and a page that immediately redirects to a captcha. This one is sneaky: 202 means "accepted," so many tools treat it as success and read the captcha page as if it were the homepage. Ours did too, until we caught it while preparing this post (see "About the data").

## Who is doing the blocking

<figure class="viz" id="chart-who">
<figcaption><strong>Who is doing the blocking</strong><br><span class="sub">284 blocked county sites by hosting platform or CDN</span></figcaption>
<svg viewBox="0 0 680 272" role="img" aria-label="Who is doing the blocking. Cloudflare (other sites) 98, Granicus govAccess (Akamai) 71, SiteGround captcha 27, Unknown platform on Google Cloud 26, Other 21, Colorado state platform (CloudFront) 19, CivicPlus (Cloudflare) 19, AWS CloudFront (other sites) 3." xmlns="http://www.w3.org/2000/svg"><line x1="312" y1="4" x2="312" y2="264" class="grid"/><line x1="384" y1="4" x2="384" y2="264" class="grid"/><line x1="455" y1="4" x2="455" y2="264" class="grid"/><line x1="527" y1="4" x2="527" y2="264" class="grid"/><line x1="598" y1="4" x2="598" y2="264" class="grid"/><g class="row block"><title>Cloudflare (other sites): 98 counties (3.4%)</title><text x="302" y="17" class="lbl" text-anchor="end" dominant-baseline="middle">Cloudflare (other sites)</text><path d="M312,8 h230 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-230 z" class="bar"/><text x="554" y="17" class="val" dominant-baseline="middle">98</text></g><g class="row block"><title>Granicus govAccess (Akamai): 71 counties (2.5%)</title><text x="302" y="49" class="lbl" text-anchor="end" dominant-baseline="middle">Granicus govAccess (Akamai)</text><path d="M312,40 h165 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-165 z" class="bar"/><text x="489" y="49" class="val" dominant-baseline="middle">71</text></g><g class="row block"><title>SiteGround captcha: 27 counties (0.9%)</title><text x="302" y="81" class="lbl" text-anchor="end" dominant-baseline="middle">SiteGround captcha</text><path d="M312,72 h60 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-60 z" class="bar"/><text x="384" y="81" class="val" dominant-baseline="middle">27</text></g><g class="row block"><title>Unknown platform on Google Cloud: 26 counties (0.9%)</title><text x="302" y="113" class="lbl" text-anchor="end" dominant-baseline="middle">Unknown platform on Google Cloud</text><path d="M312,104 h58 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-58 z" class="bar"/><text x="382" y="113" class="val" dominant-baseline="middle">26</text></g><g class="row block"><title>Other: 21 counties (0.7%)</title><text x="302" y="145" class="lbl" text-anchor="end" dominant-baseline="middle">Other</text><path d="M312,136 h46 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-46 z" class="bar"/><text x="370" y="145" class="val" dominant-baseline="middle">21</text></g><g class="row block"><title>Colorado state platform (CloudFront): 19 counties (0.7%)</title><text x="302" y="177" class="lbl" text-anchor="end" dominant-baseline="middle">Colorado state platform (CloudFront)</text><path d="M312,168 h41 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-41 z" class="bar"/><text x="365" y="177" class="val" dominant-baseline="middle">19</text></g><g class="row block"><title>CivicPlus (Cloudflare): 19 counties (0.7%)</title><text x="302" y="209" class="lbl" text-anchor="end" dominant-baseline="middle">CivicPlus (Cloudflare)</text><path d="M312,200 h41 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-41 z" class="bar"/><text x="365" y="209" class="val" dominant-baseline="middle">19</text></g><g class="row block"><title>AWS CloudFront (other sites): 3 counties (0.1%)</title><text x="302" y="241" class="lbl" text-anchor="end" dominant-baseline="middle">AWS CloudFront (other sites)</text><path d="M312,232 h3 a4,4 0 0 1 4,4 v10 a4,4 0 0 1 -4,4 h-3 z" class="bar"/><text x="327" y="241" class="val" dominant-baseline="middle">3</text></g></svg>
<p class="note">Attribution from DNS: CNAME chains and shared address blocks, checked by hand. "Other sites" on Cloudflare, CloudFront or Akamai means the CDN is the only thing we can see; the customer behind it varies.</p>
<details><summary>Data table</summary><table><thead><tr><th>Category</th><th>Counties</th><th>Share of 2,858</th></tr></thead><tbody><tr><td>Cloudflare (other sites)</td><td>98</td><td>3.4%</td></tr><tr><td>Granicus govAccess (Akamai)</td><td>71</td><td>2.5%</td></tr><tr><td>SiteGround captcha</td><td>27</td><td>0.9%</td></tr><tr><td>Unknown platform on Google Cloud</td><td>26</td><td>0.9%</td></tr><tr><td>Other</td><td>21</td><td>0.7%</td></tr><tr><td>Colorado state platform (CloudFront)</td><td>19</td><td>0.7%</td></tr><tr><td>CivicPlus (Cloudflare)</td><td>19</td><td>0.7%</td></tr><tr><td>AWS CloudFront (other sites)</td><td>3</td><td>0.1%</td></tr></tbody></table></details>
</figure>

This is the part that matters most. We resolved every blocking site's DNS to see where it is hosted, and the blocks cluster tightly:

- **71 counties on Granicus govAccess**, a government CMS platform fronted by Akamai, all return a plain 403 to the bot. One platform, one setting, 71 counties.
- **19 counties on CivicPlus** sit behind a Cloudflare challenge. CivicPlus hosts hundreds of county sites that do let us in, so this looks like a per-account or newer-plan default rather than a platform-wide choice.
- **19 Colorado counties** are hosted on the state's shared platform on AWS CloudFront, which returns 403 to the bot for every one of them.
- **27 counties on SiteGround** hosting get the captcha treatment.
- **98 other counties sit behind Cloudflare** with either the challenge page or a firewall rule. We can see Cloudflare; we cannot see who set the rule.
- **26 counties** share one nginx setup on Google Cloud and return a plain 403. We could not identify the vendor.

In other words, if four or five platforms changed one default, roughly two thirds of the county websites that block good bots would open up, and almost none of those counties would notice anything had changed.

## Why this matters

These are taxpayer-funded websites. Their whole purpose is to be found and read. The bots being turned away are not scrapers hammering the server; they are the tools that make public information usable:

- search engines and the AI assistants people now use to ask "when is the county clerk open" or "how do I appeal my property assessment"
- accessibility and quality checkers, like ours
- link checkers, uptime monitors, archive crawlers and the state and federal tools that inventory government sites

A well-behaved bot announces itself, follows robots.txt, and visits slowly. Blocking it by user agent does nothing to a bot that pretends to be Chrome, which is exactly what the abusive ones do. The only bots a user-agent block reliably stops are the honest ones.

If you run a county website, or a platform that hosts them, here is what to check:

1. Run the [good bot scan](/tools/good-bot-scan/) on your domain.
2. If it fails, look at your CDN and firewall bot settings. "Block automated traffic" and "challenge unknown bots" are common defaults that were never chosen on purpose.
3. Allow bots that identify themselves and honor robots.txt, and rate-limit instead of blocking. Cloudflare, Akamai and AWS all support verified-bot and allow-list rules. [Our bot page](https://scangov.com/bot/) has everything a firewall administrator needs to allow ScanGovBot by name.
4. Use robots.txt for the bots you actually want to keep out, and say so by name.

## About the data

- **The list.** 2,858 county, parish and borough homepages, one per county, checked by hand over the summer of 2026.
- **Blocking tiers** come from each site's most recent ScanGov audit (August or September 2026), which records whether the basic request, the headless browser and Lighthouse got through, plus one fresh plain request to every homepage on September 13, 2026, identified as ScanGovBot, following redirects, retrying the `www.` host when the bare host had a certificate error, the same way our scanner does.
- **Block mechanism** comes from the status code and body of that request, and from an earlier probe (September 7) that compared the bot user agent with a browser user agent, basic requests only. That one-off comparison is the only time we sent a browser user agent; a real scan identifies as ScanGovBot on every request, [as documented on our bot page](https://scangov.com/bot/).
- **Platform attribution** comes from DNS: CNAME chains (for example `*.granicusgovaccess.net`, `*.civicplus.io`) and shared address blocks, checked by hand. Where we can only see a CDN, we say so.
- **What we got wrong, and fixed.** The 33 captcha sites answered with HTTP 202, which our scanner had been treating as a successful fetch, so for a few weeks their scores were computed on the captcha page. We fixed the scanner on September 13: a captcha or browser-check page is now recognized wherever it appears and recorded as a block with its own status code (996, "Challenge page"). If both the basic request and the headless browser are challenged, we stop and record the block rather than let Lighthouse's Chrome try its luck, because a site that walls off both identified requests has blocked a good bot, whatever a full browser can squeeze through. We re-audited those sites, and they now show on scangov.org as blocked rather than graded. They are counted as blocked here. The [good bot scan](/tools/good-bot-scan/) reports the same thing when it runs into one.
- A site's behavior changes: a few that blocked us in August let us in on September 13, and vice versa. Every number is as of the date given.

**Raw data:** [county-bot-blocking-2026-09.csv](/data/county-bot-blocking-2026-09.csv), one row per county with the result, the plain-request status, the block mechanism, whether the headless browser and Lighthouse got through, and the hosting platform.
