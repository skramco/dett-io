import type { TimelineSimulatorInputs, CalculatorResult } from './types';
import { monthlyPayment, monthlyRate as calcMonthlyRate } from './mortgageMath';

export function calculateTimelineSimulator(inputs: TimelineSimulatorInputs): CalculatorResult {
  const {
    loanAmount,
    interestRate,
    expectedMoveYear,
    refiLikelihood,
    armInitialRate,
    armFixedPeriod,
    pointsCost,
    pointsRate,
  } = inputs;

  const loanTerm = 30;
  const numPayments = loanTerm * 12;
  const holdMonths = expectedMoveYear * 12;

  // Scenario 1: 30-year fixed at par
  const fixedPayment = monthlyPayment(loanAmount, interestRate, numPayments);
  const fixedTotalPaid = fixedPayment * holdMonths;

  // Scenario 2: 30-year fixed with points
  const pointsPayment = monthlyPayment(loanAmount, pointsRate, numPayments);
  const pointsTotalPaid = (pointsPayment * holdMonths) + pointsCost;

  // Scenario 3: ARM
  const armPayment = monthlyPayment(loanAmount, armInitialRate, numPayments);
  const armTotalPaid = armPayment * holdMonths;

  // Scenario 4: 15-year fixed (if moving soon, shorter term might work)
  const fifteenYearRate = interestRate - 0.5; // Typically 0.5% lower
  const fifteenPayments = 15 * 12;
  const fifteenPayment = monthlyPayment(loanAmount, fifteenYearRate, fifteenPayments);
  const fifteenTotalPaid = fifteenPayment * Math.min(holdMonths, fifteenPayments);

  // Calculate remaining balance at move time for each scenario
  const calculateBalance = (payment: number, rate: number, months: number) => {
    let balance = loanAmount;
    const monthlyRate = calcMonthlyRate(rate);
    for (let i = 0; i < months; i++) {
      const interest = balance * monthlyRate;
      const principal = payment - interest;
      balance -= principal;
    }
    return balance;
  };

  const fixedBalance = calculateBalance(fixedPayment, interestRate, holdMonths);
  const pointsBalance = calculateBalance(pointsPayment, pointsRate, holdMonths);
  const armBalance = calculateBalance(armPayment, armInitialRate, holdMonths);
  const fifteenBalance = holdMonths < fifteenPayments ? calculateBalance(fifteenPayment, fifteenYearRate, holdMonths) : 0;

  const results = [
    { name: '30-Year Fixed (Par)', payment: fixedPayment, totalPaid: fixedTotalPaid, balance: fixedBalance, rate: interestRate },
    { name: '30-Year Fixed (Points)', payment: pointsPayment, totalPaid: pointsTotalPaid, balance: pointsBalance, rate: pointsRate },
    { name: `${armFixedPeriod}-Year ARM`, payment: armPayment, totalPaid: armTotalPaid, balance: armBalance, rate: armInitialRate },
    { name: '15-Year Fixed', payment: fifteenPayment, totalPaid: fifteenTotalPaid, balance: fifteenBalance, rate: fifteenYearRate },
  ];

  const bestOption = results.reduce((best, current) => 
    current.totalPaid < best.totalPaid ? current : best
  );

  const insights: string[] = [];
  
  insights.push(
    `Planning to move in ${expectedMoveYear} years: Total cost matters more than rate`
  );

  if (expectedMoveYear <= armFixedPeriod) {
    insights.push(
      `ARM wins for ${expectedMoveYear}-year hold: Lower rate (${armInitialRate}%), no adjustment risk before you move`
    );
  } else {
    insights.push(
      `⚠️ ARM adjusts in year ${armFixedPeriod} - you'll face rate risk before moving`
    );
  }

  const pointsBreakEven = pointsCost / (fixedPayment - pointsPayment);
  if (pointsBreakEven / 12 < expectedMoveYear) {
    insights.push(
      `Buying points breaks even in ${(pointsBreakEven / 12).toFixed(1)} years - worth it for your ${expectedMoveYear}-year timeline`
    );
  } else {
    insights.push(
      `Buying points breaks even in ${(pointsBreakEven / 12).toFixed(1)} years - too long for your ${expectedMoveYear}-year timeline`
    );
  }

  if (refiLikelihood > 50 && expectedMoveYear > 3) {
    insights.push(
      `💡 High refi likelihood (${refiLikelihood}%): Consider ARM or par rate - you might refi before points pay off`
    );
  }

  if (expectedMoveYear <= 7 && fifteenPayment < fixedPayment * 1.3) {
    insights.push(
      `15-year option: Higher payment ($${Math.round(fifteenPayment).toLocaleString()}) but builds equity faster and lower rate`
    );
  }

  insights.push(
    `Best for ${expectedMoveYear} years: ${bestOption.name} (total cost: $${Math.round(bestOption.totalPaid).toLocaleString()})`
  );

  const summary = `For a ${expectedMoveYear}-year hold, ${bestOption.name} costs least at $${Math.round(bestOption.totalPaid).toLocaleString()} total.`;

  return {
    summary,
    details: {
      loanAmount,
      expectedMoveYear,
      refiLikelihood,
      bestOption: bestOption.name,
      bestPayment: Math.round(bestOption.payment),
      bestTotalCost: Math.round(bestOption.totalPaid),
      bestBalance: Math.round(bestOption.balance),
      fixedPayment: Math.round(fixedPayment),
      armPayment: Math.round(armPayment),
    },
    chartData: results.map(r => ({
      option: r.name,
      monthlyPayment: Math.round(r.payment),
      totalPaid: Math.round(r.totalPaid),
      remainingBalance: Math.round(r.balance),
    })),
    insights,
  };
}
