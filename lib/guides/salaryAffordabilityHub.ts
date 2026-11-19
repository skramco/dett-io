import { calculateAffordability } from '@/lib/calculators';
import { monthlyPayment } from '@/lib/calculators/mortgageMath';
import type { AffordabilityInputs } from '@/lib/calculators/types';

/** Freddie Mac PMMS 30-year fixed average, week ending November 12, 2026 (estimation only). */
export const HUB_PMMS_THIRTY_YEAR = 7.11;

export const HUB_GUIDE_SLUG = 'how-much-house-can-i-afford-by-salary';

import { SALARY_GUIDE_REDIRECT_SLUGS } from './salaryGuideRedirects';

export { SALARY_GUIDE_REDIRECT_SLUGS };

/** Salary rungs on the site today (no new rungs). */
export const SALARY_BAND_INCOMES = [
  40_000, 50_000, 60_000, 65_000, 75_000, 80_000, 90_000, 100_000, 120_000, 125_000, 150_000,
  175_000, 200_000,
] as const;

const BASE_SCENARIO = {
  interestRate: HUB_PMMS_THIRTY_YEAR,
  loanTerm: 30,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1800,
  hoaFees: 0,
  creditScore: 740,
} as const;

/** Shared assumptions scaled from the $100k worked example ($400/mo debts, $40k down). */
export function scenarioForAnnualIncome(annualIncome: number): AffordabilityInputs {
  return {
    annualIncome,
    monthlyDebts: Math.round(annualIncome * 0.004),
    downPayment: Math.round(annualIncome * 0.4),
    ...BASE_SCENARIO,
  };
}

export function buildAffordabilityCalculatorHref(inputs: AffordabilityInputs): string {
  const params = new URLSearchParams({
    annualIncome: String(inputs.annualIncome),
    monthlyDebts: String(inputs.monthlyDebts),
    downPayment: String(inputs.downPayment),
    interestRate: String(inputs.interestRate),
    loanTerm: String(inputs.loanTerm),
    propertyTaxRate: String(inputs.propertyTaxRate),
    homeInsuranceAnnual: String(inputs.homeInsuranceAnnual),
    hoaFees: String(inputs.hoaFees),
    creditScore: String(inputs.creditScore ?? 740),
  });
  return `/calculators/affordability?${params.toString()}`;
}

export function buildMortgageCostCalculatorHref(
  inputs: AffordabilityInputs,
  homePrice: number
): string {
  const annualTax = Math.round((homePrice * inputs.propertyTaxRate) / 100);
  const params = new URLSearchParams({
    homePrice: String(Math.round(homePrice)),
    downPayment: String(inputs.downPayment),
    interestRate: String(inputs.interestRate),
    loanTerm: String(inputs.loanTerm),
    propertyTax: String(annualTax),
    homeInsurance: String(inputs.homeInsuranceAnnual),
    hoaFees: String(inputs.hoaFees),
    creditScore: String(inputs.creditScore ?? 740),
    pmi: '0',
  });
  return `/calculators/mortgage-cost?${params.toString()}`;
}

export function buildDtiCalculatorHref(
  inputs: AffordabilityInputs,
  homePrice: number,
  loanAmount: number
): string {
  const monthlyPi = Math.round(
    monthlyPayment(loanAmount, inputs.interestRate, inputs.loanTerm * 12)
  );
  const annualTax = Math.round((homePrice * inputs.propertyTaxRate) / 100);
  const params = new URLSearchParams({
    monthlyGrossIncome: String(Math.round(inputs.annualIncome / 12)),
    mortgagePayment: String(monthlyPi),
    propertyTax: String(annualTax),
    homeInsurance: String(inputs.homeInsuranceAnnual),
    hoaFees: String(inputs.hoaFees),
    carPayments: '0',
    studentLoans: '0',
    creditCardMinimums: '0',
    personalLoans: '0',
    childSupport: '0',
    otherDebts: String(inputs.monthlyDebts),
  });
  return `/calculators/dti?${params.toString()}`;
}

export type SalaryBandRow = {
  annualIncome: number;
  inputs: AffordabilityInputs;
  conservativePrice: number;
  moderatePrice: number;
  moderatePayment: number;
  calculatorHref: string;
};

export function computeSalaryBandRow(annualIncome: number): SalaryBandRow {
  const inputs = scenarioForAnnualIncome(annualIncome);
  const result = calculateAffordability(inputs);
  return {
    annualIncome,
    inputs,
    conservativePrice: result.details.conservativePrice as number,
    moderatePrice: result.details.moderatePrice as number,
    moderatePayment: result.details.moderatePayment as number,
    calculatorHref: buildAffordabilityCalculatorHref(inputs),
  };
}

export const SALARY_BAND_ROWS: SalaryBandRow[] = SALARY_BAND_INCOMES.map(computeSalaryBandRow);

export const HUB_SHARED_ASSUMPTIONS = {
  dtiTiers:
    'Conservative 28/36 (housing-only 28%, total debts 36%); mid-range 36% total-debt cap; top-of-guideline 43% total-debt cap',
  downPaymentNote: 'Down payment scales with income at 40% of annual gross (same ratio as the $100,000 worked example)',
  monthlyDebtsNote: 'Other monthly debts scale at 0.4% of annual income ($400/mo at $100,000)',
  taxesInsurance: '1.2% property tax rate and $1,800/year homeowners insurance (calculator defaults)',
  term: '30-year fixed, fully amortizing',
  rateLabel: `${HUB_PMMS_THIRTY_YEAR}% illustrative 30-year fixed (Freddie Mac PMMS average for the week of November 12, 2026 — not a quote)`,
  creditScore: 740,
} as const;