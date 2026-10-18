import { DEFAULT_RATES } from '../rates/defaultRates';
import { calculateMortgageCost } from './mortgageCost';
import { DEFAULT_PMI_CREDIT_SCORE } from './mortgageMath';
import type { MortgageCostInputs } from './types';

/**
 * Single source of truth for the True Monthly Cost calculator's default
 * inputs. Used by the calculator page AND the homepage hero card so the
 * hero's mock result can never drift from what the calculator shows.
 *
 * Interest rate comes from DEFAULT_RATES (ENG-347) so a PMMS update
 * changes both the calculator prefill and the hero together.
 */
export const MORTGAGE_COST_DEFAULT_INPUTS: MortgageCostInputs = {
  homePrice: 450000,
  downPayment: 90000,
  interestRate: DEFAULT_RATES.thirtyYearFixed,
  loanTerm: 30,
  propertyTax: 5400,
  homeInsurance: 1800,
  hoaFees: 0,
  creditScore: DEFAULT_PMI_CREDIT_SCORE,
  pmi: 0,
  state: '',
  zip: '',
};

/** Whole dollars with thousands separators — same formatting the calculator uses. */
export function formatWholeDollars(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export interface MortgageCostHeroLine {
  label: string;
  value: string;
  pct: number;
}

export interface MortgageCostHeroData {
  /** Formatted headline total, e.g. "$2,935" */
  total: string;
  /** Formatted breakdown lines (zero-value lines excluded, same as the calculator) */
  breakdown: MortgageCostHeroLine[];
}

/**
 * Derives the homepage hero card numbers from the real calculator function
 * and its default inputs. No hardcoded result values.
 */
export function getMortgageCostHeroData(): MortgageCostHeroData {
  const result = calculateMortgageCost(MORTGAGE_COST_DEFAULT_INPUTS);
  return {
    total: formatWholeDollars(result.details.totalMonthlyPayment as number),
    breakdown: (result.chartData ?? []).map((item) => ({
      label: item.name as string,
      value: formatWholeDollars(item.value as number),
      pct: item.percentage as number,
    })),
  };
}
