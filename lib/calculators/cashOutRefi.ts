import type { CashOutRefinanceInputs, CalculatorResult } from './types';

export function calculateCashOutRefi(inputs: CashOutRefinanceInputs): CalculatorResult {
  const {
    currentBalance,
    currentRate,
    yearsRemaining,
    homeValue,
    cashOutAmount,
    newRate,
    newTerm,
    closingCosts,
    alternativeRate,
  } = inputs;

  const currentMonthlyRate = currentRate / 100 / 12;
  const currentPayments = yearsRemaining * 12;
  
  // Current mortgage payment
  const currentPayment = currentBalance * (currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentPayments)) / 
                        (Math.pow(1 + currentMonthlyRate, currentPayments) - 1);

  // Cash-out refi scenario
  const newLoanAmount = currentBalance + cashOutAmount + closingCosts;
  const newMonthlyRate = newRate / 100 / 12;
  const newPayments = newTerm * 12;
  
  const newPayment = newLoanAmount * (newMonthlyRate * Math.pow(1 + newMonthlyRate, newPayments)) / 
                    (Math.pow(1 + newMonthlyRate, newPayments) - 1);

  // Calculate total interest for both scenarios
  const currentTotalPaid = currentPayment * currentPayments;
  const currentTotalInterest = currentTotalPaid - currentBalance;
  
  const newTotalPaid = newPayment * newPayments;
  const newTotalInterest = newTotalPaid - newLoanAmount;

  // Alternative: Keep mortgage, take separate loan for cash
  const altLoanPayment = cashOutAmount * (alternativeRate / 100 / 12 * Math.pow(1 + alternativeRate / 100 / 12, 120)) / 
                        (Math.pow(1 + alternativeRate / 100 / 12, 120) - 1); // 10-year loan
  const altTotalPayment = currentPayment + altLoanPayment;
  const altTotalPaid = (currentPayment * currentPayments) + (altLoanPayment * 120);
  const altTotalInterest = altTotalPaid - currentBalance - cashOutAmount;

  // Calculate effective cost of cash
  const cashCostViaRefi = newTotalInterest - currentTotalInterest;
  const effectiveRate = (cashCostViaRefi / cashOutAmount / newTerm) * 100;

  // LTV check
  const newLTV = (newLoanAmount / homeValue) * 100;
  const maxLTV = 80;

  const insights: string[] = [];
  
  insights.push(
    `Current: $${Math.round(currentPayment).toLocaleString()}/month, $${Math.round(currentTotalInterest).toLocaleString()} interest remaining`
  );
  
  insights.push(
    `Cash-out refi: $${Math.round(newPayment).toLocaleString()}/month, get $${cashOutAmount.toLocaleString()} cash, pay $${Math.round(newTotalInterest).toLocaleString()} total interest`
  );

  insights.push(
    `Effective cost of cash: ${effectiveRate.toFixed(2)}% over ${newTerm} years`
  );

  if (newLTV > maxLTV) {
    insights.push(
      `⚠️ New LTV is ${newLTV.toFixed(1)}% - you may not qualify or will pay higher rates above 80% LTV`
    );
  }

  if (altTotalPaid < newTotalPaid) {
    insights.push(
      `💡 Alternative: Keep current mortgage + separate ${alternativeRate}% loan saves $${Math.round(newTotalPaid - altTotalPaid).toLocaleString()} total`
    );
  } else {
    insights.push(
      `Cash-out refi is cheaper than taking a separate loan at ${alternativeRate}%`
    );
  }

  if (newRate > currentRate) {
    insights.push(
      `⚠️ You're trading a ${currentRate}% mortgage for ${newRate}% - expensive way to get cash`
    );
  }

  const summary = `Cash-out refi gives you $${cashOutAmount.toLocaleString()} but costs ${effectiveRate.toFixed(2)}% effective rate and resets your loan to ${newTerm} years.`;

  return {
    summary,
    details: {
      currentBalance,
      currentPayment: Math.round(currentPayment),
      currentRate,
      cashOutAmount,
      newLoanAmount,
      newPayment: Math.round(newPayment),
      newRate,
      newLTV: Math.round(newLTV),
      effectiveRate: parseFloat(effectiveRate.toFixed(2)),
      totalInterestIncrease: Math.round(newTotalInterest - currentTotalInterest),
    },
    chartData: [
      { scenario: 'Current Mortgage', payment: Math.round(currentPayment), totalInterest: Math.round(currentTotalInterest) },
      { scenario: 'Cash-Out Refi', payment: Math.round(newPayment), totalInterest: Math.round(newTotalInterest) },
      { scenario: 'Keep + Separate Loan', payment: Math.round(altTotalPayment), totalInterest: Math.round(altTotalInterest) },
    ],
    insights,
  };
}
