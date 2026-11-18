import { calculateAffordability } from '@/lib/calculators/affordability';
import type { AffordabilityInputs } from '@/lib/calculators/types';
import type { DTIInputs } from '@/lib/calculators/dti';
import type { MortgageCostInputs } from '@/lib/calculators/types';
import {
  conventionalPmiRatePercent,
  ltvPercent,
  monthlyPayment,
  monthlyPmiAmount,
} from '@/lib/calculators/mortgageMath';
import { applyInputsToUrl, type CalculatorInputs } from '@/lib/share/calculatorState';
import { RATE_SOURCE } from '@/lib/rates/defaultRates';

/** Illustrative PMMS average cited in the worked example (week of Nov 12, 2026). */
export const AFFORD_HOUSE_100K_ILLUSTRATIVE_RATE = 7.11;
export const AFFORD_HOUSE_100K_RATE_AS_OF = 'week of November 12, 2026';

export const AFFORD_HOUSE_100K_SCENARIO: AffordabilityInputs = {
  annualIncome: 100_000,
  monthlyDebts: 400,
  downPayment: 40_000,
  interestRate: AFFORD_HOUSE_100K_ILLUSTRATIVE_RATE,
  loanTerm: 30,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1800,
  hoaFees: 0,
  creditScore: 740,
  state: '',
  zip: '',
};

export const affordHouse100kBaseResult = calculateAffordability(AFFORD_HOUSE_100K_SCENARIO);

export function affordHouse100kResult(
  overrides: Partial<AffordabilityInputs> = {}
) {
  return calculateAffordability({ ...AFFORD_HOUSE_100K_SCENARIO, ...overrides });
}

export const AFFORD_HOUSE_100K_VARIANTS = [
  {
    label: 'Starting example ($400 debts, $40k down, 7.11%)',
    result: affordHouse100kBaseResult,
  },
  {
    label: 'Pay off the $400 in other debts',
    result: affordHouse100kResult({ monthlyDebts: 0 }),
  },
  {
    label: 'Put $80,000 down (PMI drops off at the mid-range)',
    result: affordHouse100kResult({ downPayment: 80_000 }),
  },
  {
    label: 'Use 6.75% instead of 7.11%',
    result: affordHouse100kResult({ interestRate: 6.75 }),
  },
] as const;

export function moderatePaymentBreakdown(
  inputs: AffordabilityInputs,
  homePrice: number
) {
  const loanAmount = Math.max(0, homePrice - inputs.downPayment);
  const monthlyPI = monthlyPayment(
    loanAmount,
    inputs.interestRate,
    inputs.loanTerm * 12
  );
  const pmiRate = conventionalPmiRatePercent(
    ltvPercent(loanAmount, homePrice),
    inputs.creditScore ?? 740
  );
  const monthlyPMI = monthlyPmiAmount(loanAmount, pmiRate);
  const monthlyTax = (homePrice * inputs.propertyTaxRate) / 100 / 12;
  const monthlyIns = inputs.homeInsuranceAnnual / 12;
  return {
    monthlyPI,
    monthlyPMI,
    monthlyTax,
    monthlyIns,
    total:
      monthlyPI + monthlyPMI + monthlyTax + monthlyIns + (inputs.hoaFees ?? 0),
    loanAmount,
  };
}

const PREFILL_ORIGIN = 'https://dett.io';

export function buildAffordabilityGuideHref(
  inputs: AffordabilityInputs = AFFORD_HOUSE_100K_SCENARIO
): string {
  return applyInputsToUrl(
    `${PREFILL_ORIGIN}/calculators/affordability`,
    inputs as unknown as CalculatorInputs,
    Object.keys(inputs)
  );
}

export function buildMortgageCostGuideHref(
  homePrice: number = affordHouse100kBaseResult.details.moderatePrice as number
): string {
  const inputs: MortgageCostInputs = {
    homePrice,
    downPayment: AFFORD_HOUSE_100K_SCENARIO.downPayment,
    interestRate: AFFORD_HOUSE_100K_SCENARIO.interestRate,
    loanTerm: AFFORD_HOUSE_100K_SCENARIO.loanTerm,
    propertyTax: Math.round(homePrice * (AFFORD_HOUSE_100K_SCENARIO.propertyTaxRate / 100)),
    homeInsurance: AFFORD_HOUSE_100K_SCENARIO.homeInsuranceAnnual,
    hoaFees: AFFORD_HOUSE_100K_SCENARIO.hoaFees,
    creditScore: AFFORD_HOUSE_100K_SCENARIO.creditScore,
    pmi: 0,
    state: '',
    zip: '',
  };
  return applyInputsToUrl(
    `${PREFILL_ORIGIN}/calculators/mortgage-cost`,
    inputs as unknown as CalculatorInputs,
    Object.keys(inputs)
  );
}

export function buildDtiGuideHref(): string {
  const moderatePrice = affordHouse100kBaseResult.details.moderatePrice as number;
  const breakdown = moderatePaymentBreakdown(
    AFFORD_HOUSE_100K_SCENARIO,
    moderatePrice
  );
  const inputs: DTIInputs = {
    monthlyGrossIncome: Math.round(AFFORD_HOUSE_100K_SCENARIO.annualIncome / 12),
    mortgagePayment: Math.round(breakdown.monthlyPI),
    propertyTax: Math.round(moderatePrice * (AFFORD_HOUSE_100K_SCENARIO.propertyTaxRate / 100)),
    homeInsurance: AFFORD_HOUSE_100K_SCENARIO.homeInsuranceAnnual,
    hoaFees: AFFORD_HOUSE_100K_SCENARIO.hoaFees,
    carPayments: 0,
    studentLoans: 0,
    creditCardMinimums: 0,
    personalLoans: 0,
    childSupport: 0,
    otherDebts: AFFORD_HOUSE_100K_SCENARIO.monthlyDebts,
  };
  return applyInputsToUrl(
    `${PREFILL_ORIGIN}/calculators/dti`,
    inputs as unknown as CalculatorInputs,
    Object.keys(inputs)
  );
}

export const AFFORD_HOUSE_100K_RATE_SOURCE = RATE_SOURCE;