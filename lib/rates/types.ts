/**
 * Market mortgage-rate types shared by rate providers, the /api/rates route,
 * and the client hooks that apply live defaults to calculators.
 */

/** Optional personalization inputs. Providers that can't personalize ignore them. */
export interface RateQuery {
  zip?: string;
  /** FICO-style credit score */
  creditScore?: number;
  /** Loan-to-value ratio as a percentage, e.g. 80 */
  ltv?: number;
}

/** A snapshot of current market mortgage rates from a single provider. */
export interface MarketRates {
  /** 30-year fixed average rate, in percent (e.g. 6.72) */
  rate30: number;
  /** 15-year fixed average rate, in percent, if the provider publishes one */
  rate15: number | null;
  /** Date the rates were published / surveyed (ISO yyyy-mm-dd) */
  asOf: string;
  /** Provider id, e.g. 'pmms' */
  source: string;
  /** Human-readable attribution shown next to defaults, e.g. 'Freddie Mac PMMS' */
  sourceLabel: string;
  /** True when the provider personalized the quote using the RateQuery */
  personalized: boolean;
}

/**
 * A source of market rates. Implementations should throw (or reject) on
 * failure so the provider chain in lib/rates/index.ts can fall through.
 *
 * To add a new provider (e.g. Ratesboard), implement this interface and
 * register it in the `providers` list in lib/rates/index.ts.
 */
export interface RateProvider {
  id: string;
  label: string;
  fetchRates(query?: RateQuery): Promise<MarketRates>;
}

/** Shape returned by GET /api/rates. `rates` is null when every provider failed. */
export interface RatesResponse {
  rates: MarketRates | null;
}
