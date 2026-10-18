/**
 * Shared mortgage math — the single source of truth for every dett.io calculator.
 *
 * All calculators must derive their headline numbers from these functions instead
 * of re-implementing formulas locally. Automated tests in tests/ compare each
 * calculator's output against these reference implementations, so any divergence
 * (copy-paste drift, a typo in an exponent, etc.) fails CI.
 */

/** Convert an annual percentage rate (e.g. 6.5) to a monthly decimal rate. */
export function toMonthlyRate(annualRatePercent: number): number {
  return annualRatePercent / 100 / 12;
}

/**
 * Standard amortizing monthly payment (principal & interest).
 * P × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1], with a zero-rate fallback of P ÷ n.
 */
export function monthlyPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): number {
  if (termMonths <= 0) return 0;
  const r = toMonthlyRate(annualRatePercent);
  if (r === 0) return principal / termMonths;
  const growth = Math.pow(1 + r, termMonths);
  return (principal * r * growth) / (growth - 1);
}

/**
 * Present value of an annuity — the loan amount a given monthly payment supports.
 * Payment × [(1+r)ⁿ − 1] ÷ [r × (1+r)ⁿ], with a zero-rate fallback of Payment × n.
 */
export function loanAmountFromPayment(
  payment: number,
  annualRatePercent: number,
  termMonths: number
): number {
  if (termMonths <= 0) return 0;
  const r = toMonthlyRate(annualRatePercent);
  if (r === 0) return payment * termMonths;
  const growth = Math.pow(1 + r, termMonths);
  return (payment * (growth - 1)) / (r * growth);
}

/** Interest accrued on a balance for one month. */
export function monthlyInterest(balance: number, annualRatePercent: number): number {
  return balance * toMonthlyRate(annualRatePercent);
}

/**
 * Remaining balance after `monthsPaid` scheduled payments, computed by iterating
 * the amortization schedule (matches the schedule-based calculators exactly).
 */
export function remainingBalance(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
  monthsPaid: number
): number {
  const r = toMonthlyRate(annualRatePercent);
  const payment = monthlyPayment(principal, annualRatePercent, termMonths);
  let balance = principal;
  for (let m = 0; m < monthsPaid && balance > 0; m++) {
    balance -= payment - balance * r;
  }
  return Math.max(0, balance);
}

/**
 * Remaining balance after `monthsElapsed` payments of an explicit `payment`
 * amount (closed-form). Use when the payment may differ from the scheduled
 * amortizing payment (e.g. a validated user-entered payment).
 */
export function remainingBalanceWithPayment(
  principal: number,
  annualRatePercent: number,
  payment: number,
  monthsElapsed: number
): number {
  const r = toMonthlyRate(annualRatePercent);
  if (r === 0) return Math.max(0, principal - payment * monthsElapsed);
  const growth = Math.pow(1 + r, monthsElapsed);
  return Math.max(0, principal * growth - payment * ((growth - 1) / r));
}

/** Total interest paid over the full scheduled term (no extra payments). */
export function totalInterestOverTerm(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): number {
  return monthlyPayment(principal, annualRatePercent, termMonths) * termMonths - principal;
}

/** Loan-to-value ratio as a percentage. */
export function ltvPercent(loanAmount: number, homeValue: number): number {
  return homeValue > 0 ? (loanAmount / homeValue) * 100 : 0;
}

/**
 * Number of scheduled payments until the balance reaches `targetLtvPercent`
 * of the home value (e.g. 78 for automatic PMI cancellation).
 * Returns 0 when the target is never reached within the term.
 */
export function monthsToReachLtv(
  loanAmount: number,
  homeValue: number,
  annualRatePercent: number,
  termMonths: number,
  targetLtvPercent: number
): number {
  const r = toMonthlyRate(annualRatePercent);
  const payment = monthlyPayment(loanAmount, annualRatePercent, termMonths);
  const targetBalance = homeValue * (targetLtvPercent / 100);
  let balance = loanAmount;
  for (let m = 1; m <= termMonths; m++) {
    balance -= payment - balance * r;
    if (balance <= targetBalance) return m;
  }
  return 0;
}

/** Monthly PMI from an annual PMI rate (e.g. 0.5 for 0.5%/yr). */
export function monthlyPmiAmount(loanAmount: number, annualPmiRatePercent: number): number {
  return (loanAmount * (annualPmiRatePercent / 100)) / 12;
}

/** Approximate conventional annual PMI rate (%) based on LTV and credit score. */
export function conventionalPmiRatePercent(ltv: number, creditScore: number): number {
  if (creditScore >= 760) {
    if (ltv <= 85) return 0.19;
    if (ltv <= 90) return 0.3;
    if (ltv <= 95) return 0.46;
    return 0.55;
  } else if (creditScore >= 740) {
    if (ltv <= 85) return 0.25;
    if (ltv <= 90) return 0.35;
    if (ltv <= 95) return 0.55;
    return 0.65;
  } else if (creditScore >= 720) {
    if (ltv <= 85) return 0.31;
    if (ltv <= 90) return 0.47;
    if (ltv <= 95) return 0.65;
    return 0.8;
  } else if (creditScore >= 700) {
    if (ltv <= 85) return 0.4;
    if (ltv <= 90) return 0.58;
    if (ltv <= 95) return 0.82;
    return 0.95;
  } else if (creditScore >= 680) {
    if (ltv <= 85) return 0.5;
    if (ltv <= 90) return 0.72;
    if (ltv <= 95) return 1.05;
    return 1.15;
  }
  if (ltv <= 85) return 0.65;
  if (ltv <= 90) return 0.9;
  if (ltv <= 95) return 1.25;
  return 1.5;
}

/** Front-end (housing) DTI as a percentage of gross monthly income. */
export function frontEndDtiPercent(
  monthlyHousingCosts: number,
  monthlyGrossIncome: number
): number {
  return monthlyGrossIncome > 0 ? (monthlyHousingCosts / monthlyGrossIncome) * 100 : 0;
}

/** Back-end (total debt) DTI as a percentage of gross monthly income. */
export function backEndDtiPercent(
  monthlyHousingCosts: number,
  otherMonthlyDebts: number,
  monthlyGrossIncome: number
): number {
  return monthlyGrossIncome > 0
    ? ((monthlyHousingCosts + otherMonthlyDebts) / monthlyGrossIncome) * 100
    : 0;
}

// ---------------------------------------------------------------------------
// FHA
// ---------------------------------------------------------------------------

/** FHA upfront mortgage insurance premium rate (% of base loan). */
export const FHA_UPFRONT_MIP_PERCENT = 1.75;

/** FHA upfront MIP in dollars (financed into the loan). */
export function fhaUpfrontMip(baseLoanAmount: number): number {
  return baseLoanAmount * (FHA_UPFRONT_MIP_PERCENT / 100);
}

/** FHA annual MIP rate (%) based on term, LTV, and base loan amount. */
export function fhaAnnualMipRatePercent(
  baseLoanAmount: number,
  ltv: number,
  loanTermYears: number
): number {
  if (loanTermYears <= 15) {
    return ltv <= 90 ? 0.15 : 0.4;
  }
  if (baseLoanAmount <= 726200) {
    return ltv <= 95 ? 0.5 : 0.55;
  }
  return ltv <= 95 ? 0.7 : 0.75;
}

/** FHA monthly MIP in dollars. */
export function fhaMonthlyMip(baseLoanAmount: number, annualMipRatePercent: number): number {
  return (baseLoanAmount * (annualMipRatePercent / 100)) / 12;
}

// ---------------------------------------------------------------------------
// VA
// ---------------------------------------------------------------------------

export type VAServiceType = 'regular' | 'reserves-guard' | 'surviving-spouse';

/** VA funding fee rate (%) per current guidelines. */
export function vaFundingFeeRatePercent(
  downPaymentPercent: number,
  firstTimeUse: boolean,
  serviceType: VAServiceType | string,
  disabilityExempt: boolean
): number {
  if (disabilityExempt) return 0;
  const isReservesGuard = serviceType === 'reserves-guard';
  if (downPaymentPercent >= 10) return 1.25;
  if (downPaymentPercent >= 5) return 1.5;
  if (firstTimeUse) return isReservesGuard ? 2.5 : 2.15;
  return isReservesGuard ? 2.5 : 3.3;
}

// ---------------------------------------------------------------------------
// ARM
// ---------------------------------------------------------------------------

/**
 * Rate after one ARM adjustment: fully-indexed rate (index + margin), limited by
 * the periodic adjustment cap and the lifetime cap over the initial rate.
 */
export function armAdjustedRate(
  currentRatePercent: number,
  indexRatePercent: number,
  marginPercent: number,
  periodicCapPercent: number,
  initialRatePercent: number,
  lifetimeCapPercent: number
): number {
  const fullyIndexed = indexRatePercent + marginPercent;
  const periodicMax = currentRatePercent + periodicCapPercent;
  const lifetimeMax = initialRatePercent + lifetimeCapPercent;
  return Math.min(fullyIndexed, periodicMax, lifetimeMax);
}

// ---------------------------------------------------------------------------
// Biweekly
// ---------------------------------------------------------------------------

export interface BiweeklyPayoffResult {
  /** Number of biweekly payments made until payoff. */
  periods: number;
  totalPaid: number;
  totalInterest: number;
}

/**
 * Simulate a true biweekly schedule (26 payments/year, interest accrued per
 * biweekly period at annualRate ÷ 26).
 */
export function simulateBiweeklyPayoff(
  loanAmount: number,
  annualRatePercent: number,
  biweeklyPaymentAmount: number,
  maxPeriods: number
): BiweeklyPayoffResult {
  const periodRate = annualRatePercent / 100 / 26;
  let balance = loanAmount;
  let totalPaid = 0;
  let periods = 0;
  while (balance > 0 && periods < maxPeriods) {
    const interest = balance * periodRate;
    balance -= biweeklyPaymentAmount - interest;
    totalPaid += biweeklyPaymentAmount;
    periods++;
  }
  return { periods, totalPaid, totalInterest: totalPaid - loanAmount };
}

// ---------------------------------------------------------------------------
// Break-even
// ---------------------------------------------------------------------------

/** Months to recoup an upfront cost through monthly savings (Infinity if no savings). */
export function breakEvenMonths(upfrontCost: number, monthlySavings: number): number {
  return monthlySavings > 0 ? upfrontCost / monthlySavings : Infinity;
}
