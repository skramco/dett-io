/**
 * Per-calculator review metadata.
 *
 * `lastUpdated` is the date (ISO 8601, YYYY-MM-DD) the calculator's formulas,
 * rate tables, and assumptions were last reviewed. Update the value here when
 * a calculator's math or data sources change — it drives the "Last updated"
 * label shown on every calculator page.
 */
export interface CalculatorMeta {
  lastUpdated: string;
}

export const calculatorMeta: Record<string, CalculatorMeta> = {
  'mortgage-cost': { lastUpdated: '2026-10-18' },
  affordability: { lastUpdated: '2026-10-18' },
  'down-payment': { lastUpdated: '2026-10-18' },
  'rent-vs-buy': { lastUpdated: '2026-10-18' },
  refinance: { lastUpdated: '2026-10-18' },
  'cash-out-refi': { lastUpdated: '2026-10-18' },
  'recast-vs-refi': { lastUpdated: '2026-10-18' },
  'points-buydown': { lastUpdated: '2026-10-18' },
  'arm-vs-fixed': { lastUpdated: '2026-10-18' },
  'timeline-simulator': { lastUpdated: '2026-10-18' },
  'extra-payment': { lastUpdated: '2026-10-18' },
  acceleration: { lastUpdated: '2026-10-18' },
  biweekly: { lastUpdated: '2026-10-18' },
  'interest-sensitivity': { lastUpdated: '2026-10-18' },
  amortization: { lastUpdated: '2026-10-18' },
  dti: { lastUpdated: '2026-10-18' },
  'closing-costs': { lastUpdated: '2026-10-18' },
  pmi: { lastUpdated: '2026-10-18' },
  fha: { lastUpdated: '2026-10-18' },
  va: { lastUpdated: '2026-10-18' },
};

/** Formats an ISO date (YYYY-MM-DD) as e.g. "October 18, 2026". */
export function formatLastUpdated(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function getCalculatorLastUpdated(slug: string): string | null {
  const meta = calculatorMeta[slug];
  return meta ? meta.lastUpdated : null;
}
