import type { TimelineSimulatorInputs, CalculatorResult } from './types';

function monthlyPayment(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 100 / 12;
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

interface ScenarioResult {
  name: string;
  payment: number; // initial monthly payment
  totalPaid: number;
  balance: number;
  netCost: number; // payments + upfront costs − equity built
  rate: number;
}

export function calculateTimelineSimulator(inputs: TimelineSimulatorInputs): CalculatorResult {
  const {
    loanAmount,
    interestRate,
    expectedMoveYear,
    armInitialRate,
    armFixedPeriod,
    armIndexRate,
    armMargin,
    armAdjustmentCap,
    armLifetimeCap,
    pointsCost,
    pointsRate,
  } = inputs;

  const loanTerm = 30;
  const numPayments = loanTerm * 12;
  const holdMonths = Math.min(expectedMoveYear * 12, numPayments);

  // Amortize a fixed-rate loan over the holding period
  const simulateFixed = (rate: number, termMonths: number): { payment: number; totalPaid: number; balance: number } => {
    const payment = monthlyPayment(loanAmount, rate, termMonths);
    const r = rate / 100 / 12;
    const months = Math.min(holdMonths, termMonths);
    let balance = loanAmount;
    for (let i = 0; i < months; i++) {
      balance -= payment - balance * r;
    }
    return { payment, totalPaid: payment * months, balance: Math.max(balance, 0) };
  };

  // Scenario 1: 30-year fixed at par
  const fixed = simulateFixed(interestRate, numPayments);

  // Scenario 2: 30-year fixed with points
  const points = simulateFixed(pointsRate, numPayments);

  // Scenario 3: ARM — rate adjusts annually after the fixed period to
  // index + margin, limited by the periodic and lifetime caps. The payment
  // is recast on the remaining balance and term at each adjustment.
  const armInitialPayment = monthlyPayment(loanAmount, armInitialRate, numPayments);
  let armBalance = loanAmount;
  let armTotalPaid = 0;
  let currentArmRate = armInitialRate;
  let armCurrentPayment = armInitialPayment;
  for (let month = 1; month <= holdMonths; month++) {
    if (month > armFixedPeriod * 12 && month % 12 === 1) {
      const indexedRate = armIndexRate + armMargin;
      const periodicMax = currentArmRate + armAdjustmentCap;
      const lifetimeMax = armInitialRate + armLifetimeCap;
      currentArmRate = Math.min(indexedRate, periodicMax, lifetimeMax);
      armCurrentPayment = monthlyPayment(armBalance, currentArmRate, numPayments - month + 1);
    }
    const interest = armBalance * (currentArmRate / 100 / 12);
    armBalance -= armCurrentPayment - interest;
    armTotalPaid += armCurrentPayment;
  }
  armBalance = Math.max(armBalance, 0);

  // Scenario 4: 15-year fixed (typically ~0.5% below the 30-year rate)
  const fifteenYearRate = interestRate - 0.5;
  const fifteen = simulateFixed(fifteenYearRate, 15 * 12);

  // Net cost = payments made + upfront costs − equity built (principal paid)
  const netCost = (totalPaid: number, balance: number, upfront = 0) =>
    totalPaid + upfront - (loanAmount - balance);

  const results: ScenarioResult[] = [
    { name: '30-Year Fixed (Par)', payment: fixed.payment, totalPaid: fixed.totalPaid, balance: fixed.balance, netCost: netCost(fixed.totalPaid, fixed.balance), rate: interestRate },
    { name: '30-Year Fixed (Points)', payment: points.payment, totalPaid: points.totalPaid + pointsCost, balance: points.balance, netCost: netCost(points.totalPaid, points.balance, pointsCost), rate: pointsRate },
    { name: `${armFixedPeriod}-Year ARM`, payment: armInitialPayment, totalPaid: armTotalPaid, balance: armBalance, netCost: netCost(armTotalPaid, armBalance), rate: armInitialRate },
    { name: '15-Year Fixed', payment: fifteen.payment, totalPaid: fifteen.totalPaid, balance: fifteen.balance, netCost: netCost(fifteen.totalPaid, fifteen.balance), rate: fifteenYearRate },
  ];

  const bestOption = results.reduce((best, current) =>
    current.netCost < best.netCost ? current : best
  );

  const armAdjusts = expectedMoveYear > armFixedPeriod;
  const armAdjustedRate = armAdjusts ? currentArmRate : armInitialRate;
  const armAdjustedPayment = armAdjusts ? armCurrentPayment : armInitialPayment;

  const insights: string[] = [];

  insights.push(
    `Planning to move in ${expectedMoveYear} years: Net cost (payments + upfront costs − equity built) matters more than rate`
  );

  if (!armAdjusts) {
    insights.push(
      `ARM rate stays fixed through your ${expectedMoveYear}-year hold (${armInitialRate}%) - no adjustment risk before you move`
    );
  } else {
    insights.push(
      `⚠️ ARM adjusts after year ${armFixedPeriod}: at index ${armIndexRate}% + margin ${armMargin}% (capped), the rate becomes ${armAdjustedRate.toFixed(2)}% and the payment rises to $${Math.round(armAdjustedPayment).toLocaleString()}/month`
    );
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

  if (expectedMoveYear <= 7 && fifteen.payment < fixed.payment * 1.3) {
    insights.push(
      `15-year option: Higher payment ($${Math.round(fifteen.payment).toLocaleString()}) but builds equity faster and lower rate`
    );
  }

  insights.push(
    `Best for ${expectedMoveYear} years: ${bestOption.name} (net cost: $${Math.round(bestOption.netCost).toLocaleString()})`
  );

  const summary = `For a ${expectedMoveYear}-year hold, ${bestOption.name} has the lowest net cost at $${Math.round(bestOption.netCost).toLocaleString()} (payments + upfront costs − equity built).`;

  return {
    summary,
    details: {
      loanAmount,
      expectedMoveYear,
      bestOption: bestOption.name,
      bestPayment: Math.round(bestOption.payment),
      bestNetCost: Math.round(bestOption.netCost),
      bestBalance: Math.round(bestOption.balance),
      fixedPayment: Math.round(fixed.payment),
      armPayment: Math.round(armInitialPayment),
      armAdjustedRate: Number(armAdjustedRate.toFixed(2)),
      armAdjustedPayment: Math.round(armAdjustedPayment),
    },
    chartData: results.map(r => ({
      option: r.name,
      monthlyPayment: Math.round(r.payment),
      totalPaid: Math.round(r.totalPaid),
      remainingBalance: Math.round(r.balance),
      netCost: Math.round(r.netCost),
    })),
    insights,
  };
}
