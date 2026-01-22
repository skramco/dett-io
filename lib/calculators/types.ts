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
}

export interface DownPaymentInputs {
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate: number;
  homeInsuranceAnnual: number;
  pmiRate: number;
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
  buydownType: 'none' | '2-1' | '1-0';
  buydownCost: number;
  yearsToHold: number;
}

export interface ArmVsFixedInputs {
  loanAmount: number;
  fixedRate: number;
  armInitialRate: number;
  armFixedPeriod: number;
  armAdjustmentCap: number;
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
}

export interface TimelineSimulatorInputs {
  loanAmount: number;
  interestRate: number;
  expectedMoveYear: number;
  refiLikelihood: number;
  armInitialRate: number;
  armFixedPeriod: number;
  pointsCost: number;
  pointsRate: number;
}
