import { formatCurrency } from '../format';
import type { LoanTimelineInputs, CalculatorResult } from './types';
import {
  monthlyPayment,
  toMonthlyRate,
  armAdjustedRate,
  remainingBalance,
  breakEvenMonths,
} from './mortgageMath';
import {
  createRng,
  meanRevertingStep,
  percentile,
  shareWhere,
} from './monteCarlo';

export interface TimelineScenario {
  option: string;
  rate: number;
  termYears: number;
  upfrontCost: number;
  initialPayment: number;
  /** Highest monthly payment experienced during the hold (differs for ARMs). */
  maxPaymentDuringHold: number;
  totalPaidDuringHold: number;
  remainingBalance: number;
  principalPaid: number;
  /** Payments + upfront cost − principal paid down. Interest + fees actually spent. */
  netCost: number;
}

export interface LoanTimelineResult extends CalculatorResult {
  scenarios: TimelineScenario[];
  /** Year-by-year ARM expected vs named/worst-case paths plus Monte Carlo band (full term). */
  armSchedule: Array<{
    year: number;
    armRate: number;
    armPayment: number;
    fixedPayment: number;
    fallingPayment: number;
    fallingRate: number;
    risingPayment: number;
    risingRate: number;
    worstRate: number;
    worstPayment: number;
    p10Payment: number;
    p50Payment: number;
    p90Payment: number;
  }>;
}

export interface WorstCaseStep {
  /** First month (1-indexed) this rate applies */
  month: number;
  rate: number;
  cap: string;
}

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

/**
 * Cap-driven worst-case rate steps after the fixed period: the first adjustment
 * hits the initial cap, later adjustments hit the periodic cap, and the rate
 * never exceeds initial + lifetime cap.
 */
export function getWorstCaseRatePath(
  inputs: Pick<
    LoanTimelineInputs,
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
    armAdjustmentFrequency = 6,
    armInitialCap = 2,
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

interface FixedSimResult {
  payment: number;
  totalPaid: number;
  balance: number;
}

/** Amortize a fixed-rate loan for `holdMonths` (or until paid off). */
function simulateFixed(
  loanAmount: number,
  ratePercent: number,
  termMonths: number,
  holdMonths: number
): FixedSimResult {
  const payment = monthlyPayment(loanAmount, ratePercent, termMonths);
  const months = Math.min(holdMonths, termMonths);
  const totalPaid = payment * months;
  const balance = remainingBalance(loanAmount, ratePercent, termMonths, months);
  return { payment, totalPaid, balance };
}

interface ArmSimResult {
  initialPayment: number;
  maxPayment: number;
  holdMaxPayment: number;
  maxRate: number;
  maxRateMonth: number;
  totalPaid: number;
  balance: number;
  adjustedRate: number;
  adjustedPayment: number;
  adjusts: boolean;
  schedule: Array<{ year: number; rate: number; payment: number }>;
}

/**
 * Amortize an ARM with proper adjustments (ENG-324 / ENG-330):
 * after the fixed period the rate moves toward index + margin, limited by the
 * initial cap (first adjustment), the periodic cap (later), the lifetime cap,
 * and a floor at the margin. The payment is re-amortized at each adjustment.
 * `indexAtAdjustment(i)` is the index used at the i-th adjustment (0-based).
 * Pass `() => Infinity` to trace the cap-driven worst-case path.
 */
function simulateArm(params: {
  loanAmount: number;
  initialRatePercent: number;
  fixedPeriodYears: number;
  marginPercent: number;
  initialCapPercent: number;
  periodicCapPercent: number;
  lifetimeCapPercent: number;
  adjustmentFrequency: number;
  indexAtAdjustment: (adjustmentIndex: number) => number;
  termMonths: number;
  holdMonths: number;
}): ArmSimResult {
  const {
    loanAmount,
    initialRatePercent,
    fixedPeriodYears,
    marginPercent,
    initialCapPercent,
    periodicCapPercent,
    lifetimeCapPercent,
    adjustmentFrequency,
    indexAtAdjustment,
    termMonths,
    holdMonths,
  } = params;

  const monthsToRun = Math.min(Math.max(holdMonths, termMonths), termMonths);
  const fixedMonths = Math.min(fixedPeriodYears * 12, termMonths);
  const frequency = Math.max(1, Math.round(adjustmentFrequency));

  let currentRate = initialRatePercent;
  let payment = monthlyPayment(loanAmount, initialRatePercent, termMonths);
  const initialPayment = payment;
  let maxPayment = payment;
  let maxRate = currentRate;
  let maxRateMonth = 0;
  let balance = loanAmount;
  let totalPaid = 0;
  let holdTotalPaid = 0;
  let holdBalance = loanAmount;
  let holdRate = currentRate;
  let holdPayment = payment;
  let holdMaxPayment = payment;
  let adjustmentIndex = 0;
  const schedule: Array<{ year: number; rate: number; payment: number }> = [];

  for (let month = 1; month <= monthsToRun && balance > 0; month++) {
    const isAdjustmentMonth =
      month > fixedMonths && (month - fixedMonths - 1) % frequency === 0;

    if (isAdjustmentMonth) {
      const cap = adjustmentIndex === 0 ? initialCapPercent : periodicCapPercent;
      currentRate = armAdjustedRate(
        currentRate,
        indexAtAdjustment(adjustmentIndex),
        marginPercent,
        cap,
        initialRatePercent,
        lifetimeCapPercent
      );
      payment = monthlyPayment(balance, currentRate, termMonths - month + 1);
      adjustmentIndex++;
    }

    const interest = balance * toMonthlyRate(currentRate);
    let principal = payment - interest;
    if (principal > balance) principal = balance;
    balance -= principal;
    totalPaid += principal + interest;

    if (payment > maxPayment) maxPayment = payment;
    if (currentRate > maxRate) {
      maxRate = currentRate;
      maxRateMonth = month;
    }

    if (month <= Math.min(holdMonths, termMonths)) {
      holdTotalPaid = totalPaid;
      holdBalance = balance;
      holdRate = currentRate;
      holdPayment = payment;
      if (payment > holdMaxPayment) holdMaxPayment = payment;
    }

    if (month % 12 === 0) {
      schedule.push({ year: month / 12, rate: currentRate, payment: Math.round(payment) });
    }
  }

  const holdMonthsClamped = Math.min(holdMonths, termMonths);
  return {
    initialPayment,
    maxPayment,
    holdMaxPayment,
    maxRate,
    maxRateMonth,
    totalPaid: holdMonthsClamped >= monthsToRun ? totalPaid : holdTotalPaid,
    balance: holdMonthsClamped >= monthsToRun ? Math.max(0, balance) : Math.max(0, holdBalance),
    adjustedRate: holdMonthsClamped >= monthsToRun ? currentRate : holdRate,
    adjustedPayment: holdMonthsClamped >= monthsToRun ? payment : holdPayment,
    adjusts: holdMonthsClamped > fixedMonths,
    schedule,
  };
}

function constantIndex(indexRatePercent: number): (adjustmentIndex: number) => number {
  return () => indexRatePercent;
}

function adjustmentCount(numPayments: number, fixedMonths: number, frequency: number): number {
  if (fixedMonths >= numPayments) return 0;
  return Math.floor((numPayments - fixedMonths - 1) / frequency) + 1;
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

/** Yearly rate reductions during a temporary buydown, e.g. 2-1 → [2, 1]. */
const BUYDOWN_SCHEDULES: Record<string, number[]> = {
  '3-2-1': [3, 2, 1],
  '2-1': [2, 1],
  '1-0': [1],
};

interface BuydownSim {
  year1Payment: number;
  subsidy: number;
  totalPaid: number;
  endingBalance: number;
}

function simulateTemporaryBuydown(
  loanAmount: number,
  parRate: number,
  termMonths: number,
  holdMonths: number,
  buydownType: string
): BuydownSim | null {
  const schedule = BUYDOWN_SCHEDULES[buydownType];
  if (!schedule) return null;

  const parPayment = monthlyPayment(loanAmount, parRate, termMonths);
  const yearlyReducedPayments = schedule.map((reduction) =>
    monthlyPayment(loanAmount, Math.max(parRate - reduction, 0), termMonths)
  );

  let subsidy = 0;
  let totalPaidOverHold = 0;
  let unusedSubsidy = 0;
  for (const [yearIndex, reducedPayment] of yearlyReducedPayments.entries()) {
    const monthlySubsidy = parPayment - reducedPayment;
    for (let month = yearIndex * 12 + 1; month <= (yearIndex + 1) * 12 && month <= termMonths; month++) {
      subsidy += monthlySubsidy;
      if (month <= holdMonths) {
        totalPaidOverHold += reducedPayment;
      } else {
        unusedSubsidy += monthlySubsidy;
      }
    }
  }
  totalPaidOverHold += parPayment * Math.max(holdMonths - schedule.length * 12, 0);

  const endingBalance = Math.max(
    remainingBalance(loanAmount, parRate, termMonths, holdMonths) - unusedSubsidy,
    0
  );

  return {
    year1Payment: yearlyReducedPayments[0],
    subsidy,
    totalPaid: totalPaidOverHold,
    endingBalance,
  };
}

function normalizeInputs(inputs: LoanTimelineInputs) {
  const parRate = inputs.parRate ?? inputs.interestRate ?? inputs.fixedRate ?? 0;
  const expectedYearsInHome = inputs.expectedYearsInHome ?? inputs.expectedMoveYear ?? inputs.loanTerm;
  const armAdjustmentFrequency = inputs.armAdjustmentFrequency ?? 6;
  const armInitialCap = inputs.armInitialCap ?? inputs.armAdjustmentCap;
  const lenderCredit = inputs.lenderCredit ?? 0;
  const lenderCreditRate = inputs.lenderCreditRate ?? parRate;
  const buydownType = inputs.buydownType ?? 'none';
  const fifteenYearRate = inputs.fifteenYearRate ?? parRate - 0.5;
  return {
    ...inputs,
    parRate,
    expectedYearsInHome,
    armAdjustmentFrequency,
    armInitialCap,
    lenderCredit,
    lenderCreditRate,
    buydownType,
    fifteenYearRate,
  };
}

export function calculateLoanTimeline(inputs: LoanTimelineInputs): LoanTimelineResult {
  const {
    loanAmount,
    loanTerm,
    expectedYearsInHome,
    parRate,
    pointsRate,
    pointsCost,
    lenderCredit,
    lenderCreditRate,
    buydownType,
    armInitialRate,
    armFixedPeriod,
    armAdjustmentFrequency,
    armInitialCap,
    armMargin,
    armAdjustmentCap,
    armLifetimeCap,
    expectedIndexRate,
    fifteenYearRate,
  } = normalizeInputs(inputs);

  const termMonths = loanTerm * 12;
  const holdMonths = Math.min(Math.max(expectedYearsInHome, 0) * 12, termMonths);
  const productName = getArmProductName(armFixedPeriod, armAdjustmentFrequency);
  const capStructure = getArmCapStructure(armInitialCap, armAdjustmentCap, armLifetimeCap);
  const frequency = Math.max(1, Math.round(armAdjustmentFrequency));
  const fixedMonths = Math.min(armFixedPeriod * 12, termMonths);
  const nAdjustments = adjustmentCount(termMonths, fixedMonths, frequency);
  const dtYears = frequency / 12;
  const fallingIndex = Math.max(0, expectedIndexRate + ARM_RATE_PATH_ASSUMPTIONS.fallingIndexShift);
  const risingIndex = expectedIndexRate + ARM_RATE_PATH_ASSUMPTIONS.risingIndexShift;

  const par = simulateFixed(loanAmount, parRate, termMonths, holdMonths);
  const points = simulateFixed(loanAmount, pointsRate, termMonths, holdMonths);
  const credit = simulateFixed(loanAmount, lenderCreditRate, termMonths, holdMonths);

  const armBase = {
    loanAmount,
    initialRatePercent: armInitialRate,
    fixedPeriodYears: armFixedPeriod,
    marginPercent: armMargin,
    initialCapPercent: armInitialCap,
    periodicCapPercent: armAdjustmentCap,
    lifetimeCapPercent: armLifetimeCap,
    adjustmentFrequency: armAdjustmentFrequency,
    termMonths,
    holdMonths,
  };

  const armFalling = simulateArm({
    ...armBase,
    indexAtAdjustment: constantIndex(fallingIndex),
  });
  const armExpected = simulateArm({
    ...armBase,
    indexAtAdjustment: constantIndex(expectedIndexRate),
  });
  const armRising = simulateArm({
    ...armBase,
    indexAtAdjustment: constantIndex(risingIndex),
  });
  const armWorst = simulateArm({
    ...armBase,
    holdMonths: termMonths,
    indexAtAdjustment: constantIndex(Number.POSITIVE_INFINITY),
  });

  const rng = createRng(ARM_RATE_PATH_ASSUMPTIONS.seed);
  const samples = ARM_RATE_PATH_ASSUMPTIONS.samples;
  const totals = new Float64Array(samples);
  const maxPays = new Float64Array(samples);
  const yearlyPayments: Float64Array[] = armExpected.schedule.map(() => new Float64Array(samples));

  for (let s = 0; s < samples; s++) {
    const series = sampleIndexSeries(
      nAdjustments,
      expectedIndexRate,
      ARM_RATE_PATH_ASSUMPTIONS.meanReversion,
      ARM_RATE_PATH_ASSUMPTIONS.indexVolPercent,
      dtYears,
      rng
    );
    const path = simulateArm({
      ...armBase,
      indexAtAdjustment: (i) => series[i] ?? expectedIndexRate,
    });
    totals[s] = path.totalPaid;
    maxPays[s] = path.holdMaxPayment;
    for (let y = 0; y < path.schedule.length; y++) {
      yearlyPayments[y][s] = path.schedule[y].payment;
    }
  }

  const p10TotalPaid = percentile(totals, 10);
  const p50TotalPaid = percentile(totals, 50);
  const p90TotalPaid = percentile(totals, 90);
  const p10MaxPayment = percentile(maxPays, 10);
  const p50MaxPayment = percentile(maxPays, 50);
  const p90MaxPayment = percentile(maxPays, 90);
  const pctArmCheaper = roundPct(shareWhere(totals, (t) => t < par.totalPaid));

  const fifteenTermMonths = 15 * 12;
  const fifteen = simulateFixed(loanAmount, fifteenYearRate, fifteenTermMonths, holdMonths);

  const buydown = buydownType !== 'none'
    ? simulateTemporaryBuydown(loanAmount, parRate, termMonths, holdMonths, buydownType)
    : null;

  const netCostOf = (totalPaid: number, upfrontCost: number, balance: number) =>
    Math.round(totalPaid) + upfrontCost - (loanAmount - Math.round(balance));

  const buildScenario = (
    option: string,
    rate: number,
    termYears: number,
    upfrontCost: number,
    sim: { payment?: number; initialPayment?: number; maxPayment?: number; totalPaid: number; balance: number }
  ): TimelineScenario => {
    const initialPayment = sim.initialPayment ?? sim.payment ?? 0;
    const roundedBalance = Math.round(sim.balance);
    const roundedPaid = Math.round(sim.totalPaid);
    const principalPaid = loanAmount - roundedBalance;
    return {
      option,
      rate,
      termYears,
      upfrontCost,
      initialPayment: Math.round(initialPayment),
      maxPaymentDuringHold: Math.round(sim.maxPayment ?? initialPayment),
      totalPaidDuringHold: roundedPaid,
      remainingBalance: roundedBalance,
      principalPaid: Math.round(principalPaid),
      netCost: roundedPaid + upfrontCost - principalPaid,
    };
  };

  const scenarios: TimelineScenario[] = [
    buildScenario(`${loanTerm}-Year Fixed (Par)`, parRate, loanTerm, 0, par),
    buildScenario(`${loanTerm}-Year Fixed (Points)`, pointsRate, loanTerm, pointsCost, points),
    buildScenario(productName, armInitialRate, loanTerm, 0, {
      initialPayment: armExpected.initialPayment,
      maxPayment: armExpected.holdMaxPayment,
      totalPaid: armExpected.totalPaid,
      balance: armExpected.balance,
    }),
    buildScenario('15-Year Fixed', fifteenYearRate, 15, 0, fifteen),
  ];

  if (lenderCredit > 0 || lenderCreditRate !== parRate) {
    scenarios.push(buildScenario('Lender Credit', lenderCreditRate, loanTerm, -lenderCredit, credit));
  }

  if (buydown) {
    scenarios.push(
      buildScenario(`${buydownType} Buydown`, parRate, loanTerm, Math.round(buydown.subsidy), {
        payment: buydown.year1Payment,
        totalPaid: buydown.totalPaid,
        balance: buydown.endingBalance,
      })
    );
  }

  const bestOption = scenarios.reduce((best, current) =>
    current.netCost < best.netCost ? current : best
  );

  const pointsBreakEven = breakEvenMonths(pointsCost, par.payment - points.payment);
  const pointsMonthlySavings = Math.round(par.payment) - Math.round(points.payment);
  const worstCaseMaxPayment = Math.round(armWorst.maxPayment);
  const worstCaseRate = armWorst.maxRate;
  const worstCaseYear = armWorst.maxRateMonth > 0 ? Math.ceil(armWorst.maxRateMonth / 12) : loanTerm;
  const fullyIndexedRate = expectedIndexRate + armMargin;

  const insights: string[] = [];

  insights.push(
    `For a ${expectedYearsInHome}-year stay, net cost (payments + upfront − equity built) matters more than the rate. Best option: ${bestOption.option} at ${formatCurrency(bestOption.netCost)}.`
  );

  if (expectedYearsInHome <= armFixedPeriod) {
    insights.push(
      `You plan to move before the ${productName} adjusts (year ${armFixedPeriod}), so the lower rate (${armInitialRate}%) carries no adjustment risk for you.`
    );
  } else {
    insights.push(
      `⚠️ ${productName} adjusts starting year ${armFixedPeriod + 1}: at a ${expectedIndexRate}% index + ${armMargin}% margin (capped), the rate becomes ${armExpected.adjustedRate.toFixed(2)}% and the payment rises from ${formatCurrency(armExpected.initialPayment)} to ${formatCurrency(armExpected.adjustedPayment)}/month before you move.`
    );
  }

  insights.push(
    `Rate-path range: falling index (${fallingIndex.toFixed(2)}%) pays ${formatCurrency(armFalling.totalPaid)} over your stay; rising index (${risingIndex.toFixed(2)}%) pays ${formatCurrency(armRising.totalPaid)}`
  );

  insights.push(
    `Monte Carlo (${samples} seeded index paths, ${ARM_RATE_PATH_ASSUMPTIONS.indexVolPercent}% annual vol, mean-reverting to ${expectedIndexRate}%): ARM costs less than the ${loanTerm}-year fixed in ${pctArmCheaper}% of paths over a ${expectedYearsInHome}-year stay. Total paid P10–P90: ${formatCurrency(p10TotalPaid)}–${formatCurrency(p90TotalPaid)}`
  );

  insights.push(
    `⚠️ Worst case from your ${capStructure} caps: rate reaches ${worstCaseRate.toFixed(2)}% by year ${worstCaseYear}, pushing the payment to ${formatCurrency(worstCaseMaxPayment)}/month`
  );

  if (Number.isFinite(pointsBreakEven) && pointsMonthlySavings > 0) {
    const breakEvenYears = pointsBreakEven / 12;
    insights.push(
      breakEvenYears < expectedYearsInHome
        ? `Buying points breaks even in ${breakEvenYears.toFixed(1)} years — worth it for your ${expectedYearsInHome}-year timeline.`
        : `Buying points breaks even in ${breakEvenYears.toFixed(1)} years — longer than your ${expectedYearsInHome}-year timeline, so skip the points.`
    );
  } else {
    insights.push('Points at this rate produce no monthly savings — skip them.');
  }

  if (buydown) {
    insights.push(
      `${buydownType} buydown: Payments start at ${formatCurrency(buydown.year1Payment)}/month and step up to the par payment. The ${formatCurrency(buydown.subsidy)} subsidy is usually seller- or builder-paid.`
    );
  }

  const fifteenScenario = scenarios.find((s) => s.option === '15-Year Fixed')!;
  insights.push(
    `The 15-year fixed costs ${formatCurrency(fifteenScenario.initialPayment)}/month but builds ${formatCurrency(fifteenScenario.principalPaid)} of equity by the time you move — the highest of any option.`
  );

  const armSchedule = armExpected.schedule.map((p, i) => ({
    year: p.year,
    armRate: Math.round(p.rate * 100000) / 100000,
    armPayment: p.payment,
    fixedPayment: Math.round(par.payment),
    fallingPayment: armFalling.schedule[i]?.payment ?? p.payment,
    fallingRate: armFalling.schedule[i]?.rate ?? p.rate,
    risingPayment: armRising.schedule[i]?.payment ?? p.payment,
    risingRate: armRising.schedule[i]?.rate ?? p.rate,
    worstRate: armWorst.schedule[i]?.rate ?? p.rate,
    worstPayment: armWorst.schedule[i]?.payment ?? p.payment,
    p10Payment: Math.round(percentile(yearlyPayments[i], 10)),
    p50Payment: Math.round(percentile(yearlyPayments[i], 50)),
    p90Payment: Math.round(percentile(yearlyPayments[i], 90)),
  }));

  const parEnding = Math.round(par.balance);
  const pointsEnding = Math.round(points.balance);
  const parTotalCost = netCostOf(par.totalPaid, 0, par.balance);
  const pointsTotalCost = netCostOf(points.totalPaid, pointsCost, points.balance);
  const creditTotalCost = netCostOf(credit.totalPaid, -lenderCredit, credit.balance);

  const chartRows: Array<Record<string, number | string>> = [
    {
      option: `${loanTerm}-Year Fixed (Par)`,
      monthlyPayment: Math.round(par.payment),
      upfrontCost: 0,
      totalPaid: Math.round(par.totalPaid),
      remainingBalance: parEnding,
      endingBalance: parEnding,
      netCost: parTotalCost,
      totalCost: parTotalCost,
    },
    {
      option: `${loanTerm}-Year Fixed (Points)`,
      monthlyPayment: Math.round(points.payment),
      upfrontCost: pointsCost,
      totalPaid: Math.round(points.totalPaid),
      remainingBalance: pointsEnding,
      endingBalance: pointsEnding,
      netCost: pointsTotalCost,
      totalCost: pointsTotalCost,
    },
    {
      option: productName,
      monthlyPayment: Math.round(armExpected.initialPayment),
      upfrontCost: 0,
      totalPaid: Math.round(armExpected.totalPaid),
      remainingBalance: Math.round(armExpected.balance),
      endingBalance: Math.round(armExpected.balance),
      netCost: netCostOf(armExpected.totalPaid, 0, armExpected.balance),
      totalCost: netCostOf(armExpected.totalPaid, 0, armExpected.balance),
    },
    {
      option: `${armFixedPeriod}-Year ARM`,
      monthlyPayment: Math.round(armExpected.initialPayment),
      upfrontCost: 0,
      totalPaid: Math.round(armExpected.totalPaid),
      remainingBalance: Math.round(armExpected.balance),
      endingBalance: Math.round(armExpected.balance),
      netCost: netCostOf(armExpected.totalPaid, 0, armExpected.balance),
      totalCost: netCostOf(armExpected.totalPaid, 0, armExpected.balance),
    },
    {
      option: '15-Year Fixed',
      monthlyPayment: Math.round(fifteen.payment),
      upfrontCost: 0,
      totalPaid: Math.round(fifteen.totalPaid),
      remainingBalance: Math.round(fifteen.balance),
      endingBalance: Math.round(fifteen.balance),
      netCost: netCostOf(fifteen.totalPaid, 0, fifteen.balance),
      totalCost: netCostOf(fifteen.totalPaid, 0, fifteen.balance),
    },
    {
      option: 'Par Rate',
      monthlyPayment: Math.round(par.payment),
      upfrontCost: 0,
      totalPaid: Math.round(par.totalPaid),
      remainingBalance: parEnding,
      endingBalance: parEnding,
      netCost: parTotalCost,
      totalCost: parTotalCost,
    },
    {
      option: 'Buy Points',
      monthlyPayment: Math.round(points.payment),
      upfrontCost: pointsCost,
      totalPaid: Math.round(points.totalPaid),
      remainingBalance: pointsEnding,
      endingBalance: pointsEnding,
      netCost: pointsTotalCost,
      totalCost: pointsTotalCost,
    },
    {
      option: 'Lender Credit',
      monthlyPayment: Math.round(credit.payment),
      upfrontCost: -lenderCredit,
      totalPaid: Math.round(credit.totalPaid),
      remainingBalance: Math.round(credit.balance),
      endingBalance: Math.round(credit.balance),
      netCost: creditTotalCost,
      totalCost: creditTotalCost,
    },
  ];

  if (buydown) {
    const buydownCost = netCostOf(buydown.totalPaid, Math.round(buydown.subsidy), buydown.endingBalance);
    chartRows.push({
      option: `${buydownType} Buydown`,
      monthlyPayment: Math.round(buydown.year1Payment),
      upfrontCost: Math.round(buydown.subsidy),
      totalPaid: Math.round(buydown.totalPaid),
      remainingBalance: Math.round(buydown.endingBalance),
      endingBalance: Math.round(buydown.endingBalance),
      netCost: buydownCost,
      totalCost: buydownCost,
    });
  }

  const summary = `For a ${expectedYearsInHome}-year stay, ${bestOption.option} has the lowest net cost at ${formatCurrency(bestOption.netCost)} (payments + upfront costs − equity built).`;

  return {
    summary,
    details: {
      loanAmount,
      expectedYearsInHome,
      expectedMoveYear: expectedYearsInHome,
      yearsToHold: expectedYearsInHome,
      bestOption: bestOption.option,
      bestNetCost: bestOption.netCost,
      bestTotalCost: bestOption.netCost,
      bestInitialPayment: bestOption.initialPayment,
      bestPayment: bestOption.initialPayment,
      bestBalance: bestOption.remainingBalance,
      bestTotalPaid: bestOption.totalPaidDuringHold,
      fixedPayment: Math.round(par.payment),
      parPayment: Math.round(par.payment),
      parEndingBalance: parEnding,
      pointsPayment: Math.round(points.payment),
      pointsEndingBalance: pointsEnding,
      pointsMonthlySavings,
      armPayment: Math.round(armExpected.initialPayment),
      armInitialPayment: Math.round(armExpected.initialPayment),
      armTotalPaid: Math.round(armExpected.totalPaid),
      armMaxPaymentDuringHold: Math.round(armExpected.holdMaxPayment),
      armAdjusts: armExpected.adjusts ? 1 : 0,
      armAdjustedRate: Number(armExpected.adjustedRate.toFixed(3)),
      armAdjustedPayment: Math.round(armExpected.adjustedPayment),
      armWorstCasePayment: worstCaseMaxPayment,
      fixedTotalPaid: Math.round(par.totalPaid),
      savingsInFixedPeriod: Math.round((par.payment - armExpected.initialPayment) * armFixedPeriod * 12),
      fallingIndex: Number(fallingIndex.toFixed(3)),
      fallingTotalPaid: Math.round(armFalling.totalPaid),
      fallingMaxPayment: Math.round(armFalling.holdMaxPayment),
      fallingMaxRate: Number(armFalling.maxRate.toFixed(3)),
      risingIndex: Number(risingIndex.toFixed(3)),
      risingTotalPaid: Math.round(armRising.totalPaid),
      risingMaxPayment: Math.round(armRising.holdMaxPayment),
      risingMaxRate: Number(armRising.maxRate.toFixed(3)),
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
      fifteenYearPayment: Math.round(fifteen.payment),
      pointsBreakEvenMonths: Number.isFinite(pointsBreakEven) ? Math.round(pointsBreakEven) : 0,
      pointsCost,
      productName,
      capStructure,
      adjustmentFrequency: armAdjustmentFrequency,
      fullyIndexedRate: Number(fullyIndexedRate.toFixed(3)),
      worstCaseRate: Number(worstCaseRate.toFixed(3)),
      worstCasePayment: worstCaseMaxPayment,
      worstCaseYear,
      buydownCost: buydown ? Math.round(buydown.subsidy) : 0,
    },
    chartData: chartRows,
    insights,
    scenarios,
    armSchedule,
  };
}
