import { getData } from '../scripts/getdata.js';

export default async () => {
    const data = await getData('https://github.com/ScanGov/data/raw/refs/heads/main/standards/guidance.json', true);

    return data.map(item => { return { title: item.displayName } });
};
