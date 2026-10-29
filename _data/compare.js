import { readdirSync, readFileSync } from 'node:fs';

// Derived data for /compare/. The raw records live in _data/comparison/
// (rows.json, concerns.json, indicators.json, scangov.json, competitors/*.json)
// and are also available as the `comparison` global. Adding a tool is a data
// change: drop a JSON file in competitors/ and set `published` to true once
// every claim has a source and a checked date.
const dir = new URL('./comparison/', import.meta.url);
const read = (name) => JSON.parse(readFileSync(new URL(name, dir), 'utf8'));

export default () => {
    const rows = read('rows.json');
    const concerns = read('concerns.json');
    const indicators = read('indicators.json');
    const scangov = read('scangov.json');

    const tools = readdirSync(new URL('competitors/', dir))
        .filter((f) => f.endsWith('.json'))
        .map((f) => read(`competitors/${f}`))
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name));

    const published = tools.filter((t) => t.published);

    // Detail rows grouped by indicator, in indicators.json order, so the
    // templates can emit one <tbody> per indicator.
    const groups = indicators
        .map((ind) => ({ ...ind, rows: rows.detail.filter((r) => r.indicator === ind.id) }))
        .filter((g) => g.rows.length);

    // One static page per indicator (/compare/{indicator}/), platform excluded;
    // the platform rows appear on every page under the All tab.
    const indicatorPages = groups
        .filter((g) => g.id !== 'platform')
        .map((g) => ({ ...g, tools: published }));

    const modified = [scangov.checked, ...published.map((t) => t.modified || t.checked)]
        .filter(Boolean).sort().pop();

    return { rows, concerns, indicators, scangov, tools, published, groups, indicatorPages, modified };
};
