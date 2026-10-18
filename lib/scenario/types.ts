/**
 * Shared "My scenario" profile — enter income, debts, price, and rate once
 * so every calculator can pre-fill.
 *
 * Stored locally today. The shape is account-ready: a later authenticated
 * adapter can persist the same JSON without changing callers.
 */

export const SCENARIO_STORAGE_KEY = 'dett.scenario.v1';
export const SCENARIO_VERSION = 1 as const;

export interface ScenarioProfile {
  version: typeof SCENARIO_VERSION;
  updatedAt: string;
  /** Annual gross household income (dollars). */
  annualIncome?: number;
  /** Recurring monthly debt payments excluding the mortgage (dollars). */
  monthlyDebts?: number;
  /** Home price / purchase price (dollars). */
  homePrice?: number;
  /** Interest rate as a percent, e.g. 6.75. */
  interestRate?: number;
  /** Down payment in dollars. */
  downPayment?: number;
  /** Loan term in years. */
  loanTerm?: number;
  /** Estimated credit score (user-entered, not a pulled report). */
  creditScore?: number;
  /** Annual property tax as a percent of home price, e.g. 1.2. */
  propertyTaxRate?: number;
  /** Annual homeowners insurance (dollars). */
  homeInsuranceAnnual?: number;
  /** Monthly HOA dues (dollars). */
  hoaFees?: number;
}

export const SCENARIO_NUMERIC_FIELDS = [
  'annualIncome',
  'monthlyDebts',
  'homePrice',
  'interestRate',
  'downPayment',
  'loanTerm',
  'creditScore',
  'propertyTaxRate',
  'homeInsuranceAnnual',
  'hoaFees',
] as const;

export type ScenarioNumericField = (typeof SCENARIO_NUMERIC_FIELDS)[number];

export const SCENARIO_CORE_FIELDS: ScenarioNumericField[] = [
  'annualIncome',
  'monthlyDebts',
  'homePrice',
  'interestRate',
];

export const SCENARIO_FIELD_LABELS: Record<ScenarioNumericField, string> = {
  annualIncome: 'Annual income',
  monthlyDebts: 'Monthly debts',
  homePrice: 'Home price',
  interestRate: 'Interest rate',
  downPayment: 'Down payment',
  loanTerm: 'Loan term',
  creditScore: 'Credit score',
  propertyTaxRate: 'Property tax rate',
  homeInsuranceAnnual: 'Home insurance',
  hoaFees: 'HOA fees',
};

export function emptyScenario(now = new Date()): ScenarioProfile {
  return {
    version: SCENARIO_VERSION,
    updatedAt: now.toISOString(),
  };
}

export function hasScenarioValues(profile: ScenarioProfile | null | undefined): boolean {
  if (!profile) return false;
  return SCENARIO_NUMERIC_FIELDS.some((field) => typeof profile[field] === 'number');
}

export function countScenarioValues(profile: ScenarioProfile | null | undefined): number {
  if (!profile) return 0;
  return SCENARIO_NUMERIC_FIELDS.filter((field) => typeof profile[field] === 'number').length;
}
