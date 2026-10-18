/**
 * Central source of truth for default interest rates used across calculators.
 *
 * UPDATE WEEKLY: Freddie Mac publishes the Primary Mortgage Market Survey
 * (PMMS) every Thursday at https://www.freddiemac.com/pmms
 *
 * 1. Update `thirtyYearFixed` and `fifteenYearFixed` with the published averages.
 * 2. Update `RATES_AS_OF` with the survey date (the Thursday the data covers).
 * 3. FHA / VA / ARM defaults are estimates derived from typical spreads vs the
 *    PMMS 30-year average — adjust the spreads below if market conditions shift.
 */

// PMMS survey date the published averages below are from (YYYY-MM-DD).
export const RATES_AS_OF = '2026-10-15';

export const RATES_SOURCE = {
  name: 'Freddie Mac Primary Mortgage Market Survey (PMMS)',
  shortName: 'Freddie Mac PMMS',
  url: 'https://www.freddiemac.com/pmms',
};

/** Round a derived rate to 2 decimals to avoid float artifacts (7.4 - 0.5 → 6.9). */
export function offsetRate(base: number, delta: number): number {
  return Math.round((base + delta) * 100) / 100;
}

// Published PMMS national averages as of RATES_AS_OF.
const PMMS_30_YEAR = 7.4;
const PMMS_15_YEAR = 6.71;

export const DEFAULT_RATES = {
  /** 30-year fixed — Freddie Mac PMMS national average as of RATES_AS_OF. */
  thirtyYearFixed: PMMS_30_YEAR,
  /** 15-year fixed — Freddie Mac PMMS national average as of RATES_AS_OF. */
  fifteenYearFixed: PMMS_15_YEAR,
  /** 30-year FHA — estimate: PMMS 30-yr minus a typical ~0.25% FHA spread. */
  fha30: offsetRate(PMMS_30_YEAR, -0.25),
  /** 30-year VA — estimate: PMMS 30-yr minus a typical ~0.50% VA spread. */
  va30: offsetRate(PMMS_30_YEAR, -0.5),
  /** 5/1 ARM initial rate — estimate: PMMS 30-yr minus a typical ~0.75% spread. */
  arm5Initial: offsetRate(PMMS_30_YEAR, -0.75),
} as const;

/** Human-readable as-of date, e.g. "October 15, 2026". */
export function formatRatesAsOf(): string {
  const [year, month, day] = RATES_AS_OF.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
