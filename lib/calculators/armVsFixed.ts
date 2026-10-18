import { formatCurrency } from '../format';
import type { ArmVsFixedInputs, CalculatorResult } from './types';
import { armAdjustedRate, monthlyPayment, toMonthlyRate } from './mortgageMath';
import {
  createRng,
  meanRevertingStep,
  percentile,
  shareWhere,
} from './monteCarlo';

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

/**
 * Disclosed Monte Carlo / named-path assumptions for ARM index scenarios.
 * Keep these in sync with the methodology page and Show Me the Math copy.
 */
export const ARM_RATE_PATH_ASSUMPTIONS = {
  /** Seeded draws of the SOFR/Treasury-like index after the fixed period. */
  samples: 400,
  seed: 34901,
  /** Annualized index volatility (percentage points). */
  indexVolPercent: 1.25,
  /** Mean-reversion speed κ (per year) toward the expected index. */
  meanReversion: 0.35,
  /** Named "rates fall" path: constant index = expected − this (floored at 0). */
  fallingIndexShift: -2,
  /** Named "rates rise" path: constant index = expected + this. */
  risingIndexShift: 2,
} as const;

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

function adjustmentCount(numPayments: number, fixedMonths: number, frequency: number): number {
  if (fixedMonths >= numPayments) return 0;
  return Math.floor((numPayments - fixedMonths - 1) / frequency) + 1;
}

/**
 * Amortizes the ARM month by month. After the fixed period, the rate moves toward
 * the fully indexed rate (index + margin) at each adjustment, constrained by the
 * initial cap (first adjustment), the periodic cap (later adjustments), the
 * lifetime cap, and a floor at the margin (index assumed non-negative).
 *
 * `indexAtAdjustment(i)` is the index used at the i-th adjustment (0-based).
 * Pass `() => Infinity` to trace the cap-driven worst-case path.
 */
function simulateArm(
  inputs: ArmVsFixedInputs,
  indexAtAdjustment: (adjustmentIndex: number) => number
): ArmSimulation {
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
        indexAtAdjustment(adjustmentIndex),
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

function constantIndex(indexRatePercent: number): (adjustmentIndex: number) => number {
  return () => indexRatePercent;
}

/** Sample a mean-reverting index path, one value per ARM adjustment. */
function sampleIndexSeries(
  adjustments: number,
  mean: number,
  kappa: number,
  sigma: number,
  dtYears: number,
  rng: () => number
): number[] {
  const series = new Array<number>(adjustments);
  let index = mean;
  for (let i = 0; i < adjustments; i++) {
    if (i > 0) {
      index = Math.max(0, meanRevertingStep(index, mean, kappa, sigma, dtYears, rng));
    }
    series[i] = index;
  }
  return series;
}

function roundPct(value: number): number {
  return Number(value.toFixed(1));
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
  const frequency = Math.max(1, Math.round(armAdjustmentFrequency));
  const fixedMonths = Math.min(armFixedPeriod * 12, numPayments);
  const nAdjustments = adjustmentCount(numPayments, fixedMonths, frequency);
  const dtYears = frequency / 12;

  const fallingIndex = Math.max(0, expectedIndexRate + ARM_RATE_PATH_ASSUMPTIONS.fallingIndexShift);
  const risingIndex = expectedIndexRate + ARM_RATE_PATH_ASSUMPTIONS.risingIndexShift;

  const fixedPayment = monthlyPayment(loanAmount, fixedRate, numPayments);
  const fixedTotalPaid = fixedPayment * numPayments;

  const falling = simulateArm(inputs, constantIndex(fallingIndex));
  const expected = simulateArm(inputs, constantIndex(expectedIndexRate));
  const rising = simulateArm(inputs, constantIndex(risingIndex));
  const worst = simulateArm(inputs, constantIndex(Number.POSITIVE_INFINITY));

  const worstCaseRate = worst.maxRate;
  const worstCasePayment = worst.maxPayment;
  const worstCaseYear = worst.maxRateMonth > 0 ? Math.ceil(worst.maxRateMonth / 12) : loanTerm;

  const initialSavings = fixedPayment - expected.initialPayment;
  const savingsOverFixedPeriod = initialSavings * armFixedPeriod * 12;

  // Monte Carlo: sample index paths, then apply the same ARM cap machinery
  const rng = createRng(ARM_RATE_PATH_ASSUMPTIONS.seed);
  const samples = ARM_RATE_PATH_ASSUMPTIONS.samples;
  const totals = new Float64Array(samples);
  const maxPays = new Float64Array(samples);
  const yearlyPayments: Float64Array[] = expected.yearly.map(
    () => new Float64Array(samples)
  );

  for (let s = 0; s < samples; s++) {
    const series = sampleIndexSeries(
      nAdjustments,
      expectedIndexRate,
      ARM_RATE_PATH_ASSUMPTIONS.meanReversion,
      ARM_RATE_PATH_ASSUMPTIONS.indexVolPercent,
      dtYears,
      rng
    );
    const path = simulateArm(inputs, (i) => series[i] ?? expectedIndexRate);
    totals[s] = path.totalPaid;
    maxPays[s] = path.maxPayment;
    for (let y = 0; y < path.yearly.length; y++) {
      yearlyPayments[y][s] = path.yearly[y].payment;
    }
  }

  const p10TotalPaid = percentile(totals, 10);
  const p50TotalPaid = percentile(totals, 50);
  const p90TotalPaid = percentile(totals, 90);
  const p10MaxPayment = percentile(maxPays, 10);
  const p50MaxPayment = percentile(maxPays, 50);
  const p90MaxPayment = percentile(maxPays, 90);
  const pctArmCheaper = roundPct(shareWhere(totals, (t) => t < fixedTotalPaid));

  const insights: string[] = [];

  insights.push(
    `Fixed rate: ${formatCurrency(fixedPayment)}/month for ${loanTerm} years - predictable and stable`
  );

  insights.push(
    `${productName}: Starts at ${formatCurrency(expected.initialPayment)}/month, saves ${formatCurrency(savingsOverFixedPeriod)} in first ${armFixedPeriod} years, then adjusts every ${armAdjustmentFrequency} months`
  );

  if (expected.totalPaid < fixedTotalPaid) {
    insights.push(
      `Expected path (index stays at ${expectedIndexRate}%): ARM saves ${formatCurrency(fixedTotalPaid - expected.totalPaid)} total versus fixed (fully indexed ${fullyIndexedRate.toFixed(2)}%)`
    );
  } else {
    insights.push(
      `Expected path (index stays at ${expectedIndexRate}%): Fixed saves ${formatCurrency(expected.totalPaid - fixedTotalPaid)} total versus ARM (fully indexed ${fullyIndexedRate.toFixed(2)}%)`
    );
  }

  insights.push(
    `Rate-path range: falling index (${fallingIndex.toFixed(2)}%) pays ${formatCurrency(falling.totalPaid)} total; rising index (${risingIndex.toFixed(2)}%) pays ${formatCurrency(rising.totalPaid)}`
  );

  insights.push(
    `Monte Carlo (${samples} seeded index paths, ${ARM_RATE_PATH_ASSUMPTIONS.indexVolPercent}% annual vol, mean-reverting to ${expectedIndexRate}%): ARM costs less than fixed in ${pctArmCheaper}% of paths. Total paid P10–P90: ${formatCurrency(p10TotalPaid)}–${formatCurrency(p90TotalPaid)}`
  );

  insights.push(
    `⚠️ Cap-driven worst case from your ${capStructure} caps: rate reaches ${worstCaseRate.toFixed(2)}% by year ${worstCaseYear}, pushing the payment to ${formatCurrency(worstCasePayment)}/month`
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

  const summary = `${productName} starts ${(((fixedPayment - expected.initialPayment) / fixedPayment) * 100).toFixed(1)}% cheaper. Across ${samples} rate paths ARM costs less than fixed in ${pctArmCheaper}% of cases (worst case ${worstCaseRate.toFixed(2)}% from ${capStructure} caps).`;

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
      fallingIndex: Number(fallingIndex.toFixed(3)),
      fallingTotalPaid: Math.round(falling.totalPaid),
      fallingMaxPayment: Math.round(falling.maxPayment),
      fallingMaxRate: Number(falling.maxRate.toFixed(3)),
      risingIndex: Number(risingIndex.toFixed(3)),
      risingTotalPaid: Math.round(rising.totalPaid),
      risingMaxPayment: Math.round(rising.maxPayment),
      risingMaxRate: Number(rising.maxRate.toFixed(3)),
      p10TotalPaid: Math.round(p10TotalPaid),
      p50TotalPaid: Math.round(p50TotalPaid),
      p90TotalPaid: Math.round(p90TotalPaid),
      p10MaxPayment: Math.round(p10MaxPayment),
      p50MaxPayment: Math.round(p50MaxPayment),
      p90MaxPayment: Math.round(p90MaxPayment),
      pctArmCheaper,
      mcSamples: samples,
      mcIndexVol: ARM_RATE_PATH_ASSUMPTIONS.indexVolPercent,
      mcMeanReversion: ARM_RATE_PATH_ASSUMPTIONS.meanReversion,
    },
    chartData: expected.yearly.map((p, i) => ({
      year: p.year,
      armPayment: p.payment,
      armRate: p.rate,
      fixedPayment: Math.round(fixedPayment),
      fallingPayment: falling.yearly[i]?.payment ?? p.payment,
      fallingRate: falling.yearly[i]?.rate ?? p.rate,
      risingPayment: rising.yearly[i]?.payment ?? p.payment,
      risingRate: rising.yearly[i]?.rate ?? p.rate,
      worstRate: worst.yearly[i]?.rate ?? p.rate,
      worstPayment: worst.yearly[i]?.payment ?? p.payment,
      p10Payment: Math.round(percentile(yearlyPayments[i], 10)),
      p50Payment: Math.round(percentile(yearlyPayments[i], 50)),
      p90Payment: Math.round(percentile(yearlyPayments[i], 90)),
    })),
    insights,
  };
}
