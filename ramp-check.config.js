// ramp-check configuration. Docs: https://github.com/Mayor-s-Office-of-Innovation/ramp-check#readme
//
// Accessibility checks for the built site: everything axe checks, plus
// motion, keyboard, reflow, text spacing and cross-page consistency. Runs in
// the deploy workflow against _site served on port 8080, and locally with
// `npm run build`, a static server on 8080, then `npm run a11y`.
//
// The ScanGov action covers usability, botability, security and readability
// in the same workflow; this tool owns accessibility.
export default {
  baseURL: "http://127.0.0.1:8080",

  // A representative page per template rather than all ~100 pages: the
  // home page, each section landing, one detail page per section, and the
  // interactive tools.
  pages: [
    "/",
    "/about/",
    "/features/",
    "/features/readability/",
    "/news/",
    "/news/new-scangov-readability-scanner/",
    "/tools/",
    "/rfp-builder/",
    "/search/",
    "/demo/",
    "/plans/",
    "/contact/",
  ],

  // The site has a light and a dark theme, so both are checked. The
  // "reduce" cell runs the motion audit. Mobile catches reflow.
  matrix: {
    colorScheme: ["light", "dark"],
    reducedMotion: ["reduce"],
    viewport: ["mobile", "desktop"],
  },

  // WCAG 2.2 A and AA block; AAA findings (enhanced contrast, for one) warn.
  // Switch to "wcag-aaa" once the AA findings are clear.
  policy: "wcag22-aa",

  // Primary navigation, for the cross-page consistency check.
  consistency: { nav: "nav.navbar" },

  // Exceptions: every entry has a rule, target, reason, and expiry date.
  allowlist: "./a11y-allowlist.json",

  // Adopting with existing findings? Run `npm run a11y:baseline` once and
  // commit a11y-baseline.json; later runs fail only on new findings.
  baseline: "./a11y-baseline.json",

  out: "ramp-check-report",
};
