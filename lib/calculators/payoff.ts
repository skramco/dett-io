import { formatCurrency } from '../format';
import type { PayoffInputs, CalculatorResult } from './types';
import {
  monthlyPayment,
  toMonthlyRate,
  simulateBiweeklyPayoff,
} from './mortgageMath';

export interface PayoffStrategyRow {
  strategy: string;
  totalInterest: number;
  years: number;
}

export interface PayoffResult extends CalculatorResult {
  /** Side-by-side comparison of every payoff strategy. */
  strategyComparison: PayoffStrategyRow[];
}

interface PathSimulation {
  totalInterest: number;
  totalPaidToLoan: number;
  payoffMonth: number;
  portfolioAtHorizon: number;
  yearlyBalances: number[];
}

/**
 * Simulates one strategy over the full horizon with identical monthly cash
 * outflow (base payment + extras + lump sum), so the two paths are directly
 * comparable (ENG-323):
 * - prepay=true:  extra dollars and the lump sum go to principal; once the
 *   loan is paid off, the entire freed-up payment is invested until the
 *   horizon.
 * - prepay=false: only the base payment goes to the loan; extra dollars and
 *   the lump sum are invested.
 * Any cash not needed by the loan in a given month (including the partial
 * final payment) is invested. Final loan payments are clamped so total
 * interest is exact.
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
  const yearlyBalances: number[] = [loanAmount];

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

    if (month % 12 === 0 || balance <= 0) {
      yearlyBalances[Math.ceil(month / 12)] = Math.max(0, balance);
    }
  }

  return {
    totalInterest,
    totalPaidToLoan,
    payoffMonth,
    portfolioAtHorizon: portfolio,
    yearlyBalances,
  };
}

export function calculatePayoff(inputs: PayoffInputs): PayoffResult {
  const {
    loanAmount,
    interestRate,
    loanTerm,
    biweeklyFee = 400,
    investmentReturn = 7,
    recastOption = false,
    recastFee = 250,
  } = inputs;

  const extraMonthly = inputs.extraMonthlyPayment ?? inputs.extraMonthly ?? 0;
  const extraAnnual = inputs.extraAnnualPayment ?? inputs.extraAnnual ?? 0;
  const lumpSumAmount = inputs.lumpSumAmount ?? 0;
  const lumpSumYear = inputs.lumpSumYear ?? 0;

  const monthlyRate = toMonthlyRate(interestRate);
  const termMonths = loanTerm * 12;
  const basePayment = monthlyPayment(loanAmount, interestRate, termMonths);
  const investMonthlyRate = toMonthlyRate(investmentReturn);
  const lumpSumMonth = lumpSumAmount > 0 && lumpSumYear > 0 ? lumpSumYear * 12 : 0;

  // Regular path (no extras) and prepay path share the same cash-outflow model.
  const regular = simulatePath({
    loanAmount,
    monthlyRate,
    basePayment,
    extraMonthly: 0,
    extraAnnual: 0,
    lumpSumAmount: 0,
    lumpSumMonth: 0,
    investMonthlyRate,
    horizonMonths: termMonths,
    prepay: false,
  });

  const prepayPath = simulatePath({
    loanAmount,
    monthlyRate,
    basePayment,
    extraMonthly,
    extraAnnual,
    lumpSumAmount,
    lumpSumMonth,
    investMonthlyRate,
    horizonMonths: termMonths,
    prepay: true,
  });

  const investPath = simulatePath({
    loanAmount,
    monthlyRate,
    basePayment,
    extraMonthly,
    extraAnnual,
    lumpSumAmount,
    lumpSumMonth,
    investMonthlyRate,
    horizonMonths: termMonths,
    prepay: false,
  });

  const regularTotalInterest = regular.totalInterest;
  const prepayTotalInterest = prepayPath.totalInterest;
  const prepayMonths = prepayPath.payoffMonth;
  const prepayPortfolio = prepayPath.portfolioAtHorizon;
  const investPortfolio = investPath.portfolioAtHorizon;
  const netWorthDifference = investPortfolio - prepayPortfolio;

  const interestSaved = regularTotalInterest - prepayTotalInterest;
  const monthsSaved = regular.payoffMonth - prepayMonths;
  const yearsSaved = monthsSaved / 12;
  const totalExtraPaid =
    extraMonthly * prepayMonths +
    extraAnnual * Math.floor(prepayMonths / 12) +
    (lumpSumMonth > 0 && prepayMonths >= lumpSumMonth ? lumpSumAmount : 0);

  // True biweekly (26 half-payments/year = 13 monthly payments)
  const biweekly = simulateBiweeklyPayoff(loanAmount, interestRate, basePayment / 2, termMonths * 3);
  const biweeklyYears = biweekly.periods / 26;
  const biweeklyInterestSaved = regularTotalInterest - biweekly.totalInterest;
  const biweeklyYearsSaved = regular.payoffMonth / 12 - biweeklyYears;

  // DIY equivalent of true biweekly: add 1/12 of the payment each month
  const diyExtraMonthly = basePayment / 12;
  const diy = simulatePath({
    loanAmount,
    monthlyRate,
    basePayment,
    extraMonthly: diyExtraMonthly,
    extraAnnual: 0,
    lumpSumAmount: 0,
    lumpSumMonth: 0,
    investMonthlyRate,
    horizonMonths: termMonths,
    prepay: true,
  });

  // Optional recast after the lump sum (from the former Acceleration tool)
  let recastMonths = prepayMonths;
  let recastTotalInterest = prepayTotalInterest;
  if (recastOption && lumpSumMonth > 0) {
    let recastBalance = loanAmount;
    let recastTotalPaid = 0;
    recastMonths = 0;
    let recastPayment = basePayment;

    for (let month = 1; month <= termMonths; month++) {
      const interest = recastBalance * monthlyRate;
      let payment = recastPayment + extraMonthly;
      if (month % 12 === 0) payment += extraAnnual;

      if (month === lumpSumMonth) {
        recastBalance -= lumpSumAmount;
        recastTotalPaid += recastFee;
        const remainingMonths = termMonths - month;
        recastPayment = monthlyPayment(Math.max(recastBalance, 0), interestRate, remainingMonths);
      }

      const amountDue = recastBalance + interest;
      payment = Math.min(payment, amountDue);
      recastBalance = amountDue - payment;
      recastTotalPaid += payment;
      recastMonths++;
      if (recastBalance <= 1e-6) break;
    }
    recastTotalInterest = recastTotalPaid - loanAmount;
  }

  const insights: string[] = [];

  if (interestSaved > 0) {
    insights.push(
      `Making extra payments saves you ${formatCurrency(interestSaved)} in interest and pays off your loan ${yearsSaved.toFixed(1)} years earlier.`
    );
    insights.push(
      `Every extra dollar you put toward principal earns a guaranteed return equal to your mortgage rate: ${interestRate}%.`
    );
  }

  insights.push(
    `True biweekly payments (${formatCurrency(basePayment / 2)} every 2 weeks) save ${formatCurrency(biweeklyInterestSaved)} and pay off ${biweeklyYearsSaved.toFixed(1)} years early — the same as adding ${formatCurrency(diyExtraMonthly)}/month yourself, free of charge.`
  );

  insights.push(
    `⚠️ Watch out for "fake" biweekly programs: some services charge ~${formatCurrency(biweeklyFee)}/year but only forward 24 half-payments (identical to monthly) — all fee, no benefit. DIY by adding 1/12 of your payment to principal each month.`
  );

  insights.push(
    `⚠️ Servicer limits: Many servicers will not accept half-payments or a true biweekly schedule. Partial payments can be rejected or held until a full monthly amount arrives — confirm before you enroll.`
  );

  if (extraMonthly > 0 || extraAnnual > 0 || lumpSumAmount > 0) {
    const freedUp = basePayment + extraMonthly;
    if (netWorthDifference > 0) {
      insights.push(
        `Fair comparison at year ${loanTerm}: investing the extra at ${investmentReturn}% grows to ${formatCurrency(investPortfolio)}, while prepaying (then investing the freed-up payment of ${formatCurrency(freedUp)}/month after payoff) reaches ${formatCurrency(prepayPortfolio)} - investing comes out ${formatCurrency(netWorthDifference)} ahead, but that edge depends on actually earning ${investmentReturn}% every year.`
      );
    } else {
      insights.push(
        `Fair comparison at year ${loanTerm}: prepaying (then investing the freed-up payment of ${formatCurrency(freedUp)}/month after payoff) reaches ${formatCurrency(prepayPortfolio)}, versus ${formatCurrency(investPortfolio)} from investing the extra at ${investmentReturn}% - prepaying comes out ${formatCurrency(Math.abs(netWorthDifference))} ahead.`
      );
    }
  }

  if (recastOption && recastMonths < prepayMonths) {
    insights.push(
      `Recasting after the lump sum lowers the required payment and pays off ${((prepayMonths - recastMonths) / 12).toFixed(1)} years sooner than extra payments alone (fee: ${formatCurrency(recastFee)}).`
    );
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

  const totalYears = Math.ceil(regular.payoffMonth / 12);
  const chartData: Array<Record<string, number | string>> = [];
  for (let year = 0; year <= totalYears; year++) {
    chartData.push({
      year,
      regularLoan: Math.round(regular.yearlyBalances[year] ?? 0),
      withExtraPayments: Math.round(prepayPath.yearlyBalances[year] ?? 0),
    });
    if ((regular.yearlyBalances[year] ?? 0) <= 0 && (prepayPath.yearlyBalances[year] ?? 0) <= 0) break;
  }

  const summaryParts: string[] = [];
  if (totalExtraPaid > 0) {
    summaryParts.push(
      `Your payoff plan saves ${formatCurrency(interestSaved)} in interest and ${yearsSaved.toFixed(1)} years of payments.`
    );
  }
  summaryParts.push(
    `A free DIY biweekly strategy (add ${formatCurrency(diyExtraMonthly)}/month) saves ${formatCurrency(regularTotalInterest - diy.totalInterest)} and ${((regular.payoffMonth - diy.payoffMonth) / 12).toFixed(1)} years.`
  );

  return {
    summary: summaryParts.join(' '),
    details: {
      loanAmount,
      basePayment: Math.round(basePayment * 100) / 100,
      regularMonthlyPayment: parseFloat(basePayment.toFixed(2)),
      monthlyPayment: Math.round(basePayment),
      extraMonthlyPayment: extraMonthly,
      extraAnnualPayment: extraAnnual,
      lumpSumAmount,
      totalExtraPaid: parseFloat(totalExtraPaid.toFixed(2)),
      interestSaved: parseFloat(interestSaved.toFixed(2)),
      monthsSaved,
      yearsSaved: parseFloat(yearsSaved.toFixed(2)),
      monthsRegular: regular.payoffMonth,
      monthsWithExtra: prepayMonths,
      totalInterestRegular: parseFloat(regularTotalInterest.toFixed(2)),
      totalInterestWithExtra: parseFloat(prepayTotalInterest.toFixed(2)),
      regularInterest: Math.round(regularTotalInterest),
      biweeklyPayment: Math.round(basePayment / 2),
      biweeklyInterestSaved: Math.round(biweeklyInterestSaved),
      biweeklyYears: Math.round(biweeklyYears * 10) / 10,
      biweeklyYearsSaved: Math.round(biweeklyYearsSaved * 10) / 10,
      diyExtraMonthly: Math.round(diyExtraMonthly),
      // ENG-323: portfolios at the original term under identical cash outflow
      investmentValue: parseFloat(investPortfolio.toFixed(2)),
      prepayPortfolio: parseFloat(prepayPortfolio.toFixed(2)),
      investPortfolio: parseFloat(investPortfolio.toFixed(2)),
      netWorthDifference: parseFloat(netWorthDifference.toFixed(2)),
      horizonYears: loanTerm,
      effectiveReturnRate: interestRate,
      investmentReturn,
      biweeklyFee,
      recastInterest: Math.round(recastTotalInterest),
      recastMonths,
    },
    chartData,
    insights,
    strategyComparison: [
      { strategy: 'Regular', totalInterest: Math.round(regularTotalInterest), years: Math.round((regular.payoffMonth / 12) * 10) / 10 },
      { strategy: 'Your Extra-Payment Plan', totalInterest: Math.round(prepayTotalInterest), years: Math.round((prepayMonths / 12) * 10) / 10 },
      { strategy: 'True Biweekly', totalInterest: Math.round(biweekly.totalInterest), years: Math.round(biweeklyYears * 10) / 10 },
      { strategy: 'DIY 13th Payment', totalInterest: Math.round(diy.totalInterest), years: Math.round((diy.payoffMonth / 12) * 10) / 10 },
    ],
  };
}
