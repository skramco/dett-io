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

  // Annualized cost of the cash accessed — a simplified cost measure, not an APR
  const cashCostViaRefi = newTotalInterest - currentTotalInterest;
  const effectiveAnnualCost = (cashCostViaRefi / cashOutAmount / newTerm) * 100;

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
    `Effective annual cost of cash: ${effectiveAnnualCost.toFixed(2)}% over ${newTerm} years (a cost measure, not an APR)`
  );

  if (newLTV > maxLTV) {
    insights.push(
      `⚠️ New LTV is ${newLTV.toFixed(1)}% - above 80% LTV is outside typical guidelines and pricing is usually higher`
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

  const summary = `Cash-out refi gives you $${cashOutAmount.toLocaleString()} at an effective annual cost of ${effectiveAnnualCost.toFixed(2)}% (not an APR) and resets your loan to ${newTerm} years.`;

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
      effectiveAnnualCostPercent: parseFloat(effectiveAnnualCost.toFixed(2)),
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
