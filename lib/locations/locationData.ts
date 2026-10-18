/**
 * State + DC dataset for programmatic SEO pages
 * (e.g. "Closing Costs in California").
 *
 * Scope is states only — no county, metro, or city pages.
 * When you update any numbers, bump that row's `lastUpdated` so the
 * sitemap reports an accurate lastmod.
 *
 * Sources (figures last reviewed 2026-10-18):
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
  {
    slug: 'alabama',
    name: 'Alabama',
    stateAbbr: 'AL',
    region: 'south',
    medianHomePrice: 282400,
    propertyTaxRate: 0.4,
    annualInsurance: 2950,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Alabama is an attorney-closing state with a low effective property tax rate, so the dollar amounts collected for tax escrow are modest. Title work and the attorney fee usually outweigh transfer taxes on a typical purchase.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'alaska',
    name: 'Alaska',
    stateAbbr: 'AK',
    region: 'west',
    medianHomePrice: 400500,
    propertyTaxRate: 1.02,
    annualInsurance: 1400,
    buyerTransferShare: 0,
    conformingLoanLimit: 1249125,
    highCostLoanLimit: null,
    insight:
      'Alaska has no real estate transfer tax and a statutory 2026 conforming loan limit of $1,249,125 — 50% above the Lower 48 baseline. Insurance is inexpensive by national standards; shipping and remote-property logistics are the bigger wild cards.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'arizona',
    name: 'Arizona',
    stateAbbr: 'AZ',
    region: 'west',
    medianHomePrice: 470200,
    propertyTaxRate: 0.67,
    annualInsurance: 3650,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Arizona abolished its real estate transfer tax, and closings run through title companies rather than attorneys. Combined with a below-average effective tax rate, buyer-side government fees stay near the bottom of the national range.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'arkansas',
    name: 'Arkansas',
    stateAbbr: 'AR',
    region: 'south',
    medianHomePrice: 255300,
    propertyTaxRate: 0.64,
    annualInsurance: 2800,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Arkansas home prices sit well below the national median, which keeps absolute closing costs low even after a modest documentary transfer tax. Insurance in tornado-prone counties can still surprise first-time buyers.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'california',
    name: 'California',
    stateAbbr: 'CA',
    region: 'west',
    medianHomePrice: 866100,
    propertyTaxRate: 0.74,
    annualInsurance: 3950,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'California closing costs are driven by price, not rate: Prop 13 keeps effective property taxes near 0.7%, but a median sale near $866K scales title, escrow, and prepaid items up. Documentary transfer tax is usually seller-paid; some cities add their own.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'colorado',
    name: 'Colorado',
    stateAbbr: 'CO',
    region: 'west',
    medianHomePrice: 640000,
    propertyTaxRate: 0.56,
    annualInsurance: 7300,
    buyerTransferShare: 1,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Colorado has one of the lowest effective property tax rates in the country, which keeps tax escrow deposits small. Hail-prone Front Range insurance is the line item that has climbed, and a few mountain towns levy their own transfer taxes.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'connecticut',
    name: 'Connecticut',
    stateAbbr: 'CT',
    region: 'northeast',
    medianHomePrice: 466000,
    propertyTaxRate: 1.7,
    annualInsurance: 2650,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Connecticut is an attorney-closing state with a conveyance tax that sellers customarily pay. The effective property tax rate is among the highest in the U.S., so prepaid tax escrow is a large share of cash to close.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'delaware',
    name: 'Delaware',
    stateAbbr: 'DE',
    region: 'south',
    medianHomePrice: 396100,
    propertyTaxRate: 0.58,
    annualInsurance: 1300,
    buyerTransferShare: 0.5,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Delaware’s 4% transfer tax is among the highest in the country and is typically split 50/50 — the buyer’s 2% share is often the single largest government fee on the settlement statement. An attorney conducts the closing.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'district-of-columbia',
    name: 'District of Columbia',
    stateAbbr: 'DC',
    region: 'south',
    medianHomePrice: 920000,
    propertyTaxRate: 0.59,
    annualInsurance: 3650,
    buyerTransferShare: 1,
    conformingLoanLimit: 1249125,
    highCostLoanLimit: null,
    insight:
      'The District is treated as a high-cost area for 2026 conforming loans (limit $1,249,125). Buyers pay recordation tax (1.1%, or 1.45% above $400K) while sellers pay a separate transfer tax, and closings run through attorneys.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'florida',
    name: 'Florida',
    stateAbbr: 'FL',
    region: 'south',
    medianHomePrice: 433600,
    propertyTaxRate: 0.94,
    annualInsurance: 8450,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Florida’s insurance market dominates cash-to-close math: the prepaid first-year premium plus escrow cushion is often larger than every lender fee combined. Documentary stamp tax on the deed is customarily seller-paid; buyers still pay doc stamps and intangible tax on the mortgage.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'georgia',
    name: 'Georgia',
    stateAbbr: 'GA',
    region: 'south',
    medianHomePrice: 374700,
    propertyTaxRate: 0.92,
    annualInsurance: 2550,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Georgia requires a licensed attorney to conduct the closing, and buyers owe an intangible recording tax on the loan amount ($1.50 per $500). The state transfer tax itself is small and seller-paid.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'hawaii',
    name: 'Hawaii',
    stateAbbr: 'HI',
    region: 'west',
    medianHomePrice: 975500,
    propertyTaxRate: 0.3,
    annualInsurance: 3100,
    buyerTransferShare: 0,
    conformingLoanLimit: 1249125,
    highCostLoanLimit: 1299500,
    insight:
      'Hawaii has the lowest effective property tax rate in the country and a statutory conforming loan limit of $1,249,125 (Maui/Kalawao go higher). Conveyance tax is tiered by price and occupancy; insurance is cheap relative to the median sale price.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'idaho',
    name: 'Idaho',
    stateAbbr: 'ID',
    region: 'west',
    medianHomePrice: 474700,
    propertyTaxRate: 0.75,
    annualInsurance: 2250,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Idaho has no state transfer tax and title-company closings, so buyer-side government fees are mostly recording. Fast-growing metros have some high-cost conforming limits in 2026; insurance is moderate.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'illinois',
    name: 'Illinois',
    stateAbbr: 'IL',
    region: 'midwest',
    medianHomePrice: 285600,
    propertyTaxRate: 2.05,
    annualInsurance: 2100,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Illinois has the second-highest effective property tax rate in the nation (over 2%), so tax escrow collected at closing is large relative to the home price. Chicago buyers also pay a 0.75% city transfer tax that the rest of the state does not.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'indiana',
    name: 'Indiana',
    stateAbbr: 'IN',
    region: 'midwest',
    medianHomePrice: 258900,
    propertyTaxRate: 0.87,
    annualInsurance: 1450,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Indiana has no real estate transfer tax and title-company closings, which keeps government fees lean. Home prices and insurance sit near the Midwest average, so cash to close is driven mostly by the down payment and lender fees.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'iowa',
    name: 'Iowa',
    stateAbbr: 'IA',
    region: 'midwest',
    medianHomePrice: 230600,
    propertyTaxRate: 1.5,
    annualInsurance: 1900,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Iowa’s effective property tax rate is well above the national average, so several months of tax escrow add up even on a relatively affordable median home. Transfer tax is modest and there is no attorney-closing requirement statewide.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'kansas',
    name: 'Kansas',
    stateAbbr: 'KS',
    region: 'midwest',
    medianHomePrice: 280900,
    propertyTaxRate: 1.33,
    annualInsurance: 4150,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Kansas has no state transfer tax. The story at closing is insurance and taxes: hail country premiums are among the highest in the U.S., and the effective property tax rate is above average.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'kentucky',
    name: 'Kentucky',
    stateAbbr: 'KY',
    region: 'south',
    medianHomePrice: 270200,
    propertyTaxRate: 0.82,
    annualInsurance: 3200,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Kentucky is an attorney-closing state with a small transfer tax. Median prices are affordable, so absolute closing costs stay low; prepaid taxes and the attorney fee are the main local line items.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'louisiana',
    name: 'Louisiana',
    stateAbbr: 'LA',
    region: 'south',
    medianHomePrice: 253200,
    propertyTaxRate: 0.52,
    annualInsurance: 5300,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Louisiana closings are conducted by a notary attorney and there is no state transfer tax. Homeowners insurance — especially wind/hail along the Gulf — is among the most expensive in the country and dominates prepaid items.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'maine',
    name: 'Maine',
    stateAbbr: 'ME',
    region: 'northeast',
    medianHomePrice: 375800,
    propertyTaxRate: 1.27,
    annualInsurance: 1550,
    buyerTransferShare: 0.5,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Maine is an attorney-closing state whose transfer tax is split evenly between buyer and seller. A moderately high effective property tax rate means tax escrow is a meaningful piece of cash to close, especially on coastal properties.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'maryland',
    name: 'Maryland',
    stateAbbr: 'MD',
    region: 'south',
    medianHomePrice: 496500,
    propertyTaxRate: 1.04,
    annualInsurance: 2900,
    buyerTransferShare: 0.5,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Maryland buyers should budget for state and county transfer plus recordation taxes, which are often split and vary sharply by county. High-cost conforming limits apply in the D.C. suburbs; closings are attorney-led.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'massachusetts',
    name: 'Massachusetts',
    stateAbbr: 'MA',
    region: 'northeast',
    medianHomePrice: 749900,
    propertyTaxRate: 1.15,
    annualInsurance: 4150,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Massachusetts is an attorney-closing state. The deed excise tax is customarily seller-paid, so buyer-side government fees stay modest — but a high median price and above-average property taxes still make prepaid escrow substantial. Several counties are high-cost for conforming loans.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'michigan',
    name: 'Michigan',
    stateAbbr: 'MI',
    region: 'midwest',
    medianHomePrice: 249300,
    propertyTaxRate: 1.44,
    annualInsurance: 1950,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Michigan’s transfer tax is customarily paid by the seller, which helps buyers. The effective property tax rate is above the national average, and winter/insurance costs vary widely between the southern metros and the Upper Peninsula.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'minnesota',
    name: 'Minnesota',
    stateAbbr: 'MN',
    region: 'midwest',
    medianHomePrice: 370900,
    propertyTaxRate: 1.11,
    annualInsurance: 3550,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Minnesota has a modest transfer tax and title-company closings. Winter weather and a slightly above-average property tax rate show up in prepaid insurance and tax escrow more than in government stamps.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'mississippi',
    name: 'Mississippi',
    stateAbbr: 'MS',
    region: 'south',
    medianHomePrice: 255100,
    propertyTaxRate: 0.65,
    annualInsurance: 2850,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Mississippi is an attorney-closing state with no state transfer tax. Affordable median prices keep absolute closing costs low; insurance in coastal and tornado-belt counties is the line item that moves around the most.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'missouri',
    name: 'Missouri',
    stateAbbr: 'MO',
    region: 'midwest',
    medianHomePrice: 263300,
    propertyTaxRate: 1.01,
    annualInsurance: 1900,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Missouri has no state transfer tax and typical title-company closings. Buyer-side costs are mostly lender, title, and prepaid taxes — the effective property tax rate sits right around 1%.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'montana',
    name: 'Montana',
    stateAbbr: 'MT',
    region: 'west',
    medianHomePrice: 528000,
    propertyTaxRate: 0.76,
    annualInsurance: 4950,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Montana has no state transfer tax. Closing costs are otherwise straightforward title-company fees plus prepaid items; insurance and a relatively high median price (for the Mountain West) do most of the work on cash to close.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'nebraska',
    name: 'Nebraska',
    stateAbbr: 'NE',
    region: 'midwest',
    medianHomePrice: 288800,
    propertyTaxRate: 1.65,
    annualInsurance: 6350,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Nebraska’s homeowners insurance is the most expensive statewide average in the country, driven by severe convective storms. That prepaid premium plus an above-average property tax rate outweigh the modest documentary tax at closing.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'nevada',
    name: 'Nevada',
    stateAbbr: 'NV',
    region: 'west',
    medianHomePrice: 496000,
    propertyTaxRate: 0.66,
    annualInsurance: 1800,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Nevada’s real property transfer tax is customarily seller-paid in the Las Vegas market. Low effective property taxes and inexpensive insurance keep buyer-side closing costs near the national low end.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'new-hampshire',
    name: 'New Hampshire',
    stateAbbr: 'NH',
    region: 'northeast',
    medianHomePrice: 502300,
    propertyTaxRate: 2.03,
    annualInsurance: 1750,
    buyerTransferShare: 0.5,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'New Hampshire’s 1.5% transfer tax is split 50/50, so buyers typically pay 0.75% — a large government fee relative to most states. It is also an attorney-closing state with one of the highest effective property tax rates in the U.S.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'new-jersey',
    name: 'New Jersey',
    stateAbbr: 'NJ',
    region: 'northeast',
    medianHomePrice: 526500,
    propertyTaxRate: 2.21,
    annualInsurance: 2150,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'New Jersey has the highest effective property tax rate in the nation, so tax escrow at closing is heavy. The realty transfer fee is seller-paid; buyers only owe the 1% mansion tax above $1M. Closings are attorney-led, and several counties are high-cost for conforming loans.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'new-mexico',
    name: 'New Mexico',
    stateAbbr: 'NM',
    region: 'west',
    medianHomePrice: 370600,
    propertyTaxRate: 0.68,
    annualInsurance: 2700,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'New Mexico has no state transfer tax and title-company closings. Buyer-side costs are mostly lender, title, and prepaid taxes and insurance — a straightforward, below-average closing-cost state.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'new-york',
    name: 'New York',
    stateAbbr: 'NY',
    region: 'northeast',
    medianHomePrice: 576100,
    propertyTaxRate: 1.4,
    annualInsurance: 3550,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'New York is an attorney state. The state transfer tax is seller-paid, but buyers should budget for mortgage recording tax (especially downstate) and a 1% mansion tax on homes of $1M or more. NYC adds its own transfer and mansion taxes.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'north-carolina',
    name: 'North Carolina',
    stateAbbr: 'NC',
    region: 'south',
    medianHomePrice: 380300,
    propertyTaxRate: 0.85,
    annualInsurance: 3750,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'North Carolina closings run through attorneys, and the seller-paid excise tax keeps buyer-side government fees light. A few coastal counties add a local land-transfer tax, and wind/hail insurance is the swing factor on the coast.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'north-dakota',
    name: 'North Dakota',
    stateAbbr: 'ND',
    region: 'midwest',
    medianHomePrice: 350000,
    propertyTaxRate: 0.95,
    annualInsurance: 3250,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'North Dakota is an attorney-closing state with no transfer tax. Affordable prices and moderate insurance keep cash to close compact; prepaid tax escrow tracks a near-average effective rate.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'ohio',
    name: 'Ohio',
    stateAbbr: 'OH',
    region: 'midwest',
    medianHomePrice: 248600,
    propertyTaxRate: 1.62,
    annualInsurance: 1150,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Ohio’s low median price keeps absolute closing costs among the cheapest in the country, even with an above-average property tax rate. The conveyance fee is customarily seller-paid, so buyers mostly see lender, title, and prepaid items.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'oklahoma',
    name: 'Oklahoma',
    stateAbbr: 'OK',
    region: 'south',
    medianHomePrice: 245900,
    propertyTaxRate: 0.88,
    annualInsurance: 3850,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Oklahoma has a small documentary tax and no attorney-closing requirement. The expensive line items are hail/wind insurance and tax escrow — both well above the national average relative to the home price.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'oregon',
    name: 'Oregon',
    stateAbbr: 'OR',
    region: 'west',
    medianHomePrice: 521500,
    propertyTaxRate: 0.98,
    annualInsurance: 1900,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Oregon has no statewide transfer tax (Washington County is the exception at 0.1%). Title-company closings and moderate insurance keep buyer-side costs predictable; the Portland metro can reach high-cost conforming territory.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'pennsylvania',
    name: 'Pennsylvania',
    stateAbbr: 'PA',
    region: 'northeast',
    medianHomePrice: 301000,
    propertyTaxRate: 1.51,
    annualInsurance: 1300,
    buyerTransferShare: 0.5,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Pennsylvania’s transfer tax (about 1% state + 1% local) is typically split 50/50, so the buyer’s 1% share is often the largest government fee at the table. Philadelphia and Pittsburgh local rates run higher than the statewide custom.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'rhode-island',
    name: 'Rhode Island',
    stateAbbr: 'RI',
    region: 'northeast',
    medianHomePrice: 484800,
    propertyTaxRate: 1.53,
    annualInsurance: 3800,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Rhode Island is an attorney-closing state. Conveyance tax is customarily seller-paid, so buyer-side government fees stay modest; an above-average property tax rate still makes tax escrow noticeable on a typical purchase.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'south-carolina',
    name: 'South Carolina',
    stateAbbr: 'SC',
    region: 'south',
    medianHomePrice: 403600,
    propertyTaxRate: 0.56,
    annualInsurance: 3500,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'South Carolina closings are attorney-led, and the deed recording fee is customarily seller-paid. Low effective property taxes help, but coastal insurance can dwarf every other prepaid item.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'south-dakota',
    name: 'South Dakota',
    stateAbbr: 'SD',
    region: 'midwest',
    medianHomePrice: 325700,
    propertyTaxRate: 1.22,
    annualInsurance: 3400,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'South Dakota has a small transfer tax and title-company closings. An above-average property tax rate and prairie-storm insurance are the local factors that move cash to close more than government stamps.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'tennessee',
    name: 'Tennessee',
    stateAbbr: 'TN',
    region: 'south',
    medianHomePrice: 389100,
    propertyTaxRate: 0.73,
    annualInsurance: 3450,
    buyerTransferShare: 1,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Tennessee is unusual in that the buyer customarily pays the recordation tax. There is no attorney-closing requirement statewide. Several counties are high-cost for 2026 conforming loans, especially around Nashville.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'texas',
    name: 'Texas',
    stateAbbr: 'TX',
    region: 'south',
    medianHomePrice: 339500,
    propertyTaxRate: 1.69,
    annualInsurance: 4400,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Texas has no transfer tax, but it trades an income tax for high property taxes and expensive hail/wind insurance. Prepaid tax and insurance escrow usually dwarf lender fees on a typical purchase.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'utah',
    name: 'Utah',
    stateAbbr: 'UT',
    region: 'west',
    medianHomePrice: 588500,
    propertyTaxRate: 0.62,
    annualInsurance: 2500,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Utah has no state transfer tax and title-company closings. Along the Wasatch Front, 2026 conforming limits are high-cost in some counties; insurance is inexpensive relative to the median price.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'vermont',
    name: 'Vermont',
    stateAbbr: 'VT',
    region: 'northeast',
    medianHomePrice: 388000,
    propertyTaxRate: 1.8,
    annualInsurance: 1050,
    buyerTransferShare: 1,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Vermont buyers pay the property transfer tax (a lower rate on the first $100K of a principal residence, then 1.45% above). It is an attorney-closing state with one of the highest effective property tax rates in the country.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'virginia',
    name: 'Virginia',
    stateAbbr: 'VA',
    region: 'south',
    medianHomePrice: 457500,
    propertyTaxRate: 0.86,
    annualInsurance: 2600,
    buyerTransferShare: 1,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Virginia buyers pay recordation taxes while sellers pay the grantor tax, and closings are attorney-led. Northern Virginia counties are high-cost for 2026 conforming loans; insurance is moderate.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'washington',
    name: 'Washington',
    stateAbbr: 'WA',
    region: 'west',
    medianHomePrice: 658700,
    propertyTaxRate: 0.92,
    annualInsurance: 3400,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Washington’s graduated real estate excise tax is paid by the seller, so buyer-side government fees stay light. No state income tax means property taxes carry more of the load; King County and other metros are high-cost for conforming loans.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'west-virginia',
    name: 'West Virginia',
    stateAbbr: 'WV',
    region: 'south',
    medianHomePrice: 258800,
    propertyTaxRate: 0.55,
    annualInsurance: 900,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'West Virginia is an attorney-closing state with a modest transfer tax and the lowest median sale prices in this dataset. A few counties are high-cost for 2026 conforming loans despite the affordable statewide median.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'wisconsin',
    name: 'Wisconsin',
    stateAbbr: 'WI',
    region: 'midwest',
    medianHomePrice: 318000,
    propertyTaxRate: 1.73,
    annualInsurance: 1400,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: null,
    insight:
      'Wisconsin’s transfer fee is customarily seller-paid. The effective property tax rate is among the highest in the U.S., so tax escrow — not stamps — is the local closing-cost story.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'wyoming',
    name: 'Wyoming',
    stateAbbr: 'WY',
    region: 'west',
    medianHomePrice: 450000,
    propertyTaxRate: 0.55,
    annualInsurance: 1950,
    buyerTransferShare: 0,
    conformingLoanLimit: 832750,
    highCostLoanLimit: 1249125,
    insight:
      'Wyoming has no state transfer tax and inexpensive insurance. A handful of high-cost counties (Jackson Hole and similar) use the 2026 conforming ceiling; most of the state uses the baseline limit.',
    lastUpdated: '2026-10-18',
  }
];

function withCustoms(row: LocationData): LocationData {
  const customs = STATE_CLOSING_CUSTOMS[row.stateAbbr];
  if (!customs) {
    throw new Error(`Missing STATE_CLOSING_CUSTOMS for ${row.stateAbbr}`);
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
