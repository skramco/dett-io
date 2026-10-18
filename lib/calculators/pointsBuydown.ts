import type { PointsBuydownInputs, CalculatorResult } from './types';

/** Rate reductions (in percentage points) per year of a temporary buydown. */
const BUYDOWN_SCHEDULES: Record<string, number[]> = {
  '1-0': [1],
  '2-1': [2, 1],
  '3-2-1': [3, 2, 1],
};

function monthlyPaymentFor(principal: number, annualRate: number, months: number): number {
  if (months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1);
}

function remainingBalanceAfter(
  principal: number,
  annualRate: number,
  totalMonths: number,
  monthsElapsed: number
): number {
  if (monthsElapsed >= totalMonths) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal * (1 - monthsElapsed / totalMonths);
  const growthFull = Math.pow(1 + r, totalMonths);
  const growthElapsed = Math.pow(1 + r, monthsElapsed);
  return (principal * (growthFull - growthElapsed)) / (growthFull - 1);
}

/**
 * Standard escrow cost of a temporary buydown: the sum of the differences
 * between the note-rate payment and the subsidized payment for each buydown month.
 */
export function calculateBuydownSubsidy(
  loanAmount: number,
  parRate: number,
  loanTerm: number,
  buydownType: PointsBuydownInputs['buydownType']
): number {
  const schedule = BUYDOWN_SCHEDULES[buydownType];
  if (!schedule) return 0;
  const numPayments = loanTerm * 12;
  const parPayment = monthlyPaymentFor(loanAmount, parRate, numPayments);
  return schedule.reduce((sum, reduction) => {
    const reducedPayment = monthlyPaymentFor(loanAmount, Math.max(parRate - reduction, 0), numPayments);
    return sum + (parPayment - reducedPayment) * 12;
  }, 0);
}

/** Borrower's out-of-pocket payment for a given month (0-indexed) of a temporary buydown. */
function buydownPaymentForMonth(
  month: number,
  schedule: number[],
  loanAmount: number,
  parRate: number,
  numPayments: number
): number {
  const year = Math.floor(month / 12);
  const reduction = schedule[year] ?? 0;
  return monthlyPaymentFor(loanAmount, Math.max(parRate - reduction, 0), numPayments);
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
    buydownCost,
    yearsToHold,
  } = inputs;

  const numPayments = loanTerm * 12;
  const holdMonths = Math.min(yearsToHold * 12, numPayments);

  interface Scenario {
    name: string;
    rate: number;
    upfrontCost: number;
    buydownSchedule?: number[];
  }

  const scenarios: Scenario[] = [
    { name: 'Par Rate', rate: parRate, upfrontCost: 0 },
    { name: 'Buy Points', rate: pointsRate, upfrontCost: pointsCost },
    { name: 'Lender Credit', rate: lenderCreditRate, upfrontCost: -lenderCredit },
  ];

  const buydownSchedule = BUYDOWN_SCHEDULES[buydownType];
  if (buydownSchedule) {
    // Temporary buydown: the note (and amortization) stays at the par rate; the
    // borrower pays a subsidized payment during the buydown years and the
    // upfront buydown cost funds the difference.
    scenarios.push({
      name: `${buydownType} Buydown`,
      rate: parRate,
      upfrontCost: buydownCost,
      buydownSchedule,
    });
  }

  const results = scenarios.map((scenario) => {
    // Temporary buydowns amortize at the note (par) rate regardless of the subsidized payment.
    const amortizationRate = scenario.buydownSchedule ? parRate : scenario.rate;

    let totalPaidOverHold = 0;
    if (scenario.buydownSchedule) {
      for (let month = 0; month < holdMonths; month++) {
        totalPaidOverHold += buydownPaymentForMonth(
          month,
          scenario.buydownSchedule,
          loanAmount,
          parRate,
          numPayments
        );
      }
    } else {
      totalPaidOverHold = monthlyPaymentFor(loanAmount, scenario.rate, numPayments) * holdMonths;
    }

    const firstMonthPayment = scenario.buydownSchedule
      ? buydownPaymentForMonth(0, scenario.buydownSchedule, loanAmount, parRate, numPayments)
      : monthlyPaymentFor(loanAmount, scenario.rate, numPayments);

    const remainingBalance = remainingBalanceAfter(loanAmount, amortizationRate, numPayments, holdMonths);
    const principalPaid = loanAmount - remainingBalance;
    // Net cost over the hold: cash out the door minus the equity built. Including
    // principal paid (equivalently, the remaining balance) keeps options with
    // different payoff speeds comparable.
    const totalCost = totalPaidOverHold + scenario.upfrontCost - principalPaid;

    return {
      name: scenario.name,
      rate: scenario.rate,
      monthlyPayment: Math.round(firstMonthPayment),
      upfrontCost: Math.round(scenario.upfrontCost),
      totalPaidOverHold: Math.round(totalPaidOverHold),
      remainingBalance: Math.round(remainingBalance),
      principalPaid: Math.round(principalPaid),
      totalCost: Math.round(totalCost),
    };
  });

  const parOption = results.find((r) => r.name === 'Par Rate')!;
  const bestOption = results.reduce((best, current) =>
    current.totalCost < best.totalCost ? current : best
  );

  const insights: string[] = [];

  insights.push(
    `Par rate (${parRate}%): $${parOption.monthlyPayment.toLocaleString()}/month, no upfront cost`
  );

  const pointsOption = results.find((r) => r.name === 'Buy Points');
  if (pointsOption) {
    const monthlySavings = parOption.monthlyPayment - pointsOption.monthlyPayment;
    const balanceAdvantage = parOption.remainingBalance - pointsOption.remainingBalance;
    if (monthlySavings > 0) {
      const breakEvenMonths = pointsCost / monthlySavings;
      insights.push(
        `Buying points: Saves $${monthlySavings.toLocaleString()}/month, breaks even in ${Math.round(breakEvenMonths)} months (${(breakEvenMonths / 12).toFixed(1)} years) on payments alone — plus you'd owe $${balanceAdvantage.toLocaleString()} less after ${yearsToHold} years`
      );
    } else {
      insights.push(
        `Buying points: No monthly savings at ${pointsRate}% vs par — the upfront cost never breaks even`
      );
    }
  }

  const creditOption = results.find((r) => r.name === 'Lender Credit');
  if (creditOption) {
    const extraMonthly = creditOption.monthlyPayment - parOption.monthlyPayment;
    const balanceDisadvantage = creditOption.remainingBalance - parOption.remainingBalance;
    insights.push(
      `Lender credit: Get $${lenderCredit.toLocaleString()} upfront, pay $${extraMonthly.toLocaleString()}/month more and owe $${balanceDisadvantage.toLocaleString()} more after ${yearsToHold} years`
    );
  }

  const buydownOption = results.find((r) => r.name.endsWith('Buydown'));
  if (buydownOption && buydownSchedule) {
    const yearPayments = buydownSchedule.map((reduction, i) => {
      const payment = monthlyPaymentFor(loanAmount, Math.max(parRate - reduction, 0), numPayments);
      return `$${Math.round(payment).toLocaleString()}/mo in year ${i + 1}`;
    });
    insights.push(
      `${buydownType} buydown: ${yearPayments.join(', ')}, then $${parOption.monthlyPayment.toLocaleString()}/mo at the ${parRate}% note rate — the loan amortizes at the note rate throughout`
    );
  }

  insights.push(
    `Best option for ${yearsToHold} years: ${bestOption.name} (net cost: $${bestOption.totalCost.toLocaleString()} — payments + upfront − principal paid)`
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

  const summary = `For a ${yearsToHold}-year hold, ${bestOption.name} is cheapest at $${bestOption.totalCost.toLocaleString()} net cost (payments + upfront cost, minus principal paid down).`;

  return {
    summary,
    details: {
      loanAmount,
      yearsToHold,
      parRate,
      parPayment: parOption.monthlyPayment,
      bestOption: bestOption.name,
      bestRate: bestOption.rate,
      bestPayment: bestOption.monthlyPayment,
      bestTotalCost: bestOption.totalCost,
      bestRemainingBalance: bestOption.remainingBalance,
    },
    chartData: results.map((r) => ({
      option: r.name,
      monthlyPayment: r.monthlyPayment,
      upfrontCost: r.upfrontCost,
      totalPaid: r.totalPaidOverHold,
      remainingBalance: r.remainingBalance,
      totalCost: r.totalCost,
    })),
    insights,
  };
}
