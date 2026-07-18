---
layout: layouts/default-plain
date: 2026-07-18
modified:
author: ScanGov
title: ScanGovBot
description: "Information about ScanGov's web crawler for site owners and administrators."
---

## About ScanGovBot

ScanGovBot is the web crawler operated by [ScanGov](https://scangov.org), a government website auditing service. It visits government websites to evaluate accessibility, security, usability, and SEO compliance.

ScanGovBot helps government agencies understand how their websites perform against established web standards.

## User-Agent

When ScanGovBot visits your site, you'll see the following User-Agent string in your server logs:

```
Mozilla/5.0 (compatible; ScanGovBot/1.0; +https://scangov.com/bot)
```

Lighthouse audits identify as:

```
Mozilla/5.0 (compatible; ScanGovBot/1.0; +https://scangov.com/bot) Lighthouse
```

## Behavior

- **HTTP method:** GET requests only
- **robots.txt:** ScanGovBot respects robots.txt directives for both `User-agent: ScanGovBot` and `User-agent: *`
- **Rate limiting:** One page at a time per domain, with domain-level checks limited to once per 24 hours
- **Non-destructive:** ScanGovBot only reads pages. It does not submit forms, create accounts, or modify content.
- **No authentication:** ScanGovBot does not attempt to access pages behind login walls

## Scanning frequency

- **Per-page audits:** Pages are audited on a scheduled basis depending on their priority tier
- **Domain-level checks:** Once per domain per 24 hours (robots.txt, sitemap, security.txt, schema markup)

## IP addresses

ScanGovBot requests originate from:

- `44.236.34.143`

If you need to allowlist our crawler, use the IP address above along with our User-Agent string.

## What we check

ScanGovBot evaluates:

- **Accessibility:** WCAG compliance via Lighthouse accessibility audits
- **Security:** HTTPS, HSTS, CSP, security.txt, X-Content-Type-Options
- **Usability:** Page readability, performance metrics, mobile-friendliness, social metadata
- **Botability:** robots.txt validity, sitemap presence, crawlability

## Blocking ScanGovBot

To block ScanGovBot from crawling your site, add the following to your robots.txt:

```
User-agent: ScanGovBot
Disallow: /
```

## Contact

If you have questions about ScanGovBot or want to report an issue, please [contact us](/contact).
