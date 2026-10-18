import type { TimelineSimulatorInputs, CalculatorResult } from './types';
import { armAdjustedRate, monthlyInterest, monthlyPayment, remainingBalance } from './mortgageMath';

const LOAN_TERM_YEARS = 30;
/** Timeline Simulator models a traditional annual (5/1-style) reset after the fixed period. */
const ARM_ADJUSTMENT_FREQUENCY_MONTHS = 12;

interface ScenarioOutcome {
  payment: number;       // initial monthly payment
  totalPaid: number;     // sum of all payments made during the hold
  balance: number;       // remaining balance when you move
  netCost: number;       // payments + closing costs − equity built
}

function simulateFixed(
  loanAmount: number,
  annualRate: number,
  termMonths: number,
  holdMonths: number,
  closingCosts: number
): ScenarioOutcome {
  const months = Math.min(holdMonths, termMonths);
  const payment = monthlyPayment(loanAmount, annualRate, termMonths);
  const totalPaid = payment * months;
  const balance = remainingBalance(loanAmount, annualRate, termMonths, months);
  const equityBuilt = loanAmount - balance;
  return { payment, totalPaid, balance, netCost: totalPaid + closingCosts - equityBuilt };
}

interface ArmOutcome extends ScenarioOutcome {
  adjustedRate: number;     // rate in effect at the end of the hold
  adjustedPayment: number;  // payment in effect at the end of the hold
  adjusts: boolean;         // whether the rate reset before the move
}

function simulateArm(
  loanAmount: number,
  initialRate: number,
  fixedPeriodYears: number,
  indexRate: number,
  margin: number,
  adjustmentCap: number,
  lifetimeCap: number,
  termMonths: number,
  holdMonths: number
): ArmOutcome {
  const initialPayment = monthlyPayment(loanAmount, initialRate, termMonths);
  const fixedMonths = Math.min(fixedPeriodYears * 12, termMonths);
  const months = Math.min(holdMonths, termMonths);

  let balance = loanAmount;
  let totalPaid = 0;
  let currentRate = initialRate;
  let currentPayment = initialPayment;

  for (let month = 1; month <= months; month++) {
    const isAdjustmentMonth =
      month > fixedMonths && (month - fixedMonths - 1) % ARM_ADJUSTMENT_FREQUENCY_MONTHS === 0;

    if (isAdjustmentMonth) {
      currentRate = armAdjustedRate(
        currentRate,
        indexRate,
        margin,
        adjustmentCap,
        initialRate,
        lifetimeCap
      );
      currentPayment = monthlyPayment(balance, currentRate, termMonths - month + 1);
    }

    const interest = monthlyInterest(balance, currentRate);
    balance -= currentPayment - interest;
    totalPaid += currentPayment;
  }
  balance = Math.max(0, balance);

  const equityBuilt = loanAmount - balance;
  return {
    payment: initialPayment,
    totalPaid,
    balance,
    netCost: totalPaid - equityBuilt,
    adjustedRate: currentRate,
    adjustedPayment: currentPayment,
    adjusts: months > fixedMonths,
  };
}

export function calculateTimelineSimulator(inputs: TimelineSimulatorInputs): CalculatorResult {
  const {
    loanAmount,
    interestRate,
    expectedMoveYear,
    armInitialRate,
    armFixedPeriod,
    armMargin,
    expectedIndexRate,
    armAdjustmentCap,
    armLifetimeCap,
    pointsCost,
    pointsRate,
  } = inputs;

  const termMonths = LOAN_TERM_YEARS * 12;
  const holdMonths = expectedMoveYear * 12;

  // Scenario 1: 30-year fixed at par
  const fixed = simulateFixed(loanAmount, interestRate, termMonths, holdMonths, 0);

  // Scenario 2: 30-year fixed with points (points cost counts as closing cost)
  const points = simulateFixed(loanAmount, pointsRate, termMonths, holdMonths, pointsCost);

  // Scenario 3: ARM — rate resets to index + margin (capped) after the fixed period
  const arm = simulateArm(
    loanAmount,
    armInitialRate,
    armFixedPeriod,
    expectedIndexRate,
    armMargin,
    armAdjustmentCap,
    armLifetimeCap,
    termMonths,
    holdMonths
  );

  // Scenario 4: 15-year fixed (typically ~0.5% below the 30-year rate)
  const fifteenYearRate = interestRate - 0.5;
  const fifteen = simulateFixed(loanAmount, fifteenYearRate, 15 * 12, holdMonths, 0);

  const results = [
    { name: '30-Year Fixed (Par)', rate: interestRate, ...fixed },
    { name: '30-Year Fixed (Points)', rate: pointsRate, ...points },
    { name: `${armFixedPeriod}-Year ARM`, rate: armInitialRate, ...arm },
    { name: '15-Year Fixed', rate: fifteenYearRate, ...fifteen },
  ];

  // Best option = lowest net cost (payments + closing costs − equity built),
  // matching the documented formula.
  const bestOption = results.reduce((best, current) =>
    current.netCost < best.netCost ? current : best
  );

  const fullyIndexedRate = expectedIndexRate + armMargin;
  const cappedAdjustedRate = arm.adjustedRate;

  const insights: string[] = [];

  insights.push(
    `Planning to move in ${expectedMoveYear} years: Net cost (payments + closing costs − equity built) matters more than rate`
  );

  if (expectedMoveYear <= armFixedPeriod) {
    insights.push(
      `ARM's ${armInitialRate}% rate is locked through year ${armFixedPeriod} - you'd move before it adjusts`
    );
  } else {
    insights.push(
      `⚠️ ARM adjusts in year ${armFixedPeriod + 1}: at a ${expectedIndexRate}% index + ${armMargin}% margin (capped), the rate becomes ${cappedAdjustedRate.toFixed(2)}% and the payment rises from $${Math.round(arm.payment).toLocaleString()} to $${Math.round(arm.adjustedPayment).toLocaleString()}/month before you move`
    );
    if (fullyIndexedRate > cappedAdjustedRate) {
      insights.push(
        `Rate caps limit the first reset to ${cappedAdjustedRate.toFixed(2)}% (fully-indexed rate would be ${fullyIndexedRate.toFixed(2)}%) - later resets could go higher`
      );
    }
  }

  const pointsBreakEven = pointsCost / (fixed.payment - points.payment);
  if (pointsBreakEven / 12 < expectedMoveYear) {
    insights.push(
      `Buying points breaks even in ${(pointsBreakEven / 12).toFixed(1)} years - worth it for your ${expectedMoveYear}-year timeline`
    );
  } else {
    insights.push(
      `Buying points breaks even in ${(pointsBreakEven / 12).toFixed(1)} years - too long for your ${expectedMoveYear}-year timeline`
    );
  }

  if (bestOption.name === '15-Year Fixed') {
    insights.push(
      `15-Year Fixed wins on net cost because it builds equity fastest - but the payment is $${Math.round(fifteen.payment).toLocaleString()}/month vs $${Math.round(fixed.payment).toLocaleString()} for the 30-year. Make sure it fits your budget`
    );
  } else if (expectedMoveYear <= 7 && fifteen.payment < fixed.payment * 1.3) {
    insights.push(
      `15-year option: Higher payment ($${Math.round(fifteen.payment).toLocaleString()}) but builds equity faster and lower rate`
    );
  }

  const displayedNetCost = (option: { name: string; totalPaid: number; balance: number }) => {
    const totalPaid = Math.round(option.totalPaid);
    const remainingBalance = Math.round(option.balance);
    const closing = option.name === '30-Year Fixed (Points)' ? pointsCost : 0;
    return totalPaid + closing - (loanAmount - remainingBalance);
  };
  const bestNetCost = displayedNetCost(bestOption);

  insights.push(
    `Best for ${expectedMoveYear} years: ${bestOption.name} (net cost: $${bestNetCost.toLocaleString()})`
  );

  const summary = `For a ${expectedMoveYear}-year hold, ${bestOption.name} has the lowest net cost at $${bestNetCost.toLocaleString()} (payments + closing costs − equity built).`;

  return {
    summary,
    details: {
      loanAmount,
      expectedMoveYear,
      bestOption: bestOption.name,
      bestPayment: Math.round(bestOption.payment),
      bestNetCost,
      bestTotalPaid: Math.round(bestOption.totalPaid),
      bestBalance: Math.round(bestOption.balance),
      fixedPayment: Math.round(fixed.payment),
      armPayment: Math.round(arm.payment),
      armAdjusts: arm.adjusts ? 1 : 0,
      armAdjustedRate: Number(arm.adjustedRate.toFixed(3)),
      armAdjustedPayment: Math.round(arm.adjustedPayment),
    },
    chartData: results.map(r => {
      const totalPaid = Math.round(r.totalPaid);
      const remainingBalance = Math.round(r.balance);
      return {
        option: r.name,
        monthlyPayment: Math.round(r.payment),
        totalPaid,
        remainingBalance,
        netCost: displayedNetCost(r),
      };
    }),
    insights,
  };
}
