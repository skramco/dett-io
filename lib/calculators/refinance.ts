import type { RefinanceInputs, CalculatorResult } from './types';

/** Standard amortization payment: P × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1] */
function amortizedPayment(principal: number, annualRate: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export type RefinanceVerdict = 'refinance' | 'mixed' | 'keep';

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

  // What the P&I payment should be given the stated balance, rate, and remaining term.
  // Used to validate the user-entered payment (which often includes taxes/insurance by mistake).
  const impliedCurrentPayment = amortizedPayment(currentBalance, currentRate, currentPaymentsRemaining);
  const paymentMismatch =
    Math.abs(currentMonthlyPayment - impliedCurrentPayment) > Math.max(25, impliedCurrentPayment * 0.02);

  // Closing costs are financed: rolled into the new loan balance rather than paid upfront.
  const newLoanAmount = currentBalance + closingCosts;
  const newNumberOfPayments = newTerm * 12;
  const newMonthlyPayment = amortizedPayment(newLoanAmount, newRate, newNumberOfPayments);

  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  const hasMonthlySavings = monthlySavings > 0;
  const breakEvenMonths = hasMonthlySavings ? Math.ceil(closingCosts / monthlySavings) : 0;
  const breakEvenYears = breakEvenMonths / 12;

  const currentTotalPaid = currentMonthlyPayment * currentPaymentsRemaining;
  const newTotalPaid = newMonthlyPayment * newNumberOfPayments;
  const totalSavings = currentTotalPaid - newTotalPaid;
  const hasLifetimeSavings = totalSavings > 0;

  const currentTotalInterest = currentTotalPaid - currentBalance;
  // Interest on the new loan is relative to the new (larger) principal; the financed
  // closing costs show up in totalSavings, not here.
  const newTotalInterest = newTotalPaid - newLoanAmount;
  const interestSavings = currentTotalInterest - newTotalInterest;

  // Verdict must agree with both the monthly and lifetime numbers:
  // - 'refinance': saves monthly AND over the life of the loan
  // - 'mixed': lower payment but higher lifetime cost (usually a term reset)
  // - 'keep': doesn't even lower the payment
  const verdict: RefinanceVerdict = hasMonthlySavings
    ? hasLifetimeSavings
      ? 'refinance'
      : 'mixed'
    : 'keep';

  const insights: string[] = [];

  if (paymentMismatch) {
    insights.push(
      `Warning: at $${currentBalance.toLocaleString()} / ${currentRate}% / ${yearsRemaining} years remaining, the amortized P&I payment is about $${impliedCurrentPayment.toFixed(0)}/month, but you entered $${currentMonthlyPayment.toFixed(0)}. Make sure your payment excludes taxes, insurance, and escrow — a wrong payment skews every number below.`
    );
  }

  insights.push(
    `Closing costs of $${closingCosts.toLocaleString()} are financed into the new loan, so your new balance starts at $${newLoanAmount.toLocaleString()} — you're borrowing the costs (and paying interest on them) rather than paying them upfront.`
  );

  if (hasMonthlySavings) {
    insights.push(
      `You'll save $${monthlySavings.toFixed(2)}/month, but it will take ${breakEvenMonths} months (${breakEvenYears.toFixed(1)} years) of those savings to recoup the $${closingCosts.toFixed(0)} closing costs.`
    );
  } else {
    insights.push(
      `Your monthly payment will increase by $${Math.abs(monthlySavings).toFixed(2)}. This refinance may not make financial sense.`
    );
  }

  if (hasLifetimeSavings) {
    insights.push(
      `Over the life of the loan, you'll save $${totalSavings.toFixed(0)} total (including the financed closing costs).`
    );
  } else {
    insights.push(
      `Over the life of the loan, you'll pay $${Math.abs(totalSavings).toFixed(0)} more than keeping your current loan.`
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
      `Warning: You're extending your loan by ${extraYears} years. A lower payment from a term reset also means rebuilding equity more slowly — the break-even figure above only counts payment savings.`
    );
  }

  const chartData = [];
  for (let year = 0; year <= Math.max(yearsRemaining, newTerm); year++) {
    const currentRemaining = Math.max(0, currentBalance - (currentMonthlyPayment * 12 * year - currentTotalInterest * (year / yearsRemaining)));
    const newRemaining = Math.max(0, newLoanAmount - (newMonthlyPayment * 12 * year - newTotalInterest * (year / newTerm)));

    chartData.push({
      year,
      currentLoan: parseFloat(currentRemaining.toFixed(0)),
      newLoan: parseFloat(newRemaining.toFixed(0)),
    });
  }

  const summary =
    verdict === 'refinance'
      ? `Refinancing saves you $${monthlySavings.toFixed(2)}/month and $${totalSavings.toFixed(0)} over the life of the loan. You'll break even on the financed $${closingCosts.toFixed(0)} closing costs in ${breakEvenMonths} months.`
      : verdict === 'mixed'
        ? `Refinancing lowers your payment by $${monthlySavings.toFixed(2)}/month, but resets your term — you'd pay $${Math.abs(totalSavings).toFixed(0)} more over the life of the loan. Break-even on payment alone is ${breakEvenMonths} months.`
        : `This refinance increases your monthly payment by $${Math.abs(monthlySavings).toFixed(2)}. Consider if the trade-offs are worth it.`;

  return {
    summary,
    details: {
      currentMonthlyPayment: parseFloat(currentMonthlyPayment.toFixed(2)),
      impliedCurrentPayment: parseFloat(impliedCurrentPayment.toFixed(2)),
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
