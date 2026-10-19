export * from './types';

// Shared mortgage math — single source of truth for all calculator formulas
export * from './mortgageMath';
// 2026 FHA / conforming / jumbo loan limits
export * from './loanLimits';
export { calculateMortgageCost } from './mortgageCost';
export {
  MORTGAGE_COST_DEFAULT_INPUTS,
  formatWholeDollars,
  getMortgageCostHeroData,
} from './mortgageCostDefaults';
export type { MortgageCostHeroData, MortgageCostHeroLine } from './mortgageCostDefaults';
export { calculateRefinance } from './refinance';

// Category 1: Buying a Home
export { calculateAffordability } from './affordability';
export { calculateDownPayment } from './downPayment';
export { calculateRentVsBuy, RENT_VS_BUY_SCENARIO_ASSUMPTIONS } from './rentVsBuy';

// Category 2: Rate & Structure — merged "Best Loan for My Timeline"
export {
  calculateLoanTimeline,
  getArmProductName,
  getArmCapStructure,
  getWorstCaseRatePath,
  ARM_RATE_PATH_ASSUMPTIONS,
} from './loanTimeline';
export type {
  LoanTimelineResult,
  TimelineScenario,
  WorstCaseStep,
  RecommendationBadge,
  FifteenYearAlternative,
} from './loanTimeline';

// Category 3: Refinancing & Equity
export { calculateCashOutRefi } from './cashOutRefi';
export { calculateRecastVsRefi } from './recastVsRefi';

// Category 4: Payoff & Wealth — merged "Pay Off Faster"
export { calculatePayoff } from './payoff';
export type { PayoffResult, PayoffStrategyRow } from './payoff';

// Category 5: Advanced
export { calculateInterestSensitivity } from './interestSensitivity';

// Category 6: New High-Volume Calculators
export { calculateAmortization } from './amortization';
export type { AmortizationInputs, AmortizationRow, AmortizationSchedule } from './amortization';
export {
  amortizationCsvFilename,
  buildAmortizationCsv,
  triggerCsvDownload,
} from './amortizationCsv';
export type { AmortizationCsvView } from './amortizationCsv';
export { evaluateLockFloat } from './lockFloat';
export type { LockFloatDecision } from './lockFloat';
export { calculateDTI } from './dti';
export type { DTIInputs } from './dti';
export { calculateClosingCosts } from './closingCosts';
export type { ClosingCostInputs } from './closingCosts';
export { calculatePMI } from './pmi';
export type { PMIInputs } from './pmi';
export { calculateFHA } from './fha';
export type { FHAInputs } from './fha';
export {
  calculateVA,
  VA_REGION_LABELS,
  VA_RESIDUAL_INCOME_80K_PLUS,
  VA_RESIDUAL_INCOME_UNDER_80K,
  getResidualIncomeTable,
  getRequiredResidualIncome,
} from './va';
export type { VAInputs, VARegion } from './va';
