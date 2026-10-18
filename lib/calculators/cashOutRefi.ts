import { formatCurrency } from '../format';
import type { CashOutRefinanceInputs, CalculatorResult } from './types';
import { ltvPercent, monthlyPayment, totalInterestOverTerm } from './mortgageMath';

/**
 * Solves the internal rate of return (IRR) of borrowing cash via a refi:
 * you receive `cashReceived` at month 0 and pay `incrementalFlows[m]` extra
 * each month compared to keeping your current mortgage. Returns the monthly
 * rate, or null when the incremental payments never exceed the cash received
 * (i.e. the cash is effectively free or better).
 *
 * The flows are outflows after month 0, so NPV is monotonic in the rate and
 * bisection converges reliably.
 */
function solveMonthlyIrr(cashReceived: number, incrementalFlows: number[]): number | null {
  if (cashReceived <= 0) return null;

  const npvAt = (monthlyRate: number): number => {
    let npv = cashReceived;
    let discount = 1;
    for (let m = 0; m < incrementalFlows.length; m++) {
      discount /= 1 + monthlyRate;
      npv -= incrementalFlows[m] * discount;
    }
    return npv;
  };

  // At 0%, NPV = cash received minus total extra paid. If that's already
  // non-negative, the incremental borrowing has zero or negative cost.
  if (npvAt(0) >= 0) return null;

  let lo = 0;
  let hi = 1; // 100% per month — far beyond any realistic cost
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npvAt(mid) < 0) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
}

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

  const currentPayments = yearsRemaining * 12;
  
  // Current mortgage payment
  const currentPayment = monthlyPayment(currentBalance, currentRate, currentPayments);

  // Cash-out refi scenario
  const newLoanAmount = currentBalance + cashOutAmount + closingCosts;
  const newPayments = newTerm * 12;
  
  const newPayment = monthlyPayment(newLoanAmount, newRate, newPayments);

  const currentTotalInterest = totalInterestOverTerm(currentBalance, currentRate, currentPayments);
  const newTotalPaid = newPayment * newPayments;
  const newTotalInterest = totalInterestOverTerm(newLoanAmount, newRate, newPayments);

  // Alternative: Keep mortgage, take a separate 10-year HELOC / home equity loan for cash
  const altLoanPayment = monthlyPayment(cashOutAmount, alternativeRate, 120);
  const altTotalPayment = currentPayment + altLoanPayment;
  const altTotalPaid = (currentPayment * currentPayments) + (altLoanPayment * 120);
  const altTotalInterest = altTotalPaid - currentBalance - cashOutAmount;

  const totalInterestIncrease = newTotalInterest - currentTotalInterest;

  // Implied annual cost of the cash (IRR on incremental cash flows):
  // you receive the cash-out amount at closing (closing costs are financed),
  // then each month you pay the difference between the new payment and what
  // you would have paid by keeping the current mortgage.
  const horizonMonths = Math.max(currentPayments, newPayments);
  const incrementalFlows: number[] = [];
  for (let m = 1; m <= horizonMonths; m++) {
    const refiOutflow = m <= newPayments ? newPayment : 0;
    const keepOutflow = m <= currentPayments ? currentPayment : 0;
    incrementalFlows.push(refiOutflow - keepOutflow);
  }
  // A single IRR is only meaningful when the incremental flows don't change
  // sign (cash in at closing, extra payments out every month afterwards).
  // When the refi lowers the payment or ends before the current loan, the
  // flows are mixed and multiple IRRs can exist, so we skip the figure.
  const flowsAllOutflows = incrementalFlows.every((f) => f >= -1e-9);
  const monthlyIrr = flowsAllOutflows ? solveMonthlyIrr(cashOutAmount, incrementalFlows) : null;
  // Annualized with monthly compounding, the same convention as quoted note rates
  const impliedCashCostIrr = monthlyIrr === null ? 0 : monthlyIrr * 12 * 100;

  // Blended-rate comparison: keeping the current mortgage and borrowing the
  // cash separately gives a weighted-average note rate across both balances,
  // versus the refi which moves the entire balance to the new rate.
  const blendedKeepRate = cashOutAmount > 0
    ? (currentBalance * currentRate + cashOutAmount * alternativeRate) / (currentBalance + cashOutAmount)
    : currentRate;

  // LTV check
  const newLTV = ltvPercent(newLoanAmount, homeValue);
  const maxLTV = 80;

  const insights: string[] = [];
  
  insights.push(
    `Current: ${formatCurrency(currentPayment)}/month, ${formatCurrency(currentTotalInterest)} interest remaining`
  );
  
  insights.push(
    `Cash-out refi: ${formatCurrency(newPayment)}/month, get ${formatCurrency(cashOutAmount)} cash, pay ${formatCurrency(newTotalInterest)} total interest`
  );

  if (monthlyIrr !== null) {
    insights.push(
      `Implied annual cost of the ${formatCurrency(cashOutAmount)} cash via refi is about ${impliedCashCostIrr.toFixed(2)}% (IRR on the extra payments vs keeping your current mortgage). This is an educational estimate, not an APR.`
    );
  } else if (cashOutAmount > 0 && flowsAllOutflows) {
    insights.push(
      `Over the full term, the refi's extra payments add up to less than the ${formatCurrency(cashOutAmount)} cash received, so the implied cost of the cash is at or below 0%.`
    );
  } else if (cashOutAmount > 0) {
    insights.push(
      `A single implied-cost figure isn't meaningful for this scenario (the refi lowers your payment or pays off before your current loan would), so compare the monthly payments and total interest below instead.`
    );
  }

  insights.push(
    `Blended-rate comparison: keeping your ${currentRate}% mortgage and borrowing ${formatCurrency(cashOutAmount)} at ${alternativeRate}% works out to a ${blendedKeepRate.toFixed(2)}% weighted-average note rate, vs ${newRate}% on the entire ${formatCurrency(newLoanAmount)} refi balance.`
  );

  if (newLTV > maxLTV) {
    insights.push(
      `⚠️ New LTV is ${newLTV.toFixed(1)}% - you may not qualify or will pay higher rates above 80% LTV`
    );
  }

  if (altTotalPaid < newTotalPaid) {
    insights.push(
      `💡 Alternative: Keep current mortgage + separate ${alternativeRate}% loan (e.g. HELOC or home equity loan) saves ${formatCurrency(newTotalPaid - altTotalPaid)} total`
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

  insights.push(
    `These figures are educational estimates for comparison only — they are not an APR, a Truth in Lending disclosure, or an offer of credit. Your lender's Loan Estimate shows the official APR.`
  );

  const summary = `Cash-out refi gives you ${formatCurrency(cashOutAmount)} but adds ${formatCurrency(totalInterestIncrease)} in interest over the new ${newTerm}-year term vs keeping your current mortgage.`;

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
      impliedCashCostIrr: parseFloat(impliedCashCostIrr.toFixed(2)),
      blendedKeepRate: parseFloat(blendedKeepRate.toFixed(2)),
      totalInterestIncrease: Math.round(totalInterestIncrease),
    },
    chartData: [
      { scenario: 'Current Mortgage', payment: Math.round(currentPayment), totalInterest: Math.round(currentTotalInterest) },
      { scenario: 'Cash-Out Refi', payment: Math.round(newPayment), totalInterest: Math.round(newTotalInterest) },
      { scenario: 'Keep + Separate Loan', payment: Math.round(altTotalPayment), totalInterest: Math.round(altTotalInterest) },
    ],
    insights,
  };
}
