import { getData } from '../scripts/getdata.js';

// HTTP status definitions (ScanGov/data status.json), fetched once at build time
// and published as /data/status.json (content/data-status.njk) for the good bot
// scan tool. Fetching at build keeps the page from calling raw.githubusercontent.com
// on every visit; wording changes ship with the next site deploy. With a local
// ../data checkout, getData reads that file instead (same as the other datasets).
export default async () => {
  return getData('https://github.com/ScanGov/data/raw/refs/heads/main/status.json', true);
};
