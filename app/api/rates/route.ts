import { NextRequest, NextResponse } from 'next/server';
import { getMarketRates } from '@/lib/rates';
import type { RateQuery, RatesResponse } from '@/lib/rates';

/**
 * GET /api/rates — current market mortgage rates for calculator defaults.
 *
 * The upstream feed (Freddie Mac PMMS) is cached in Next's server-side data
 * cache for 6 hours; this route additionally sets CDN cache headers so the
 * JSON itself is served from the edge. When every provider fails we return
 * { rates: null } with a short cache so clients quietly keep their static
 * defaults and we retry soon.
 *
 * Optional query params (?zip=&credit=&ltv=) are forwarded to providers for
 * personalization. The current PMMS provider ignores them (national average);
 * a future Ratesboard provider can use them.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query: RateQuery = {};
  const zip = params.get('zip');
  if (zip && /^\d{5}$/.test(zip)) query.zip = zip;
  const credit = Number(params.get('credit'));
  if (Number.isFinite(credit) && credit >= 300 && credit <= 850) query.creditScore = credit;
  const ltv = Number(params.get('ltv'));
  if (Number.isFinite(ltv) && ltv > 0 && ltv <= 200) query.ltv = ltv;

  const rates = await getMarketRates(query);
  const body: RatesResponse = { rates };

  return NextResponse.json(body, {
    headers: {
      'Cache-Control': rates
        ? 'public, s-maxage=21600, stale-while-revalidate=86400'
        : 'public, s-maxage=300',
    },
  });
}
