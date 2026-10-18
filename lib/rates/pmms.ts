import type { MarketRates, RateProvider } from './types';

/**
 * Freddie Mac Primary Mortgage Market Survey (PMMS) provider.
 *
 * PMMS publishes a public weekly U.S. average for 30-year and 15-year fixed
 * mortgages every Thursday. We read the full-history CSV and take the most
 * recent row. The upstream fetch is cached server-side via Next's data cache
 * (revalidated every 6 hours), so visitors never wait on freddiemac.com.
 *
 * PMMS is a national average — it cannot personalize by ZIP / credit / LTV,
 * so the RateQuery is ignored and `personalized` is always false.
 */

const PMMS_CSV_URL = 'https://www.freddiemac.com/pmms/docs/PMMS_history.csv';
const REVALIDATE_SECONDS = 6 * 60 * 60;

/** Sanity bounds — reject obviously corrupt feed values. */
const MIN_RATE = 0.5;
const MAX_RATE = 25;

function parseRate(raw: string | undefined): number | null {
  if (!raw) return null;
  const num = Number(raw.trim());
  if (!Number.isFinite(num) || num < MIN_RATE || num > MAX_RATE) return null;
  return num;
}

/** Converts PMMS "M/D/YYYY" dates to ISO "yyyy-mm-dd". Returns null if malformed. */
function parseDate(raw: string | undefined): string | null {
  if (!raw) return null;
  const match = raw.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, month, day, year] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function parsePmmsCsv(csv: string): MarketRates {
  const lines = csv.trim().split('\n');
  const header = lines[0].split(',').map((col) => col.trim().toLowerCase());
  const dateIdx = header.indexOf('date');
  const rate30Idx = header.indexOf('pmms30');
  const rate15Idx = header.indexOf('pmms15');
  if (dateIdx === -1 || rate30Idx === -1) {
    throw new Error('PMMS CSV header missing expected columns');
  }

  // Walk backwards to the most recent row with a valid 30-year rate.
  for (let i = lines.length - 1; i > 0; i--) {
    const cols = lines[i].split(',');
    const rate30 = parseRate(cols[rate30Idx]);
    const asOf = parseDate(cols[dateIdx]);
    if (rate30 !== null && asOf !== null) {
      return {
        rate30,
        rate15: rate15Idx === -1 ? null : parseRate(cols[rate15Idx]),
        asOf,
        source: 'pmms',
        sourceLabel: 'Freddie Mac PMMS',
        personalized: false,
      };
    }
  }
  throw new Error('No valid rate rows found in PMMS CSV');
}

export const pmmsProvider: RateProvider = {
  id: 'pmms',
  label: 'Freddie Mac PMMS',
  async fetchRates(): Promise<MarketRates> {
    const res = await fetch(PMMS_CSV_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: 'text/csv' },
    });
    if (!res.ok) {
      throw new Error(`PMMS fetch failed with status ${res.status}`);
    }
    return parsePmmsCsv(await res.text());
  },
};
