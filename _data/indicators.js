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
        usability: 'Digital usability and Core Web Vitals'
    };

    // Meta description and lead for the indicator page. `description` stays short for cards.
    const pageDescriptions = {
        accessibility: n => `Check your site against accessibility standards like WCAG, ADA Title II, and Section 508, with a prioritized fix list and a public scorecard.`,
        botability: n => `Check whether AI tools and search engines can find and understand your site: robots.txt, sitemaps, canonical tags, schema, and crawlability.`,
        security: n => `Check security headers and practices on every page: HTTPS, HSTS, CSP, X-Content-Type-Options, and security.txt.`,
        usability: n => `Check usability and Core Web Vitals on every page: performance, readability, viewport and mobile settings, and content structure.`
    };

    // Topic pages under an indicator (plan 13 topic layer). Rendered by content/indicator.html.
    const topics = {
        usability: [
            { title: 'Readability', url: '/usability/readability/', description: 'Reading grade level of government web content, scored against the plain language standard.' }
        ]
    };

    const whatCopy = {
        botability: 'the technical issues that keep AI tools and search engines from finding, crawling, and understanding your website',
        accessibility: 'the barriers that keep people with disabilities from using your website',
        usability: 'the navigation and content issues that make it hard for people to find what they need',
        security: 'the vulnerabilities that put your website and its visitors at risk'
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
            topics: topics[key] ?? [],
            why: value.why,
            risk: value.risk,
            ogImage: value.ogImage
        });
    };

    return indicators;
};
