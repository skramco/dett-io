import type { CashOutRefinanceInputs, CalculatorResult } from './types';

function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1);
}

/**
 * IRR of the incremental cash flows of taking the cash-out refi instead of
 * keeping the current mortgage: receive the cash today, then pay the
 * difference between the new payment and the old payment each month (the old
 * payment ends when the current loan would have been paid off).
 *
 * Returns a nominal annual percentage (monthly IRR x 12, the same convention
 * used to quote mortgage rates), or null when the incremental payments never
 * exceed the cash received so no positive cost exists.
 *
 * This is an educational estimate of the marginal cost of accessing cash this
 * way. It is NOT an APR: APR is a regulated disclosure (Truth in Lending Act)
 * computed by lenders on a single loan's actual fees and terms.
 */
function incrementalCashFlowIrr(
  cashReceived: number,
  currentPayment: number,
  currentPayments: number,
  newPayment: number,
  newPayments: number
): number | null {
  const totalMonths = Math.max(currentPayments, newPayments);
  const npv = (monthlyRate: number): number => {
    let value = cashReceived;
    let discount = 1;
    for (let m = 1; m <= totalMonths; m++) {
      discount /= 1 + monthlyRate;
      const oldFlow = m <= currentPayments ? currentPayment : 0;
      const newFlow = m <= newPayments ? newPayment : 0;
      value += (oldFlow - newFlow) * discount;
    }
    return value;
  };

  // NPV at rate 0 is cash received minus total extra payments. If it is not
  // negative, the refi never costs more than the cash in nominal terms and a
  // positive IRR does not exist.
  if (npv(0) >= 0) return null;

  let lo = 0;
  let hi = 1; // 100% monthly — far above any realistic cost
  if (npv(hi) < 0) return null;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (npv(mid) < 0) lo = mid;
    else hi = mid;
  }
  return ((lo + hi) / 2) * 12 * 100;
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
  const currentPayment = monthlyPayment(currentBalance, currentRate, currentPayments);

  // Cash-out refi scenario (closing costs financed into the new loan)
  const newLoanAmount = currentBalance + cashOutAmount + closingCosts;
  const newPayments = newTerm * 12;
  const newPayment = monthlyPayment(newLoanAmount, newRate, newPayments);

  // Total interest for both scenarios
  const currentTotalPaid = currentPayment * currentPayments;
  const currentTotalInterest = currentTotalPaid - currentBalance;

  const newTotalPaid = newPayment * newPayments;
  const newTotalInterest = newTotalPaid - newLoanAmount;

  const totalInterestIncrease = newTotalInterest - currentTotalInterest;

  // Alternative: keep current mortgage, borrow the cash separately (10-year loan)
  const altLoanPayments = 120;
  const altLoanPayment = monthlyPayment(cashOutAmount, alternativeRate, altLoanPayments);
  const altTotalPayment = currentPayment + altLoanPayment;
  const altTotalPaid = currentPayment * currentPayments + altLoanPayment * altLoanPayments;
  const altTotalInterest = altTotalPaid - currentBalance - cashOutAmount;

  // Blended rate of the keep-mortgage + separate-loan alternative: the
  // balance-weighted average rate across both loans, comparable to the single
  // rate you'd pay on the full refinanced balance.
  const blendedAltRate =
    (currentBalance * currentRate + cashOutAmount * alternativeRate) /
    (currentBalance + cashOutAmount);

  // Marginal cost of cash: IRR of the incremental cash flows (educational
  // estimate, not an APR).
  const marginalCashCostIrr = incrementalCashFlowIrr(
    cashOutAmount,
    currentPayment,
    currentPayments,
    newPayment,
    newPayments
  );

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

  if (marginalCashCostIrr !== null) {
    insights.push(
      `Marginal cost of cash: accessing $${cashOutAmount.toLocaleString()} this way is comparable to borrowing it at roughly ${marginalCashCostIrr.toFixed(2)}% (IRR of the incremental payments — an educational estimate, not an APR or loan offer)`
    );
  }

  insights.push(
    `Blended-rate comparison: keeping your ${currentRate}% mortgage and borrowing $${cashOutAmount.toLocaleString()} at ${alternativeRate}% works out to a blended ${blendedAltRate.toFixed(2)}% across both balances, vs ${newRate}% on the full refinanced balance`
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

  const summary = `Cash-out refi gives you $${cashOutAmount.toLocaleString()} but adds $${Math.round(totalInterestIncrease).toLocaleString()} in total interest and resets your loan to ${newTerm} years.`;

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
      marginalCashCostIrr:
        marginalCashCostIrr !== null ? parseFloat(marginalCashCostIrr.toFixed(2)) : 'N/A',
      blendedAltRate: parseFloat(blendedAltRate.toFixed(2)),
      altMonthlyPayment: Math.round(altTotalPayment),
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
