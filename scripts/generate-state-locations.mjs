/**
 * One-shot generator for lib/locations/locationData.ts
 * Sources are documented in the emitted file header.
 */
import { writeFileSync } from 'node:fs';

const LAST_UPDATED = '2026-10-18';
const BASELINE = 832_750;
const CEILING = 1_249_125;
const AK_HI_BASE = 1_249_125;
const HI_CEILING = 1_299_500;

const HIGH_COST = new Set([
  'CA', 'CO', 'CT', 'DC', 'FL', 'HI', 'ID', 'MD', 'MA', 'NH', 'NJ', 'NY', 'PA', 'TN', 'UT', 'VA', 'WA', 'WV', 'WY',
]);

/** Share of statewide transfer/recordation tax the buyer customarily pays. */
const BUYER_SHARE = {
  AL: 0, AK: 0, AZ: 0, AR: 0, CA: 0, CO: 1, CT: 0, DE: 0.5, DC: 1, FL: 0,
  GA: 0, HI: 0, ID: 0, IL: 0, IN: 0, IA: 0, KS: 0, KY: 0, LA: 0, ME: 0.5,
  MD: 0.5, MA: 0, MI: 0, MN: 0, MS: 0, MO: 0, MT: 0, NE: 0, NV: 0, NH: 0.5,
  NJ: 0, NM: 0, NY: 0, NC: 0, ND: 0, OH: 0, OK: 0, OR: 0, PA: 0.5, RI: 0,
  SC: 0, SD: 0, TN: 1, TX: 0, UT: 0, VT: 1, VA: 1, WA: 0, WV: 0, WI: 0, WY: 0,
};

const REGION = {
  AL: 'south', AK: 'west', AZ: 'west', AR: 'south', CA: 'west', CO: 'west',
  CT: 'northeast', DE: 'south', DC: 'south', FL: 'south', GA: 'south', HI: 'west',
  ID: 'west', IL: 'midwest', IN: 'midwest', IA: 'midwest', KS: 'midwest', KY: 'south',
  LA: 'south', ME: 'northeast', MD: 'south', MA: 'northeast', MI: 'midwest', MN: 'midwest',
  MS: 'south', MO: 'midwest', MT: 'west', NE: 'midwest', NV: 'west', NH: 'northeast',
  NJ: 'northeast', NM: 'west', NY: 'northeast', NC: 'south', ND: 'midwest', OH: 'midwest',
  OK: 'south', OR: 'west', PA: 'northeast', RI: 'northeast', SC: 'south', SD: 'midwest',
  TN: 'south', TX: 'south', UT: 'west', VT: 'northeast', VA: 'south', WA: 'west',
  WV: 'south', WI: 'midwest', WY: 'west',
};

const NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
  PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia',
  WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

const SLUGS = {
  AL: 'alabama', AK: 'alaska', AZ: 'arizona', AR: 'arkansas', CA: 'california',
  CO: 'colorado', CT: 'connecticut', DE: 'delaware', DC: 'district-of-columbia',
  FL: 'florida', GA: 'georgia', HI: 'hawaii', ID: 'idaho', IL: 'illinois',
  IN: 'indiana', IA: 'iowa', KS: 'kansas', KY: 'kentucky', LA: 'louisiana',
  ME: 'maine', MD: 'maryland', MA: 'massachusetts', MI: 'michigan', MN: 'minnesota',
  MS: 'mississippi', MO: 'missouri', MT: 'montana', NE: 'nebraska', NV: 'nevada',
  NH: 'new-hampshire', NJ: 'new-jersey', NM: 'new-mexico', NY: 'new-york',
  NC: 'north-carolina', ND: 'north-dakota', OH: 'ohio', OK: 'oklahoma', OR: 'oregon',
  PA: 'pennsylvania', RI: 'rhode-island', SC: 'south-carolina', SD: 'south-dakota',
  TN: 'tennessee', TX: 'texas', UT: 'utah', VT: 'vermont', VA: 'virginia',
  WA: 'washington', WV: 'west-virginia', WI: 'wisconsin', WY: 'wyoming',
};

/** Redfin Feb 2025 single-family median sale prices (via Bankrate). */
const MEDIAN = {
  AL: 282400, AK: 400500, AZ: 470200, AR: 255300, CA: 866100, CO: 640000,
  CT: 466000, DE: 396100, DC: 920000, FL: 433600, GA: 374700, HI: 975500,
  ID: 474700, IL: 285600, IN: 258900, IA: 230600, KS: 280900, KY: 270200,
  LA: 253200, ME: 375800, MD: 496500, MA: 749900, MI: 249300, MN: 370900,
  MS: 255100, MO: 263300, MT: 528000, NE: 288800, NV: 496000, NH: 502300,
  NJ: 526500, NM: 370600, NY: 576100, NC: 380300, ND: 350000, OH: 248600,
  OK: 245900, OR: 521500, PA: 301000, RI: 484800, SC: 403600, SD: 325700,
  TN: 389100, TX: 339500, UT: 588500, VT: 388000, VA: 457500, WA: 658700,
  WV: 258800, WI: 318000, WY: 450000,
};

/** Tax Foundation 2025 (2023 ACS): property tax as % of owner-occupied value. */
const TAX = {
  AL: 0.4, AK: 1.02, AZ: 0.67, AR: 0.64, CA: 0.74, CO: 0.56, CT: 1.7, DE: 0.58,
  DC: 0.59, FL: 0.94, GA: 0.92, HI: 0.3, ID: 0.75, IL: 2.05, IN: 0.87, IA: 1.5,
  KS: 1.33, KY: 0.82, LA: 0.52, ME: 1.27, MD: 1.04, MA: 1.15, MI: 1.44, MN: 1.11,
  MS: 0.65, MO: 1.01, MT: 0.76, NE: 1.65, NV: 0.66, NH: 2.03, NJ: 2.21, NM: 0.68,
  NY: 1.4, NC: 0.85, ND: 0.95, OH: 1.62, OK: 0.88, OR: 0.98, PA: 1.51, RI: 1.53,
  SC: 0.56, SD: 1.22, TN: 0.73, TX: 1.69, UT: 0.62, VT: 1.8, VA: 0.86, WA: 0.92,
  WV: 0.55, WI: 1.73, WY: 0.55,
};

/** Bankrate 2026 average annual premium for $300k dwelling coverage. */
const INS_300K = {
  AL: 3114, AK: 1035, AZ: 2331, AR: 3287, CA: 1641, CO: 3412, CT: 1700, DE: 966,
  DC: 1525, FL: 5838, GA: 2041, HI: 1296, ID: 1409, IL: 2225, IN: 1666, IA: 2446,
  KS: 4444, KY: 3540, LA: 6274, ME: 1219, MD: 1751, MA: 1733, MI: 2368, MN: 2852,
  MS: 3353, MO: 2191, MT: 2801, NE: 6587, NV: 1074, NH: 1039, NJ: 1214, NM: 2179,
  NY: 1860, NC: 2951, ND: 2776, OH: 1364, OK: 4695, OR: 1091, PA: 1278, RI: 2347,
  SC: 2611, SD: 3152, TN: 2672, TX: 3899, UT: 1283, VT: 827, VA: 1706, WA: 1539,
  WV: 1047, WI: 1303, WY: 1306,
};

const INSIGHTS = {
  AL: 'Alabama is an attorney-closing state with a low effective property tax rate, so the dollar amounts collected for tax escrow are modest. Title work and the attorney fee usually outweigh transfer taxes on a typical purchase.',
  AK: 'Alaska has no real estate transfer tax and a statutory 2026 conforming loan limit of $1,249,125 — 50% above the Lower 48 baseline. Insurance is inexpensive by national standards; shipping and remote-property logistics are the bigger wild cards.',
  AZ: 'Arizona abolished its real estate transfer tax, and closings run through title companies rather than attorneys. Combined with a below-average effective tax rate, buyer-side government fees stay near the bottom of the national range.',
  AR: 'Arkansas home prices sit well below the national median, which keeps absolute closing costs low even after a modest documentary transfer tax. Insurance in tornado-prone counties can still surprise first-time buyers.',
  CA: 'California closing costs are driven by price, not rate: Prop 13 keeps effective property taxes near 0.7%, but a median sale near $866K scales title, escrow, and prepaid items up. Documentary transfer tax is usually seller-paid; some cities add their own.',
  CO: 'Colorado has one of the lowest effective property tax rates in the country, which keeps tax escrow deposits small. Hail-prone Front Range insurance is the line item that has climbed, and a few mountain towns levy their own transfer taxes.',
  CT: 'Connecticut is an attorney-closing state with a conveyance tax that sellers customarily pay. The effective property tax rate is among the highest in the U.S., so prepaid tax escrow is a large share of cash to close.',
  DE: 'Delaware’s 4% transfer tax is among the highest in the country and is typically split 50/50 — the buyer’s 2% share is often the single largest government fee on the settlement statement. An attorney conducts the closing.',
  DC: 'The District is treated as a high-cost area for 2026 conforming loans (limit $1,249,125). Buyers pay recordation tax (1.1%, or 1.45% above $400K) while sellers pay a separate transfer tax, and closings run through attorneys.',
  FL: 'Florida’s insurance market dominates cash-to-close math: the prepaid first-year premium plus escrow cushion is often larger than every lender fee combined. Documentary stamp tax on the deed is customarily seller-paid; buyers still pay doc stamps and intangible tax on the mortgage.',
  GA: 'Georgia requires a licensed attorney to conduct the closing, and buyers owe an intangible recording tax on the loan amount ($1.50 per $500). The state transfer tax itself is small and seller-paid.',
  HI: 'Hawaii has the lowest effective property tax rate in the country and a statutory conforming loan limit of $1,249,125 (Maui/Kalawao go higher). Conveyance tax is tiered by price and occupancy; insurance is cheap relative to the median sale price.',
  ID: 'Idaho has no state transfer tax and title-company closings, so buyer-side government fees are mostly recording. Fast-growing metros have some high-cost conforming limits in 2026; insurance is moderate.',
  IL: 'Illinois has the second-highest effective property tax rate in the nation (over 2%), so tax escrow collected at closing is large relative to the home price. Chicago buyers also pay a 0.75% city transfer tax that the rest of the state does not.',
  IN: 'Indiana has no real estate transfer tax and title-company closings, which keeps government fees lean. Home prices and insurance sit near the Midwest average, so cash to close is driven mostly by the down payment and lender fees.',
  IA: 'Iowa’s effective property tax rate is well above the national average, so several months of tax escrow add up even on a relatively affordable median home. Transfer tax is modest and there is no attorney-closing requirement statewide.',
  KS: 'Kansas has no state transfer tax. The story at closing is insurance and taxes: hail country premiums are among the highest in the U.S., and the effective property tax rate is above average.',
  KY: 'Kentucky is an attorney-closing state with a small transfer tax. Median prices are affordable, so absolute closing costs stay low; prepaid taxes and the attorney fee are the main local line items.',
  LA: 'Louisiana closings are conducted by a notary attorney and there is no state transfer tax. Homeowners insurance — especially wind/hail along the Gulf — is among the most expensive in the country and dominates prepaid items.',
  ME: 'Maine is an attorney-closing state whose transfer tax is split evenly between buyer and seller. A moderately high effective property tax rate means tax escrow is a meaningful piece of cash to close, especially on coastal properties.',
  MD: 'Maryland buyers should budget for state and county transfer plus recordation taxes, which are often split and vary sharply by county. High-cost conforming limits apply in the D.C. suburbs; closings are attorney-led.',
  MA: 'Massachusetts is an attorney-closing state. The deed excise tax is customarily seller-paid, so buyer-side government fees stay modest — but a high median price and above-average property taxes still make prepaid escrow substantial. Several counties are high-cost for conforming loans.',
  MI: 'Michigan’s transfer tax is customarily paid by the seller, which helps buyers. The effective property tax rate is above the national average, and winter/insurance costs vary widely between the southern metros and the Upper Peninsula.',
  MN: 'Minnesota has a modest transfer tax and title-company closings. Winter weather and a slightly above-average property tax rate show up in prepaid insurance and tax escrow more than in government stamps.',
  MS: 'Mississippi is an attorney-closing state with no state transfer tax. Affordable median prices keep absolute closing costs low; insurance in coastal and tornado-belt counties is the line item that moves around the most.',
  MO: 'Missouri has no state transfer tax and typical title-company closings. Buyer-side costs are mostly lender, title, and prepaid taxes — the effective property tax rate sits right around 1%.',
  MT: 'Montana has no state transfer tax. Closing costs are otherwise straightforward title-company fees plus prepaid items; insurance and a relatively high median price (for the Mountain West) do most of the work on cash to close.',
  NE: 'Nebraska’s homeowners insurance is the most expensive statewide average in the country, driven by severe convective storms. That prepaid premium plus an above-average property tax rate outweigh the modest documentary tax at closing.',
  NV: 'Nevada’s real property transfer tax is customarily seller-paid in the Las Vegas market. Low effective property taxes and inexpensive insurance keep buyer-side closing costs near the national low end.',
  NH: 'New Hampshire’s 1.5% transfer tax is split 50/50, so buyers typically pay 0.75% — a large government fee relative to most states. It is also an attorney-closing state with one of the highest effective property tax rates in the U.S.',
  NJ: 'New Jersey has the highest effective property tax rate in the nation, so tax escrow at closing is heavy. The realty transfer fee is seller-paid; buyers only owe the 1% mansion tax above $1M. Closings are attorney-led, and several counties are high-cost for conforming loans.',
  NM: 'New Mexico has no state transfer tax and title-company closings. Buyer-side costs are mostly lender, title, and prepaid taxes and insurance — a straightforward, below-average closing-cost state.',
  NY: 'New York is an attorney state. The state transfer tax is seller-paid, but buyers should budget for mortgage recording tax (especially downstate) and a 1% mansion tax on homes of $1M or more. NYC adds its own transfer and mansion taxes.',
  NC: 'North Carolina closings run through attorneys, and the seller-paid excise tax keeps buyer-side government fees light. A few coastal counties add a local land-transfer tax, and wind/hail insurance is the swing factor on the coast.',
  ND: 'North Dakota is an attorney-closing state with no transfer tax. Affordable prices and moderate insurance keep cash to close compact; prepaid tax escrow tracks a near-average effective rate.',
  OH: 'Ohio’s low median price keeps absolute closing costs among the cheapest in the country, even with an above-average property tax rate. The conveyance fee is customarily seller-paid, so buyers mostly see lender, title, and prepaid items.',
  OK: 'Oklahoma has a small documentary tax and no attorney-closing requirement. The expensive line items are hail/wind insurance and tax escrow — both well above the national average relative to the home price.',
  OR: 'Oregon has no statewide transfer tax (Washington County is the exception at 0.1%). Title-company closings and moderate insurance keep buyer-side costs predictable; the Portland metro can reach high-cost conforming territory.',
  PA: 'Pennsylvania’s transfer tax (about 1% state + 1% local) is typically split 50/50, so the buyer’s 1% share is often the largest government fee at the table. Philadelphia and Pittsburgh local rates run higher than the statewide custom.',
  RI: 'Rhode Island is an attorney-closing state. Conveyance tax is customarily seller-paid, so buyer-side government fees stay modest; an above-average property tax rate still makes tax escrow noticeable on a typical purchase.',
  SC: 'South Carolina closings are attorney-led, and the deed recording fee is customarily seller-paid. Low effective property taxes help, but coastal insurance can dwarf every other prepaid item.',
  SD: 'South Dakota has a small transfer tax and title-company closings. An above-average property tax rate and prairie-storm insurance are the local factors that move cash to close more than government stamps.',
  TN: 'Tennessee is unusual in that the buyer customarily pays the recordation tax. There is no attorney-closing requirement statewide. Several counties are high-cost for 2026 conforming loans, especially around Nashville.',
  TX: 'Texas has no transfer tax, but it trades an income tax for high property taxes and expensive hail/wind insurance. Prepaid tax and insurance escrow usually dwarf lender fees on a typical purchase.',
  UT: 'Utah has no state transfer tax and title-company closings. Along the Wasatch Front, 2026 conforming limits are high-cost in some counties; insurance is inexpensive relative to the median price.',
  VT: 'Vermont buyers pay the property transfer tax (a lower rate on the first $100K of a principal residence, then 1.45% above). It is an attorney-closing state with one of the highest effective property tax rates in the country.',
  VA: 'Virginia buyers pay recordation taxes while sellers pay the grantor tax, and closings are attorney-led. Northern Virginia counties are high-cost for 2026 conforming loans; insurance is moderate.',
  WA: 'Washington’s graduated real estate excise tax is paid by the seller, so buyer-side government fees stay light. No state income tax means property taxes carry more of the load; King County and other metros are high-cost for conforming loans.',
  WV: 'West Virginia is an attorney-closing state with a modest transfer tax and the lowest median sale prices in this dataset. A few counties are high-cost for 2026 conforming loans despite the affordable statewide median.',
  WI: 'Wisconsin’s transfer fee is customarily seller-paid. The effective property tax rate is among the highest in the U.S., so tax escrow — not stamps — is the local closing-cost story.',
  WY: 'Wyoming has no state transfer tax and inexpensive insurance. A handful of high-cost counties (Jackson Hole and similar) use the 2026 conforming ceiling; most of the state uses the baseline limit.',
};

function slugToExport() {
  const codes = Object.keys(NAMES).sort((a, b) => NAMES[a].localeCompare(NAMES[b]));
  if (codes.length !== 51) throw new Error(`expected 51 jurisdictions, got ${codes.length}`);

  const rows = codes.map((code) => {
    const median = MEDIAN[code];
    const ins300 = INS_300K[code];
    const scaled = Math.round((ins300 * (median / 300_000)) / 50) * 50;
    const annualInsurance = Math.max(800, Math.min(scaled, Math.round((ins300 * 2.4) / 50) * 50));

    let conformingLoanLimit = BASELINE;
    let highCostLoanLimit = null;
    if (code === 'AK') {
      conformingLoanLimit = AK_HI_BASE;
    } else if (code === 'HI') {
      conformingLoanLimit = AK_HI_BASE;
      highCostLoanLimit = HI_CEILING;
    } else if (code === 'DC') {
      conformingLoanLimit = CEILING;
    } else if (HIGH_COST.has(code)) {
      highCostLoanLimit = CEILING;
    }

    return {
      slug: SLUGS[code],
      name: NAMES[code],
      stateAbbr: code,
      region: REGION[code],
      medianHomePrice: median,
      propertyTaxRate: TAX[code],
      annualInsurance,
      buyerTransferShare: BUYER_SHARE[code],
      conformingLoanLimit,
      highCostLoanLimit,
      insight: INSIGHTS[code],
      lastUpdated: LAST_UPDATED,
    };
  });

  const body = rows
    .map((r) => {
      const hcl = r.highCostLoanLimit === null ? 'null' : String(r.highCostLoanLimit);
      return `  {
    slug: '${r.slug}',
    name: '${r.name.replace(/'/g, "\\'")} ',
    stateAbbr: '${r.stateAbbr}',
    region: '${r.region}',
    medianHomePrice: ${r.medianHomePrice},
    propertyTaxRate: ${r.propertyTaxRate},
    annualInsurance: ${r.annualInsurance},
    buyerTransferShare: ${r.buyerTransferShare},
    conformingLoanLimit: ${r.conformingLoanLimit},
    highCostLoanLimit: ${hcl},
    insight:
      '${r.insight.replace(/'/g, "\\'").replace(/\n/g, ' ')}',
    lastUpdated: '${r.lastUpdated}',
  }`.replace("District of Columbia' ", "District of Columbia'");
    })
    .join(',\n');

  // fix the accidental trailing space in name from replace
  const cleaned = body.replace(/name: '(.+?) ',/g, "name: '$1',");

  return `/**
 * State + DC dataset for programmatic SEO pages
 * (e.g. "Closing Costs in California").
 *
 * Scope is states only — no county, metro, or city pages.
 * When you update any numbers, bump that row's \`lastUpdated\` so the
 * sitemap reports an accurate lastmod.
 *
 * Sources (figures last reviewed ${LAST_UPDATED}):
 * - Median sale price: Redfin Feb 2025 single-family medians via Bankrate
 * - Effective property tax rate: Tax Foundation Facts & Figures 2025
 *   (property tax as % of owner-occupied housing value, 2023 ACS)
 * - Homeowners insurance: Bankrate 2026 averages for $300k dwelling
 *   coverage, scaled to each state's median sale price for the example
 * - 2026 conforming loan limits: FHFA (baseline $832,750; high-cost
 *   ceiling $1,249,125; AK/HI statutory baseline $1,249,125)
 * - Transfer tax, who pays, and attorney customs: STATE_CLOSING_CUSTOMS
 *   in lib/calculators/closingCosts.ts
 */

import { STATE_CLOSING_CUSTOMS } from '@/lib/calculators/closingCosts';

export type LocationRegion = 'northeast' | 'midwest' | 'south' | 'west';

export interface LocationData {
  /** URL slug, e.g. 'california' or 'district-of-columbia' */
  slug: string;
  /** Full jurisdiction name */
  name: string;
  /** Two-letter abbreviation (DC for the District) */
  stateAbbr: string;
  region: LocationRegion;
  /** Approximate median single-family sale price (USD) */
  medianHomePrice: number;
  /** Effective annual property tax rate as % of home value */
  propertyTaxRate: number;
  /** Typical annual homeowners insurance premium on a median-priced home (USD) */
  annualInsurance: number;
  /** Share of the statewide transfer/recordation tax the buyer customarily pays (0, 0.5, or 1) */
  buyerTransferShare: 0 | 0.5 | 1;
  /** 2026 conforming loan limit that applies to most of the state (1-unit) */
  conformingLoanLimit: number;
  /** 2026 high-cost ceiling if any counties exceed the baseline; otherwise null */
  highCostLoanLimit: number | null;
  /** Locale-specific editorial insight shown on the page */
  insight: string;
  /** ISO date the figures were last reviewed — used for sitemap lastmod */
  lastUpdated: string;
}

/** Assumptions used for the server-rendered example numbers on state pages. */
export const LOCATION_ASSUMPTIONS = {
  interestRateKey: 'thirtyYearFixed' as const,
  loanTermYears: 30,
  downPaymentPercent: 20,
} as const;

export const LOCATION_REGIONS: { id: LocationRegion; label: string }[] = [
  { id: 'northeast', label: 'Northeast' },
  { id: 'midwest', label: 'Midwest' },
  { id: 'south', label: 'South' },
  { id: 'west', label: 'West' },
];

const RAW_STATES: LocationData[] = [
${cleaned}
];

function withCustoms(row: LocationData): LocationData {
  const customs = STATE_CLOSING_CUSTOMS[row.stateAbbr];
  if (!customs) {
    throw new Error(\`Missing STATE_CLOSING_CUSTOMS for \${row.stateAbbr}\`);
  }
  return row;
}

export const locations: LocationData[] = RAW_STATES.map(withCustoms);

export function getLocation(slug: string): LocationData | undefined {
  return locations.find((l) => l.slug === slug);
}

export function getAllLocationSlugs(): string[] {
  return locations.map((l) => l.slug);
}

export function locationLabel(loc: LocationData): string {
  return loc.name;
}

export function getLocationsByRegion(region: LocationRegion): LocationData[] {
  return locations.filter((l) => l.region === region);
}

export function getRelatedLocations(loc: LocationData): LocationData[] {
  return locations.filter((l) => l.region === loc.region && l.slug !== loc.slug);
}

export function latestLocationUpdate(): string {
  return locations.reduce(
    (latest, loc) => (loc.lastUpdated > latest ? loc.lastUpdated : latest),
    locations[0].lastUpdated
  );
}

export function getStateCustoms(loc: LocationData) {
  return STATE_CLOSING_CUSTOMS[loc.stateAbbr];
}
`;
}

const out = slugToExport();
writeFileSync(new URL('../lib/locations/locationData.ts', import.meta.url), out);
console.log('wrote lib/locations/locationData.ts');
