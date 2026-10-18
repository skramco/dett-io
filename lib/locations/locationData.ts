export interface Location {
  slug: string;
  /** Short display name, e.g. "Orange County" or "California" */
  name: string;
  /** Full display name, e.g. "Orange County, California" */
  fullName: string;
  type: 'state' | 'county';
  stateCode: string;
  stateName: string;
  /** Slug of the parent state page, if one exists */
  stateSlug?: string;
  /** Approximate median single-family home price (USD) */
  medianHomePrice: number;
  /** Effective annual property tax rate as % of home value */
  propertyTaxRate: number;
  /** Real estate transfer / documentary tax as % of sale price (state + typical county) */
  transferTaxRate: number;
  /** Typical annual homeowners insurance premium (USD) */
  avgAnnualInsurance: number;
  /** Whether an attorney is customarily or legally required at closing */
  attorneyState: boolean;
  /** 1-2 sentences of local context shown on the page */
  marketNote: string;
  /** ISO date the figures for this location were last reviewed — drives sitemap lastmod */
  lastUpdated: string;
}

// Market figures are editorial estimates based on publicly available data
// (median sale prices, effective property tax rates, statutory transfer tax
// rates, and average insurance premiums). Update lastUpdated whenever a
// location's figures are reviewed so the sitemap lastmod stays honest.
export const locations: Location[] = [
  // ─── States ────────────────────────────────────────────────────────────
  {
    slug: 'california',
    name: 'California',
    fullName: 'California',
    type: 'state',
    stateCode: 'CA',
    stateName: 'California',
    medianHomePrice: 790000,
    propertyTaxRate: 0.75,
    transferTaxRate: 0.11,
    avgAnnualInsurance: 1500,
    attorneyState: false,
    marketNote:
      'California pairs some of the highest home prices in the country with a low documentary transfer tax ($1.10 per $1,000) and Prop 13-capped property taxes. Several cities, including Los Angeles and San Francisco, layer their own transfer taxes on top.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'texas',
    name: 'Texas',
    fullName: 'Texas',
    type: 'state',
    stateCode: 'TX',
    stateName: 'Texas',
    medianHomePrice: 340000,
    propertyTaxRate: 1.68,
    transferTaxRate: 0,
    avgAnnualInsurance: 3200,
    attorneyState: false,
    marketNote:
      'Texas has no real estate transfer tax at all, which keeps government fees low. The trade-off is one of the highest effective property tax rates in the country, which inflates the prepaid and escrow portion of your closing costs.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'florida',
    name: 'Florida',
    fullName: 'Florida',
    type: 'state',
    stateCode: 'FL',
    stateName: 'Florida',
    medianHomePrice: 410000,
    propertyTaxRate: 0.86,
    transferTaxRate: 0.7,
    avgAnnualInsurance: 4200,
    attorneyState: false,
    marketNote:
      'Florida\u2019s documentary stamp tax ($0.70 per $100 in most counties) is one of the steepest transfer taxes in the country, and hurricane exposure makes homeowners insurance unusually expensive — both push cash-to-close higher than the sticker price suggests.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'new-york',
    name: 'New York',
    fullName: 'New York',
    type: 'state',
    stateCode: 'NY',
    stateName: 'New York',
    medianHomePrice: 450000,
    propertyTaxRate: 1.64,
    transferTaxRate: 0.4,
    avgAnnualInsurance: 1700,
    attorneyState: true,
    marketNote:
      'New York requires an attorney at closing and charges a 0.4% state transfer tax. New York City adds its own transfer tax and a mansion tax above $1 million, so city purchases run meaningfully higher than the statewide numbers below.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'illinois',
    name: 'Illinois',
    fullName: 'Illinois',
    type: 'state',
    stateCode: 'IL',
    stateName: 'Illinois',
    medianHomePrice: 270000,
    propertyTaxRate: 2.08,
    transferTaxRate: 0.15,
    avgAnnualInsurance: 1800,
    attorneyState: true,
    marketNote:
      'Illinois has the second-highest effective property tax rate in the nation, which balloons prepaid taxes and escrow deposits at closing. Attorneys customarily handle closings, and many municipalities add local transfer stamps on top of the state and county tax.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'pennsylvania',
    name: 'Pennsylvania',
    fullName: 'Pennsylvania',
    type: 'state',
    stateCode: 'PA',
    stateName: 'Pennsylvania',
    medianHomePrice: 270000,
    propertyTaxRate: 1.49,
    transferTaxRate: 2.0,
    avgAnnualInsurance: 1300,
    attorneyState: false,
    marketNote:
      'Pennsylvania\u2019s 2% combined transfer tax (1% state + 1% typical local) is among the highest in the U.S., though buyers and sellers customarily split it 50/50. Philadelphia\u2019s local rate is higher still, at 3.278%.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'georgia',
    name: 'Georgia',
    fullName: 'Georgia',
    type: 'state',
    stateCode: 'GA',
    stateName: 'Georgia',
    medianHomePrice: 330000,
    propertyTaxRate: 0.9,
    transferTaxRate: 0.1,
    avgAnnualInsurance: 2000,
    attorneyState: true,
    marketNote:
      'Georgia is an attorney-closing state — a licensed attorney must conduct the closing. The transfer tax is modest ($1 per $1,000) and property taxes sit near the national average, keeping overall closing costs reasonable.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'north-carolina',
    name: 'North Carolina',
    fullName: 'North Carolina',
    type: 'state',
    stateCode: 'NC',
    stateName: 'North Carolina',
    medianHomePrice: 330000,
    propertyTaxRate: 0.8,
    transferTaxRate: 0.2,
    avgAnnualInsurance: 1600,
    attorneyState: true,
    marketNote:
      'North Carolina closings are handled by attorneys, and the state levies a 0.2% excise tax (customarily paid by the seller). Below-average property taxes keep the prepaid portion of closing costs in check.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'arizona',
    name: 'Arizona',
    fullName: 'Arizona',
    type: 'state',
    stateCode: 'AZ',
    stateName: 'Arizona',
    medianHomePrice: 430000,
    propertyTaxRate: 0.6,
    transferTaxRate: 0,
    avgAnnualInsurance: 1800,
    attorneyState: false,
    marketNote:
      'Arizona abolished its real estate transfer tax by constitutional amendment in 2008 and has below-average property taxes, making it one of the cheaper states to close in relative to home price.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'washington',
    name: 'Washington',
    fullName: 'Washington',
    type: 'state',
    stateCode: 'WA',
    stateName: 'Washington',
    medianHomePrice: 610000,
    propertyTaxRate: 0.87,
    transferTaxRate: 1.28,
    avgAnnualInsurance: 1400,
    attorneyState: false,
    marketNote:
      'Washington\u2019s graduated real estate excise tax (REET) starts at 1.1% and reaches 3% on the portion of price above $3 million; most sales fall in the 1.28% bracket. It is customarily paid by the seller but is often negotiated in practice.',
    lastUpdated: '2026-10-18',
  },

  // ─── Counties & metros ─────────────────────────────────────────────────
  {
    slug: 'orange-county-ca',
    name: 'Orange County',
    fullName: 'Orange County, California',
    type: 'county',
    stateCode: 'CA',
    stateName: 'California',
    stateSlug: 'california',
    medianHomePrice: 1150000,
    propertyTaxRate: 0.68,
    transferTaxRate: 0.11,
    avgAnnualInsurance: 1600,
    attorneyState: false,
    marketNote:
      'Orange County\u2019s seven-figure median price means even a low 0.11% transfer tax and Prop 13-capped property taxes translate into large dollar amounts at closing. Escrow companies, not attorneys, handle closings here.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'los-angeles-county-ca',
    name: 'Los Angeles County',
    fullName: 'Los Angeles County, California',
    type: 'county',
    stateCode: 'CA',
    stateName: 'California',
    stateSlug: 'california',
    medianHomePrice: 900000,
    propertyTaxRate: 0.7,
    transferTaxRate: 0.11,
    avgAnnualInsurance: 1650,
    attorneyState: false,
    marketNote:
      'The county documentary transfer tax is 0.11%, but the City of Los Angeles adds 0.45% — and its \u201Cmansion tax\u201D (Measure ULA) adds 4%+ on sales above roughly $5 million. Check whether your property sits inside city limits.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'san-diego-county-ca',
    name: 'San Diego County',
    fullName: 'San Diego County, California',
    type: 'county',
    stateCode: 'CA',
    stateName: 'California',
    stateSlug: 'california',
    medianHomePrice: 950000,
    propertyTaxRate: 0.7,
    transferTaxRate: 0.11,
    avgAnnualInsurance: 1550,
    attorneyState: false,
    marketNote:
      'San Diego County keeps to the standard California transfer tax of $1.10 per $1,000 with no added city transfer taxes in most jurisdictions, so closing costs track the state pattern: high dollar amounts driven almost entirely by high prices.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'harris-county-tx',
    name: 'Harris County',
    fullName: 'Harris County, Texas (Houston)',
    type: 'county',
    stateCode: 'TX',
    stateName: 'Texas',
    stateSlug: 'texas',
    medianHomePrice: 325000,
    propertyTaxRate: 1.77,
    transferTaxRate: 0,
    avgAnnualInsurance: 3800,
    attorneyState: false,
    marketNote:
      'Houston-area buyers pay zero transfer tax, but Harris County\u2019s high property tax rate and Gulf Coast insurance premiums (wind and flood exposure) make prepaids the dominant closing cost category.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'travis-county-tx',
    name: 'Travis County',
    fullName: 'Travis County, Texas (Austin)',
    type: 'county',
    stateCode: 'TX',
    stateName: 'Texas',
    stateSlug: 'texas',
    medianHomePrice: 540000,
    propertyTaxRate: 1.7,
    transferTaxRate: 0,
    avgAnnualInsurance: 2600,
    attorneyState: false,
    marketNote:
      'Austin\u2019s higher-than-Texas-average prices combined with a ~1.7% property tax rate mean six months of prepaid taxes alone can top $7,500 at closing, even with no transfer tax.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'dallas-county-tx',
    name: 'Dallas County',
    fullName: 'Dallas County, Texas',
    type: 'county',
    stateCode: 'TX',
    stateName: 'Texas',
    stateSlug: 'texas',
    medianHomePrice: 380000,
    propertyTaxRate: 1.73,
    transferTaxRate: 0,
    avgAnnualInsurance: 3100,
    attorneyState: false,
    marketNote:
      'Like the rest of Texas, Dallas County charges no transfer tax. Expect title insurance at state-regulated rates and a heavy prepaid tax burden from the ~1.73% effective property tax rate.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'miami-dade-county-fl',
    name: 'Miami-Dade County',
    fullName: 'Miami-Dade County, Florida',
    type: 'county',
    stateCode: 'FL',
    stateName: 'Florida',
    stateSlug: 'florida',
    medianHomePrice: 560000,
    propertyTaxRate: 0.9,
    transferTaxRate: 0.6,
    avgAnnualInsurance: 5500,
    attorneyState: false,
    marketNote:
      'Miami-Dade uses a lower documentary stamp rate ($0.60 per $100 for single-family homes) than the rest of Florida, but adds a surtax on non-single-family property. Hurricane-driven insurance premiums are the real budget-buster here.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'king-county-wa',
    name: 'King County',
    fullName: 'King County, Washington (Seattle)',
    type: 'county',
    stateCode: 'WA',
    stateName: 'Washington',
    stateSlug: 'washington',
    medianHomePrice: 850000,
    propertyTaxRate: 0.85,
    transferTaxRate: 1.28,
    avgAnnualInsurance: 1450,
    attorneyState: false,
    marketNote:
      'Seattle-area sales mostly fall in Washington\u2019s 1.28% REET bracket (the portion of price above $1.57M is taxed higher). The excise tax is customarily a seller cost, but it shapes negotiations on every deal.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'cook-county-il',
    name: 'Cook County',
    fullName: 'Cook County, Illinois (Chicago)',
    type: 'county',
    stateCode: 'IL',
    stateName: 'Illinois',
    stateSlug: 'illinois',
    medianHomePrice: 340000,
    propertyTaxRate: 2.02,
    transferTaxRate: 0.15,
    avgAnnualInsurance: 2000,
    attorneyState: true,
    marketNote:
      'Cook County adds $0.25 per $500 to the state transfer tax, and the City of Chicago layers on another 0.75% (buyer-paid). Combined with a 2%+ property tax rate and attorney closings, Chicago cash-to-close runs high for the price point.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'maricopa-county-az',
    name: 'Maricopa County',
    fullName: 'Maricopa County, Arizona (Phoenix)',
    type: 'county',
    stateCode: 'AZ',
    stateName: 'Arizona',
    stateSlug: 'arizona',
    medianHomePrice: 460000,
    propertyTaxRate: 0.57,
    transferTaxRate: 0,
    avgAnnualInsurance: 1900,
    attorneyState: false,
    marketNote:
      'Phoenix-area closings are among the cheapest for a major metro: no transfer tax, a 0.57% effective property tax rate, and title/escrow companies handling the closing instead of attorneys.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'clark-county-nv',
    name: 'Clark County',
    fullName: 'Clark County, Nevada (Las Vegas)',
    type: 'county',
    stateCode: 'NV',
    stateName: 'Nevada',
    medianHomePrice: 450000,
    propertyTaxRate: 0.55,
    transferTaxRate: 0.51,
    avgAnnualInsurance: 1500,
    attorneyState: false,
    marketNote:
      'Clark County\u2019s real property transfer tax is $2.55 per $500 (0.51%), customarily split between buyer and seller. Nevada\u2019s property tax abatements keep effective rates low for owner-occupants.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'fulton-county-ga',
    name: 'Fulton County',
    fullName: 'Fulton County, Georgia (Atlanta)',
    type: 'county',
    stateCode: 'GA',
    stateName: 'Georgia',
    stateSlug: 'georgia',
    medianHomePrice: 430000,
    propertyTaxRate: 1.04,
    transferTaxRate: 0.1,
    avgAnnualInsurance: 2100,
    attorneyState: true,
    marketNote:
      'Atlanta closings must be conducted by a Georgia attorney, which replaces the escrow fee you\u2019d see out West. Fulton County property taxes run above the Georgia average, raising prepaid deposits.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'mecklenburg-county-nc',
    name: 'Mecklenburg County',
    fullName: 'Mecklenburg County, North Carolina (Charlotte)',
    type: 'county',
    stateCode: 'NC',
    stateName: 'North Carolina',
    stateSlug: 'north-carolina',
    medianHomePrice: 430000,
    propertyTaxRate: 0.85,
    transferTaxRate: 0.2,
    avgAnnualInsurance: 1700,
    attorneyState: true,
    marketNote:
      'Charlotte closings run through North Carolina attorneys, and the 0.2% state excise tax is customarily a seller cost. Moderate taxes and insurance keep buyer cash-to-close close to the national average.',
    lastUpdated: '2026-10-18',
  },
  {
    slug: 'denver-county-co',
    name: 'Denver County',
    fullName: 'Denver County, Colorado',
    type: 'county',
    stateCode: 'CO',
    stateName: 'Colorado',
    medianHomePrice: 580000,
    propertyTaxRate: 0.5,
    transferTaxRate: 0.01,
    avgAnnualInsurance: 2900,
    attorneyState: false,
    marketNote:
      'Colorado\u2019s documentary fee is a token $0.01 per $100, and Denver\u2019s effective property tax rate is one of the lowest of any major metro. Hail-driven insurance premiums are the main local cost pressure.',
    lastUpdated: '2026-10-18',
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

export function getStateLocations(): Location[] {
  return locations.filter((l) => l.type === 'state');
}

export function getCountyLocations(): Location[] {
  return locations.filter((l) => l.type === 'county');
}

/** Other locations in the same state (for internal cross-linking) */
export function getRelatedLocations(location: Location, limit = 6): Location[] {
  const sameState = locations.filter(
    (l) => l.slug !== location.slug && l.stateCode === location.stateCode
  );
  const others = locations.filter(
    (l) => l.slug !== location.slug && l.stateCode !== location.stateCode && l.type === location.type
  );
  return [...sameState, ...others].slice(0, limit);
}
