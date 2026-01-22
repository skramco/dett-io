export * from './types';
export { calculateMortgageCost } from './mortgageCost';
export { calculateRefinance } from './refinance';
export { calculateExtraPayment } from './extraPayment';

// Category 1: Buying a Home
export { calculateAffordability } from './affordability';
export { calculateDownPayment } from './downPayment';
export { calculateRentVsBuy } from './rentVsBuy';

// Category 2: Rate & Structure
export { calculatePointsBuydown } from './pointsBuydown';
export { calculateArmVsFixed } from './armVsFixed';

// Category 3: Refinancing & Equity
export { calculateCashOutRefi } from './cashOutRefi';
export { calculateRecastVsRefi } from './recastVsRefi';

// Category 4: Payoff & Wealth
export { calculateAcceleration } from './acceleration';
export { calculateBiweekly } from './biweekly';

// Category 5: Advanced
export { calculateInterestSensitivity } from './interestSensitivity';
export { calculateTimelineSimulator } from './timelineSimulator';
