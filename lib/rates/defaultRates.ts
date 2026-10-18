/**
 * Single source of truth for the default market interest rates pre-filled
 * into every calculator, plus the as-of date and source we disclose on-page.
 *
 * When updating rates: change the values + RATES_AS_OF below, and bump
 * `lastUpdated` in lib/seo/calculatorSeo.ts for affected calculators so the
 * sitemap lastmod and on-page "Last updated" stay accurate.
 */

export const RATES_AS_OF_ISO = '2026-10-15';
export const RATES_AS_OF_LABEL = 'week of October 15, 2026';

export const RATE_SOURCE = {
  name: 'Freddie Mac Primary Mortgage Market Survey (PMMS)',
  shortName: 'Freddie Mac PMMS',
  url: 'https://www.freddiemac.com/pmms',
};

export const DEFAULT_RATES = {
  thirtyYearFixed: 6.75,
  fifteenYearFixed: 6.0,
  fiveOneArm: 5.75,
  fha30: 6.5,
  va30: 6.25,
} as const;

export type RateKey = keyof typeof DEFAULT_RATES;

export const RATE_LABELS: Record<RateKey, string> = {
  thirtyYearFixed: '30-yr fixed',
  fifteenYearFixed: '15-yr fixed',
  fiveOneArm: '5/1 ARM',
  fha30: 'FHA 30-yr',
  va30: 'VA 30-yr',
};

/**
 * Which default rates each calculator pre-fills, so the on-page disclosure
 * can list exactly the rates that calculator uses.
 */
export const CALCULATOR_RATE_KEYS: Record<string, RateKey[]> = {
  'mortgage-cost': ['thirtyYearFixed'],
  affordability: ['thirtyYearFixed'],
  'down-payment': ['thirtyYearFixed'],
  'rent-vs-buy': ['thirtyYearFixed'],
  refinance: ['thirtyYearFixed'],
  'cash-out-refi': ['thirtyYearFixed'],
  'recast-vs-refi': ['thirtyYearFixed'],
  'points-buydown': ['thirtyYearFixed'],
  'arm-vs-fixed': ['thirtyYearFixed', 'fiveOneArm'],
  'timeline-simulator': ['thirtyYearFixed', 'fiveOneArm'],
  'extra-payment': ['thirtyYearFixed'],
  acceleration: ['thirtyYearFixed'],
  biweekly: ['thirtyYearFixed'],
  'interest-sensitivity': ['thirtyYearFixed'],
  amortization: ['thirtyYearFixed'],
  dti: [], // no rate inputs
  'closing-costs': ['thirtyYearFixed'],
  pmi: ['thirtyYearFixed'],
  fha: ['fha30'],
  va: ['va30'],
};

export function formatRate(value: number): string {
  return `${value.toFixed(2).replace(/\.?0+$/, '')}%`;
}
