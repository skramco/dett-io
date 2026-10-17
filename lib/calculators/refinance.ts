import type { RefinanceInputs, CalculatorResult } from './types';

function amortizedPayment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function remainingBalance(principal: number, annualRatePct: number, payment: number, monthsElapsed: number): number {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return Math.max(0, principal - payment * monthsElapsed);
  const growth = Math.pow(1 + r, monthsElapsed);
  return Math.max(0, principal * growth - payment * ((growth - 1) / r));
}

export type RefinanceVerdict = 'save' | 'lower-payment-higher-cost' | 'higher-payment-lower-cost' | 'costs-more';

export function calculateRefinance(inputs: RefinanceInputs): CalculatorResult {
  const {
    currentBalance,
    currentRate,
    currentMonthlyPayment,
    yearsRemaining,
    newRate,
    newTerm,
    closingCosts,
  } = inputs;

  const currentPaymentsRemaining = yearsRemaining * 12;

  // Scheduled P&I implied by the current balance, rate, and remaining term.
  const scheduledCurrentPayment = amortizedPayment(currentBalance, currentRate, currentPaymentsRemaining);

  // Validate the entered payment against the amortization schedule. If it's
  // materially off (wrong number, or includes escrow/extra principal), use the
  // computed scheduled payment so the comparison stays apples-to-apples.
  const mismatchTolerance = Math.max(scheduledCurrentPayment * 0.01, 10);
  const paymentMismatch =
    currentMonthlyPayment > 0 &&
    Math.abs(currentMonthlyPayment - scheduledCurrentPayment) > mismatchTolerance;
  const effectiveCurrentPayment =
    currentMonthlyPayment > 0 && !paymentMismatch ? currentMonthlyPayment : scheduledCurrentPayment;

  // Closing costs are financed into the new loan (disclosed in the UI and insights).
  const newLoanAmount = currentBalance + closingCosts;
  const newNumberOfPayments = newTerm * 12;
  const newMonthlyPayment = amortizedPayment(newLoanAmount, newRate, newNumberOfPayments);

  const monthlySavings = effectiveCurrentPayment - newMonthlyPayment;

  // Break-even: months of payment savings needed to offset the closing costs
  // that were rolled into the new balance. Payment-based method; it does not
  // credit the slower equity build from resetting the term (documented on page).
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity;
  const breakEvenYears = breakEvenMonths / 12;

  const currentTotalPaid = effectiveCurrentPayment * currentPaymentsRemaining;
  const newTotalPaid = newMonthlyPayment * newNumberOfPayments;
  // Financed closing costs are already inside newTotalPaid, so this is a true
  // total-cost comparison of the two paths from today forward.
  const totalSavings = currentTotalPaid - newTotalPaid;

  const currentTotalInterest = currentTotalPaid - currentBalance;
  // Interest on the new loan accrues on the financed balance (incl. closing costs).
  const newTotalInterest = newTotalPaid - newLoanAmount;
  const interestSavings = currentTotalInterest - newTotalInterest;

  const savesMonthly = monthlySavings > 0;
  const savesTotal = totalSavings > 0;
  const verdict: RefinanceVerdict = savesMonthly
    ? savesTotal
      ? 'save'
      : 'lower-payment-higher-cost'
    : savesTotal
      ? 'higher-payment-lower-cost'
      : 'costs-more';

  const insights: string[] = [];

  if (paymentMismatch) {
    insights.push(
      `Warning: Your entered payment ($${currentMonthlyPayment.toFixed(2)}) doesn't match the scheduled P&I of $${scheduledCurrentPayment.toFixed(2)} implied by a $${currentBalance.toLocaleString()} balance at ${currentRate}% with ${yearsRemaining} years left. The analysis uses the computed $${scheduledCurrentPayment.toFixed(2)} — check that your entry is principal & interest only.`
    );
  }

  insights.push(
    `The $${closingCosts.toLocaleString(undefined, { maximumFractionDigits: 0 })} in closing costs is financed into the new loan, so you'd borrow $${newLoanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} and pay interest on those costs for the full ${newTerm}-year term.`
  );

  if (savesMonthly) {
    insights.push(
      `You'll save $${monthlySavings.toFixed(2)}/month, and it will take ${breakEvenMonths} months (${breakEvenYears.toFixed(1)} years) of those savings to offset the $${closingCosts.toFixed(0)} closing costs.`
    );
  } else {
    insights.push(
      `Your monthly payment will increase by $${Math.abs(monthlySavings).toFixed(2)}/month, so there is no payment-based break-even point.`
    );
  }

  if (savesTotal) {
    insights.push(
      `Over the life of the loan, you'll pay $${totalSavings.toFixed(0)} less in total than keeping your current loan (closing costs included).`
    );
  } else {
    insights.push(
      `Over the life of the loan, you'll pay $${Math.abs(totalSavings).toFixed(0)} more in total than keeping your current loan (closing costs included)${savesMonthly ? ' — the lower payment comes from stretching the debt over more years.' : '.'}`
    );
  }

  if (interestSavings > 0) {
    insights.push(
      `You'll save $${interestSavings.toFixed(0)} in interest charges alone.`
    );
  }

  if (newTerm > yearsRemaining) {
    const extraYears = newTerm - yearsRemaining;
    insights.push(
      `Warning: You're extending your loan by ${extraYears} years. Resetting the term restarts amortization, so early payments are mostly interest and you build equity more slowly.`
    );
  }

  const chartData = [];
  for (let year = 0; year <= Math.max(yearsRemaining, newTerm); year++) {
    const currentRemaining = remainingBalance(currentBalance, currentRate, effectiveCurrentPayment, Math.min(year, yearsRemaining) * 12);
    const newRemaining = remainingBalance(newLoanAmount, newRate, newMonthlyPayment, Math.min(year, newTerm) * 12);

    chartData.push({
      year,
      currentLoan: parseFloat(currentRemaining.toFixed(0)),
      newLoan: parseFloat(newRemaining.toFixed(0)),
    });
  }

  const summaryByVerdict: Record<RefinanceVerdict, string> = {
    save: `Refinancing saves you $${monthlySavings.toFixed(2)}/month and $${totalSavings.toFixed(0)} over the life of the loan. You'll break even on the financed closing costs in ${Number.isFinite(breakEvenMonths) ? breakEvenMonths : 0} months.`,
    'lower-payment-higher-cost': `Refinancing lowers your payment by $${monthlySavings.toFixed(2)}/month, but you'd pay $${Math.abs(totalSavings).toFixed(0)} more in total because the term resets to ${newTerm} years.`,
    'higher-payment-lower-cost': `Your payment rises by $${Math.abs(monthlySavings).toFixed(2)}/month, but the shorter payoff saves you $${totalSavings.toFixed(0)} in total.`,
    'costs-more': `This refinance increases your monthly payment by $${Math.abs(monthlySavings).toFixed(2)} and costs $${Math.abs(totalSavings).toFixed(0)} more over the life of the loan. It does not save you money.`,
  };

  return {
    summary: summaryByVerdict[verdict],
    details: {
      currentMonthlyPayment: parseFloat(effectiveCurrentPayment.toFixed(2)),
      enteredMonthlyPayment: parseFloat(currentMonthlyPayment.toFixed(2)),
      scheduledCurrentPayment: parseFloat(scheduledCurrentPayment.toFixed(2)),
      paymentMismatch: paymentMismatch ? 1 : 0,
      newLoanAmount: parseFloat(newLoanAmount.toFixed(2)),
      newMonthlyPayment: parseFloat(newMonthlyPayment.toFixed(2)),
      monthlySavings: parseFloat(monthlySavings.toFixed(2)),
      breakEvenMonths,
      breakEvenYears: parseFloat(breakEvenYears.toFixed(2)),
      closingCosts: parseFloat(closingCosts.toFixed(2)),
      currentTotalPaid: parseFloat(currentTotalPaid.toFixed(2)),
      newTotalPaid: parseFloat(newTotalPaid.toFixed(2)),
      totalSavings: parseFloat(totalSavings.toFixed(2)),
      interestSavings: parseFloat(interestSavings.toFixed(2)),
      verdict,
    },
    chartData,
    insights,
  };
}
