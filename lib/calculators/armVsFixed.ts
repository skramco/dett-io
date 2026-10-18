import type { ArmVsFixedInputs, CalculatorResult } from './types';

/** e.g. "5/6" for a 5-year fixed period adjusting every 6 months, "5/1" for annual adjustments */
export function getArmProductName(armFixedPeriod: number, armAdjustmentFrequency: number): string {
  return `${armFixedPeriod}/${armAdjustmentFrequency === 12 ? 1 : armAdjustmentFrequency}`;
}

export interface WorstCaseStep {
  /** First month (1-indexed) this rate applies */
  month: number;
  rate: number;
}

/**
 * The worst-case rate path implied by the caps alone, assuming the index
 * immediately rises enough that every adjustment hits its cap:
 * - Initial rate holds through the fixed period
 * - First adjustment: +initial cap
 * - Each subsequent adjustment (every `armAdjustmentFrequency` months): +periodic cap
 * - Never above initial rate + lifetime cap
 */
export function getWorstCaseRatePath(inputs: ArmVsFixedInputs): WorstCaseStep[] {
  const { armInitialRate, armFixedPeriod, armAdjustmentFrequency, armInitialCap, armAdjustmentCap, armLifetimeCap, loanTerm } = inputs;
  const numPayments = loanTerm * 12;
  const maxRate = armInitialRate + armLifetimeCap;

  const steps: WorstCaseStep[] = [{ month: 1, rate: armInitialRate }];
  let rate = armInitialRate;
  let month = armFixedPeriod * 12 + 1;
  let isFirstAdjustment = true;

  while (rate < maxRate && month <= numPayments) {
    const newRate = Math.min(rate + (isFirstAdjustment ? armInitialCap : armAdjustmentCap), maxRate);
    if (newRate <= rate) break;
    rate = newRate;
    steps.push({ month, rate });
    month += armAdjustmentFrequency;
    isFirstAdjustment = false;
  }

  return steps;
}

function monthlyPayment(balance: number, annualRate: number, remainingMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return balance / remainingMonths;
  return balance * (r * Math.pow(1 + r, remainingMonths)) / (Math.pow(1 + r, remainingMonths) - 1);
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
  const armName = getArmProductName(armFixedPeriod, armAdjustmentFrequency);
  const lifetimeMaxRate = armInitialRate + armLifetimeCap;

  // Fixed rate calculation
  const fixedPayment = monthlyPayment(loanAmount, fixedRate, numPayments);
  const fixedTotalPaid = fixedPayment * numPayments;

  // ARM expected case: index settles at expectedIndexRate, fully-indexed rate = index + margin,
  // adjustments constrained by initial/periodic/lifetime caps
  let armBalance = loanAmount;
  let armTotalPaid = 0;
  let currentArmRate = armInitialRate;
  let isFirstAdjustment = true;
  const armPayments: Array<{ year: number; rate: number; payment: number }> = [];

  for (let month = 1; month <= numPayments; month++) {
    const monthsSinceFixedEnd = month - armFixedPeriod * 12 - 1;
    if (monthsSinceFixedEnd >= 0 && monthsSinceFixedEnd % armAdjustmentFrequency === 0) {
      const fullyIndexedRate = expectedIndexRate + armMargin;
      const adjustmentCap = isFirstAdjustment ? armInitialCap : armAdjustmentCap;
      const maxThisAdjustment = currentArmRate + adjustmentCap;
      const minThisAdjustment = currentArmRate - adjustmentCap;
      currentArmRate = Math.min(
        Math.max(fullyIndexedRate, minThisAdjustment),
        maxThisAdjustment,
        lifetimeMaxRate
      );
      isFirstAdjustment = false;
    }

    const remainingMonths = numPayments - month + 1;
    const payment = monthlyPayment(armBalance, currentArmRate, remainingMonths);
    const interest = armBalance * (currentArmRate / 100 / 12);
    armBalance -= payment - interest;
    armTotalPaid += payment;

    if (month % 12 === 0) {
      armPayments.push({
        year: month / 12,
        rate: currentArmRate,
        payment: Math.round(payment),
      });
    }
  }

  // Worst case: every adjustment hits its cap until the lifetime cap is reached.
  // Simulated along the actual amortization path (not max rate from day one).
  const worstCasePath = getWorstCaseRatePath(inputs);
  let worstBalance = loanAmount;
  let worstCasePayment = 0;
  let worstCaseMonth = 1;
  let pathIndex = 0;
  let worstRate = worstCasePath[0].rate;

  for (let month = 1; month <= numPayments; month++) {
    if (pathIndex + 1 < worstCasePath.length && month === worstCasePath[pathIndex + 1].month) {
      pathIndex++;
      worstRate = worstCasePath[pathIndex].rate;
    }

    const remainingMonths = numPayments - month + 1;
    const payment = monthlyPayment(worstBalance, worstRate, remainingMonths);
    const interest = worstBalance * (worstRate / 100 / 12);
    worstBalance -= payment - interest;

    if (payment > worstCasePayment + 0.005) {
      worstCasePayment = payment;
      worstCaseMonth = month;
    }
  }

  const worstCaseRate = worstCasePath[worstCasePath.length - 1].rate;
  const worstCaseYear = Math.ceil(worstCasePath[worstCasePath.length - 1].month / 12);

  const armInitialPayment = monthlyPayment(loanAmount, armInitialRate, numPayments);
  const initialSavings = fixedPayment - armInitialPayment;
  const savingsOverFixedPeriod = initialSavings * armFixedPeriod * 12;

  const insights: string[] = [];

  insights.push(
    `Fixed rate: $${Math.round(fixedPayment).toLocaleString()}/month for ${loanTerm} years - predictable and stable`
  );

  insights.push(
    `${armName} ARM: Starts at $${armPayments[0].payment.toLocaleString()}/month, saves $${Math.round(savingsOverFixedPeriod).toLocaleString()} in first ${armFixedPeriod} years`
  );

  if (armTotalPaid < fixedTotalPaid) {
    insights.push(
      `Expected case: ARM saves $${Math.round(fixedTotalPaid - armTotalPaid).toLocaleString()} total (assumes ${expectedIndexRate}% index + ${armMargin}% margin)`
    );
  } else {
    insights.push(
      `Expected case: Fixed saves $${Math.round(armTotalPaid - fixedTotalPaid).toLocaleString()} total (assumes ${expectedIndexRate}% index + ${armMargin}% margin)`
    );
  }

  insights.push(
    `⚠️ Worst case: with ${armInitialCap}/${armAdjustmentCap}/${armLifetimeCap} caps, the rate can reach ${worstCaseRate}% by year ${worstCaseYear}, pushing the payment to $${Math.round(worstCasePayment).toLocaleString()}/month`
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

  const summary = `The ${armName} ARM starts ${((fixedPayment - armPayments[0].payment) / fixedPayment * 100).toFixed(1)}% cheaper but carries rate risk after year ${armFixedPeriod}.`;

  return {
    summary,
    details: {
      loanAmount,
      fixedRate,
      fixedPayment: Math.round(fixedPayment),
      fixedTotalPaid: Math.round(fixedTotalPaid),
      armProductName: `${armName} ARM`,
      armInitialRate,
      armInitialPayment: armPayments[0].payment,
      armTotalPaid: Math.round(armTotalPaid),
      worstCaseRate,
      worstCaseYear,
      worstCaseMonth,
      worstCasePayment: Math.round(worstCasePayment),
      savingsInFixedPeriod: Math.round(savingsOverFixedPeriod),
    },
    chartData: armPayments.map(p => ({
      year: p.year,
      armPayment: p.payment,
      fixedPayment: Math.round(fixedPayment),
      armRate: p.rate,
    })),
    insights,
  };
}
