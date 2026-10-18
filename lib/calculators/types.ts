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

export interface ExtraPaymentInputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  extraMonthlyPayment?: number;
  extraAnnualPayment?: number;
  investmentReturn?: number;
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
}

// Category 2: Rate & Structure
export interface PointsBuydownInputs {
  loanAmount: number;
  parRate: number;
  loanTerm: number;
  pointsCost: number;
  pointsRate: number;
  lenderCredit: number;
  lenderCreditRate: number;
  buydownType: 'none' | '3-2-1' | '2-1' | '1-0';
  yearsToHold: number;
}

export interface ArmVsFixedInputs {
  loanAmount: number;
  fixedRate: number;
  armInitialRate: number;
  /** Fixed-rate period in years (the "5" in 5/6 or 5/1). */
  armFixedPeriod: number;
  /** Months between adjustments after the fixed period: 6 (modern SOFR ARMs) or 12. */
  armAdjustmentFrequency: number;
  /** Max rate change at the first adjustment (percentage points). */
  armInitialCap: number;
  /** Max rate change at each subsequent adjustment (percentage points). */
  armAdjustmentCap: number;
  /** Max total increase above the initial rate (percentage points). */
  armLifetimeCap: number;
  armMargin: number;
  loanTerm: number;
  expectedIndexRate: number;
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
}

// Category 4: Payoff & Wealth
export interface AccelerationInputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  extraMonthly: number;
  extraAnnual: number;
  lumpSumAmount: number;
  lumpSumYear: number;
  investmentReturn: number;
  recastOption: boolean;
  recastFee: number;
}

export interface BiweeklyInputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  biweeklyFee: number;
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

export interface TimelineSimulatorInputs {
  loanAmount: number;
  interestRate: number;
  expectedMoveYear: number;
  armInitialRate: number;
  armFixedPeriod: number;
  armMargin: number;
  expectedIndexRate: number;
  armAdjustmentCap: number;
  armLifetimeCap: number;
  pointsCost: number;
  pointsRate: number;
}
