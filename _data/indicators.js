import { getData } from '../scripts/getdata.js';

export default async () => {
    const data = await getData('https://github.com/ScanGov/data/raw/refs/heads/main/standards/audits.json', true);

    const indicators = [];
    for (const key in data) {
        const value = data[key];

        indicators.push({
            url: key,
            name: value.displayName,
            description: value.displayName
        })
    };

    console.log(indicators)
    return indicators;
};
