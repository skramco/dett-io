import { formatCurrency } from '../format';
import type { ArmVsFixedInputs, CalculatorResult } from './types';
import { armAdjustedRate, monthlyPayment, toMonthlyRate } from './mortgageMath';

/** e.g. "5/6 ARM" for a 5-year fixed period adjusting every 6 months, "5/1 ARM" for annual. */
export function getArmProductName(armFixedPeriod: number, armAdjustmentFrequency: number): string {
  const suffix = armAdjustmentFrequency === 12 ? 1 : armAdjustmentFrequency;
  return `${armFixedPeriod}/${suffix} ARM`;
}

export function getArmCapStructure(
  armInitialCap: number,
  armAdjustmentCap: number,
  armLifetimeCap: number
): string {
  return `${armInitialCap}/${armAdjustmentCap}/${armLifetimeCap}`;
}

export interface WorstCaseStep {
  /** First month (1-indexed) this rate applies */
  month: number;
  rate: number;
  cap: string;
}

/**
 * Cap-driven worst-case rate steps after the fixed period: the first adjustment
 * hits the initial cap, later adjustments hit the periodic cap, and the rate
 * never exceeds initial + lifetime cap.
 */
export function getWorstCaseRatePath(
  inputs: Pick<
    ArmVsFixedInputs,
    | 'armInitialRate'
    | 'armFixedPeriod'
    | 'armAdjustmentFrequency'
    | 'armInitialCap'
    | 'armAdjustmentCap'
    | 'armLifetimeCap'
    | 'loanTerm'
  >
): WorstCaseStep[] {
  const {
    armInitialRate,
    armFixedPeriod,
    armAdjustmentFrequency,
    armInitialCap,
    armAdjustmentCap,
    armLifetimeCap,
    loanTerm,
  } = inputs;

  const lifetimeMaxRate = armInitialRate + armLifetimeCap;
  const numPayments = loanTerm * 12;
  const frequency = Math.max(1, Math.round(armAdjustmentFrequency));
  const steps: WorstCaseStep[] = [];

  let rate = armInitialRate;
  let month = armFixedPeriod * 12 + 1;
  let isFirst = true;

  while (month <= numPayments && steps.length < 60) {
    const capSize = isFirst ? armInitialCap : armAdjustmentCap;
    const capLabel = isFirst
      ? `+${armInitialCap}% initial cap`
      : `+${armAdjustmentCap}% periodic cap`;
    const newRate = Math.min(rate + capSize, lifetimeMaxRate);
    steps.push({ month, rate: newRate, cap: capLabel });
    if (newRate <= rate || newRate >= lifetimeMaxRate) break;
    rate = newRate;
    month += frequency;
    isFirst = false;
  }

  return steps;
}

interface ArmSimulation {
  totalPaid: number;
  initialPayment: number;
  maxPayment: number;
  maxRate: number;
  /** Month (1-indexed) when the max rate is first reached; 0 if the rate never rises. */
  maxRateMonth: number;
  yearly: Array<{ year: number; rate: number; payment: number }>;
}

/**
 * Amortizes the ARM month by month. After the fixed period, the rate moves toward
 * the fully indexed rate (index + margin) at each adjustment, constrained by the
 * initial cap (first adjustment), the periodic cap (later adjustments), the
 * lifetime cap, and a floor at the margin (index assumed non-negative).
 * Pass `indexRatePercent = Infinity` to trace the cap-driven worst-case path.
 */
function simulateArm(inputs: ArmVsFixedInputs, indexRatePercent: number): ArmSimulation {
  const {
    loanAmount,
    armInitialRate,
    armFixedPeriod,
    armAdjustmentFrequency,
    armInitialCap,
    armAdjustmentCap,
    armLifetimeCap,
    armMargin,
    loanTerm,
  } = inputs;

  const numPayments = loanTerm * 12;
  const fixedMonths = Math.min(armFixedPeriod * 12, numPayments);
  const frequency = Math.max(1, Math.round(armAdjustmentFrequency));

  let balance = loanAmount;
  let rate = armInitialRate;
  let payment = monthlyPayment(balance, rate, numPayments);
  const initialPayment = payment;

  let totalPaid = 0;
  let maxPayment = payment;
  let maxRate = rate;
  let maxRateMonth = 0;
  let adjustmentIndex = 0;
  const yearly: ArmSimulation['yearly'] = [];

  for (let month = 1; month <= numPayments; month++) {
    const isAdjustmentMonth =
      month > fixedMonths && (month - fixedMonths - 1) % frequency === 0;

    if (isAdjustmentMonth) {
      const cap = adjustmentIndex === 0 ? armInitialCap : armAdjustmentCap;
      rate = armAdjustedRate(
        rate,
        indexRatePercent,
        armMargin,
        cap,
        armInitialRate,
        armLifetimeCap
      );
      payment = monthlyPayment(balance, rate, numPayments - month + 1);
      adjustmentIndex++;
    }

    const interest = balance * toMonthlyRate(rate);
    balance -= payment - interest;
    totalPaid += payment;

    if (payment > maxPayment) maxPayment = payment;
    if (rate > maxRate) {
      maxRate = rate;
      maxRateMonth = month;
    }

    if (month % 12 === 0) {
      yearly.push({ year: month / 12, rate, payment: Math.round(payment) });
    }
  }

  return { totalPaid, initialPayment, maxPayment, maxRate, maxRateMonth, yearly };
}

export function calculateArmVsFixed(inputs: ArmVsFixedInputs): CalculatorResult {
  const {
    loanAmount,
    fixedRate,
    armInitialRate,
    armFixedPeriod,
    armAdjustmentFrequency,
    armInitialCap,
    armAdjustmentCap,
    armLifetimeCap,
    armMargin,
    loanTerm,
    expectedIndexRate,
  } = inputs;

  const numPayments = loanTerm * 12;
  const productName = getArmProductName(armFixedPeriod, armAdjustmentFrequency);
  const capStructure = getArmCapStructure(armInitialCap, armAdjustmentCap, armLifetimeCap);
  const fullyIndexedRate = expectedIndexRate + armMargin;

  const fixedPayment = monthlyPayment(loanAmount, fixedRate, numPayments);
  const fixedTotalPaid = fixedPayment * numPayments;

  // Expected path: rate moves toward the fully indexed rate (index + margin), within caps
  const expected = simulateArm(inputs, expectedIndexRate);

  // Worst case: index rises so far that every adjustment hits its cap,
  // until the lifetime cap (initial rate + lifetime cap) is reached
  const worst = simulateArm(inputs, Number.POSITIVE_INFINITY);
  const worstCaseRate = worst.maxRate;
  const worstCasePayment = worst.maxPayment;
  const worstCaseYear = worst.maxRateMonth > 0 ? Math.ceil(worst.maxRateMonth / 12) : loanTerm;

  const initialSavings = fixedPayment - expected.initialPayment;
  const savingsOverFixedPeriod = initialSavings * armFixedPeriod * 12;

  const insights: string[] = [];

  insights.push(
    `Fixed rate: ${formatCurrency(fixedPayment)}/month for ${loanTerm} years - predictable and stable`
  );

  insights.push(
    `${productName}: Starts at ${formatCurrency(expected.initialPayment)}/month, saves ${formatCurrency(savingsOverFixedPeriod)} in first ${armFixedPeriod} years, then adjusts every ${armAdjustmentFrequency} months`
  );

  if (expected.totalPaid < fixedTotalPaid) {
    insights.push(
      `Expected case: ARM saves ${formatCurrency(fixedTotalPaid - expected.totalPaid)} total (assumes ${expectedIndexRate}% index + ${armMargin}% margin = ${fullyIndexedRate.toFixed(2)}% fully indexed rate)`
    );
  } else {
    insights.push(
      `Expected case: Fixed saves ${formatCurrency(expected.totalPaid - fixedTotalPaid)} total (assumes ${expectedIndexRate}% index + ${armMargin}% margin = ${fullyIndexedRate.toFixed(2)}% fully indexed rate)`
    );
  }

  insights.push(
    `⚠️ Worst case from your ${capStructure} caps: rate reaches ${worstCaseRate.toFixed(2)}% by year ${worstCaseYear}, pushing the payment to ${formatCurrency(worstCasePayment)}/month`
  );

  if (armFixedPeriod >= 7) {
    insights.push(
      `💡 With a ${armFixedPeriod}-year fixed period, ARM makes sense if you plan to move or refi before adjustments`
    );
  } else {
    insights.push(
      `💡 Short fixed period means rate risk comes sooner. Only take ARM if you're confident about moving or refinancing`
    );
  }

  const summary = `${productName} starts ${(((fixedPayment - expected.initialPayment) / fixedPayment) * 100).toFixed(1)}% cheaper but carries rate risk after year ${armFixedPeriod} (worst case ${worstCaseRate.toFixed(2)}% from ${capStructure} caps).`;

  return {
    summary,
    details: {
      loanAmount,
      fixedRate,
      fixedPayment: Math.round(fixedPayment),
      fixedTotalPaid: Math.round(fixedTotalPaid),
      armInitialRate,
      armInitialPayment: Math.round(expected.initialPayment),
      armTotalPaid: Math.round(expected.totalPaid),
      productName,
      capStructure,
      adjustmentFrequency: armAdjustmentFrequency,
      fullyIndexedRate: Number(fullyIndexedRate.toFixed(3)),
      worstCaseRate: Number(worstCaseRate.toFixed(3)),
      worstCasePayment: Math.round(worstCasePayment),
      worstCaseYear,
      savingsInFixedPeriod: Math.round(savingsOverFixedPeriod),
    },
    chartData: expected.yearly.map((p, i) => ({
      year: p.year,
      armPayment: p.payment,
      armRate: p.rate,
      fixedPayment: Math.round(fixedPayment),
      worstRate: worst.yearly[i]?.rate ?? p.rate,
      worstPayment: worst.yearly[i]?.payment ?? p.payment,
    })),
    insights,
  };
}
