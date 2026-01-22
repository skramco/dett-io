import type { RecastVsRefinanceInputs, CalculatorResult } from './types';

export function calculateRecastVsRefi(inputs: RecastVsRefinanceInputs): CalculatorResult {
  const {
    currentBalance,
    currentRate,
    yearsRemaining,
    lumpSumAmount,
    recastFee,
    newRate,
    newTerm,
    closingCosts,
  } = inputs;

  const currentMonthlyRate = currentRate / 100 / 12;
  const currentPayments = yearsRemaining * 12;
  
  // Current payment
  const currentPayment = currentBalance * (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentPayments)) / 
                        (Math.pow(1 + currentMonthlyRate, currentPayments) - 1);

  // Recast scenario
  const recastBalance = currentBalance - lumpSumAmount;
  const recastPayment = recastBalance * (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentPayments)) / 
                       (Math.pow(1 + currentMonthlyRate, currentPayments) - 1);
  const recastTotalPaid = (recastPayment * currentPayments) + lumpSumAmount + recastFee;
  const recastTotalInterest = recastTotalPaid - currentBalance;

  // Refinance scenario
  const refiBalance = currentBalance - lumpSumAmount;
  const refiMonthlyRate = newRate / 100 / 12;
  const refiPayments = newTerm * 12;
  const refiPayment = refiBalance * (refiMonthlyRate * Math.pow(1 + refiMonthlyRate, refiPayments)) / 
                     (Math.pow(1 + refiMonthlyRate, refiPayments) - 1);
  const refiTotalPaid = (refiPayment * refiPayments) + lumpSumAmount + closingCosts;
  const refiTotalInterest = refiTotalPaid - currentBalance;

  // Principal prepayment (no recast)
  const prepayBalance = currentBalance - lumpSumAmount;
  let prepayTotalPaid = lumpSumAmount;
  let balance = prepayBalance;
  let monthsToPayoff = 0;
  
  while (balance > 0 && monthsToPayoff < currentPayments) {
    const interest = balance * currentMonthlyRate;
    const principal = currentPayment - interest;
    balance -= principal;
    prepayTotalPaid += currentPayment;
    monthsToPayoff++;
  }
  const prepayTotalInterest = prepayTotalPaid - currentBalance;

  const monthlySavings = {
    recast: currentPayment - recastPayment,
    refi: currentPayment - refiPayment,
    prepay: 0, // Same payment, just pays off faster
  };

  const insights: string[] = [];
  
  insights.push(
    `Recast: Pay $${recastFee.toLocaleString()} fee, lower payment to $${Math.round(recastPayment).toLocaleString()}/month (saves $${Math.round(monthlySavings.recast).toLocaleString()}/month)`
  );
  
  insights.push(
    `Refinance: Pay $${closingCosts.toLocaleString()} costs, new payment $${Math.round(refiPayment).toLocaleString()}/month at ${newRate}%`
  );

  insights.push(
    `Prepay only: Keep $${Math.round(currentPayment).toLocaleString()}/month payment, pay off ${Math.round((currentPayments - monthsToPayoff) / 12)} years early`
  );

  const bestOption = [
    { name: 'Recast', totalInterest: recastTotalInterest, totalCost: recastTotalPaid },
    { name: 'Refinance', totalInterest: refiTotalInterest, totalCost: refiTotalPaid },
    { name: 'Prepay Only', totalInterest: prepayTotalInterest, totalCost: prepayTotalPaid },
  ].reduce((best, current) => current.totalInterest < best.totalInterest ? current : best);

  insights.push(
    `Best for total interest: ${bestOption.name} ($${Math.round(bestOption.totalInterest).toLocaleString()} interest)`
  );

  if (newRate < currentRate - 0.5) {
    insights.push(
      `💡 Refinancing makes sense - you're dropping rate from ${currentRate}% to ${newRate}%`
    );
  } else if (recastFee < 1000) {
    insights.push(
      `💡 Recast is cheap ($${recastFee}) and gives you flexibility with lower payments`
    );
  } else {
    insights.push(
      `💡 Simple prepayment saves the most interest without fees`
    );
  }

  const summary = `${bestOption.name} saves the most interest. Recast gives flexibility, prepayment is simplest, refi works if rate drops significantly.`;

  return {
    summary,
    details: {
      currentBalance,
      currentPayment: Math.round(currentPayment),
      lumpSumAmount,
      recastPayment: Math.round(recastPayment),
      recastFee,
      recastInterest: Math.round(recastTotalInterest),
      refiPayment: Math.round(refiPayment),
      refiCosts: closingCosts,
      refiInterest: Math.round(refiTotalInterest),
      prepayMonthsSaved: currentPayments - monthsToPayoff,
      prepayInterest: Math.round(prepayTotalInterest),
    },
    chartData: [
      { option: 'Current', payment: Math.round(currentPayment), totalInterest: Math.round(currentPayment * currentPayments - currentBalance) },
      { option: 'Recast', payment: Math.round(recastPayment), totalInterest: Math.round(recastTotalInterest) },
      { option: 'Refinance', payment: Math.round(refiPayment), totalInterest: Math.round(refiTotalInterest) },
      { option: 'Prepay Only', payment: Math.round(currentPayment), totalInterest: Math.round(prepayTotalInterest) },
    ],
    insights,
  };
}
