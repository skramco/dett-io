import { formatCurrency } from '../format';
import type { ExtraPaymentInputs, CalculatorResult } from './types';
import { monthlyPayment, toMonthlyRate } from './mortgageMath';

interface PathSimulation {
  totalInterest: number;
  payoffMonth: number;
  portfolioAtHorizon: number;
}

/**
 * Simulates one strategy over the full horizon with identical monthly cash
 * outflow (base payment + extra), so the two paths are directly comparable:
 * - prepay=true:  extra dollars go to principal; once the loan is paid off,
 *   the entire freed-up payment is invested until the horizon.
 * - prepay=false: only the base payment goes to the loan; extra dollars are
 *   invested every month from day one.
 * Any cash not needed by the loan in a given month (including the partial
 * final payment) is invested.
 */
function simulatePath(params: {
  loanAmount: number;
  monthlyRate: number;
  basePayment: number;
  extraMonthly: number;
  extraAnnual: number;
  investMonthlyRate: number;
  horizonMonths: number;
  prepay: boolean;
}): PathSimulation {
  const {
    loanAmount,
    monthlyRate,
    basePayment,
    extraMonthly,
    extraAnnual,
    investMonthlyRate,
    horizonMonths,
    prepay,
  } = params;

  let balance = loanAmount;
  let totalInterest = 0;
  let portfolio = 0;
  let payoffMonth = horizonMonths;

  for (let month = 1; month <= horizonMonths; month++) {
    portfolio *= 1 + investMonthlyRate;

    const outlay = basePayment + extraMonthly + (month % 12 === 0 ? extraAnnual : 0);
    let paymentToLoan = 0;

    if (balance > 0) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      const amountDue = balance + interest;
      const maxTowardLoan = prepay ? outlay : Math.min(basePayment, outlay);
      paymentToLoan = Math.min(maxTowardLoan, amountDue);
      balance = amountDue - paymentToLoan;
      if (balance <= 1e-6) {
        balance = 0;
        payoffMonth = month;
      }
    }

    portfolio += outlay - paymentToLoan;
  }

  return { totalInterest, payoffMonth, portfolioAtHorizon: portfolio };
}

export function calculateExtraPayment(inputs: ExtraPaymentInputs): CalculatorResult {
  const {
    loanAmount,
    interestRate,
    loanTerm,
    extraMonthlyPayment = 0,
    extraAnnualPayment = 0,
    investmentReturn = 7,
  } = inputs;

  const monthlyRate = toMonthlyRate(interestRate);
  const numberOfPayments = loanTerm * 12;

  const regularMonthlyPayment = monthlyPayment(loanAmount, interestRate, numberOfPayments);

  const investmentMonthlyRate = toMonthlyRate(investmentReturn);

  // Both strategies spend the same cash every month and are measured at the
  // same horizon: the end of the original loan term.
  const prepayPath = simulatePath({
    loanAmount,
    monthlyRate,
    basePayment: regularMonthlyPayment,
    extraMonthly: extraMonthlyPayment,
    extraAnnual: extraAnnualPayment,
    investMonthlyRate: investmentMonthlyRate,
    horizonMonths: numberOfPayments,
    prepay: true,
  });

  const investPath = simulatePath({
    loanAmount,
    monthlyRate,
    basePayment: regularMonthlyPayment,
    extraMonthly: extraMonthlyPayment,
    extraAnnual: extraAnnualPayment,
    investMonthlyRate: investmentMonthlyRate,
    horizonMonths: numberOfPayments,
    prepay: false,
  });

  const totalInterestRegular = investPath.totalInterest;
  const totalInterestWithExtra = prepayPath.totalInterest;
  const monthsRegular = investPath.payoffMonth;
  const monthsWithExtra = prepayPath.payoffMonth;

  const interestSaved = totalInterestRegular - totalInterestWithExtra;
  const monthsSaved = monthsRegular - monthsWithExtra;
  const yearsSaved = monthsSaved / 12;

  const totalExtraPaid =
    extraMonthlyPayment * monthsWithExtra +
    extraAnnualPayment * Math.floor(monthsWithExtra / 12);

  // At the horizon both loans are fully paid off, so the difference in net
  // worth between the two strategies is exactly the difference in portfolios.
  const prepayPortfolio = prepayPath.portfolioAtHorizon;
  const investPortfolio = investPath.portfolioAtHorizon;
  const netWorthDifference = investPortfolio - prepayPortfolio;

  const insights: string[] = [];

  if (interestSaved > 0) {
    insights.push(
      `Making extra payments saves you ${formatCurrency(interestSaved)} in interest and pays off your loan ${yearsSaved.toFixed(1)} years earlier.`
    );
    insights.push(
      `Every extra dollar you put toward principal earns a guaranteed return equal to your mortgage rate: ${interestRate}%.`
    );
  }

  if (extraMonthlyPayment > 0 || extraAnnualPayment > 0) {
    if (netWorthDifference > 0) {
      insights.push(
        `Fair comparison at year ${loanTerm}: investing the extra at ${investmentReturn}% grows to ${formatCurrency(investPortfolio)}, while prepaying (then investing the freed-up payment of ${formatCurrency((regularMonthlyPayment + extraMonthlyPayment))}/month after payoff) reaches ${formatCurrency(prepayPortfolio)} - investing comes out ${formatCurrency(netWorthDifference)} ahead, but that edge depends on actually earning ${investmentReturn}% every year.`
      );
    } else {
      insights.push(
        `Fair comparison at year ${loanTerm}: prepaying (then investing the freed-up payment of ${formatCurrency((regularMonthlyPayment + extraMonthlyPayment))}/month after payoff) reaches ${formatCurrency(prepayPortfolio)}, versus ${formatCurrency(investPortfolio)} from investing the extra at ${investmentReturn}% - prepaying comes out ${formatCurrency(Math.abs(netWorthDifference))} ahead.`
      );
    }
  }

  if (interestRate < investmentReturn) {
    insights.push(
      `Your mortgage rate (${interestRate}%) is lower than your assumed investment return (${investmentReturn}%), so investing has the mathematical edge - but the ${interestRate}% from prepaying is guaranteed, while investment returns are not.`
    );
  } else {
    insights.push(
      `Your mortgage rate (${interestRate}%) is at or above your assumed investment return (${investmentReturn}%). Prepaying gives you a guaranteed return that the market is not expected to beat.`
    );
  }

  const chartData = [];
  let regularBalance = loanAmount;
  let extraBalance = loanAmount;

  for (let year = 0; year <= loanTerm; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year > 0) {
        if (regularBalance > 0) {
          const interest = regularBalance * monthlyRate;
          const principal = regularMonthlyPayment - interest;
          regularBalance -= principal;
        }

        if (extraBalance > 0) {
          const interest = extraBalance * monthlyRate;
          let principal = regularMonthlyPayment - interest + extraMonthlyPayment;
          if (month === 12) principal += extraAnnualPayment;
          extraBalance -= principal;
        }
      }
    }

    chartData.push({
      year,
      regularLoan: Math.max(0, parseFloat(regularBalance.toFixed(0))),
      withExtraPayments: Math.max(0, parseFloat(extraBalance.toFixed(0))),
    });

    if (regularBalance <= 0 && extraBalance <= 0) break;
  }

  return {
    summary: `Extra payments of ${formatCurrency((extraMonthlyPayment + extraAnnualPayment / 12))}/month save you ${formatCurrency(interestSaved)} in interest and ${yearsSaved.toFixed(1)} years of payments.`,
    details: {
      regularMonthlyPayment: parseFloat(regularMonthlyPayment.toFixed(2)),
      extraMonthlyPayment: parseFloat(extraMonthlyPayment.toFixed(2)),
      extraAnnualPayment: parseFloat(extraAnnualPayment.toFixed(2)),
      totalExtraPaid: parseFloat(totalExtraPaid.toFixed(2)),
      interestSaved: parseFloat(interestSaved.toFixed(2)),
      monthsSaved,
      yearsSaved: parseFloat(yearsSaved.toFixed(2)),
      monthsRegular,
      monthsWithExtra,
      totalInterestRegular: parseFloat(totalInterestRegular.toFixed(2)),
      totalInterestWithExtra: parseFloat(totalInterestWithExtra.toFixed(2)),
      // Portfolio at the end of the original term if the extra is invested
      // every month instead of prepaid.
      investmentValue: parseFloat(investPortfolio.toFixed(2)),
      // Portfolio at the same horizon under the prepay path: loan is paid off
      // early, then the entire freed-up payment is invested.
      prepayPortfolio: parseFloat(prepayPortfolio.toFixed(2)),
      netWorthDifference: parseFloat(netWorthDifference.toFixed(2)),
      horizonYears: loanTerm,
      effectiveReturnRate: interestRate,
      investmentReturn,
    },
    chartData,
    insights,
  };
}
