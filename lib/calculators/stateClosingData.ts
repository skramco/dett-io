/**
 * State-level closing customs and tax estimates.
 *
 * - attorneyFee: typical buyer-side closing attorney fee. States where closings
 *   are customarily handled by an escrow/title company (e.g. CA, AZ, WA) have $0 —
 *   no attorney line is shown for those states.
 * - transferTaxRate: approximate combined state + typical local transfer/recordation
 *   tax as a fraction of the purchase price. Actual rates vary by county and city,
 *   and in some states the seller customarily pays. Always shown as an estimate.
 * - propertyTaxRate: approximate effective annual property tax rate as a fraction
 *   of home value, used to estimate escrow deposits.
 */
export interface StateClosingProfile {
  name: string;
  attorneyFee: number;
  attorneyCustomary: boolean;
  transferTaxRate: number;
  propertyTaxRate: number;
}

export const STATE_CLOSING_PROFILES: Record<string, StateClosingProfile> = {
  AL: { name: 'Alabama', attorneyFee: 900, attorneyCustomary: true, transferTaxRate: 0.001, propertyTaxRate: 0.004 },
  AK: { name: 'Alaska', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0117 },
  AZ: { name: 'Arizona', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0063 },
  AR: { name: 'Arkansas', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.0033, propertyTaxRate: 0.0064 },
  CA: { name: 'California', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.0011, propertyTaxRate: 0.0075 },
  CO: { name: 'Colorado', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.0001, propertyTaxRate: 0.0055 },
  CT: { name: 'Connecticut', attorneyFee: 1100, attorneyCustomary: true, transferTaxRate: 0.0075, propertyTaxRate: 0.02 },
  DE: { name: 'Delaware', attorneyFee: 1000, attorneyCustomary: true, transferTaxRate: 0.02, propertyTaxRate: 0.0061 },
  DC: { name: 'District of Columbia', attorneyFee: 950, attorneyCustomary: true, transferTaxRate: 0.0145, propertyTaxRate: 0.0057 },
  FL: { name: 'Florida', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.007, propertyTaxRate: 0.0086 },
  GA: { name: 'Georgia', attorneyFee: 950, attorneyCustomary: true, transferTaxRate: 0.001, propertyTaxRate: 0.009 },
  HI: { name: 'Hawaii', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.0015, propertyTaxRate: 0.0029 },
  ID: { name: 'Idaho', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0067 },
  IL: { name: 'Illinois', attorneyFee: 850, attorneyCustomary: true, transferTaxRate: 0.0015, propertyTaxRate: 0.0208 },
  IN: { name: 'Indiana', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0084 },
  IA: { name: 'Iowa', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.0016, propertyTaxRate: 0.0152 },
  KS: { name: 'Kansas', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0134 },
  KY: { name: 'Kentucky', attorneyFee: 850, attorneyCustomary: true, transferTaxRate: 0.001, propertyTaxRate: 0.0085 },
  LA: { name: 'Louisiana', attorneyFee: 900, attorneyCustomary: true, transferTaxRate: 0, propertyTaxRate: 0.0056 },
  ME: { name: 'Maine', attorneyFee: 900, attorneyCustomary: true, transferTaxRate: 0.0022, propertyTaxRate: 0.0124 },
  MD: { name: 'Maryland', attorneyFee: 950, attorneyCustomary: true, transferTaxRate: 0.0125, propertyTaxRate: 0.0105 },
  MA: { name: 'Massachusetts', attorneyFee: 1100, attorneyCustomary: true, transferTaxRate: 0, propertyTaxRate: 0.0114 },
  MI: { name: 'Michigan', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.0086, propertyTaxRate: 0.0138 },
  MN: { name: 'Minnesota', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.0033, propertyTaxRate: 0.0111 },
  MS: { name: 'Mississippi', attorneyFee: 850, attorneyCustomary: true, transferTaxRate: 0, propertyTaxRate: 0.0067 },
  MO: { name: 'Missouri', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0091 },
  MT: { name: 'Montana', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0074 },
  NE: { name: 'Nebraska', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.00225, propertyTaxRate: 0.0163 },
  NV: { name: 'Nevada', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.0051, propertyTaxRate: 0.0059 },
  NH: { name: 'New Hampshire', attorneyFee: 950, attorneyCustomary: true, transferTaxRate: 0.0075, propertyTaxRate: 0.0193 },
  NJ: { name: 'New Jersey', attorneyFee: 1200, attorneyCustomary: true, transferTaxRate: 0, propertyTaxRate: 0.0223 },
  NM: { name: 'New Mexico', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0067 },
  NY: { name: 'New York', attorneyFee: 1350, attorneyCustomary: true, transferTaxRate: 0.004, propertyTaxRate: 0.0164 },
  NC: { name: 'North Carolina', attorneyFee: 950, attorneyCustomary: true, transferTaxRate: 0.002, propertyTaxRate: 0.0082 },
  ND: { name: 'North Dakota', attorneyFee: 850, attorneyCustomary: true, transferTaxRate: 0, propertyTaxRate: 0.0098 },
  OH: { name: 'Ohio', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.003, propertyTaxRate: 0.0159 },
  OK: { name: 'Oklahoma', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.0015, propertyTaxRate: 0.0089 },
  OR: { name: 'Oregon', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0093 },
  PA: { name: 'Pennsylvania', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.01, propertyTaxRate: 0.0149 },
  RI: { name: 'Rhode Island', attorneyFee: 950, attorneyCustomary: true, transferTaxRate: 0, propertyTaxRate: 0.014 },
  SC: { name: 'South Carolina', attorneyFee: 950, attorneyCustomary: true, transferTaxRate: 0, propertyTaxRate: 0.0057 },
  SD: { name: 'South Dakota', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.001, propertyTaxRate: 0.0117 },
  TN: { name: 'Tennessee', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.0037, propertyTaxRate: 0.0067 },
  TX: { name: 'Texas', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0168 },
  UT: { name: 'Utah', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0057 },
  VT: { name: 'Vermont', attorneyFee: 950, attorneyCustomary: true, transferTaxRate: 0.0145, propertyTaxRate: 0.0183 },
  VA: { name: 'Virginia', attorneyFee: 900, attorneyCustomary: true, transferTaxRate: 0.0033, propertyTaxRate: 0.0087 },
  WA: { name: 'Washington', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0087 },
  WV: { name: 'West Virginia', attorneyFee: 850, attorneyCustomary: true, transferTaxRate: 0.0022, propertyTaxRate: 0.0059 },
  WI: { name: 'Wisconsin', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0.003, propertyTaxRate: 0.0161 },
  WY: { name: 'Wyoming', attorneyFee: 0, attorneyCustomary: false, transferTaxRate: 0, propertyTaxRate: 0.0056 },
};

export const DEFAULT_STATE = 'CA';

export function getStateClosingProfile(state: string): StateClosingProfile {
  return STATE_CLOSING_PROFILES[state] ?? STATE_CLOSING_PROFILES[DEFAULT_STATE];
}

export const US_STATE_OPTIONS = Object.entries(STATE_CLOSING_PROFILES)
  .map(([value, profile]) => ({ value, label: profile.name }))
  .sort((a, b) => a.label.localeCompare(b.label));
