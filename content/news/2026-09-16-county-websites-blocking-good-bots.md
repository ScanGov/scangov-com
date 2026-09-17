---
draft: false
date: 2026-09-16
author: ScanGov
title: "One in 10 county government websites block good bots"
isReport: true
eleventyComputed:
  permalink: /news/one-in-ten-county-websites-blocks-good-bots/
description: "We asked all 2,858 U.S. county websites for their homepage as a well-behaved, identified bot. 284 turned us away. Here is who, how, and why it matters."
topics:
  - bots
---

<script src="/js/chartjs-vendor.js"></script>
<script src="/js/report-charts-init.js"></script>

Last week we introduced the good bot scan, a tool that tells you whether your website lets a well-behaved bot in. This is an anaysis of how many county government websites let our well behaved bot scan them.

We scanned our list of 2,858 county, parish, and borough websites. Our bot identifies itself clearly as ScanGovBot on every request. We follow all rules in every robots.txt file. We scan slowly so we don't overwhelm a small site with traffic. The rules our bot follows are detailed on our (bot page)[https://scangov.com/bot/]. If our well behaved bot is explicitly denied access we respect that. We do not attempt to circumvent crawling security measures. If our scan requests are denied we will record the failure and stop current scan attempts. We hope that all public websites allow retrieval by well behaved bots.

## Why this matters

Government websites are a public service. They are created with public resources to be found and read. If our bot is turned away these sites are probably blocking all unknown bots by default. This security stance disables useful public tools. Useful public tools might be:

- AI assistants people might use to ask questions about their county services
- archive crawlers 
- tools evaluating web appication quality like ScanGov

A well-behaved bot announces itself, follows robots.txt, and visits slowly. Site owners may be blocking all bots by default or only letting in a short list of known crawlers. This locks out all the well behaved, less well known tools. It isn't possible to fully lock out Bots not concerned with good behavior. They can take steps to more closely mimic real users.

## What we scanned

- All counties where we identified a public website: 2,858 US counties.

We made Up to 3 requests per site. We start with a basic HTTP request using node.js fetch, if that fails we try the same request with headless browser. Then we run a Google Lighthouse audit. All requests identify as ScanGovBot in the user agent header.

## What we learned

- 85.2% (2,435 counties) let the bot in.
- 9.9% (284 counties) turned us away. We encountered firewall , CDN(Content Delivery Network) rules and CAPTCHAs.
- 3.7% (107 counties) ask bots to stay out in robots.txt. Our bot follows these restrictions and will not interact with the site.
- 13.7% (391 counties) cannot be read by a well-behaved bot, put together.

Most of the blocking is not a decision a county made. A handful of hosting platforms and CDN defaults account for most of it.

{% set chartCaption = "What happens when ScanGovBot asks for a county homepage" %}
{% set chartSubcaption = "2,858 U.S. county websites, September 2026" %}
{% set chartValueLabel = "Counties" %}
{% set chartShareTotal = 2858 %}
{% set chartMainLabel = "Blocks the bot" %}
{% set chartMutedLabel = "Doesn't block" %}
{% set chartRows = [
  { label: "Lets the bot in", value: 2435, muted: true },
  { label: "Turns away the basic request only", value: 100 },
  { label: "Turns away basic request and headless browser", value: 153 },
  { label: "Turns away everything, including Lighthouse", value: 31 },
  { label: "robots.txt asks the bot to stay out", value: 107, muted: true },
  { label: "Broken or unreachable for any visitor", value: 32, muted: true }
] %}
{% include "report-chart.html" %}

## What counts as a block          

An audit makes up to three types of requests. Every request identify as ScanGovBot:

- **A basic request.** A server side HTTP fetch call.
- **A headless browser.** If the site refuses the basic request, we try calling the same url again with a headless Chromium browser. This request still identifies as ScanGovBot.
- **Lighthouse.** Google's page-quality tool, running in headless Chrome. This tool returns performance metrics and embeds axe core to run accessibility audits.

The basic request and the headless browser send the user agent `Mozilla/5.0 (compatible; ScanGovBot/1.0; +https://scangov.com/bot)`, and Lighthouse sends the same string with ` Lighthouse` appended. Anyone reading a server log can see exactly who visited and follow the link to [our bot page](https://scangov.com/bot/). We are transparent about what the bot does and how to identify it.

That gives us four outcomes for the 284 sites that block something:

<div class="table-responsive">
  <table class="table">
    <caption class="visually-hidden">Outcomes for the 284 sites that block something</caption>
    <thead>
      <tr>
        <th scope="col">Outcome</th>
        <th scope="col">Counties</th>
        <th scope="col">What the visitor sees</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Turns away the basic request only</td>
        <td>100</td>
        <td>A script or feed reader gets a 403 or a challenge page. A browser gets through.</td>
      </tr>
      <tr>
        <td>Turns away the basic request and the headless browser</td>
        <td>153</td>
        <td>Only a full browser gets in. For a plain 403 we still get a Lighthouse score, with no title, description, or social tags; for a challenge page we now stop there and record a block.</td>
      </tr>
      <tr>
        <td>Turns away everything</td>
        <td>31</td>
        <td>The site refuses even Lighthouse's Chrome. We cannot score the site at all.</td>
      </tr>
      <tr>
        <td>robots.txt asks the bot to stay out</td>
        <td>107</td>
        <td>We never request the page. 74 counties disallow the bot outright; 33 set a crawl-delay longer than we are willing to wait.</td>
      </tr>
    </tbody>
  </table>
</div>

The remaining 32 counties are not blocking anyone: they have an expired or misissued certificate, a DNS problem, or a server that times out or errors for every visitor.          

## How the block happens

{% set chartCaption = "How the blocked sites turn the bot away" %}
{% set chartSubcaption = "284 county sites that block ScanGovBot" %}
{% set chartValueLabel = "Counties" %}
{% set chartShareTotal = 2858 %}
{% set chartMainLabel = "Blocks the bot" %}
{% set chartMutedLabel = "" %}
{% set chartRows = [
  { label: "Plain 403 Forbidden", value: 169 },
  { label: "Cloudflare challenge page", value: 78 },
  { label: "Captcha page (HTTP 202)", value: 33 },
  { label: "Other", value: 4 }
] %}
{% include "report-chart.html" %}

Three mechanisms cover nearly all of it:          

- **A plain "403 Forbidden."** 169 sites. The server looks at the user agent string, sees it is not a mainstream browser, and refuses. In our earlier probe of these sites, the same request with a browser user agent got a 200. This is user-agent sniffing, not bot detection: it stops the bots that identify themselves and lets through the ones that lie.
- **A Cloudflare challenge page.** 78 sites. Cloudflare serves a "checking your browser" interstitial to every visitor it does not recognize. A real browser passes it in a second. A basic request cannot. Headless browsers usually cannot either.
- **A captcha page.** 33 sites. The server answers with HTTP 202 and a page that immediately redirects to a captcha. This one is sneaky: 202 means "accepted," so many tools treat it as success and read the captcha page as if it were the homepage. Ours did too, until we caught it while preparing this post (see "About the data").

## Who does the blocking

{% set chartCaption = "Who does the blocking" %}
{% set chartSubcaption = "284 blocked county sites by hosting platform or CDN" %}
{% set chartValueLabel = "Counties" %}
{% set chartShareTotal = 2858 %}
{% set chartMainLabel = "Blocks the bot" %}
{% set chartMutedLabel = "" %}
{% set chartRows = [
  { label: "Cloudflare (other sites)", value: 98 },
  { label: "Granicus govAccess (Akamai)", value: 71 },
  { label: "SiteGround captcha", value: 27 },
  { label: "Unknown platform on Google Cloud", value: 26 },
  { label: "Other", value: 21 },
  { label: "Colorado state platform (CloudFront)", value: 19 },
  { label: "CivicPlus (Cloudflare)", value: 19 },
  { label: "AWS CloudFront (other sites)", value: 3 }
] %}
{% include "report-chart.html" %}
<p class="text-body-secondary small">"Other sites" on Cloudflare, CloudFront, or Akamai means the CDN is the only thing we can see; the customer behind it varies. See "About the data" for how we attribute platforms.</p>

This is the part that matters most. We resolved every blocking site's DNS to find its host, and the blocks cluster tightly:

- **2.5% (71 counties)** on Granicus govAccess, a government content management system (CMS) platform fronted by Akamai, return a plain 403 to the bot — one platform, one setting.
- **0.7% (19 counties)** on CivicPlus sit behind a Cloudflare challenge. CivicPlus hosts hundreds of county sites that do let us in, so this looks like a per-account or newer-plan default rather than a platform-wide choice.
- **0.7% (19 counties)** in Colorado sit on the state's shared platform on Amazon Web Services (AWS) CloudFront, which returns 403 to the bot for every one of them.
- **0.9% (27 counties)** on SiteGround hosting get the captcha treatment.
- **3.4% (98 counties)** sit behind Cloudflare on other platforms, with either the challenge page or a firewall rule. We can see Cloudflare; we cannot see who set the rule.
- **0.9% (26 counties)** share one nginx setup on Google Cloud and return a plain 403. We could not identify the vendor.

In other words, if four or five platforms changed one default, roughly two thirds of the county websites that block good bots would open up, and almost none of those counties would notice anything had changed.

## Who's responsible

{% set whoRoles = [
  "Executives",
  "Digital service teams",
  "Third-party vendors",
  "Government leaders",
  "IT staff",
  "Website managers",
  "Hosting providers"
] %}
{% include "who-list.html" %}

## About the data

- **Blocking tiers** come from each site's most recent ScanGov audit, which records whether the basic request, the headless browser, and Lighthouse got through, plus one fresh plain request to every homepage, following redirects and retrying the `www.` host when the bare host had a certificate error, the same way our scanner does.
- **Block mechanism** comes from the status code and body of that request, and from an earlier probe (September 7) that compared the bot user agent with a browser user agent, basic requests only. That one-off comparison is the only time we sent a browser user agent; a real scan identifies as ScanGovBot on every request, [as documented on our bot page](https://scangov.com/bot/).
- **Platform attribution** comes from DNS: canonical name (CNAME) chains (for example `*.granicusgovaccess.net`, `*.civicplus.io`) and shared address blocks, checked by hand. Where we can only see a CDN, we say so.
- **What we got wrong, and fixed.** The 33 captcha sites answered with HTTP 202, which our scanner had been treating as a successful fetch, so for a few weeks we computed their scores on the captcha page. We fixed the scanner on September 13: it now recognizes a captcha or browser-check page wherever it appears and records it as a block with its own status code (996, "Challenge page"). If a site challenges both the basic request and the headless browser, we stop and record the block rather than let Lighthouse's Chrome try its luck, because a site that walls off both identified requests has blocked a good bot, whatever a full browser can squeeze through. We re-audited those sites, and they now show on scangov.org as blocked rather than graded. We count them as blocked here. The [good bot scan](/tools/good-bot-scan/) reports the same thing when it runs into one.
- A site's behavior changes: a few that blocked us in August let us in on September 13, and vice versa. Every number is as of the date given.

### Raw data

One row per county:

- `domain` — the county's homepage domain
- `agency` — the county, parish, or borough name and state
- `result` — the overall outcome: open, which block tier, robots.txt, or broken
- `robots_txt` — what the site's robots.txt says: allowed, disallowed, or crawl-delay
- `plain_fetch_status` — the HTTP status code from the basic request
- `plain_fetch_host` — whether the bare or `www` host responded
- `block_style` — how the site blocks: Cloudflare challenge, a plain 403, a captcha
- `headless_browser` — whether the headless browser request got through
- `lighthouse` — the Lighthouse audit's result
- `platform` — the hosting platform or CDN we attributed
- `server_header` — the site's `Server` HTTP header
- `cloudflare` — whether Cloudflare sits in front of the site
- `last_audit` — date of the most recent audit

<a href="/data/county-bot-blocking-2026-09.csv" class="btn btn-outline-primary btn-sm">Download CSV</a>

## What to do next

- Run the [good bot scan](/tools/good-bot-scan/) on your domain.
- If it fails, look at your CDN and firewall bot settings. "Block automated traffic" and "challenge unknown bots" are common defaults that were never chosen on purpose.
- Allow bots that identify themselves and honor robots.txt, and rate-limit instead of blocking. Cloudflare, Akamai, and AWS all support verified-bot and allow-list rules. [Our bot page](https://scangov.com/bot/) has everything a firewall administrator needs to allow ScanGovBot by name.
- Use robots.txt for the bots you actually want to keep out, and say so by name.

## About ScanGov

ScanGov monitors websites for [AI-readiness](/botability/), [accessibility](/accessibility/), [security](/security/), and [usability](/usability/), and helps teams build better digital experiences. [Learn more about ScanGov](/about).