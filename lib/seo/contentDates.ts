/**
 * Per-URL content dates — the single source of truth for:
 *   - sitemap <lastmod> (app/sitemap.ts)
 *   - JSON-LD dateModified on calculator pages
 *   - the visible "Last updated" line on calculator pages
 *
 * UPDATE THE RELEVANT DATE whenever you make a meaningful content change to
 * a page (copy, math, defaults, FAQs). Do NOT use new Date() here — lastmod
 * must reflect real content changes, not build timestamps, or search engines
 * learn to ignore it.
 */

/** Calculator pages: slug -> last meaningful content change (YYYY-MM-DD). */
export const calculatorLastUpdated: Record<string, string> = {
  // 2026-10-18: added FAQs, methodology & rate-source disclosures sitewide
  'mortgage-cost': '2026-10-18',
  affordability: '2026-10-18',
  'down-payment': '2026-10-18',
  'rent-vs-buy': '2026-10-18',
  refinance: '2026-10-18',
  'cash-out-refi': '2026-10-18',
  'recast-vs-refi': '2026-10-18',
  'points-buydown': '2026-10-18',
  'arm-vs-fixed': '2026-10-18',
  'timeline-simulator': '2026-10-18',
  'extra-payment': '2026-10-18',
  acceleration: '2026-10-18',
  biweekly: '2026-10-18',
  'interest-sensitivity': '2026-10-18',
  amortization: '2026-10-18',
  dti: '2026-10-18',
  'closing-costs': '2026-10-18',
  pmi: '2026-10-18',
  fha: '2026-10-18',
  va: '2026-10-18',
};

/** Static / index pages: path -> last meaningful content change. */
export const staticPageLastUpdated: Record<string, string> = {
  '/': '2026-02-15',
  '/calculators': '2026-10-18', // calculator index reflects calculator content
  '/guides': '2026-02-16',
  '/learn': '2026-02-16',
  '/compare': '2026-02-16',
  '/privacy': '2026-10-18',
  '/terms': '2026-10-18',
  '/about': '2026-10-18',
  '/scenario': '2026-10-18',
  '/embed': '2026-10-18',
};

/** Guide articles (content lives in lib/guides/guideContent.tsx). */
export const guidesLastUpdated = '2026-02-16';

/** Comparison pages (content lives in lib/comparisons/comparisonData.ts). */
export const comparisonsLastUpdated = '2026-02-15';

/** Definition / glossary pages (content lives in lib/definitions/definitionData.ts). */
export const definitionsLastUpdated = '2026-02-16';

export function getCalculatorLastUpdated(slug: string): string {
  return calculatorLastUpdated[slug] ?? '2026-10-18';
}
