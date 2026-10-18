import { formatCurrency } from '../format';
import type { AccelerationInputs, CalculatorResult } from './types';
import { monthlyPayment, toMonthlyRate } from './mortgageMath';

interface PathSimulation {
  totalInterest: number;
  totalPaidToLoan: number;
  payoffMonth: number;
  portfolioAtHorizon: number;
}

/**
 * Simulates one strategy over the full horizon with identical monthly cash
 * outflow (base payment + extras + lump sum), so the two paths are directly
 * comparable:
 * - prepay=true:  extra dollars and the lump sum go to principal; once the
 *   loan is paid off, the entire freed-up payment is invested until the
 *   horizon.
 * - prepay=false: only the base payment goes to the loan; extra dollars and
 *   the lump sum are invested.
 * Any cash not needed by the loan in a given month (including the partial
 * final payment) is invested.
 */
function simulatePath(params: {
  loanAmount: number;
  monthlyRate: number;
  basePayment: number;
  extraMonthly: number;
  extraAnnual: number;
  lumpSumAmount: number;
  lumpSumMonth: number;
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
    lumpSumAmount,
    lumpSumMonth,
    investMonthlyRate,
    horizonMonths,
    prepay,
  } = params;

  let balance = loanAmount;
  let totalInterest = 0;
  let totalPaidToLoan = 0;
  let portfolio = 0;
  let payoffMonth = horizonMonths;

  for (let month = 1; month <= horizonMonths; month++) {
    portfolio *= 1 + investMonthlyRate;

    const lumpSum = month === lumpSumMonth ? lumpSumAmount : 0;
    const outlay =
      basePayment + extraMonthly + (month % 12 === 0 ? extraAnnual : 0) + lumpSum;
    let paymentToLoan = 0;

    if (balance > 0) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      const amountDue = balance + interest;
      const maxTowardLoan = prepay ? outlay : Math.min(basePayment, outlay);
      paymentToLoan = Math.min(maxTowardLoan, amountDue);
      balance = amountDue - paymentToLoan;
      totalPaidToLoan += paymentToLoan;
      if (balance <= 1e-6) {
        balance = 0;
        payoffMonth = month;
      }
    }

    portfolio += outlay - paymentToLoan;
  }

  return { totalInterest, totalPaidToLoan, payoffMonth, portfolioAtHorizon: portfolio };
}

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

  const monthlyRate = toMonthlyRate(interestRate);
  const numPayments = loanTerm * 12;
  const investMonthlyRate = toMonthlyRate(investmentReturn);
  const lumpSumMonth = lumpSumAmount > 0 ? lumpSumYear * 12 : 0;

  // Base payment
  const basePayment = monthlyPayment(loanAmount, interestRate, numPayments);

  // Scenario 1: Regular payments only
  const regularTotalPaid = basePayment * numPayments;
  const regularTotalInterest = regularTotalPaid - loanAmount;

  // Scenario 2: Extra payments (prepay). After early payoff, the freed-up
  // payment is invested until the end of the original term so the comparison
  // with investing is apples-to-apples.
  const prepayPath = simulatePath({
    loanAmount,
    monthlyRate,
    basePayment,
    extraMonthly,
    extraAnnual,
    lumpSumAmount,
    lumpSumMonth,
    investMonthlyRate,
    horizonMonths: numPayments,
    prepay: true,
  });
  const prepayTotalInterest = prepayPath.totalInterest;
  const prepayMonths = prepayPath.payoffMonth;
  const prepayPortfolio = prepayPath.portfolioAtHorizon;
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

    if (month === lumpSumMonth && recastOption) {
      recastBalance -= lumpSumAmount;
      recastTotalPaid += recastFee;
      // Recalculate payment based on new balance
      const remainingMonths = numPayments - month;
      recastPayment = monthlyPayment(recastBalance, interestRate, remainingMonths);
    }

    const amountDue = recastBalance + interest;
    payment = Math.min(payment, amountDue);
    recastBalance = amountDue - payment;
    recastTotalPaid += payment;
    recastMonths++;

    if (recastBalance <= 1e-6) break;
  }
  const recastTotalInterest = recastTotalPaid - loanAmount;

  // Scenario 4: Invest instead - same cash outflow, extras go to a portfolio
  // while the loan runs its full term.
  const investPath = simulatePath({
    loanAmount,
    monthlyRate,
    basePayment,
    extraMonthly,
    extraAnnual,
    lumpSumAmount,
    lumpSumMonth,
    investMonthlyRate,
    horizonMonths: numPayments,
    prepay: false,
  });
  const investTotalInterest = investPath.totalInterest;
  const investPortfolio = investPath.portfolioAtHorizon;

  // At the end of the original term both loans are fully paid off, so the
  // net-worth difference between the strategies is the portfolio difference.
  const netWorthDifference = investPortfolio - prepayPortfolio;

  const interestSaved = regularTotalInterest - prepayTotalInterest;

  const insights: string[] = [];

  insights.push(
    `Regular payments: ${formatCurrency(basePayment)}/month, ${formatCurrency(regularTotalInterest)} interest over ${loanTerm} years`
  );

  insights.push(
    `Prepay strategy: Pay off in ${(prepayMonths / 12).toFixed(1)} years, save ${formatCurrency(interestSaved)} in interest - a guaranteed ${interestRate}% return on every extra dollar`
  );

  if (recastOption && recastMonths < prepayMonths) {
    insights.push(
      `Recast strategy: Pay off in ${(recastMonths / 12).toFixed(1)} years, gives flexibility to lower payments after lump sum`
    );
  }

  if (extraMonthly > 0 || extraAnnual > 0 || lumpSumAmount > 0) {
    if (netWorthDifference > 0) {
      insights.push(
        `💡 Fair comparison at year ${loanTerm}: investing the extra at ${investmentReturn}% grows to ${formatCurrency(investPortfolio)}, while prepaying (then investing the freed-up ${formatCurrency(basePayment + extraMonthly)}/month after payoff) reaches ${formatCurrency(prepayPortfolio)} - investing comes out ${formatCurrency(netWorthDifference)} ahead, if returns hold`
      );
    } else {
      insights.push(
        `Fair comparison at year ${loanTerm}: prepaying (then investing the freed-up ${formatCurrency(basePayment + extraMonthly)}/month after payoff) reaches ${formatCurrency(prepayPortfolio)}, versus ${formatCurrency(investPortfolio)} from investing at ${investmentReturn}% - prepaying wins by ${formatCurrency(Math.abs(netWorthDifference))}`
      );
    }
  }

  insights.push(
    `The "right" choice depends on: your guaranteed ${interestRate}% mortgage rate vs uncertain ${investmentReturn}% investment returns, risk tolerance, and peace of mind value`
  );

  const summary = `Prepaying saves ${formatCurrency(interestSaved)} and pays off ${prepayYearsSaved.toFixed(1)} years early.`;

  return {
    summary,
    details: {
      loanAmount,
      basePayment: Math.round(basePayment),
      regularInterest: Math.round(regularTotalInterest),
      regularYears: loanTerm,
      prepayInterest: Math.round(prepayTotalInterest),
      prepayYears: parseFloat((prepayMonths / 12).toFixed(1)),
      interestSaved: Math.round(interestSaved),
      yearsSaved: parseFloat(prepayYearsSaved.toFixed(1)),
      recastInterest: Math.round(recastTotalInterest),
      // Portfolio at the end of the original term under each strategy
      // (identical monthly cash outflow in both).
      prepayPortfolio: Math.round(prepayPortfolio),
      investPortfolio: Math.round(investPortfolio),
      netWorthDifference: Math.round(netWorthDifference),
      horizonYears: loanTerm,
      effectiveReturnRate: interestRate,
    },
    chartData: [
      { strategy: 'Regular', totalInterest: Math.round(regularTotalInterest), years: loanTerm },
      { strategy: 'Prepay', totalInterest: Math.round(prepayTotalInterest), years: parseFloat((prepayMonths / 12).toFixed(1)) },
      { strategy: 'Invest', totalInterest: Math.round(investTotalInterest), portfolio: Math.round(investPortfolio) },
    ],
    insights,
  };
}
