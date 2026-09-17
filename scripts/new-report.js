import * as fs from 'fs';

// Scaffolds a new report post. See the `report-format` skill
// (ScanGov/skills, content-style plugin) for the full structure and the
// Chart.js system this wires up.
//
// Usage: node scripts/new-report.js "Working title"

const title = process.argv.slice(2).join(' ').trim();
if (!title) {
    console.error('Usage: node scripts/new-report.js "Working title"');
    process.exit(1);
}

const slug = title
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const date = new Date().toISOString().slice(0, 10);
const permalink = `/news/${slug}/`;
const filePath = `content/news/${date}-${slug}.md`;

if (fs.existsSync(filePath)) {
    console.error(`Already exists: ${filePath}`);
    process.exit(1);
}

const frontmatter = `---
draft: true
date: ${date}
author: ScanGov
title: "${title}"
isReport: true
eleventyComputed:
  permalink: ${permalink}
description: "TODO: one or two sentences — what was tested, the headline number, why it matters."
topics:
  - TODO
---
`;

// The permalink above is fixed at scaffold time on purpose: scangov-com
// derives news URLs from \`title\` by default (see news.11tydata.json),
// so a later title edit would otherwise silently move the page and
// orphan the old URL. A report's working title is especially likely to
// change before publish.

const body = `
<script src="/js/chartjs-vendor.js"></script>
<script src="/js/report-charts-init.js"></script>

TODO: lead paragraph — what was tested, and why. No heading here.

## Why this matters

TODO — tie the finding to real impact, not just the numbers.

## What we scanned

- TODO: the scope, stat-led if a real count applies (e.g. "**100% (N
  things)** — what was checked, and when").

## What we learned

- TODO: the headline number, bulleted, in plain language
- TODO: supporting numbers

<!-- Chart example — see the report-format skill for the full reference.
{% raw %}
{% set chartCaption = "TODO" %}
{% set chartSubcaption = "TODO" %}
{% set chartValueLabel = "TODO" %}
{% set chartRows = [
  { label: "TODO", value: 0 }
] %}
{% include "report-chart.html" %}
{% endraw %}
-->

## TODO: first analysis section

TODO

## Who's responsible

<!-- Pick whichever who.json roles are actually relevant to this report -
     titles must match who.json exactly. See the report-format skill. -->
{% raw %}
{% set whoRoles = [
  "TODO"
] %}
{% include "who-list.html" %}
{% endraw %}

## About the data

- **Methodology.** TODO — how it was measured, not what/when (that's
  "What we scanned" above). Don't repeat a fact already given elsewhere
  on the page; link back to this section instead.

<!-- If numbers change or a methodology bug is found after this report
     publishes, add a "### Corrections" subsection here — narrative, not
     bullets. Not for a bug fixed while still preparing the report; that's
     just methodology and belongs as a bullet above instead. -->

### Raw data

TODO: one row per TODO:

- \`TODO_field\` — TODO short description

<a href="/data/TODO.csv" class="btn btn-outline-primary btn-sm">Download CSV</a>

## What to do next

- TODO: first step, with a plain text link to the relevant tool (e.g.
  "Run the [good bot scan](/tools/TODO/) on your domain.") — no ".btn"-
  styled button, and no lead-in sentence before the checklist
- TODO: next step

## About ScanGov

ScanGov monitors websites for [AI-readiness](/botability/), [accessibility](/accessibility/), [security](/security/), and [usability](/usability/), and helps teams build better digital experiences. [Learn more about ScanGov](/about).
`;

fs.writeFileSync(filePath, frontmatter + body);
console.log(`Created ${filePath}`);
console.log(`Permalink fixed at ${permalink}`);
