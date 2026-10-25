import { readFileSync } from 'node:fs';
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
        readability: n => `Check the reading grade level of every page against the plain language standard, with Automated Readability Index and Flesch-Kincaid scores.`
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
    const extraIncludes = {};

    // FAQ lists for the hand-written sections. Rendered by _includes/faq.html,
    // which also emits the FAQPage JSON-LD.
    const faqs = {};

    // Free tools related to each indicator, shown in a Tools section on the
    // indicator page by content/indicator.html.
    const tools = {
        readability: [
            {
                name: 'Readability scan',
                url: '/tools/readability/',
                icon: 'fa-book-open-reader',
                description: 'Check the reading grade level of any web page against the plain language standard.'
            }
        ],
        botability: [
            {
                name: 'Good bot scan',
                url: '/tools/good-bot-scan/',
                icon: 'fa-plug-circle-check',
                description: 'Check if good bots like ScanGovBot can scan your website.'
            }
        ]
    };

    // Features that name an indicator ("indicator" in features.json), shown in a
    // Features section on the indicator page by content/indicator.html.
    const features = JSON.parse(readFileSync(new URL('./features.json', import.meta.url), 'utf8'));

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
            tools: tools[key],
            features: features.filter(f => f.indicator === key),
            why: value.why,
            risk: value.risk,
            ogImage: value.ogImage
        });
    };

    indicators.sort((a, b) => a.name.localeCompare(b.name));

    return indicators;
};
