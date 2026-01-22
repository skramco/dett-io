import type { PointsBuydownInputs, CalculatorResult } from './types';

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
  const holdMonths = yearsToHold * 12;

  const scenarios = [
    { name: 'Par Rate', rate: parRate, upfrontCost: 0 },
    { name: 'Buy Points', rate: pointsRate, upfrontCost: pointsCost },
    { name: 'Lender Credit', rate: lenderCreditRate, upfrontCost: -lenderCredit },
  ];

  if (buydownType !== 'none') {
    const buydownRates = buydownType === '2-1' 
      ? [parRate - 2, parRate - 1, parRate]
      : [parRate - 1, parRate];
    scenarios.push({
      name: `${buydownType} Buydown`,
      rate: parRate,
      upfrontCost: buydownCost,
    });
  }

  const results = scenarios.map(scenario => {
    const monthlyRate = scenario.rate / 100 / 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalPaidOverHold = monthlyPayment * holdMonths;
    const totalCost = totalPaidOverHold + scenario.upfrontCost;
    
    return {
      name: scenario.name,
      rate: scenario.rate,
      monthlyPayment: Math.round(monthlyPayment),
      upfrontCost: Math.round(scenario.upfrontCost),
      totalPaidOverHold: Math.round(totalPaidOverHold),
      totalCost: Math.round(totalCost),
    };
  });

  const parOption = results.find(r => r.name === 'Par Rate')!;
  const bestOption = results.reduce((best, current) => 
    current.totalCost < best.totalCost ? current : best
  );

  const insights: string[] = [];
  
  insights.push(
    `Par rate (${parRate}%): $${parOption.monthlyPayment.toLocaleString()}/month, no upfront cost`
  );

  const pointsOption = results.find(r => r.name === 'Buy Points');
  if (pointsOption) {
    const monthlySavings = parOption.monthlyPayment - pointsOption.monthlyPayment;
    const breakEvenMonths = pointsCost / monthlySavings;
    insights.push(
      `Buying points: Saves $${monthlySavings}/month, breaks even in ${Math.round(breakEvenMonths)} months (${(breakEvenMonths / 12).toFixed(1)} years)`
    );
  }

  const creditOption = results.find(r => r.name === 'Lender Credit');
  if (creditOption) {
    const extraMonthly = creditOption.monthlyPayment - parOption.monthlyPayment;
    insights.push(
      `Lender credit: Get $${lenderCredit.toLocaleString()} upfront, pay $${extraMonthly}/month more`
    );
  }

  insights.push(
    `Best option for ${yearsToHold} years: ${bestOption.name} (total cost: $${bestOption.totalCost.toLocaleString()})`
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

  const summary = `For a ${yearsToHold}-year hold, ${bestOption.name} is cheapest at $${bestOption.totalCost.toLocaleString()} total cost.`;

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
    },
    chartData: results.map(r => ({
      option: r.name,
      monthlyPayment: r.monthlyPayment,
      upfrontCost: Math.abs(r.upfrontCost),
      totalCost: r.totalCost,
    })),
    insights,
  };
}
