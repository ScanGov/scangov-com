import { getData } from '../scripts/getdata.js';

export default async () => {
  const data = await getData('https://github.com/ScanGov/data/raw/refs/heads/main/standards/audits.json', true);

  const excluded = new Set(['fcp', 'ttfb']);
  const scans = [];
  for (const key in data) {
    const value = data[key];
    for (const standard of value.attributes) {
      if (standard.videos && !excluded.has(standard.key)) {
        standard.topic = key;
        standard.ogImage = value.ogImage;
        scans.push(standard);
      }
    }
  };

  return scans;
};
