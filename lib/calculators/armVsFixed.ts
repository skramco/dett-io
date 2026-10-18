import type { ArmVsFixedInputs, CalculatorResult } from './types';
import { armAdjustedRate, monthlyPayment, toMonthlyRate } from './mortgageMath';

export function calculateArmVsFixed(inputs: ArmVsFixedInputs): CalculatorResult {
  const {
    loanAmount,
    fixedRate,
    armInitialRate,
    armFixedPeriod,
    armAdjustmentCap,
    armLifetimeCap,
    armMargin,
    loanTerm,
    expectedIndexRate,
  } = inputs;

  const numPayments = loanTerm * 12;
  const fixedMonthlyRate = toMonthlyRate(fixedRate);
  
  // Fixed rate calculation
  const fixedPayment = monthlyPayment(loanAmount, fixedRate, numPayments);
  
  let fixedBalance = loanAmount;
  let fixedTotalPaid = 0;
  
  for (let month = 1; month <= numPayments; month++) {
    const interest = fixedBalance * fixedMonthlyRate;
    const principal = fixedPayment - interest;
    fixedBalance -= principal;
    fixedTotalPaid += fixedPayment;
  }

  // ARM calculation with rate adjustments
  let armBalance = loanAmount;
  let armTotalPaid = 0;
  let currentArmRate = armInitialRate;
  const armPayments = [];
  
  for (let month = 1; month <= numPayments; month++) {
    // Adjust rate after fixed period
    if (month > armFixedPeriod * 12 && month % 12 === 1) {
      currentArmRate = armAdjustedRate(
        currentArmRate,
        expectedIndexRate,
        armMargin,
        armAdjustmentCap,
        armInitialRate,
        armLifetimeCap
      );
    }
    
    const monthlyRate = toMonthlyRate(currentArmRate);
    const remainingMonths = numPayments - month + 1;
    const payment = monthlyPayment(armBalance, currentArmRate, remainingMonths);
    
    const interest = armBalance * monthlyRate;
    const principal = payment - interest;
    armBalance -= principal;
    armTotalPaid += payment;
    
    if (month % 12 === 0) {
      armPayments.push({
        year: month / 12,
        rate: currentArmRate,
        payment: Math.round(payment),
      });
    }
  }

  // Worst case scenario (max rate from start)
  const worstCaseRate = Math.min(armInitialRate + armLifetimeCap, fixedRate + 3);
  const worstPayment = monthlyPayment(loanAmount, worstCaseRate, numPayments);

  const initialSavings = fixedPayment - monthlyPayment(loanAmount, armInitialRate, numPayments);
  const savingsOverFixedPeriod = initialSavings * armFixedPeriod * 12;

  const insights: string[] = [];
  
  insights.push(
    `Fixed rate: $${Math.round(fixedPayment).toLocaleString()}/month for ${loanTerm} years - predictable and stable`
  );
  
  insights.push(
    `ARM: Starts at $${armPayments[0].payment.toLocaleString()}/month, saves $${Math.round(savingsOverFixedPeriod).toLocaleString()} in first ${armFixedPeriod} years`
  );

  if (armTotalPaid < fixedTotalPaid) {
    insights.push(
      `Expected case: ARM saves $${Math.round(fixedTotalPaid - armTotalPaid).toLocaleString()} total (assumes ${expectedIndexRate}% index)`
    );
  } else {
    insights.push(
      `Expected case: Fixed saves $${Math.round(armTotalPaid - fixedTotalPaid).toLocaleString()} total (assumes ${expectedIndexRate}% index)`
    );
  }

  insights.push(
    `⚠️ Worst case: ARM payment could reach $${Math.round(worstPayment).toLocaleString()}/month if rates spike`
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

  const summary = `ARM starts ${((fixedPayment - armPayments[0].payment) / fixedPayment * 100).toFixed(1)}% cheaper but carries rate risk after year ${armFixedPeriod}.`;

  return {
    summary,
    details: {
      loanAmount,
      fixedRate,
      fixedPayment: Math.round(fixedPayment),
      fixedTotalPaid: Math.round(fixedTotalPaid),
      armInitialRate,
      armInitialPayment: armPayments[0].payment,
      armTotalPaid: Math.round(armTotalPaid),
      worstCaseRate,
      worstCasePayment: Math.round(worstPayment),
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
