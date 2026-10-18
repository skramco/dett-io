import { NATIONAL_CLOSING_CUSTOMS, STATE_CLOSING_CUSTOMS, type StateClosingCustoms } from '../calculators/closingCosts';
import {
  findZipHousingOverride,
  NATIONAL_HOUSING_DEFAULTS,
  STATE_HOUSING_DEFAULTS,
} from './housingDefaults';
import { isCompleteZip, zipToState } from './zipToState';

export interface LocationValue {
  /** Two-letter state code, or '' for the U.S. average. */
  state: string;
  /** 0–5 digit ZIP the user has typed. */
  zip: string;
}

export interface ResolvedLocationDefaults {
  state: string;
  stateName: string;
  zip: string;
  /** Effective annual property tax as % of home value. */
  propertyTaxRate: number;
  /** Annual property tax in dollars at the given home price. */
  annualPropertyTax: number;
  /** Typical annual homeowners insurance as % of home value. */
  insuranceRate: number;
  /** Annual homeowners insurance in dollars at the given home price. */
  annualInsurance: number;
  attorneyCustomary: boolean;
  attorneyFee: number;
  /** Combined transfer/recordation tax as % of sale price. */
  transferTaxRate: number;
  /** Transfer tax in dollars at the given home price. */
  transferTax: number;
  /**
   * When set, callers should pass this dollar amount into calculateClosingCosts
   * so a ZIP-level transfer tax overrides the statewide table.
   */
  transferTaxOverride?: number;
  /** Short label for helper text, e.g. "New Jersey" or "ZIP 33101 (Miami-Dade County)". */
  sourceLabel: string;
  note?: string;
}

export function roundDollars(value: number): number {
  return Math.round(value);
}

function closingForState(state: string): StateClosingCustoms {
  if (!state) return NATIONAL_CLOSING_CUSTOMS;
  return STATE_CLOSING_CUSTOMS[state] ?? NATIONAL_CLOSING_CUSTOMS;
}

function housingForState(state: string) {
  if (!state) return NATIONAL_HOUSING_DEFAULTS;
  return STATE_HOUSING_DEFAULTS[state] ?? NATIONAL_HOUSING_DEFAULTS;
}

/**
 * Resolve property-tax, insurance, transfer-tax, and attorney defaults
 * from a state and optional ZIP. ZIP wins for state identity once it's
 * a complete 5-digit code we can map; metro ZIP prefixes can further
 * refine tax, insurance, and transfer tax.
 */
export function resolveLocationDefaults(
  location: LocationValue,
  homePrice: number,
): ResolvedLocationDefaults {
  const zip = location.zip.replace(/\D/g, '').slice(0, 5);
  const zipState = isCompleteZip(zip) ? zipToState(zip) : null;
  const state = zipState ?? location.state ?? '';
  const housing = housingForState(state);
  const closing = closingForState(state);
  const metro = isCompleteZip(zip) ? findZipHousingOverride(zip) : null;

  const propertyTaxRate = metro?.propertyTaxRate ?? housing.propertyTaxRate;
  const insuranceRate = metro?.insuranceRate ?? housing.insuranceRate;
  const transferTaxRate = metro?.transferTaxRate ?? closing.transferTaxRate;

  const price = Math.max(0, homePrice);
  const annualPropertyTax = roundDollars((price * propertyTaxRate) / 100);
  const annualInsurance = roundDollars((price * insuranceRate) / 100);
  const transferTax = roundDollars((price * transferTaxRate) / 100);

  let sourceLabel = closing.name;
  if (metro && zipState) {
    sourceLabel = `ZIP ${zip} (${metro.label})`;
  } else if (zipState && zip) {
    sourceLabel = `ZIP ${zip} (${closing.name})`;
  }

  const noteParts: string[] = [];
  if (metro) {
    noteParts.push(`${metro.label} figures replace the statewide averages where they differ.`);
  }
  if (closing.note) noteParts.push(closing.note);

  return {
    state,
    stateName: closing.name,
    zip,
    propertyTaxRate,
    annualPropertyTax,
    insuranceRate,
    annualInsurance,
    attorneyCustomary: closing.attorneyCustomary,
    attorneyFee: closing.attorneyFee,
    transferTaxRate,
    transferTax,
    transferTaxOverride: metro?.transferTaxRate !== undefined ? transferTax : undefined,
    sourceLabel,
    note: noteParts.length ? noteParts.join(' ') : undefined,
  };
}

/** True when the user has picked a state or entered a mappable ZIP. */
export function hasSpecificLocation(location: LocationValue): boolean {
  if (location.state) return true;
  return isCompleteZip(location.zip) && zipToState(location.zip) !== null;
}
