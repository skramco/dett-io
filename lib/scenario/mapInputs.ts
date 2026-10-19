import { formatCurrency } from '@/lib/format';
import type { ScenarioProfile } from './types';

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Calculator input keys that copy a profile field directly when both exist.
 * Deliberately omits current-loan fields (currentRate, currentBalance, …)
 * so refinance "today's loan" stays independent of the purchase scenario.
 */
const DIRECT_FIELD_MAP: Record<string, keyof ScenarioProfile> = {
  annualIncome: 'annualIncome',
  monthlyDebts: 'monthlyDebts',
  homePrice: 'homePrice',
  homeValue: 'homePrice',
  interestRate: 'interestRate',
  parRate: 'interestRate',
  fixedRate: 'interestRate',
  baseRate: 'interestRate',
  newRate: 'interestRate',
  downPayment: 'downPayment',
  loanTerm: 'loanTerm',
  newTerm: 'loanTerm',
  creditScore: 'creditScore',
  propertyTaxRate: 'propertyTaxRate',
  homeInsuranceAnnual: 'homeInsuranceAnnual',
  hoaFees: 'hoaFees',
};

/**
 * When a rate field is remapped, keep sibling rates at the same spread
 * they had against the calculator's default (ARM teaser, points, credits).
 */
const RATE_OFFSET_FIELDS: Record<string, string[]> = {
  parRate: ['pointsRate', 'lenderCreditRate', 'armInitialRate', 'fifteenYearRate'],
  fixedRate: ['armInitialRate'],
  interestRate: ['armInitialRate', 'pointsRate'],
};

const DTI_SPLIT_FIELDS = [
  'carPayments',
  'studentLoans',
  'creditCardMinimums',
  'personalLoans',
  'childSupport',
] as const;

export function getDownPaymentPercent(profile: ScenarioProfile): number | undefined {
  if (typeof profile.homePrice !== 'number' || profile.homePrice <= 0) return undefined;
  if (typeof profile.downPayment !== 'number') return undefined;
  return round2((profile.downPayment / profile.homePrice) * 100);
}

export function getLoanAmount(profile: ScenarioProfile): number | undefined {
  if (typeof profile.homePrice !== 'number' || profile.homePrice <= 0) return undefined;
  if (typeof profile.downPayment === 'number') {
    return Math.max(0, Math.round(profile.homePrice - profile.downPayment));
  }
  return undefined;
}

function skipKey(urlParams: URLSearchParams | undefined, key: string): boolean {
  return Boolean(urlParams?.has(key));
}

/**
 * Map a scenario profile onto a calculator's input object.
 * Only keys that already exist on `defaults` are written.
 * URL query params win: any key present in the URL is left untouched.
 */
export function mapProfileToInputs<T extends object>(
  defaults: T,
  profile: ScenarioProfile,
  urlParams?: URLSearchParams
): Partial<T> {
  const defaultsRec = defaults as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [inputKey, profileKey] of Object.entries(DIRECT_FIELD_MAP)) {
    if (!(inputKey in defaultsRec) || skipKey(urlParams, inputKey)) continue;
    const value = profile[profileKey];
    if (typeof value !== 'number') continue;
    result[inputKey] = value;

    const offsets = RATE_OFFSET_FIELDS[inputKey];
    const defaultRate = defaultsRec[inputKey];
    if (offsets && typeof defaultRate === 'number') {
      const delta = value - defaultRate;
      for (const offsetKey of offsets) {
        if (!(offsetKey in defaultsRec) || skipKey(urlParams, offsetKey)) continue;
        const offsetDefault = defaultsRec[offsetKey];
        if (typeof offsetDefault === 'number') {
          const updated = round2(offsetDefault + delta);
          if (updated > 0) result[offsetKey] = updated;
        }
      }
    }
  }

  if (
    'monthlyGrossIncome' in defaultsRec &&
    !skipKey(urlParams, 'monthlyGrossIncome') &&
    typeof profile.annualIncome === 'number'
  ) {
    result.monthlyGrossIncome = Math.round(profile.annualIncome / 12);
  }

  if (
    'homeInsurance' in defaultsRec &&
    !skipKey(urlParams, 'homeInsurance') &&
    typeof profile.homeInsuranceAnnual === 'number'
  ) {
    result.homeInsurance = profile.homeInsuranceAnnual;
  }

  if (
    'prepaidInsurance' in defaultsRec &&
    !skipKey(urlParams, 'prepaidInsurance') &&
    typeof profile.homeInsuranceAnnual === 'number'
  ) {
    result.prepaidInsurance = profile.homeInsuranceAnnual;
  }

  if (
    'propertyTax' in defaultsRec &&
    !skipKey(urlParams, 'propertyTax') &&
    typeof profile.propertyTaxRate === 'number' &&
    typeof profile.homePrice === 'number'
  ) {
    result.propertyTax = Math.round(profile.homePrice * (profile.propertyTaxRate / 100));
  }

  if ('downPaymentPercent' in defaultsRec && !skipKey(urlParams, 'downPaymentPercent')) {
    const percent = getDownPaymentPercent(profile);
    if (percent != null) result.downPaymentPercent = percent;
  }

  if ('loanAmount' in defaultsRec && !skipKey(urlParams, 'loanAmount')) {
    const loanAmount = getLoanAmount(profile);
    if (loanAmount != null) result.loanAmount = loanAmount;
  }

  // DTI calculator stores debts as a split. Collapse the scenario total into
  // `otherDebts` and zero the default category split so we don't double-count.
  if (
    'otherDebts' in defaultsRec &&
    typeof profile.monthlyDebts === 'number' &&
    !skipKey(urlParams, 'otherDebts')
  ) {
    result.otherDebts = profile.monthlyDebts;
    for (const field of DTI_SPLIT_FIELDS) {
      if (field in defaultsRec && !skipKey(urlParams, field)) {
        result[field] = 0;
      }
    }
  }

  if (
    'otherMonthlyDebts' in defaultsRec &&
    typeof profile.monthlyDebts === 'number' &&
    !skipKey(urlParams, 'otherMonthlyDebts')
  ) {
    result.otherMonthlyDebts = profile.monthlyDebts;
  }

  if (
    'propertyTaxAnnual' in defaultsRec &&
    !skipKey(urlParams, 'propertyTaxAnnual') &&
    typeof profile.propertyTaxRate === 'number' &&
    typeof profile.homePrice === 'number'
  ) {
    result.propertyTaxAnnual = Math.round(profile.homePrice * (profile.propertyTaxRate / 100));
  }

  return result as Partial<T>;
}

const SENTINEL_PROFILE: ScenarioProfile = {
  version: 1,
  updatedAt: '1970-01-01T00:00:00.000Z',
  annualIncome: 1,
  monthlyDebts: 1,
  homePrice: 1,
  interestRate: 1,
  downPayment: 1,
  loanTerm: 1,
  creditScore: 1,
  propertyTaxRate: 1,
  homeInsuranceAnnual: 1,
  hoaFees: 1,
};

/** Input keys this calculator would take from a fully populated scenario. */
export function scenarioMappedKeys<T extends object>(defaults: T): Array<keyof T & string> {
  return Object.keys(mapProfileToInputs(defaults, SENTINEL_PROFILE)) as Array<keyof T & string>;
}

function asFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

/**
 * Merge calculator inputs back into the shared profile.
 * Only writes fields the calculator actually exposes; leaves the rest intact.
 */
export function mapInputsToProfile(
  inputs: Record<string, unknown>,
  existing: ScenarioProfile
): ScenarioProfile {
  const next: ScenarioProfile = {
    ...existing,
    version: 1,
    updatedAt: new Date().toISOString(),
  };

  const annualIncome = asFiniteNumber(inputs.annualIncome);
  const monthlyGross = asFiniteNumber(inputs.monthlyGrossIncome);
  if (annualIncome != null) next.annualIncome = annualIncome;
  else if (monthlyGross != null) next.annualIncome = Math.round(monthlyGross * 12);

  if ('monthlyDebts' in inputs) {
    const debts = asFiniteNumber(inputs.monthlyDebts);
    if (debts != null) next.monthlyDebts = debts;
  } else if ('otherMonthlyDebts' in inputs) {
    const debts = asFiniteNumber(inputs.otherMonthlyDebts);
    if (debts != null) next.monthlyDebts = debts;
  } else if ('otherDebts' in inputs) {
    const splitTotal =
      (asFiniteNumber(inputs.carPayments) ?? 0) +
      (asFiniteNumber(inputs.studentLoans) ?? 0) +
      (asFiniteNumber(inputs.creditCardMinimums) ?? 0) +
      (asFiniteNumber(inputs.personalLoans) ?? 0) +
      (asFiniteNumber(inputs.childSupport) ?? 0) +
      (asFiniteNumber(inputs.otherDebts) ?? 0);
    next.monthlyDebts = splitTotal;
  }

  const homePrice = asFiniteNumber(inputs.homePrice) ?? asFiniteNumber(inputs.homeValue);
  if (homePrice != null) next.homePrice = homePrice;

  const rate =
    asFiniteNumber(inputs.interestRate) ??
    asFiniteNumber(inputs.parRate) ??
    asFiniteNumber(inputs.fixedRate) ??
    asFiniteNumber(inputs.baseRate) ??
    asFiniteNumber(inputs.newRate);
  if (rate != null) next.interestRate = rate;

  const downPayment = asFiniteNumber(inputs.downPayment);
  const downPaymentPercent = asFiniteNumber(inputs.downPaymentPercent);
  if (downPayment != null) {
    next.downPayment = downPayment;
  } else if (downPaymentPercent != null && homePrice != null) {
    next.downPayment = Math.round(homePrice * (downPaymentPercent / 100));
  } else if (asFiniteNumber(inputs.loanAmount) != null && homePrice != null) {
    next.downPayment = Math.max(0, Math.round(homePrice - (inputs.loanAmount as number)));
  }

  const loanTerm = asFiniteNumber(inputs.loanTerm) ?? asFiniteNumber(inputs.newTerm);
  if (loanTerm != null) next.loanTerm = loanTerm;

  const creditScore = asFiniteNumber(inputs.creditScore);
  if (creditScore != null) next.creditScore = creditScore;

  const propertyTaxRate = asFiniteNumber(inputs.propertyTaxRate);
  const propertyTax =
    asFiniteNumber(inputs.propertyTax) ?? asFiniteNumber(inputs.propertyTaxAnnual);
  if (propertyTaxRate != null) {
    next.propertyTaxRate = propertyTaxRate;
  } else if (propertyTax != null && homePrice != null && homePrice > 0) {
    next.propertyTaxRate = round2((propertyTax / homePrice) * 100);
  }

  const insurance =
    asFiniteNumber(inputs.homeInsuranceAnnual) ??
    asFiniteNumber(inputs.homeInsurance) ??
    asFiniteNumber(inputs.prepaidInsurance);
  if (insurance != null) next.homeInsuranceAnnual = insurance;

  const hoa = asFiniteNumber(inputs.hoaFees);
  if (hoa != null) next.hoaFees = hoa;

  return next;
}

export function formatScenarioChip(field: keyof ScenarioProfile, value: number): string {
  switch (field) {
    case 'annualIncome':
    case 'homePrice':
    case 'downPayment':
    case 'homeInsuranceAnnual':
      return formatCurrency(value);
    case 'monthlyDebts':
    case 'hoaFees':
      return `${formatCurrency(value)}/mo`;
    case 'interestRate':
    case 'propertyTaxRate':
      return `${round2(value)}%`;
    case 'loanTerm':
      return `${value}-year`;
    case 'creditScore':
      return String(Math.round(value));
    default:
      return String(value);
  }
}
