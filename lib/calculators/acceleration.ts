import type { AccelerationInputs, CalculatorResult } from './types';

export function calculateAcceleration(inputs: AccelerationInputs): CalculatorResult {
  const {
    loanAmount,
    interestRate,
    loanTerm,
    extraMonthly,
    extraAnnual,
    lumpSumAmount,
    lumpSumYear,
    investmentReturn,
    recastOption,
    recastFee,
  } = inputs;

  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  
  // Base payment
  const basePayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                     (Math.pow(1 + monthlyRate, numPayments) - 1);

  // Scenario 1: Regular payments only
  const regularTotalPaid = basePayment * numPayments;
  const regularTotalInterest = regularTotalPaid - loanAmount;

  // Scenario 2: Extra payments (prepay)
  let prepayBalance = loanAmount;
  let prepayTotalPaid = 0;
  let prepayMonths = 0;
  
  for (let month = 1; month <= numPayments; month++) {
    const interest = prepayBalance * monthlyRate;
    let payment = basePayment + extraMonthly;
    
    if (month % 12 === 0) {
      payment += extraAnnual;
    }
    
    if (month === lumpSumYear * 12) {
      prepayBalance -= lumpSumAmount;
    }
    
    const principal = payment - interest;
    prepayBalance -= principal;
    prepayTotalPaid += payment;
    prepayMonths++;
    
    if (prepayBalance <= 0) break;
  }
  const prepayTotalInterest = prepayTotalPaid - loanAmount;
  const prepayYearsSaved = (numPayments - prepayMonths) / 12;

  // Scenario 3: Extra payments with recast
  let recastBalance = loanAmount;
  let recastTotalPaid = 0;
  let recastMonths = 0;
  let recastPayment = basePayment;
  
  for (let month = 1; month <= numPayments; month++) {
    const interest = recastBalance * monthlyRate;
    let payment = recastPayment + extraMonthly;
    
    if (month % 12 === 0) {
      payment += extraAnnual;
    }
    
    if (month === lumpSumYear * 12 && recastOption) {
      recastBalance -= lumpSumAmount;
      recastTotalPaid += recastFee;
      // Recalculate payment based on new balance
      const remainingMonths = numPayments - month;
      recastPayment = recastBalance * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
                     (Math.pow(1 + monthlyRate, remainingMonths) - 1);
    }
    
    const principal = payment - interest;
    recastBalance -= principal;
    recastTotalPaid += payment;
    recastMonths++;
    
    if (recastBalance <= 0) break;
  }
  const recastTotalInterest = recastTotalPaid - loanAmount;

  // Scenario 4: Invest instead
  let investBalance = loanAmount;
  let investTotalPaid = 0;
  let investPortfolio = 0;
  
  for (let month = 1; month <= numPayments; month++) {
    const interest = investBalance * monthlyRate;
    const principal = basePayment - interest;
    investBalance -= principal;
    investTotalPaid += basePayment;
    
    // Invest the extra payments
    const monthlyInvestment = extraMonthly + (month % 12 === 0 ? extraAnnual : 0);
    investPortfolio = investPortfolio * (1 + investmentReturn / 100 / 12) + monthlyInvestment;
    
    if (month === lumpSumYear * 12) {
      investPortfolio += lumpSumAmount;
    }
  }
  const investTotalInterest = investTotalPaid - loanAmount;
  const investNetWorth = investPortfolio - investBalance;

  const insights: string[] = [];
  
  insights.push(
    `Regular payments: $${Math.round(basePayment).toLocaleString()}/month, $${Math.round(regularTotalInterest).toLocaleString()} interest over ${loanTerm} years`
  );
  
  insights.push(
    `Prepay strategy: Pay off in ${(prepayMonths / 12).toFixed(1)} years, save $${Math.round(regularTotalInterest - prepayTotalInterest).toLocaleString()} in interest`
  );

  if (recastOption && recastMonths < prepayMonths) {
    insights.push(
      `Recast strategy: Pay off in ${(recastMonths / 12).toFixed(1)} years, gives flexibility to lower payments after lump sum`
    );
  }

  const investNetGain = investPortfolio - (prepayTotalPaid - investTotalPaid);
  if (investNetGain > 0) {
    insights.push(
      `💡 Investing instead: End with $${Math.round(investPortfolio).toLocaleString()} portfolio vs $${Math.round(regularTotalInterest - prepayTotalInterest).toLocaleString()} interest saved`
    );
  } else {
    insights.push(
      `Prepaying wins: Guaranteed ${interestRate}% return vs uncertain ${investmentReturn}% investment return`
    );
  }

  insights.push(
    `The "right" choice depends on: interest rate vs investment returns, risk tolerance, and peace of mind value`
  );

  const summary = `Prepaying saves $${Math.round(regularTotalInterest - prepayTotalInterest).toLocaleString()} and pays off ${prepayYearsSaved.toFixed(1)} years early.`;

  return {
    summary,
    details: {
      loanAmount,
      basePayment: Math.round(basePayment),
      regularInterest: Math.round(regularTotalInterest),
      regularYears: loanTerm,
      prepayInterest: Math.round(prepayTotalInterest),
      prepayYears: parseFloat((prepayMonths / 12).toFixed(1)),
      interestSaved: Math.round(regularTotalInterest - prepayTotalInterest),
      yearsSaved: parseFloat(prepayYearsSaved.toFixed(1)),
      investPortfolio: Math.round(investPortfolio),
    },
    chartData: [
      { strategy: 'Regular', totalInterest: Math.round(regularTotalInterest), years: loanTerm },
      { strategy: 'Prepay', totalInterest: Math.round(prepayTotalInterest), years: parseFloat((prepayMonths / 12).toFixed(1)) },
      { strategy: 'Invest', totalInterest: Math.round(investTotalInterest), portfolio: Math.round(investPortfolio) },
    ],
    insights,
  };
}
