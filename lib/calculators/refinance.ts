import type { RefinanceInputs, CalculatorResult } from './types';

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

  const currentMonthlyRate = currentRate / 100 / 12;
  const currentPaymentsRemaining = yearsRemaining * 12;

  const newLoanAmount = currentBalance + closingCosts;
  const newMonthlyRate = newRate / 100 / 12;
  const newNumberOfPayments = newTerm * 12;

  const newMonthlyPayment =
    newMonthlyRate === 0
      ? newLoanAmount / newNumberOfPayments
      : (newLoanAmount * newMonthlyRate * Math.pow(1 + newMonthlyRate, newNumberOfPayments)) /
        (Math.pow(1 + newMonthlyRate, newNumberOfPayments) - 1);

  const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity;
  const breakEvenYears = breakEvenMonths / 12;

  const currentTotalPaid = currentMonthlyPayment * currentPaymentsRemaining;
  const newTotalPaid = newMonthlyPayment * newNumberOfPayments;
  const totalSavings = currentTotalPaid - newTotalPaid;

  const currentTotalInterest = currentTotalPaid - currentBalance;
  const newTotalInterest = newTotalPaid - currentBalance;
  const interestSavings = currentTotalInterest - newTotalInterest;

  const insights: string[] = [];

  if (monthlySavings > 0) {
    insights.push(
      `You'll save $${monthlySavings.toFixed(2)}/month, but it will take ${breakEvenMonths} months (${breakEvenYears.toFixed(1)} years) to break even on the $${closingCosts.toFixed(0)} closing costs.`
    );
  } else {
    insights.push(
      `Your monthly payment will increase by $${Math.abs(monthlySavings).toFixed(2)}. This refinance may not make financial sense.`
    );
  }

  if (totalSavings > 0) {
    insights.push(
      `Over the life of the loan, you'll save $${totalSavings.toFixed(0)} total (including closing costs).`
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
      `Warning: You're extending your loan by ${extraYears} years. While monthly payments may be lower, you'll be in debt longer.`
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

  return {
    summary: monthlySavings > 0
      ? `Refinancing saves you $${monthlySavings.toFixed(2)}/month, but you'll need ${breakEvenMonths} months to break even on closing costs.`
      : `This refinance increases your monthly payment by $${Math.abs(monthlySavings).toFixed(2)}. Consider if the trade-offs are worth it.`,
    details: {
      currentMonthlyPayment: parseFloat(currentMonthlyPayment.toFixed(2)),
      newMonthlyPayment: parseFloat(newMonthlyPayment.toFixed(2)),
      monthlySavings: parseFloat(monthlySavings.toFixed(2)),
      breakEvenMonths,
      breakEvenYears: parseFloat(breakEvenYears.toFixed(2)),
      closingCosts: parseFloat(closingCosts.toFixed(2)),
      currentTotalPaid: parseFloat(currentTotalPaid.toFixed(2)),
      newTotalPaid: parseFloat(newTotalPaid.toFixed(2)),
      totalSavings: parseFloat(totalSavings.toFixed(2)),
      interestSavings: parseFloat(interestSavings.toFixed(2)),
    },
    chartData,
    insights,
  };
}
