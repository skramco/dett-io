import { formatCurrency } from '../format';
import type { RefinanceInputs, CalculatorResult } from './types';
import {
  breakEvenMonths as calcBreakEvenMonths,
  monthlyPayment,
  remainingBalanceWithPayment,
} from './mortgageMath';

export type RefinanceVerdict = 'refinance' | 'mixed' | 'higher-payment-lower-cost' | 'keep';

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
  const impliedCurrentPayment = monthlyPayment(currentBalance, currentRate, currentPaymentsRemaining);
  const paymentMismatch =
    currentMonthlyPayment > 0 &&
    Math.abs(currentMonthlyPayment - impliedCurrentPayment) > Math.max(25, impliedCurrentPayment * 0.02);
  // If the entered payment is missing or materially off (e.g. includes escrow or
  // extra principal), fall back to the computed P&I so the comparison stays
  // apples-to-apples. The mismatch is still surfaced in the UI and insights.
  const effectiveCurrentPayment =
    currentMonthlyPayment > 0 && !paymentMismatch ? currentMonthlyPayment : impliedCurrentPayment;

  // Closing costs are financed: rolled into the new loan balance rather than paid upfront.
  const newLoanAmount = currentBalance + closingCosts;
  const newNumberOfPayments = newTerm * 12;
  const newMonthlyPayment = monthlyPayment(newLoanAmount, newRate, newNumberOfPayments);

  const monthlySavings = effectiveCurrentPayment - newMonthlyPayment;
  const hasMonthlySavings = monthlySavings > 0;
  const breakEvenMonths = hasMonthlySavings
    ? Math.ceil(calcBreakEvenMonths(closingCosts, monthlySavings))
    : 0;
  const breakEvenYears = breakEvenMonths / 12;

  const currentTotalPaid = effectiveCurrentPayment * currentPaymentsRemaining;
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
  // - 'higher-payment-lower-cost': payment rises but the shorter payoff costs less overall
  // - 'keep': loses on both
  const verdict: RefinanceVerdict = hasMonthlySavings
    ? hasLifetimeSavings
      ? 'refinance'
      : 'mixed'
    : hasLifetimeSavings
      ? 'higher-payment-lower-cost'
      : 'keep';

  const insights: string[] = [];

  if (paymentMismatch) {
    insights.push(
      `Warning: at ${formatCurrency(currentBalance)} / ${currentRate}% / ${yearsRemaining} years remaining, the amortized P&I payment is about ${formatCurrency(impliedCurrentPayment)}/month, but you entered ${formatCurrency(currentMonthlyPayment)}. The analysis uses the computed ${formatCurrency(impliedCurrentPayment)} — make sure your entry is principal & interest only (no taxes, insurance, or escrow).`
    );
  }

  insights.push(
    `Closing costs of ${formatCurrency(closingCosts)} are financed into the new loan, so your new balance starts at ${formatCurrency(newLoanAmount)} — you're borrowing the costs (and paying interest on them) rather than paying them upfront.`
  );

  if (hasMonthlySavings) {
    insights.push(
      `You'll save ${formatCurrency(monthlySavings)}/month, but it will take ${breakEvenMonths} months (${breakEvenYears.toFixed(1)} years) of those savings to recoup the ${formatCurrency(closingCosts)} closing costs.`
    );
  } else {
    insights.push(
      verdict === 'higher-payment-lower-cost'
        ? `Your monthly payment will increase by ${formatCurrency(Math.abs(monthlySavings))}, but the faster payoff lowers your total cost — there is no payment-based break-even point.`
        : `Your monthly payment will increase by ${formatCurrency(Math.abs(monthlySavings))}. This refinance may not make financial sense.`
    );
  }

  if (hasLifetimeSavings) {
    insights.push(
      `Over the life of the loan, you'll save ${formatCurrency(totalSavings)} total (including the financed closing costs).`
    );
  } else {
    insights.push(
      `Over the life of the loan, you'll pay ${formatCurrency(Math.abs(totalSavings))} more than keeping your current loan.`
    );
  }

  if (interestSavings > 0) {
    insights.push(
      `You'll save ${formatCurrency(interestSavings)} in interest charges alone.`
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
    const currentRemaining = remainingBalanceWithPayment(currentBalance, currentRate, effectiveCurrentPayment, Math.min(year, yearsRemaining) * 12);
    const newRemaining = remainingBalanceWithPayment(newLoanAmount, newRate, newMonthlyPayment, Math.min(year, newTerm) * 12);

    chartData.push({
      year,
      currentLoan: parseFloat(currentRemaining.toFixed(0)),
      newLoan: parseFloat(newRemaining.toFixed(0)),
    });
  }

  const summary =
    verdict === 'refinance'
      ? `Refinancing saves you ${formatCurrency(monthlySavings)}/month and ${formatCurrency(totalSavings)} over the life of the loan. You'll break even on the financed ${formatCurrency(closingCosts)} closing costs in ${breakEvenMonths} months.`
      : verdict === 'mixed'
        ? `Refinancing lowers your payment by ${formatCurrency(monthlySavings)}/month, but resets your term — you'd pay ${formatCurrency(Math.abs(totalSavings))} more over the life of the loan. Break-even on payment alone is ${breakEvenMonths} months.`
        : verdict === 'higher-payment-lower-cost'
          ? `Your payment rises by ${formatCurrency(Math.abs(monthlySavings))}/month, but the shorter payoff saves you ${formatCurrency(totalSavings)} in total.`
          : `This refinance increases your monthly payment by ${formatCurrency(Math.abs(monthlySavings))} and costs ${formatCurrency(Math.abs(totalSavings))} more over the life of the loan. It does not save you money.`;

  return {
    summary,
    details: {
      currentMonthlyPayment: parseFloat(effectiveCurrentPayment.toFixed(2)),
      enteredMonthlyPayment: parseFloat(currentMonthlyPayment.toFixed(2)),
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
