import { getData } from '../scripts/getdata.js';

export default async () => {
    const data = await getData('https://github.com/ScanGov/data/raw/refs/heads/main/standards/audits.json', true);

    const descriptionOverrides = {
        usability: 'Optimize content and design so users can quickly find what they need.'
    };

    const pageTitles = {
        accessibility: 'Digital accessibility monitoring',
        botability: 'AI and search readiness (Botability) for digital services',
        security: 'Digital security headers monitoring',
        usability: 'Digital usability and Core Web Vitals',
        readability: 'Digital readability and plain language monitoring'
    };

    // Meta description and lead for the indicator page. `description` stays short for cards.
    const pageDescriptions = {
        accessibility: n => `Check your site against accessibility standards like WCAG, ADA Title II, and Section 508, with a prioritized fix list and a public scorecard.`,
        botability: n => `Check whether AI tools and search engines can find and understand your site: robots.txt, sitemaps, canonical tags, schema, and crawlability.`,
        security: n => `Check security headers and practices on every page: HTTPS, HSTS, CSP, X-Content-Type-Options, and security.txt.`,
        usability: n => `Check usability and Core Web Vitals on every page: performance, page titles and descriptions, viewport and mobile settings, and social sharing tags.`,
        readability: n => `Check the reading grade level of every page against the plain language standard, with Automated Readability Index and Flesch-Kincaid scores, a public scorecard, and the law behind it.`
    };

    const whatCopy = {
        botability: 'the technical issues that keep AI tools and search engines from finding, crawling, and understanding your website',
        accessibility: 'the barriers that keep people with disabilities from using your website',
        usability: 'the navigation and content issues that make it hard for people to find what they need',
        security: 'the vulnerabilities that put your website and its visitors at risk',
        readability: 'the pages written above the reading grade most people can understand'
    };

    // Hand-written sections rendered after the generic ones by content/indicator.html.
    // Nunjucks cannot test whether an include file exists, so the path is set here.
    const extraIncludes = {
        readability: 'indicators/readability.html'
    };

    // FAQ lists for the hand-written sections. Rendered by _includes/faq.html,
    // which also emits the FAQPage JSON-LD.
    const faqs = {
        readability: [
            {
                q: 'What is the difference between the Automated Readability Index and Flesch-Kincaid?',
                a: 'Both estimate the U.S. school grade a reader needs. ARI uses characters per word and words per sentence; Flesch-Kincaid uses syllables per word and words per sentence. They usually land within a grade of each other. ScanGov records both and scores the pass or fail on ARI.'
            },
            {
                q: 'Does readability count toward accessibility compliance?',
                a: 'WCAG 2.2 has a reading level criterion (3.1.5) at Level AAA, above the Level AA the ADA Title II rule requires, so a hard-to-read page does not by itself fail Title II. It does fail the people the rule exists for. Plain language is the standard federal sites are held to under the Plain Writing Act and 21st Century IDEA, and most state and local style guides adopt it.'
            },
            {
                q: 'Why does my site fail readability on its ScanGov scorecard?',
                a: 'The public scorecard on scangov.org scores the homepage, and homepages are mostly links and labels, which read as fragments. A fail there means the homepage text rounds above grade 8. A ScanGov subscription scans every page, so you can see which pages actually carry the hard-to-read prose and fix those first.'
            },
            {
                q: 'How often is readability re-scored?',
                a: 'Public scorecards on scangov.org are refreshed on ScanGov\'s regular scan schedule, and each profile\'s Pulse view charts the homepage\'s indicators over time. Sites monitored in the ScanGov product are scanned on their plan\'s cadence, and the readability section lists every page above the target grade after each scan, so a content team can measure the effect of a rewrite page by page.'
            }
        ]
    };

    const indicators = [];
    for (const key in data) {
        const value = data[key];

        // Create list of all guidance under indicator
        const guidanceNames = [];
        const guidance = [];

        for (const standard of value.attributes)
            for (const guide of standard.guidance)
                if (!guidanceNames.includes(guide.displayName)) {
                    guidanceNames.push(guide.displayName);
                    guidance.push(guide);
                }

        indicators.push({
            url: key,
            name: value.displayName,
            icon: value.icon,
            link: key,
            color: value.color,
            description: descriptionOverrides[key] ?? value.description,
            pageTitle: pageTitles[key] ?? value.displayName,
            h1: value.displayName,
            pageDescription: pageDescriptions[key] ? pageDescriptions[key](value.attributes.length) : (descriptionOverrides[key] ?? value.description),
            standards: value.attributes,
            guidance,
            videos: value.videos,
            what: whatCopy[key] ?? '',
            extraInclude: extraIncludes[key],
            faq: faqs[key],
            why: value.why,
            risk: value.risk,
            ogImage: value.ogImage
        });
    };

    // Alphabetical, with readability pinned last: its hue was validated next to
    // usability's, not between botability's and security's (see the auditor's
    // docs/readability-topic-plan.md, "Topic color").
    indicators.sort((a, b) => {
        if (a.url === 'readability') return 1;
        if (b.url === 'readability') return -1;
        return a.name.localeCompare(b.name);
    });

    return indicators;
};
