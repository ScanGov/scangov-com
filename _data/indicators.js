import { getData } from '../scripts/getdata.js';

export default async () => {
    const data = await getData('https://github.com/ScanGov/data/raw/refs/heads/main/standards/audits.json', true);

    const descriptionOverrides = {
        usability: 'Optimize content and design so visitors quickly find what they need.'
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
            standards: value.attributes,
            guidance,
            videos: value.videos,
            what: whatCopy[key] ?? '',
            why: value.why,
            risk: value.risk,
            ogImage: value.ogImage
        });
    };

    return indicators;
};
