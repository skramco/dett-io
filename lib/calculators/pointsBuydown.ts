import { formatCurrency } from '../format';
import type { PointsBuydownInputs, CalculatorResult } from './types';
import { monthlyPayment, remainingBalance } from './mortgageMath';

/** Yearly rate reductions during a temporary buydown, e.g. 2-1 → [2, 1]. */
const BUYDOWN_SCHEDULES: Record<string, number[]> = {
  '3-2-1': [3, 2, 1],
  '2-1': [2, 1],
  '1-0': [1],
};

interface ScenarioResult {
  name: string;
  rate: number;
  /** Borrower's payment in year 1 (lower than the note payment during a buydown). */
  monthlyPayment: number;
  upfrontCost: number;
  totalPaidOverHold: number;
  /** Amount still owed at the end of the hold (payoff on sale or refinance). */
  endingBalance: number;
  /** Upfront + payments + payoff − loan amount: the true net cost over the hold. */
  totalCost: number;
}

export function calculatePointsBuydown(inputs: PointsBuydownInputs): CalculatorResult {
  const {
    loanAmount,
    parRate,
    loanTerm,
    pointsCost,
    pointsRate,
    lenderCredit,
    lenderCreditRate,
    buydownType,
    yearsToHold,
  } = inputs;

  const numPayments = loanTerm * 12;
  const holdMonths = Math.min(Math.max(yearsToHold, 0) * 12, numPayments);

  const buildFixedScenario = (name: string, rate: number, upfrontCost: number): ScenarioResult => {
    const payment = monthlyPayment(loanAmount, rate, numPayments);
    const totalPaidOverHold = payment * holdMonths;
    const endingBalance = remainingBalance(loanAmount, rate, numPayments, holdMonths);
    return {
      name,
      rate,
      monthlyPayment: payment,
      upfrontCost,
      totalPaidOverHold,
      endingBalance,
      totalCost: upfrontCost + totalPaidOverHold + endingBalance - loanAmount,
    };
  };

  const scenarios: ScenarioResult[] = [
    buildFixedScenario('Par Rate', parRate, 0),
    buildFixedScenario('Buy Points', pointsRate, pointsCost),
    buildFixedScenario('Lender Credit', lenderCreditRate, -lenderCredit),
  ];

  // Temporary buydown: the note rate stays at par, so the balance follows the
  // par amortization schedule. The borrower pays the payment implied by the
  // reduced rate each buydown year; an upfront escrow deposit (the subsidy)
  // covers the difference. If the loan is paid off before the buydown period
  // ends, the unused subsidy is credited against the payoff balance.
  let buydownSubsidy = 0;
  const buydownSchedule = buydownType !== 'none' ? BUYDOWN_SCHEDULES[buydownType] : undefined;
  if (buydownSchedule) {
    const parPayment = monthlyPayment(loanAmount, parRate, numPayments);
    const yearlyReducedPayments = buydownSchedule.map((reduction) =>
      monthlyPayment(loanAmount, Math.max(parRate - reduction, 0), numPayments)
    );

    let totalPaidOverHold = 0;
    let unusedSubsidy = 0;
    for (const [yearIndex, reducedPayment] of yearlyReducedPayments.entries()) {
      const monthlySubsidy = parPayment - reducedPayment;
      for (let month = yearIndex * 12 + 1; month <= (yearIndex + 1) * 12 && month <= numPayments; month++) {
        buydownSubsidy += monthlySubsidy;
        if (month <= holdMonths) {
          totalPaidOverHold += reducedPayment;
        } else {
          unusedSubsidy += monthlySubsidy;
        }
      }
    }
    totalPaidOverHold += parPayment * Math.max(holdMonths - buydownSchedule.length * 12, 0);

    const endingBalance = Math.max(
      remainingBalance(loanAmount, parRate, numPayments, holdMonths) - unusedSubsidy,
      0
    );
    scenarios.push({
      name: `${buydownType} Buydown`,
      rate: parRate,
      monthlyPayment: yearlyReducedPayments[0],
      upfrontCost: buydownSubsidy,
      totalPaidOverHold,
      endingBalance,
      totalCost: buydownSubsidy + totalPaidOverHold + endingBalance - loanAmount,
    });
  }

  const results = scenarios.map((s) => ({
    name: s.name,
    rate: s.rate,
    monthlyPayment: Math.round(s.monthlyPayment),
    upfrontCost: Math.round(s.upfrontCost),
    totalPaidOverHold: Math.round(s.totalPaidOverHold),
    endingBalance: Math.round(s.endingBalance),
    totalCost: Math.round(s.totalCost),
  }));

  const parOption = results.find((r) => r.name === 'Par Rate')!;
  const bestOption = results.reduce((best, current) =>
    current.totalCost < best.totalCost ? current : best
  );

  const insights: string[] = [];

  insights.push(
    `Par rate (${parRate}%): ${formatCurrency(parOption.monthlyPayment)}/month, no upfront cost, ${formatCurrency(parOption.endingBalance)} still owed after ${yearsToHold} years`
  );

  const pointsOption = results.find((r) => r.name === 'Buy Points')!;
  const pointsMonthlySavings = parOption.monthlyPayment - pointsOption.monthlyPayment;
  const pointsBalanceAdvantage = parOption.endingBalance - pointsOption.endingBalance;
  if (pointsMonthlySavings > 0) {
    // True break-even also counts the faster principal paydown at the lower
    // rate, not just the smaller payment.
    let pointsBreakEvenMonths: number | null = null;
    for (let month = 1; month <= numPayments; month++) {
      const savings =
        pointsMonthlySavings * month +
        (remainingBalance(loanAmount, parRate, numPayments, month) -
          remainingBalance(loanAmount, pointsRate, numPayments, month));
      if (savings >= pointsCost) {
        pointsBreakEvenMonths = month;
        break;
      }
    }
    insights.push(
      `Buying points: Saves ${formatCurrency(pointsMonthlySavings)}/month and leaves you owing ${formatCurrency(pointsBalanceAdvantage)} less after ${yearsToHold} years` +
        (pointsBreakEvenMonths
          ? `, breaking even in ${pointsBreakEvenMonths} months (${(pointsBreakEvenMonths / 12).toFixed(1)} years)`
          : '')
    );
  } else {
    insights.push(`Buying points: No monthly savings at the entered rates — not worth the upfront cost`);
  }

  const creditOption = results.find((r) => r.name === 'Lender Credit')!;
  const creditExtraMonthly = creditOption.monthlyPayment - parOption.monthlyPayment;
  const creditExtraBalance = creditOption.endingBalance - parOption.endingBalance;
  insights.push(
    `Lender credit: Get ${formatCurrency(lenderCredit)} upfront, but pay ${formatCurrency(creditExtraMonthly)}/month more and owe ${formatCurrency(creditExtraBalance)} more after ${yearsToHold} years`
  );

  const buydownOption = results.find((r) => r.name.endsWith('Buydown'));
  if (buydownOption) {
    insights.push(
      `${buydownType} buydown: Payments start at ${formatCurrency(buydownOption.monthlyPayment)}/month and step up to ${formatCurrency(parOption.monthlyPayment)} after the buydown period. The ${formatCurrency(buydownOption.upfrontCost)} subsidy is usually seller- or builder-paid — if you pay it yourself, it roughly cancels out the payment relief`
    );
  }

  insights.push(
    `Best option for ${yearsToHold} years: ${bestOption.name} (net cost: ${formatCurrency(bestOption.totalCost)}, including the remaining balance you'd pay off when you sell or refinance)`
  );

  if (yearsToHold < 5) {
    insights.push(
      `💡 Planning to move soon? Lender credits or par rate usually win for short holds`
    );
  } else {
    insights.push(
      `💡 Staying long-term? Buying points down can save thousands over time`
    );
  }

  const summary = `For a ${yearsToHold}-year hold, ${bestOption.name} is cheapest at ${formatCurrency(bestOption.totalCost)} net cost (upfront + payments + remaining balance − loan amount).`;

  return {
    summary,
    details: {
      loanAmount,
      yearsToHold,
      parRate,
      parPayment: parOption.monthlyPayment,
      parEndingBalance: parOption.endingBalance,
      pointsEndingBalance: pointsOption.endingBalance,
      pointsMonthlySavings,
      bestOption: bestOption.name,
      bestRate: bestOption.rate,
      bestPayment: bestOption.monthlyPayment,
      bestTotalCost: bestOption.totalCost,
      buydownCost: Math.round(buydownSubsidy),
    },
    chartData: results.map((r) => ({
      option: r.name,
      monthlyPayment: r.monthlyPayment,
      upfrontCost: r.upfrontCost,
      endingBalance: r.endingBalance,
      totalCost: r.totalCost,
    })),
    insights,
  };
}
