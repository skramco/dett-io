/**
 * Shared mortgage math — the single source of truth for every calculator.
 *
 * All rate/payment/amortization/DTI/PMI formulas used by the calculators in
 * this directory MUST come from this module. Do not copy-paste the annuity
 * formula into individual calculators: duplicated formulas drift apart and
 * cause headline-number bugs. Automated tests in `lib/calculators/__tests__`
 * compare each calculator's headline outputs against these functions.
 */

/** Convert an annual percentage rate (e.g. 6.5) to a monthly decimal rate. */
export function monthlyRate(annualRatePercent: number): number {
  return annualRatePercent / 100 / 12;
}

/**
 * Standard fixed-rate mortgage payment (principal & interest) per month.
 *
 * P × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1], with safe handling of 0% rates and
 * degenerate inputs (zero/negative principal or term).
 */
export function monthlyPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): number {
  if (!(principal > 0) || !(termMonths > 0)) return 0;
  const r = monthlyRate(annualRatePercent);
  if (r === 0) return principal / termMonths;
  const growth = Math.pow(1 + r, termMonths);
  return (principal * r * growth) / (growth - 1);
}

/**
 * Inverse of {@link monthlyPayment}: the loan principal that a given monthly
 * payment supports (present value of an annuity).
 */
export function principalFromPayment(
  payment: number,
  annualRatePercent: number,
  termMonths: number
): number {
  if (!(payment > 0) || !(termMonths > 0)) return 0;
  const r = monthlyRate(annualRatePercent);
  if (r === 0) return payment * termMonths;
  const growth = Math.pow(1 + r, termMonths);
  return (payment * (growth - 1)) / (r * growth);
}

/**
 * Remaining balance on a standard fixed-rate loan after `monthsElapsed`
 * scheduled payments (closed form, no extra payments).
 */
export function remainingBalance(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
  monthsElapsed: number
): number {
  if (!(principal > 0) || !(termMonths > 0)) return 0;
  const clamped = Math.min(Math.max(monthsElapsed, 0), termMonths);
  const r = monthlyRate(annualRatePercent);
  if (r === 0) return principal * (1 - clamped / termMonths);
  const growthN = Math.pow(1 + r, termMonths);
  const growthM = Math.pow(1 + r, clamped);
  return (principal * (growthN - growthM)) / (growthN - 1);
}

/** Total interest paid over the full scheduled life of a fixed-rate loan. */
export function totalLoanInterest(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): number {
  if (!(principal > 0) || !(termMonths > 0)) return 0;
  return monthlyPayment(principal, annualRatePercent, termMonths) * termMonths - principal;
}

export interface AmortizeOptions {
  principal: number;
  annualRatePercent: number;
  termMonths: number;
  /** Extra principal added to every monthly payment. */
  extraMonthly?: number;
  /** Extra principal added every 12th month (months 12, 24, ...). */
  extraAnnual?: number;
  /** One-time extra principal payment. */
  lumpSum?: number;
  /** Month (1-based) at which the lump sum is applied. */
  lumpSumMonth?: number;
}

export interface AmortizeResult {
  /** Number of months until the balance reaches zero. */
  months: number;
  totalInterest: number;
  totalPrincipal: number;
  totalPaid: number;
}

/**
 * Reference amortization engine. Iterates month by month applying scheduled
 * payments plus any extra principal, and reports payoff totals.
 */
export function amortize(options: AmortizeOptions): AmortizeResult {
  const {
    principal,
    annualRatePercent,
    termMonths,
    extraMonthly = 0,
    extraAnnual = 0,
    lumpSum = 0,
    lumpSumMonth = 0,
  } = options;

  if (!(principal > 0) || !(termMonths > 0)) {
    return { months: 0, totalInterest: 0, totalPrincipal: 0, totalPaid: 0 };
  }

  const r = monthlyRate(annualRatePercent);
  const basePayment = monthlyPayment(principal, annualRatePercent, termMonths);

  let balance = principal;
  let totalInterest = 0;
  let months = 0;

  // The hard cap guards against non-terminating loops when extra payments are
  // negative or the base payment does not cover interest.
  const maxMonths = termMonths * 2;

  for (let month = 1; month <= maxMonths && balance > 0; month++) {
    const interest = balance * r;
    let principalPaid = basePayment - interest + extraMonthly;
    if (month % 12 === 0) principalPaid += extraAnnual;
    if (month === lumpSumMonth) principalPaid += lumpSum;

    if (principalPaid >= balance) principalPaid = balance;

    totalInterest += interest;
    balance -= principalPaid;
    months++;
  }

  const totalPrincipal = principal - Math.max(0, balance);
  return {
    months,
    totalInterest,
    totalPrincipal,
    totalPaid: totalPrincipal + totalInterest,
  };
}

/** Loan-to-value ratio as a percentage. */
export function ltvPercent(loanAmount: number, propertyValue: number): number {
  if (!(propertyValue > 0)) return 0;
  return (loanAmount / propertyValue) * 100;
}

/**
 * Monthly mortgage-insurance premium from an annual rate expressed as a
 * percentage of the loan amount (applies to PMI and FHA/conventional MI).
 */
export function monthlyMortgageInsurance(
  loanAmount: number,
  annualInsuranceRatePercent: number
): number {
  return (loanAmount * (annualInsuranceRatePercent / 100)) / 12;
}

/**
 * Number of scheduled payments until the loan balance reaches the target LTV
 * (e.g. 78 for automatic PMI cancellation). Returns 0 when the loan never
 * reaches the target within its term — matching the calculators' historical
 * "PMI for the life of the loan" sentinel.
 */
export function monthsUntilLtv(
  principal: number,
  propertyValue: number,
  annualRatePercent: number,
  termMonths: number,
  targetLtvPercent: number
): number {
  if (!(principal > 0) || !(propertyValue > 0) || !(termMonths > 0)) return 0;
  const r = monthlyRate(annualRatePercent);
  const payment = monthlyPayment(principal, annualRatePercent, termMonths);
  const targetBalance = propertyValue * (targetLtvPercent / 100);

  let balance = principal;
  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * r;
    balance -= payment - interest;
    if (balance <= targetBalance) return month;
  }
  return 0;
}

/** Front-end (housing) DTI as a percentage of gross monthly income. */
export function frontEndDti(monthlyHousingCosts: number, monthlyGrossIncome: number): number {
  if (!(monthlyGrossIncome > 0)) return 0;
  return (monthlyHousingCosts / monthlyGrossIncome) * 100;
}

/** Back-end (total debt) DTI as a percentage of gross monthly income. */
export function backEndDti(
  monthlyHousingCosts: number,
  otherMonthlyDebts: number,
  monthlyGrossIncome: number
): number {
  if (!(monthlyGrossIncome > 0)) return 0;
  return ((monthlyHousingCosts + otherMonthlyDebts) / monthlyGrossIncome) * 100;
}

/**
 * Months to recoup an upfront cost through a monthly saving (points
 * break-even, refinance break-even). Returns Infinity when there is no
 * monthly saving.
 */
export function breakEvenMonths(upfrontCost: number, monthlySavings: number): number {
  if (!(monthlySavings > 0)) return Infinity;
  return upfrontCost / monthlySavings;
}
