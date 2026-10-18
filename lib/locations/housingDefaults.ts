/**
 * Statewide housing-cost defaults used when a calculator has a State/ZIP.
 *
 * Property tax rates are effective rates on owner-occupied housing
 * (Tax Foundation, latest published figures, rounded to two decimals).
 * Insurance rates are typical annual HO-3 premiums expressed as a percent
 * of dwelling value, informed by NAIC / Insurance Information Institute
 * state averages. Both are educational estimates — counties and carriers
 * vary widely, and users can override every field.
 */

export interface StateHousingDefaults {
  /** Effective annual property tax as % of home value. */
  propertyTaxRate: number;
  /** Typical annual homeowners insurance as % of home value. */
  insuranceRate: number;
}

/** Used when no state is selected. Matches the calculators' historical defaults. */
export const NATIONAL_HOUSING_DEFAULTS: StateHousingDefaults = {
  propertyTaxRate: 1.1,
  insuranceRate: 0.4,
};

/**
 * 50 states + DC. Tax: Tax Foundation effective rates on owner-occupied
 * housing. Insurance: typical HO-3 as % of value (hurricane/hail states
 * are much higher than the ~0.35–0.45% inland band).
 */
export const STATE_HOUSING_DEFAULTS: Record<string, StateHousingDefaults> = {
  AL: { propertyTaxRate: 0.4, insuranceRate: 0.7 },
  AK: { propertyTaxRate: 0.98, insuranceRate: 0.4 },
  AZ: { propertyTaxRate: 0.51, insuranceRate: 0.5 },
  AR: { propertyTaxRate: 0.61, insuranceRate: 0.75 },
  CA: { propertyTaxRate: 0.71, insuranceRate: 0.4 },
  CO: { propertyTaxRate: 0.49, insuranceRate: 0.55 },
  CT: { propertyTaxRate: 1.79, insuranceRate: 0.35 },
  DE: { propertyTaxRate: 0.56, insuranceRate: 0.35 },
  DC: { propertyTaxRate: 0.56, insuranceRate: 0.3 },
  FL: { propertyTaxRate: 0.82, insuranceRate: 1.1 },
  GA: { propertyTaxRate: 0.87, insuranceRate: 0.55 },
  HI: { propertyTaxRate: 0.27, insuranceRate: 0.4 },
  ID: { propertyTaxRate: 0.6, insuranceRate: 0.4 },
  IL: { propertyTaxRate: 2.08, insuranceRate: 0.4 },
  IN: { propertyTaxRate: 0.77, insuranceRate: 0.45 },
  IA: { propertyTaxRate: 1.5, insuranceRate: 0.45 },
  KS: { propertyTaxRate: 1.34, insuranceRate: 0.85 },
  KY: { propertyTaxRate: 0.83, insuranceRate: 0.5 },
  LA: { propertyTaxRate: 0.55, insuranceRate: 1.0 },
  ME: { propertyTaxRate: 1.24, insuranceRate: 0.35 },
  MD: { propertyTaxRate: 1.05, insuranceRate: 0.35 },
  MA: { propertyTaxRate: 1.14, insuranceRate: 0.35 },
  MI: { propertyTaxRate: 1.38, insuranceRate: 0.45 },
  MN: { propertyTaxRate: 1.05, insuranceRate: 0.4 },
  MS: { propertyTaxRate: 0.67, insuranceRate: 0.8 },
  MO: { propertyTaxRate: 0.91, insuranceRate: 0.55 },
  MT: { propertyTaxRate: 0.74, insuranceRate: 0.55 },
  NE: { propertyTaxRate: 1.54, insuranceRate: 0.7 },
  NV: { propertyTaxRate: 0.53, insuranceRate: 0.35 },
  NH: { propertyTaxRate: 1.93, insuranceRate: 0.3 },
  NJ: { propertyTaxRate: 2.23, insuranceRate: 0.35 },
  NM: { propertyTaxRate: 0.67, insuranceRate: 0.55 },
  NY: { propertyTaxRate: 1.4, insuranceRate: 0.4 },
  NC: { propertyTaxRate: 0.73, insuranceRate: 0.55 },
  ND: { propertyTaxRate: 0.98, insuranceRate: 0.5 },
  OH: { propertyTaxRate: 1.43, insuranceRate: 0.35 },
  OK: { propertyTaxRate: 0.87, insuranceRate: 0.9 },
  OR: { propertyTaxRate: 0.87, insuranceRate: 0.35 },
  PA: { propertyTaxRate: 1.49, insuranceRate: 0.35 },
  RI: { propertyTaxRate: 1.4, insuranceRate: 0.4 },
  SC: { propertyTaxRate: 0.53, insuranceRate: 0.65 },
  SD: { propertyTaxRate: 1.17, insuranceRate: 0.55 },
  TN: { propertyTaxRate: 0.55, insuranceRate: 0.55 },
  TX: { propertyTaxRate: 1.6, insuranceRate: 0.9 },
  UT: { propertyTaxRate: 0.55, insuranceRate: 0.35 },
  VT: { propertyTaxRate: 1.76, insuranceRate: 0.35 },
  VA: { propertyTaxRate: 0.82, insuranceRate: 0.35 },
  WA: { propertyTaxRate: 0.87, insuranceRate: 0.35 },
  WV: { propertyTaxRate: 0.57, insuranceRate: 0.4 },
  WI: { propertyTaxRate: 1.61, insuranceRate: 0.35 },
  WY: { propertyTaxRate: 0.51, insuranceRate: 0.4 },
};

export interface ZipHousingOverride {
  /** Inclusive ZIP3 start. */
  start: number;
  /** Inclusive ZIP3 end. */
  end: number;
  label: string;
  propertyTaxRate?: number;
  insuranceRate?: number;
  /**
   * Combined transfer/recordation tax as % of sale price, when the local
   * rate is meaningfully different from the statewide figure.
   */
  transferTaxRate?: number;
}

/**
 * Metro/county refinements. Only listed where ZIP prefixes map cleanly
 * and the local figure diverges from the statewide default.
 */
export const ZIP_HOUSING_OVERRIDES: ZipHousingOverride[] = [
  { start: 100, end: 104, label: 'New York City', propertyTaxRate: 0.88, transferTaxRate: 1.4 },
  { start: 111, end: 114, label: 'New York City', propertyTaxRate: 0.88, transferTaxRate: 1.4 },
  { start: 330, end: 332, label: 'Miami-Dade County', propertyTaxRate: 0.9, insuranceRate: 1.4 },
  { start: 333, end: 333, label: 'Broward County', propertyTaxRate: 0.95, insuranceRate: 1.3 },
  { start: 334, end: 334, label: 'Palm Beach County', propertyTaxRate: 0.85, insuranceRate: 1.25 },
  { start: 606, end: 608, label: 'Chicago', propertyTaxRate: 2.2 },
  { start: 750, end: 753, label: 'Dallas–Fort Worth', propertyTaxRate: 1.72, insuranceRate: 0.85 },
  { start: 770, end: 775, label: 'Harris County (Houston)', propertyTaxRate: 1.77, insuranceRate: 1.15 },
  { start: 850, end: 853, label: 'Maricopa County (Phoenix)', propertyTaxRate: 0.52, insuranceRate: 0.5 },
  { start: 891, end: 891, label: 'Las Vegas', propertyTaxRate: 0.55 },
  { start: 900, end: 908, label: 'Los Angeles County', propertyTaxRate: 0.71, transferTaxRate: 0.56 },
  { start: 910, end: 918, label: 'Los Angeles County', propertyTaxRate: 0.71, transferTaxRate: 0.56 },
  { start: 919, end: 921, label: 'San Diego County', propertyTaxRate: 0.7 },
  { start: 926, end: 928, label: 'Orange County, CA', propertyTaxRate: 0.68 },
  { start: 980, end: 981, label: 'Seattle metro', propertyTaxRate: 0.87 },
];

export function findZipHousingOverride(zip: string): ZipHousingOverride | null {
  if (!/^\d{5}$/.test(zip)) return null;
  const prefix = parseInt(zip.slice(0, 3), 10);
  if (Number.isNaN(prefix)) return null;
  return ZIP_HOUSING_OVERRIDES.find((row) => prefix >= row.start && prefix <= row.end) ?? null;
}
