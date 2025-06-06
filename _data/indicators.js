import { getData } from '../scripts/getdata.js';

export default async () => {
    const data = await getData('https://github.com/ScanGov/data/raw/refs/heads/main/standards/audits.json', true);

    const indicators = [];
    for (const key in data) {
        const value = data[key];

        // Create list of all guidance under indicator
        let guidance = [];
        for (const standard of value.attributes) {
            guidance = guidance.concat(standard.guidance);
        }

        indicators.push({
            url: key,
            name: value.displayName,
            icon: value.icon,
            link: key,
            color: value.color,
            description: value.description,
            standards: value.attributes,
            guidance
        })
    };

    return indicators;
};
