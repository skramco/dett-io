import { formatCurrency } from '../format';
import type { BiweeklyInputs, CalculatorResult } from './types';
import { monthlyPayment as calcMonthlyPayment, simulateBiweeklyPayoff, toMonthlyRate } from './mortgageMath';

export function calculateBiweekly(inputs: BiweeklyInputs): CalculatorResult {
  const {
    loanAmount,
    interestRate,
    loanTerm,
    biweeklyFee,
  } = inputs;

  const monthlyRate = toMonthlyRate(interestRate);
  const numPayments = loanTerm * 12;
  
  // Monthly payment
  const monthlyPayment = calcMonthlyPayment(loanAmount, interestRate, numPayments);
  
  const monthlyTotalPaid = monthlyPayment * numPayments;
  const monthlyTotalInterest = monthlyTotalPaid - loanAmount;

  // True biweekly (26 payments per year = 13 monthly payments)
  const biweeklyPayment = monthlyPayment / 2;
  const biweeklyResult = simulateBiweeklyPayoff(loanAmount, interestRate, biweeklyPayment, numPayments * 2);
  const biweeklyPaymentCount = biweeklyResult.periods;
  
  const biweeklyTotalInterest = biweeklyResult.totalInterest;
  const biweeklyYears = biweeklyPaymentCount / 26;
  const biweeklyYearsSaved = loanTerm - biweeklyYears;

  // Fake biweekly (24 payments per year = 12 monthly payments)
  const fakeBiweeklyPayment = monthlyPayment / 2;
  const fakeBiweeklyAnnualPayments = fakeBiweeklyPayment * 24;
  const fakeBiweeklyMonthlyEquivalent = fakeBiweeklyAnnualPayments / 12;
  
  // This is just monthly payments, no benefit
  const fakeBiweeklyTotalPaid = monthlyTotalPaid + (biweeklyFee * loanTerm);
  const fakeBiweeklyTotalInterest = monthlyTotalInterest;

  // Extra monthly payment equivalent (same as true biweekly effect)
  const extraMonthlyPayment = monthlyPayment / 12; // One extra payment per year
  let extraBalance = loanAmount;
  let extraTotalPaid = 0;
  let extraMonths = 0;
  
  for (let month = 1; month <= numPayments; month++) {
    const interest = extraBalance * monthlyRate;
    const payment = monthlyPayment + extraMonthlyPayment;
    const principal = payment - interest;
    extraBalance -= principal;
    extraTotalPaid += payment;
    extraMonths++;
    
    if (extraBalance <= 0) break;
  }
  const extraTotalInterest = extraTotalPaid - loanAmount;

  const insights: string[] = [];
  
  insights.push(
    `Monthly payments: ${formatCurrency(monthlyPayment)}/month, ${formatCurrency(monthlyTotalInterest)} interest over ${loanTerm} years`
  );
  
  insights.push(
    `True biweekly: ${formatCurrency(biweeklyPayment)} every 2 weeks (26 payments/year), saves ${formatCurrency(monthlyTotalInterest - biweeklyTotalInterest)} and pays off ${biweeklyYearsSaved.toFixed(1)} years early`
  );

  insights.push(
    `⚠️ "Fake" biweekly: Some services charge ${formatCurrency(biweeklyFee)}/year but only make 24 payments (same as monthly) - no benefit!`
  );

  insights.push(
    `⚠️ Servicer limits: Many servicers will not accept half-payments or a true biweekly schedule. Partial payments can be rejected or held until a full monthly amount arrives — confirm before you enroll.`
  );

  insights.push(
    `💡 DIY alternative: Add ${formatCurrency(extraMonthlyPayment)}/month to your payment - same result as true biweekly, no fees`
  );

  const trueBiweeklyAnnualCost = biweeklyPayment * 26;
  const monthlyAnnualCost = monthlyPayment * 12;
  const extraAnnualCost = trueBiweeklyAnnualCost - monthlyAnnualCost;
  
  insights.push(
    `The "magic" of biweekly: You make 13 monthly payments per year instead of 12 (extra ${formatCurrency(extraAnnualCost)}/year)`
  );

  const summary = `True biweekly saves ${formatCurrency(monthlyTotalInterest - biweeklyTotalInterest)} and pays off ${biweeklyYearsSaved.toFixed(1)} years early. DIY by adding ${formatCurrency(extraMonthlyPayment)}/month.`;

  return {
    summary,
    details: {
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment),
      monthlyInterest: Math.round(monthlyTotalInterest),
      monthlyYears: loanTerm,
      biweeklyPayment: Math.round(biweeklyPayment),
      biweeklyInterest: Math.round(biweeklyTotalInterest),
      biweeklyYears: parseFloat(biweeklyYears.toFixed(1)),
      interestSaved: Math.round(monthlyTotalInterest - biweeklyTotalInterest),
      yearsSaved: parseFloat(biweeklyYearsSaved.toFixed(1)),
      extraMonthlyEquivalent: Math.round(extraMonthlyPayment),
    },
    chartData: [
      { strategy: 'Monthly', totalInterest: Math.round(monthlyTotalInterest), years: loanTerm },
      { strategy: 'True Biweekly', totalInterest: Math.round(biweeklyTotalInterest), years: parseFloat(biweeklyYears.toFixed(1)) },
      { strategy: 'Extra Monthly', totalInterest: Math.round(extraTotalInterest), years: parseFloat((extraMonths / 12).toFixed(1)) },
      { strategy: 'Fake Biweekly', totalInterest: Math.round(fakeBiweeklyTotalInterest), years: loanTerm, fees: biweeklyFee * loanTerm },
    ],
    insights,
  };
}
