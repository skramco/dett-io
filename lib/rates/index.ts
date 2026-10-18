import { pmmsProvider } from './pmms';
import type { MarketRates, RateProvider, RateQuery } from './types';

export type { MarketRates, RateProvider, RateQuery, RatesResponse } from './types';

/**
 * Rate providers in priority order. The first one that succeeds wins.
 *
 * To showcase Ratesboard later: implement RateProvider in lib/rates/ratesboard.ts
 * (it can use the RateQuery for ZIP / credit / LTV personalization) and add it
 * ahead of PMMS here. No other code needs to change.
 */
const providers: RateProvider[] = [pmmsProvider];

/**
 * Fetches current market rates from the first available provider.
 * Returns null when every provider fails — callers (and ultimately the
 * calculators) fall back to their static defaults.
 */
export async function getMarketRates(query?: RateQuery): Promise<MarketRates | null> {
  for (const provider of providers) {
    try {
      return await provider.fetchRates(query);
    } catch (error) {
      console.error(`[rates] provider "${provider.id}" failed:`, error);
    }
  }
  return null;
}
