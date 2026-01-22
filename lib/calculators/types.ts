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
