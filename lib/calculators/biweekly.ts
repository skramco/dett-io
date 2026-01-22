import type { BiweeklyInputs, CalculatorResult } from './types';

export function calculateBiweekly(inputs: BiweeklyInputs): CalculatorResult {
  const {
    loanAmount,
    interestRate,
    loanTerm,
    biweeklyFee,
  } = inputs;

  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  
  // Monthly payment
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                        (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  const monthlyTotalPaid = monthlyPayment * numPayments;
  const monthlyTotalInterest = monthlyTotalPaid - loanAmount;

  // True biweekly (26 payments per year = 13 monthly payments)
  const biweeklyPayment = monthlyPayment / 2;
  let biweeklyBalance = loanAmount;
  let biweeklyTotalPaid = 0;
  let biweeklyPaymentCount = 0;
  
  while (biweeklyBalance > 0 && biweeklyPaymentCount < numPayments * 2) {
    // Apply payment every 2 weeks
    const interest = biweeklyBalance * (interestRate / 100 / 26);
    const principal = biweeklyPayment - interest;
    biweeklyBalance -= principal;
    biweeklyTotalPaid += biweeklyPayment;
    biweeklyPaymentCount++;
  }
  
  const biweeklyTotalInterest = biweeklyTotalPaid - loanAmount;
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
    `Monthly payments: $${Math.round(monthlyPayment).toLocaleString()}/month, $${Math.round(monthlyTotalInterest).toLocaleString()} interest over ${loanTerm} years`
  );
  
  insights.push(
    `True biweekly: $${Math.round(biweeklyPayment).toLocaleString()} every 2 weeks (26 payments/year), saves $${Math.round(monthlyTotalInterest - biweeklyTotalInterest).toLocaleString()} and pays off ${biweeklyYearsSaved.toFixed(1)} years early`
  );

  insights.push(
    `⚠️ "Fake" biweekly: Some services charge $${biweeklyFee}/year but only make 24 payments (same as monthly) - no benefit!`
  );

  insights.push(
    `💡 DIY alternative: Add $${Math.round(extraMonthlyPayment).toLocaleString()}/month to your payment - same result as true biweekly, no fees`
  );

  const trueBiweeklyAnnualCost = biweeklyPayment * 26;
  const monthlyAnnualCost = monthlyPayment * 12;
  const extraAnnualCost = trueBiweeklyAnnualCost - monthlyAnnualCost;
  
  insights.push(
    `The "magic" of biweekly: You make 13 monthly payments per year instead of 12 (extra $${Math.round(extraAnnualCost).toLocaleString()}/year)`
  );

  const summary = `True biweekly saves $${Math.round(monthlyTotalInterest - biweeklyTotalInterest).toLocaleString()} and pays off ${biweeklyYearsSaved.toFixed(1)} years early. DIY by adding $${Math.round(extraMonthlyPayment).toLocaleString()}/month.`;

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
