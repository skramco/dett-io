/**
 * Standard, realistic scenario inputs shared by the headline and
 * "Show Me the Math" regression tests. Values are chosen so that every
 * headline number (payments, savings, break-evens, crossovers, PMI) is
 * meaningfully non-zero for a typical borrower.
 */
import type {
  MortgageCostInputs,
  RefinanceInputs,
  ExtraPaymentInputs,
  AffordabilityInputs,
  DownPaymentInputs,
  RentVsBuyInputs,
  PointsBuydownInputs,
  ArmVsFixedInputs,
  CashOutRefinanceInputs,
  RecastVsRefinanceInputs,
  AccelerationInputs,
  BiweeklyInputs,
  InterestSensitivityInputs,
  TimelineSimulatorInputs,
} from '../types';
import type { AmortizationInputs } from '../amortization';
import type { DTIInputs } from '../dti';
import type { ClosingCostInputs } from '../closingCosts';
import type { PMIInputs } from '../pmi';
import type { FHAInputs } from '../fha';
import type { VAInputs } from '../va';

export const mortgageCostInputs: MortgageCostInputs = {
  homePrice: 400_000,
  downPayment: 40_000,
  interestRate: 6.5,
  loanTerm: 30,
  propertyTax: 4_800,
  homeInsurance: 1_800,
  hoaFees: 50,
  pmi: 3_240,
};

export const refinanceInputs: RefinanceInputs = {
  currentBalance: 300_000,
  currentRate: 7.5,
  currentMonthlyPayment: 2_300,
  yearsRemaining: 27,
  newRate: 5.5,
  newTerm: 30,
  closingCosts: 6_000,
};

export const extraPaymentInputs: ExtraPaymentInputs = {
  loanAmount: 300_000,
  interestRate: 6.5,
  loanTerm: 30,
  extraMonthlyPayment: 200,
  extraAnnualPayment: 1_000,
  investmentReturn: 7,
};

export const affordabilityInputs: AffordabilityInputs = {
  annualIncome: 120_000,
  monthlyDebts: 500,
  downPayment: 60_000,
  interestRate: 6.5,
  loanTerm: 30,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1_800,
  hoaFees: 0,
};

export const downPaymentInputs: DownPaymentInputs = {
  homePrice: 400_000,
  downPaymentPercent: 10,
  interestRate: 6.5,
  loanTerm: 30,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1_800,
  pmiRate: 0.5,
};

export const rentVsBuyInputs: RentVsBuyInputs = {
  homePrice: 400_000,
  downPayment: 80_000,
  interestRate: 6.5,
  loanTerm: 30,
  monthlyRent: 2_600,
  rentInflation: 3,
  homeAppreciation: 4,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1_800,
  maintenanceRate: 1,
  closingCosts: 8_000,
  sellingCosts: 6,
  investmentReturn: 5,
  yearsToAnalyze: 30,
};

export const pointsBuydownInputs: PointsBuydownInputs = {
  loanAmount: 400_000,
  parRate: 7,
  loanTerm: 30,
  pointsCost: 8_000,
  pointsRate: 6.5,
  lenderCredit: 4_000,
  lenderCreditRate: 7.25,
  buydownType: 'none',
  buydownCost: 0,
  yearsToHold: 7,
};

export const armVsFixedInputs: ArmVsFixedInputs = {
  loanAmount: 400_000,
  fixedRate: 6.75,
  armInitialRate: 5.75,
  armFixedPeriod: 5,
  armAdjustmentCap: 2,
  armLifetimeCap: 5,
  armMargin: 2.75,
  loanTerm: 30,
  expectedIndexRate: 4,
};

export const cashOutRefiInputs: CashOutRefinanceInputs = {
  currentBalance: 250_000,
  currentRate: 4,
  yearsRemaining: 25,
  homeValue: 500_000,
  cashOutAmount: 50_000,
  newRate: 6.5,
  newTerm: 30,
  closingCosts: 6_000,
  alternativeRate: 9,
};

export const recastVsRefiInputs: RecastVsRefinanceInputs = {
  currentBalance: 300_000,
  currentRate: 6,
  yearsRemaining: 25,
  lumpSumAmount: 50_000,
  recastFee: 300,
  newRate: 5.5,
  newTerm: 30,
  closingCosts: 7_000,
};

export const accelerationInputs: AccelerationInputs = {
  loanAmount: 300_000,
  interestRate: 6.5,
  loanTerm: 30,
  extraMonthly: 200,
  extraAnnual: 0,
  lumpSumAmount: 0,
  lumpSumYear: 5,
  investmentReturn: 7,
  recastOption: false,
  recastFee: 250,
};

export const biweeklyInputs: BiweeklyInputs = {
  loanAmount: 300_000,
  interestRate: 6.5,
  loanTerm: 30,
  biweeklyFee: 300,
};

export const interestSensitivityInputs: InterestSensitivityInputs = {
  loanAmount: 400_000,
  baseRate: 6.5,
  loanTerm: 30,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1_800,
};

export const timelineSimulatorInputs: TimelineSimulatorInputs = {
  loanAmount: 400_000,
  interestRate: 6.75,
  expectedMoveYear: 7,
  refiLikelihood: 50,
  armInitialRate: 5.75,
  armFixedPeriod: 5,
  pointsCost: 8_000,
  pointsRate: 6.25,
};

export const amortizationInputs: AmortizationInputs = {
  loanAmount: 300_000,
  interestRate: 6.5,
  loanTerm: 30,
  extraMonthlyPayment: 0,
};

export const dtiInputs: DTIInputs = {
  monthlyGrossIncome: 8_000,
  mortgagePayment: 1_800,
  propertyTax: 4_800,
  homeInsurance: 1_800,
  hoaFees: 0,
  carPayments: 400,
  studentLoans: 250,
  creditCardMinimums: 150,
  personalLoans: 0,
  childSupport: 0,
  otherDebts: 0,
};

export const closingCostsInputs: ClosingCostInputs = {
  homePrice: 400_000,
  downPaymentPercent: 20,
  interestRate: 6.5,
  loanTerm: 30,
  state: 'CA',
  isNewConstruction: false,
};

export const pmiInputs: PMIInputs = {
  homePrice: 400_000,
  downPaymentPercent: 10,
  loanAmount: 360_000,
  interestRate: 6.5,
  loanTerm: 30,
  creditScore: 740,
  pmiType: 'borrower-paid',
};

export const fhaInputs: FHAInputs = {
  homePrice: 400_000,
  downPaymentPercent: 3.5,
  interestRate: 6.5,
  loanTerm: 30,
  creditScore: 680,
  propertyTax: 4_800,
  homeInsurance: 1_800,
  monthlyGrossIncome: 9_000,
  monthlyDebts: 500,
};

export const vaInputs: VAInputs = {
  homePrice: 400_000,
  downPaymentPercent: 0,
  interestRate: 6.25,
  loanTerm: 30,
  serviceType: 'regular',
  firstTimeUse: true,
  disabilityExempt: false,
  propertyTax: 4_800,
  homeInsurance: 1_800,
  monthlyGrossIncome: 9_000,
  monthlyDebts: 400,
};
