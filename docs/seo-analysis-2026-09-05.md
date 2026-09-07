# ScanGov SEO research and 90-day plan

Prepared September 5, 2026 (America/Los_Angeles).

**Recommendation:** Position ScanGov around continuous website quality assurance for web teams. Use government accessibility and governance as the first focused acquisition audience, while testing a smaller, broader web-team content track. Convert visitors by demonstrating the path from a detected issue to a prioritized task, a fix, and a measurable improvement.

The founder clarified that government is the initial audience, the eventual audience is all web teams, traffic is low, and neither a primary conversion nor a leading product capability has been selected. This plan therefore treats positioning and demand as hypotheses to validate. Capacity was not specified; the schedule assumes a small team and prioritizes a few substantial pages.

**Founder follow-up incorporated:** The largest customers came through personal connections. One customer was comparing tool prices and encountered ScanGov through LinkedIn posts. ScanGov supports PDF scanning, but does not scan authenticated pages or follow dynamic application flows. The current purchase journey is choose a plan → pay through Stripe → enter a domain → initial results appear within a few minutes, including sitewide grades, prioritized tasks, and guidance for each issue. These are founder-reported facts, not independently tested product behavior. One comparison-minded customer is a useful direction for an experiment, not proof of a repeatable acquisition channel or that price alone caused the purchase.

**Evidence and limits**

Reviewed the Eleventy source, content/data templates, analytics include, and deployment workflow; fetched the live `.com` sitemap, representative HTML, public robots files, and HTTP/www redirects; examined the public companion sites and competitor pages; sampled searches for government accessibility, website governance, Siteimprove alternatives, and website QA/monitoring.

This is a technical spot audit and competitive content analysis, not a complete crawl, Google rank tracking report, backlink audit, or authenticated product evaluation. No Search Console, analytics, keyword-volume, keyword-difficulty, or revenue dataset was available. Search results reveal possible intents and competitors, not reliable Google positions. Low traffic does not establish whether discovery, demand, relevance, authority, or conversion is the principal constraint. No traffic-growth or ranking forecast is justified yet.

## 1. Positioning and acquisition strategy

Keep the homepage relevant to all web teams. Proposed copy, subject to product verification:

- Title: `Website Quality Monitoring & Accessibility | ScanGov`
- H1: `Find website quality issues. Know what to fix next.`
- Supporting copy: `Monitor accessibility, discoverability, security, and usability. Turn findings into prioritized tasks and track your team's progress.`
- Primary path for smaller teams: clear pricing and a concrete sample report before checkout.
- Government/complex accounts: a focused demo using an example relevant to their site portfolio.

Make the supported scope explicit: public websites and PDFs. Add a concise onboarding explanation near the pricing CTA: `Choose a plan, pay securely through Stripe, and enter your domain. Initial scan results start appearing in a few minutes, with grades, prioritized issues, and guidance on what to fix.` Treat the timing as an expectation to validate and qualify for site size; do not imply that a complete scan finishes in a few minutes. Use `View plans` as the broad commercial CTA and a plan-specific paid CTA at checkout. A sample report or short walkthrough should provide proof before payment; no free trial is implied.

The current [homepage](https://scangov.com/) emphasizes digital experience and AI-readiness. Those messages describe ambition but do less to explain the purchasing category or the day-to-day job. Keep the four scan areas, but make the scan → task → fix → rescan workflow the organizing story.

Prioritize these hypotheses:

| Hypothesis | Why test it | Evidence needed to continue |
| --- | --- | --- |
| Buyers comparing website quality tools value transparent pricing and a clear path to useful results | One founder-reported customer was price-comparing and discovered ScanGov on LinkedIn | More comparison-page visitors become activated paying customers; interviews establish why they chose ScanGov |
| Government teams need an affordable, practical accessibility monitoring workflow | Existing brand, public-sector data, and awards relationships give ScanGov relevant proof | Qualified government demos, activation, specific procurement and coverage feedback |
| Small web teams need continuous website QA without assembling reports from multiple tools | Broader audience fit; tasklist, GitHub integration, and history can tell a concrete workflow story | Non-government customers add a domain, complete a scan, and act on an issue |
| Agencies need repeatable reporting across client sites | Natural bridge from government vendors to broader web teams | Repeated multi-domain use, report sharing, willingness to pay |

Suggested initial effort allocation: 60% government/accessibility, 30% broader QA/workflow, 10% exploratory topics. This is an allocation decision, not a market-size estimate. Revisit after actual lead and activation evidence.

Avoid making generic “website monitoring” the sole acquisition category. Sampled results mix uptime, infrastructure, and change tracking; those intents may expect capabilities outside ScanGov's offering. [Better Stack's monitoring comparison](https://betterstack.com/community/comparisons/website-monitoring-tools/) illustrates the breadth of that category. Similarly, use “Botability” as product terminology alongside familiar explanatory language; search demand for the coined term has not been established.

PDF scanning is supported. Document the exact PDF checks, reporting behavior, discovery rules, and how PDF scans consume plan allowances before making detailed coverage claims. Authenticated pages and dynamic application flows are not supported today. Do not target those as acquisition promises or add them to the roadmap solely to match competitors. Comprehensive application testing, automatic remediation, and CI deployment checks remain unverified. Broader audience messaging should focus on the public websites and documents that web teams maintain.

## 2. What competitors demonstrate

| Competitor/evidence | Observable content strategy | Implication for ScanGov |
| --- | --- | --- |
| [Siteimprove accessibility product page](https://www.siteimprove.com/platform/accessibility/web-accessibility-software/) | Product screenshots, specific workflows, buyer questions, links to industries, customer stories, and demo CTAs | Build pages that answer evaluation questions and show the product doing the work |
| [Siteimprove government page](https://www.siteimprove.com/industries/government/) | Dedicated public-sector language, role-based paths, resources, and procurement trust signals | Give government its own substantial landing page; a list of audience roles is insufficient |
| [Siteimprove Denver case study](https://www.siteimprove.com/case-studies/city-and-county-of-denver/) | A two-person team's operational problem, implementation story, and vendor-reported results | Publish specific before/after workflows, with customer permission and documented measurements |
| [Siteimprove free checker](https://help.siteimprove.com/support/solutions/articles/80000448491) | A useful free browser extension introduces users to its testing approach | Free utility can create discovery, but it must actually solve the searched-for problem |
| [Silktide government page](https://silktide.com/industries/government/) and [public index](https://index.silktide.com/category/uk-central-government) | Government solutions plus publicly accessible benchmark content | Public data is a useful strategy, but not unique to ScanGov; differentiate through scope and analysis |
| [Acquia QA page](https://www.acquia.com/products/acquia-web-governance/features/quality-assurance) and [governance handbook](https://www.acquia.com/resources/e-book/web-optimization-and-governance) | Product-specific QA content paired with governance education | Broader QA/governance is an existing commercial category worth testing |

Siteimprove connects educational, product, industry, and proof pages into a buying journey. That architecture is observable; its contribution to traffic or revenue is not measurable from this research. ScanGov should reproduce the useful journey at a manageable scale.

Siteimprove also publishes on [government answer-engine optimization](https://www.siteimprove.com/blog/answer-engine-optimization-government/). AI-readiness is therefore not uncontested positioning. Defer a large AI-content campaign until ScanGov can show distinctive findings and associated buyer demand.

The live [ScanGov plans page](https://scangov.com/plans/) lists $50, $100, $500, and $1,000 monthly plans, with page-scan allowances and unlimited users. Transparent pricing is a concrete asset. Explain who each plan fits, what a page scan consumes, and what happens after purchase. Do not invent competitor pricing or claim feature equivalence.

## 3. Technical findings and implementation backlog

The site already generates static HTML, canonical links, descriptions, Open Graph metadata, and structured data. Sampled Organization JSON-LD parses as JSON. The three checked public hosts allow crawling and advertise their respective sitemaps. HTTP and www homepage requests correctly return 301 redirects to `https://scangov.com/`.

| Priority | Finding and evidence | Proposed change and acceptance criteria |
| --- | --- | --- |
| P1 | Live `.com` sitemap contains 59 URLs: 27 unsupported date strings, 26 empty `lastmod` elements, and 6 date-only values. `content/sitemap.njk` interpolates dates directly. | Format known dates as W3C dates; omit `lastmod` when unknown. Validate every emitted date. Use actual significant content updates, not a blanket build timestamp. |
| P1 | `/sso-setup-guide/` appears in the sitemap but serves an HTTP 200 page with a client-side redirect template. Source lacks `sitemap: false`. | Remove the source URL from the sitemap, update links to the destination, and use a server/edge permanent redirect where hosting permits. Validate the destination separately. |
| P1 | `/demo-confirm/` is omitted from the sitemap but live HTML explicitly says `index, follow`. `_includes/header.html` hardcodes this policy. `/search/` is in the sitemap. | Add an explicit per-page indexing policy. Apply `noindex` to confirmation/internal-search pages and remove them from sitemaps. Do not assume all sitemap exclusions should receive noindex. |
| P1 | `_includes/analytics.html` configures GA4; no explicit funnel events were found in inspected marketing source. Calendly and Stripe take visitors off-site. | Verify existing GA4 settings before adding events; distinguish outbound clicks from completed bookings/purchases. Test a complete conversion path. |
| P1 | Homepage title is broad; `/accessibility/` is titled `Accessibility - ScanGov`; `/plans/` is titled `Plans - ScanGov`. | Use descriptive search-intent titles and substantive corresponding page content. Preserve existing URLs unless a migration has a clear benefit. |
| P2 | Feature pages are generated from short descriptions/bullets, with some videos. The accessibility landing page heavily emphasizes links to standards. | Add product evidence, use cases, limitations, workflow explanations, and contextual links before expanding page count. |
| P2 | Related feature cards are initially hidden and moved with JavaScript in `content/feature.html`. | Render the selected related cards visibly at build time. This improves deterministic navigation; it is not evidence that Google currently cannot discover them. |
| P2 | Existing CI runs `scripts/check-sitemap-completeness.js`, which checks inclusion rather than date validity or whether listed pages should be indexed. | Preserve the completeness check and add checks for malformed/empty dates, duplicate sitemap URLs, and redirect/noindex entries. |
| P2 | Performance remains unmeasured. The site inlines CSS and preloads a TTF font. | Measure mobile lab performance on home, accessibility, and pricing; use field data when available. Optimize demonstrated bottlenecks. File format or payload size alone does not establish a Core Web Vitals failure. |

The malformed dates do not prove the sitemap cannot be used or explain low traffic on their own. Google describes `lastmod` as useful when supported and accurate; see [Google's sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). Sitemap exclusion is not a noindex directive; see [Google's technical guidance](https://developers.google.com/search/docs/fundamentals/get-started).

The local `_site` directory was not treated as a fresh build or production inventory. Source and deployed content can differ. No production code was changed for this research.

## 4. Roles for the ScanGov sites

| Host | Recommended primary role | Example next step for its reader |
| --- | --- | --- |
| `scangov.com` | Commercial product, use cases, comparisons, customer proof, pricing, demo | Evaluate the monitoring workflow and start or book a demo |
| `scangov.org` | Public research, domain profiles, benchmarks, methodology | Understand findings, then follow a relevant product/use-case link |
| `standards.scangov.org` | Authoritative explanations of checks and remediation | Apply a fix, then learn how to monitor that issue across a site |
| `my.scangov.com` | Authenticated product and activation | Complete a scan and take action on a finding |
| `docs.scangov.org` | Setup and operational documentation already linked in the repo | Implement the feature described on its commercial page |

The public [ScanGov project](https://scangov.org/) already links into product categories and standards. Improve those contextual journeys rather than assuming all cross-site linking is missing. At review time its homepage displayed 1,381 sites and a June 24, 2026 last-scan date. Treat those as a displayed snapshot; verify freshness and sample coverage before publishing a new benchmark.

Keep distinct intent on distinct pages: `.com/accessibility/` should explain buying and using the product, while a standards page should explain a specific test and fix. Cross-link naturally. Do not duplicate entire articles across hosts or canonicalize distinct reference pages to commercial pages. Multiple hosts alone do not establish cannibalization or justify migration. Reconsider consolidation only after query-level overlap, links, and maintenance costs can be evaluated.

Keep the paid application authenticated. Publish accurate screenshots, sample outputs, and walkthroughs on `.com` to make product value discoverable without exposing private customer information. Cross-domain measurement needs deliberate configuration for `.com` and `.org`; use explicit referral events and preserve acquisition attribution rather than indiscriminately adding UTMs to every owned link.

## 5. First content and keyword map

These are candidate query clusters, not measured-volume keywords. Each URL should own a primary intent; supporting variants belong on the same page when they answer the same need.

| Order | Page | Query/intent hypotheses | Required substance | Conversion |
| --- | --- | --- | --- | --- |
| 1 | Upgrade `/plans/` | ScanGov pricing; affordable website QA software | Allowance examples, public-site/PDF scope, Stripe-to-domain onboarding, initial-results expectation, sample output | Checkout → activated account |
| 2 | New `/compare/siteimprove/` | ScanGov vs Siteimprove; Siteimprove alternative | Dated source-backed comparison by buyer task, scope, pricing model, onboarding and limitations; state authenticated/dynamic flows are unsupported | Pricing or demo |
| 3 | Upgrade `/accessibility/` | website accessibility monitoring; accessibility monitoring software | Actual scan output, prioritization, fixes, rescans, supported website/PDF checks, manual-testing limits | Relevant demo or pricing |
| 4 | New `/solutions/government/` | government website accessibility software; government website governance | Government workflows, portfolio reporting, procurement facts, proof, current standards references | Qualified demo |
| 5 | New `/website-quality-assurance/` | website quality assurance tools; continuous website QA | Scan-to-GitHub-to-rescan walkthrough for public websites; what is and is not checked | Sample report → pricing |
| 6 | New practical monitoring guide on `.com` | government accessibility monitoring plan; accessibility remediation workflow | Inventory, triage, ownership, manual testing, repeat scans, reporting template | Government solution page |
| 7 | One original benchmark on `.org` | government website accessibility benchmark; public-sector website quality | Reproducible methods, sampling dates, exclusions, top failures, fixes, accessible charts/data | Relevant `.com` product page |
| 8 | Upgrade `/features/github-integration/` | website audit GitHub issues; accessibility issue tracking GitHub | Exact integration steps and screenshots; supported behavior and limitations | QA landing page or start |

Improve tasklist, scorecards, and issue-report pages as supporting links. Avoid renaming feature URLs solely to insert keywords; their slugs are currently generated from titles, so changing a data title can unintentionally change a URL. Separate display titles from stable slugs before large-scale title edits.

For the comparison, distinguish “not confirmed” from “not supported.” Explain situations where the alternative is a better fit. The broad “Siteimprove alternatives” search is already populated with directories and competitor-written lists, so do not make one comparison page the entire acquisition strategy.

The comparison and pricing pages move ahead of broad educational content because of the founder's customer evidence. Pair them with a product walkthrough so the case rests on useful outcomes as well as cost. A dedicated PDF page is a follow-on experiment after the exact checks and allowance model are documented; start by showing PDF examples within the accessibility and government pages. PDF scanning alone does not establish comprehensive PDF accessibility coverage.

For government guidance, maintain a named reviewer and checked-on date. The [current DOJ fact sheet](https://www.ada.gov/resources/2024-03-08-web-rule/) reports April 26, 2027 for entities with populations of 50,000 or more and April 26, 2028 for smaller entities and special districts following the April 2026 extension. It specifies WCAG 2.1 AA. Older pages can show earlier dates. Verify the applicable rule at publication and distinguish the state/local framework from federal requirements. Automated scores must not be presented as a legal compliance certification.

## 6. Proof, tools, and links

The existing `/tools/scan-check/` checks whether ScanGov can reach a website; it is not a free accessibility audit. Keep that promise accurate. A genuinely useful free issue sample may be a later product experiment, after reviewing implementation cost, abuse limits, and activation value. Do not advertise a free trial or free audit before one exists.

Create one complete, public scan-to-fix example using an owned or permitted site. Show the finding, the relevant code or content change, and the rescan result. For customer stories, obtain permission and measure the claimed outcome. Scanning an organization's domain does not establish that it is a customer or endorses ScanGov.

Use public data for an original research asset, not a proliferation of thin pages. Document the unit of analysis (site/page/check), denominator, scan date, methodology version, exclusions, and the limits of automated testing. If comparing time periods, use comparable samples and methodology. Report observed defects and remediation priorities, not unsupported percentages of legal compliance.

After the asset exists, a founder can share it with existing civic-tech and awards contacts, government web communities, relevant newsletters, and implementation partners. Offer useful findings and reproducible methods. Seek editorial coverage and voluntary citations; avoid purchased links, compulsory keyword-rich badges, or mass outreach. No outreach was sent as part of this work.

Use LinkedIn as an existing discovery channel while search visibility develops. Publish a concrete issue-to-fix example, an onboarding walkthrough, and an explanation of plan fit, each linking to the relevant durable `.com` page. Use campaign tags on external LinkedIn links and ask buyers how they found ScanGov; social discovery may later produce branded search or a direct visit. Evaluate social-assisted and organic acquisition separately. Invite the comparison-minded customer to explain which tools they considered, their evaluation criteria, and what made the purchase worthwhile; do not assume they were comparing Siteimprove specifically.

The [standards reference](https://standards.scangov.org/) can support long-tail discovery when pages have accurate explanations and examples. Prioritize editorial review of the most-used checks; do not scale new AI-generated reference content ahead of quality control.

## 7. Conversions and measurement

Use two commercial outcomes initially: **activated paying accounts** for self-service buyers and **qualified completed demos** for organizations needing evaluation/procurement. Booked demos are an intermediate signal. A pricing click or Calendly click is not a completed sale or meeting.

Provisional activation definition: a paying account adds a domain, receives its first actionable scan result, and opens the issue guidance or exports a finding within seven days. Measure first results separately from full scan completion because results arrive progressively. Track payment-to-domain time, domain-to-first-result time, and first-result-to-issue-engagement time. Validate whether this predicts retention; later track a rescan or confirmed improvement. Product instrumentation will require work outside this marketing repo.

| Stage | Suggested event or record | Interpretation |
| --- | --- | --- |
| Discovery | Search Console query/page impressions and clicks | Segment branded/nonbranded, audience, host, and country |
| Evaluation | Sample report viewed, pricing viewed, relevant CTA clicked | Supporting signals; do not count these as revenue |
| Lead | Demo booked, demo held, qualified/not qualified | Use Calendly integration/CRM records where available; record buyer and problem |
| Purchase | Verified completed payment | Confirm through checkout/backend integration, not the outgoing Stripe link |
| Activation | Domain added, first result available, actionable finding/guidance opened or exported; full scan completion separately | Attribute the acquisition landing page to a useful product outcome and measure where onboarding stalls |
| Retention | Rescan, repeated usage, renewal | Establish whether the SEO-acquired audience is a good customer fit |

Configure or confirm Search Console ownership for `scangov.com` and `scangov.org`, including the relevant subdomains. Existing verification strings in source do not prove usable account access. Submit each public sitemap, inspect representative important URLs, and record the first baseline. Verify GA4, consent behavior, cross-domain attribution, and external-provider completion integrations before interpreting conversions. Avoid using a bare visit to `/demo-confirm/` as proof of a new booking because the page can be opened directly or revisited.

At low traffic, use sequential improvements and qualitative lead feedback. Do not run many simultaneous A/B tests or interpret a few visits as statistically meaningful. Review 28-day trends, but show event counts and denominators alongside rates.

## 8. Ninety-day execution

Effort ranges are planning estimates, not commitments. One engineering day means focused implementation time; editorial/research days include interviews, examples, and review. Product analytics integrations and customer approval can add elapsed time.

| Window | Deliverable | Suggested owner / effort | Definition of done |
| --- | --- | --- | --- |
| Days 1–14 | Sitemap/indexing fixes and baseline tracking | Engineer + founder; 2–4 engineering days | Dates validate, redirect/utility sitemap entries corrected, key page inspection recorded, conversions testable |
| Days 1–14 | Pricing/onboarding clarity and documented capability matrix | Founder + product; 1–2 working days plus 1 engineering day | Plan fit and payment-to-first-results path explained; exact PDF coverage/allowances documented; unsupported authenticated/dynamic flows clear |
| Days 15–30 | Homepage revision, sample walkthrough, fair Siteimprove comparison, accessibility upgrade | Founder/editor + engineer; 4–6 editorial days, 2–3 engineering days | Actual product output and buyer questions addressed; comparison sources verified; distinct intent and working CTAs |
| Days 31–60 | Government and QA pages, GitHub walkthrough | Product expert/editor; 4–6 editorial days, 1–2 engineering days | Working public-site/PDF examples, verified scope, internal links, observable conversion paths |
| Days 31–60 | One practical government monitoring guide | Product expert/editor; 2–3 editorial days | Actionable workflow, reviewed references, useful template, link to solution page |
| Days 61–90 | One original benchmark or measured customer case study | Data/product + founder; 3–5 working days | Methods/results verified, permission where needed, durable public asset, distribution prepared |
| Days 61–90 | Review and focus next quarter | Founder + analyst; 1 working day | Compare discovery, qualified leads, activation, and objections by content track |

If capacity is tighter, ship the technical fixes, pricing/onboarding clarity, a sample walkthrough, the comparison page, and the accessibility upgrade first. Add the government page next. Defer the free-tool build, large content library, multiple audience pages, and domain migration. Do not expand into authenticated or dynamic-flow testing as part of this SEO plan without separate product demand evidence.

Decision rules for the review:

- Pages not discovered or indexed: investigate links, sitemap signals, canonical selection, and page quality before publishing more pages.
- Relevant impressions but few clicks: inspect the actual query mix and search presentation; improve intent alignment and titles.
- Relevant visits but little evaluation: strengthen proof, clarify scope, and lower friction in the next step.
- Checkout starts or bookings without completion: inspect provider handoff, onboarding, price fit, and qualification.
- Purchases without activation: prioritize product onboarding and audience fit.
- One audience produces useful customers: concentrate the next content investment there while retaining broad homepage positioning.

Do not set an arbitrary percentage-growth target from a tiny starting base. By day 90, success should include a verified technical foundation, a small set of substantive acquisition pages, accurate funnel measurement, and evidence about which buyer/problem deserves more investment. Rankings and revenue remain outcomes to observe, not guarantees.

Remaining discovery work: interview the comparison-minded customer about their shortlist and selection criteria; document exact PDF checks and scan-allowance treatment; measure initial-results latency on representative sites; establish available founder/editor/engineering time. The broad scan scope and post-checkout sequence are now confirmed by the founder. No additional founder answers are required to begin the prioritized work.
