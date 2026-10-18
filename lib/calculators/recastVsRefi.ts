import { formatCurrency } from '../format';
import type { RecastVsRefinanceInputs, CalculatorResult } from './types';
import { monthlyInterest, monthlyPayment, toMonthlyRate } from './mortgageMath';

interface ScenarioOutcome {
  /** Scheduled monthly P&I payment for this option. */
  payment: number;
  /** Mortgage interest accrued within the horizon. */
  interestPaid: number;
  /** Loan balance still owed at the end of the horizon. */
  remainingBalance: number;
  /**
   * Value at the horizon of the cash flow freed by a lower payment, invested
   * monthly at the savings rate. Negative when the option's payment exceeds
   * the current payment (extra cash out of pocket).
   */
  cashFlowValue: number;
  /** Investment earnings portion of cashFlowValue (growth beyond deposits). */
  cashFlowEarnings: number;
  /** Months until the loan is paid off, or null if it outlives the horizon. */
  payoffMonths: number | null;
  /**
   * Apples-to-apples total: upfront costs + loan payments made + balance still
   * owed at the horizon − investment earnings on the freed-up cash flow.
   * (The freed cash itself is never counted as a cost, so only its growth is
   * credited.) Every option is measured over the same horizon with the same
   * monthly budget, so lower is strictly better.
   */
  netCost: number;
}

function simulateScenario(opts: {
  startingBalance: number;
  annualRate: number;
  scheduledPayment: number;
  upfrontCosts: number;
  horizonMonths: number;
  monthlyBudget: number;
  savingsRate: number;
}): ScenarioOutcome {
  const { startingBalance, annualRate, scheduledPayment, upfrontCosts, horizonMonths, monthlyBudget, savingsRate } = opts;
  const sr = toMonthlyRate(savingsRate);

  let balance = Math.max(0, startingBalance);
  let interestPaid = 0;
  let totalPaid = 0;
  let sideAccount = 0;
  let sideDeposits = 0;
  let payoffMonths: number | null = balance === 0 ? 0 : null;

  for (let month = 1; month <= horizonMonths; month++) {
    sideAccount *= 1 + sr;
    let actualPayment = 0;
    if (balance > 0.005) {
      const interest = monthlyInterest(balance, annualRate);
      actualPayment = Math.min(scheduledPayment, balance + interest);
      interestPaid += interest;
      balance = balance + interest - actualPayment;
      totalPaid += actualPayment;
      if (balance <= 0.005) {
        balance = 0;
        payoffMonths = month;
      }
    }
    // Whatever the budget doesn't spend on the mortgage gets invested
    // (or, if the payment exceeds the budget, drawn from savings).
    sideAccount += monthlyBudget - actualPayment;
    sideDeposits += monthlyBudget - actualPayment;
  }

  const cashFlowEarnings = sideAccount - sideDeposits;

  return {
    payment: scheduledPayment,
    interestPaid,
    remainingBalance: balance,
    cashFlowValue: sideAccount,
    cashFlowEarnings,
    payoffMonths,
    netCost: upfrontCosts + totalPaid + balance - cashFlowEarnings,
  };
}

export function calculateRecastVsRefi(inputs: RecastVsRefinanceInputs): CalculatorResult {
  const {
    currentBalance,
    currentRate,
    yearsRemaining,
    lumpSumAmount,
    recastFee,
    newRate,
    newTerm,
    closingCosts,
    savingsRate = 4,
  } = inputs;

  // Common horizon: the current loan's remaining term. Recast and prepay both
  // end by then; a longer refi term is captured via its remaining balance.
  const horizonMonths = yearsRemaining * 12;
  const horizonYears = yearsRemaining;

  const currentPayment = monthlyPayment(currentBalance, currentRate, horizonMonths);
  const reducedBalance = Math.max(0, currentBalance - lumpSumAmount);

  // Every scenario gets the same monthly budget (the current payment); a lower
  // scheduled payment means the difference is invested at the savings rate.
  const common = { horizonMonths, monthlyBudget: currentPayment, savingsRate };

  // Recast: same rate, same remaining term, balance re-amortized after the lump sum.
  const recast = simulateScenario({
    ...common,
    startingBalance: reducedBalance,
    annualRate: currentRate,
    scheduledPayment: monthlyPayment(reducedBalance, currentRate, horizonMonths),
    upfrontCosts: lumpSumAmount + recastFee,
  });

  // Refinance: new rate and term on the reduced balance, closing costs paid upfront.
  const refi = simulateScenario({
    ...common,
    startingBalance: reducedBalance,
    annualRate: newRate,
    scheduledPayment: monthlyPayment(reducedBalance, newRate, newTerm * 12),
    upfrontCosts: lumpSumAmount + closingCosts,
  });

  // Prepay only: lump sum to principal, keep the current payment, pay off early.
  const prepay = simulateScenario({
    ...common,
    startingBalance: reducedBalance,
    annualRate: currentRate,
    scheduledPayment: currentPayment,
    upfrontCosts: lumpSumAmount,
  });

  const scenarios = [
    { name: 'Recast', outcome: recast },
    { name: 'Refinance', outcome: refi },
    { name: 'Prepay Only', outcome: prepay },
  ];
  const best = scenarios.reduce((a, b) => (b.outcome.netCost < a.outcome.netCost ? b : a));
  const runnerUp = scenarios.filter((s) => s !== best).reduce((a, b) => (b.outcome.netCost < a.outcome.netCost ? b : a));

  const monthlySavings = {
    recast: currentPayment - recast.payment,
    refi: currentPayment - refi.payment,
    prepay: 0,
  };

  const insights: string[] = [];

  insights.push(
    `All options are compared over the same ${horizonYears}-year horizon (your current loan's remaining term). Net cost = upfront costs + mortgage payments made + balance still owed at year ${horizonYears} − investment earnings on freed-up cash flow (invested monthly at ${savingsRate}%).`
  );

  insights.push(
    `Recast: pay a ${formatCurrency(recastFee)} fee to lower your payment to ${formatCurrency(recast.payment)}/month, freeing ${formatCurrency(monthlySavings.recast)}/month. Invested, that cash flow grows to ${formatCurrency(recast.cashFlowValue)} by year ${horizonYears}.`
  );

  if (refi.remainingBalance > 0) {
    insights.push(
      `Refinance: ${formatCurrency(closingCosts)} in closing costs for a ${formatCurrency(refi.payment)}/month payment at ${newRate}%. Because the new ${newTerm}-year term extends past the ${horizonYears}-year horizon, you'd still owe ${formatCurrency(refi.remainingBalance)} at year ${horizonYears} — that balance is counted in its net cost.`
    );
  } else {
    insights.push(
      `Refinance: ${formatCurrency(closingCosts)} in closing costs for a ${formatCurrency(refi.payment)}/month payment at ${newRate}%, fully paid off within the ${horizonYears}-year horizon.`
    );
  }

  const prepayYearsSaved = prepay.payoffMonths !== null ? (horizonMonths - prepay.payoffMonths) / 12 : 0;
  insights.push(
    `Prepay only: keep paying ${formatCurrency(currentPayment)}/month and pay the loan off about ${Math.round(prepayYearsSaved)} years early, then invest the full payment afterward.`
  );

  insights.push(
    `Best overall: ${best.name}, with the lowest ${horizonYears}-year net cost of ${formatCurrency(best.outcome.netCost)} — ${formatCurrency(runnerUp.outcome.netCost - best.outcome.netCost)} less than ${runnerUp.name} (${formatCurrency(runnerUp.outcome.netCost)}).`
  );

  if (best.name === 'Refinance') {
    insights.push(
      `💡 Refinance has the lowest net cost because dropping the rate from ${currentRate}% to ${newRate}% outweighs the ${formatCurrency(closingCosts)} closing costs and the remaining balance at year ${horizonYears}.`
    );
  } else if (best.name === 'Recast') {
    insights.push(
      `💡 Recast has the lowest net cost: for a ${formatCurrency(recastFee)} fee you keep your rate, and investing the freed-up ${formatCurrency(monthlySavings.recast)}/month at ${savingsRate}% beats the alternatives over ${horizonYears} years.`
    );
  } else {
    insights.push(
      `💡 Prepay Only has the lowest net cost: paying the loan down at ${currentRate}% beats investing freed-up cash at ${savingsRate}%, with no fees or closing costs.`
    );
  }

  const summary = `${best.name} has the lowest net cost over the next ${horizonYears} years: ${formatCurrency(best.outcome.netCost)} vs ${formatCurrency(runnerUp.outcome.netCost)} for ${runnerUp.name}. All options are compared over the same horizon, counting fees, remaining balance, and investment earnings on freed-up cash flow at ${savingsRate}%.`;

  return {
    summary,
    details: {
      horizonYears,
      savingsRate,
      currentBalance,
      currentPayment: Math.round(currentPayment),
      lumpSumAmount,
      bestOption: best.name,
      recastPayment: Math.round(recast.payment),
      recastFee,
      recastInterest: Math.round(recast.interestPaid),
      recastRemainingBalance: Math.round(recast.remainingBalance),
      recastCashFlowValue: Math.round(recast.cashFlowValue),
      recastCashFlowEarnings: Math.round(recast.cashFlowEarnings),
      recastNetCost: Math.round(recast.netCost),
      refiPayment: Math.round(refi.payment),
      refiCosts: closingCosts,
      refiInterest: Math.round(refi.interestPaid),
      refiRemainingBalance: Math.round(refi.remainingBalance),
      refiCashFlowValue: Math.round(refi.cashFlowValue),
      refiCashFlowEarnings: Math.round(refi.cashFlowEarnings),
      refiNetCost: Math.round(refi.netCost),
      prepayInterest: Math.round(prepay.interestPaid),
      prepayMonthsSaved: prepay.payoffMonths !== null ? horizonMonths - prepay.payoffMonths : 0,
      prepayRemainingBalance: Math.round(prepay.remainingBalance),
      prepayCashFlowValue: Math.round(prepay.cashFlowValue),
      prepayCashFlowEarnings: Math.round(prepay.cashFlowEarnings),
      prepayNetCost: Math.round(prepay.netCost),
    },
    chartData: scenarios.map(({ name, outcome }) => ({
      option: name,
      payment: Math.round(outcome.payment),
      totalInterest: Math.round(outcome.interestPaid),
      remainingBalance: Math.round(outcome.remainingBalance),
      cashFlowValue: Math.round(outcome.cashFlowValue),
      netCost: Math.round(outcome.netCost),
    })),
    insights,
  };
}
