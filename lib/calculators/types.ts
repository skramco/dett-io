export interface CalculatorResult {
  summary: string;
  details: Record<string, number | string>;
  chartData?: Array<Record<string, number | string>>;
  insights: string[];
}

export interface MortgageCostInputs {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  /** Credit score used to estimate PMI from the shared LTV × credit grid. */
  creditScore?: number;
  /** Manual annual PMI override in dollars; 0 or undefined = auto-estimate. */
  pmi?: number;
  /** Two-letter state code; drives tax/insurance defaults when set. */
  state?: string;
  zip?: string;
}

export interface RefinanceInputs {
  currentBalance: number;
  currentRate: number;
  currentMonthlyPayment: number;
  yearsRemaining: number;
  newRate: number;
  newTerm: number;
  closingCosts: number;
}

/** Merged Extra Payment + Acceleration + Biweekly inputs (ENG-345). */
export interface PayoffInputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  extraMonthlyPayment?: number;
  extraAnnualPayment?: number;
  /** Acceleration-style aliases accepted by the shared engine. */
  extraMonthly?: number;
  extraAnnual?: number;
  lumpSumAmount?: number;
  lumpSumYear?: number;
  biweeklyFee?: number;
  investmentReturn?: number;
  recastOption?: boolean;
  recastFee?: number;
}

export interface Scenario {
  id: string;
  name: string;
  inputs: Record<string, unknown>;
  results: CalculatorResult;
}

// Category 1: Buying a Home
export interface AffordabilityInputs {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
  hoaFees: number;
  /** Credit score used to estimate PMI from the shared LTV × credit grid. */
  creditScore?: number;
  /** Two-letter state code; drives tax/insurance defaults when set. */
  state?: string;
  zip?: string;
}

export interface DownPaymentInputs {
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
  /** Used to look up the annual PMI rate per LTV band (shared grid with the PMI calculator). */
  creditScore: number;
}

export interface RentVsBuyInputs {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  rentInflation: number;
  homeAppreciation: number;
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
  maintenanceRate: number;
  /** Annual PMI rate as % of loan amount; applies while down payment < 20% */
  pmiRate: number;
  closingCosts: number;
  sellingCosts: number;
  investmentReturn: number;
  yearsToAnalyze: number;
  /** Two-letter state code; drives tax/insurance/closing defaults when set. */
  state?: string;
  zip?: string;
}

/**
 * Merged Points & Buydown + Timeline Simulator + ARM vs Fixed inputs (ENG-345).
 * Aliases (interestRate / fixedRate / expectedMoveYear) keep older call sites working.
 */
export interface LoanTimelineInputs {
  loanAmount: number;
  loanTerm: number;
  expectedYearsInHome?: number;
  /** Alias used by the former timeline simulator. */
  expectedMoveYear?: number;
  parRate?: number;
  /** Aliases used by the former timeline simulator / ARM vs Fixed tools. */
  interestRate?: number;
  fixedRate?: number;
  pointsRate: number;
  pointsCost: number;
  lenderCredit?: number;
  lenderCreditRate?: number;
  buydownType?: 'none' | '3-2-1' | '2-1' | '1-0';
  armInitialRate: number;
  /** Fixed-rate period in years (the "5" in 5/6 or 5/1). */
  armFixedPeriod: number;
  /** Months between adjustments after the fixed period: 6 (modern SOFR ARMs) or 12. */
  armAdjustmentFrequency?: number;
  /** Max rate change at the first adjustment (percentage points). */
  armInitialCap?: number;
  armMargin: number;
  /** Max rate change at each subsequent adjustment (percentage points). */
  armAdjustmentCap: number;
  /** Max total increase above the initial rate (percentage points). */
  armLifetimeCap: number;
  expectedIndexRate: number;
  fifteenYearRate?: number;
  /** Gross monthly income — required before any option is recommended. */
  monthlyGrossIncome?: number;
  /** Recurring monthly debts excluding the mortgage (optional). */
  otherMonthlyDebts?: number;
  /** Optional target savings / emergency cushion reserved each month. */
  targetMonthlySavings?: number;
  /** Home value used for PMI and, with tax rate inputs, PITI. */
  homePrice?: number;
  /** Annual property tax in dollars (included in housing payment when set). */
  propertyTaxAnnual?: number;
  /** Annual homeowners insurance in dollars. */
  homeInsuranceAnnual?: number;
  /** Monthly HOA dues. */
  hoaFees?: number;
  /** Credit score for PMI estimate when homePrice is set. */
  creditScore?: number;
}

// Category 3: Refinancing & Equity
export interface CashOutRefinanceInputs {
  currentBalance: number;
  currentRate: number;
  yearsRemaining: number;
  homeValue: number;
  cashOutAmount: number;
  newRate: number;
  newTerm: number;
  closingCosts: number;
  alternativeRate: number; // HELOC or loan rate
}

export interface RecastVsRefinanceInputs {
  currentBalance: number;
  currentRate: number;
  yearsRemaining: number;
  lumpSumAmount: number;
  recastFee: number;
  newRate: number;
  newTerm: number;
  closingCosts: number;
  /** Annual return (%) earned on cash flow freed up by a lower payment. */
  savingsRate: number;
}

// Category 5: Advanced
export interface InterestSensitivityInputs {
  loanAmount: number;
  baseRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
  /** Expected closing date (YYYY-MM-DD) for the lock vs. float helper. */
  closingDate?: string;
}
