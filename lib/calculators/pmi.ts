import type { CalculatorResult } from './types';

export interface PMIInputs {
  homePrice: number;
  downPaymentPercent: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  creditScore: number;
  pmiType: 'borrower-paid' | 'lender-paid' | 'single-premium';
}

interface PMIScenario {
  downPayment: string;
  downPaymentAmount: number;
  loanAmount: number;
  pmiRate: number;
  monthlyPMI: number;
  annualPMI: number;
  monthsUntilRemoval: number;
  totalPMICost: number;
  monthlyPaymentWithPMI: number;
}

function getPMIRate(ltv: number, creditScore: number): number {
  // Approximate PMI rates based on LTV and credit score
  if (creditScore >= 760) {
    if (ltv <= 85) return 0.19;
    if (ltv <= 90) return 0.30;
    if (ltv <= 95) return 0.46;
    return 0.55;
  } else if (creditScore >= 740) {
    if (ltv <= 85) return 0.25;
    if (ltv <= 90) return 0.35;
    if (ltv <= 95) return 0.55;
    return 0.65;
  } else if (creditScore >= 720) {
    if (ltv <= 85) return 0.31;
    if (ltv <= 90) return 0.47;
    if (ltv <= 95) return 0.65;
    return 0.80;
  } else if (creditScore >= 700) {
    if (ltv <= 85) return 0.40;
    if (ltv <= 90) return 0.58;
    if (ltv <= 95) return 0.82;
    return 0.95;
  } else if (creditScore >= 680) {
    if (ltv <= 85) return 0.50;
    if (ltv <= 90) return 0.72;
    if (ltv <= 95) return 1.05;
    return 1.15;
  } else {
    if (ltv <= 85) return 0.65;
    if (ltv <= 90) return 0.90;
    if (ltv <= 95) return 1.25;
    return 1.50;
  }
}

export function calculatePMI(inputs: PMIInputs): CalculatorResult {
  const {
    homePrice,
    downPaymentPercent,
    interestRate,
    loanTerm,
    creditScore,
    pmiType,
  } = inputs;

  const loanAmount = homePrice * (1 - downPaymentPercent / 100);
  const ltv = (loanAmount / homePrice) * 100;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  // Base monthly P&I payment
  const monthlyPI = monthlyRate === 0
    ? loanAmount / numberOfPayments
    : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  // Current PMI rate
  const pmiRate = getPMIRate(ltv, creditScore);
  const monthlyPMI = (loanAmount * (pmiRate / 100)) / 12;
  const annualPMI = loanAmount * (pmiRate / 100);

  // Calculate months until PMI removal (when LTV reaches 78%)
  let balance = loanAmount;
  let monthsUntilRemoval = 0;
  const targetBalance = homePrice * 0.78;

  for (let m = 1; m <= numberOfPayments; m++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPI - interestPayment;
    balance -= principalPayment;
    if (balance <= targetBalance) {
      monthsUntilRemoval = m;
      break;
    }
  }

  const totalPMICost = monthlyPMI * monthsUntilRemoval;

  // Single premium PMI (upfront lump sum)
  const singlePremiumRate = pmiRate * 0.65; // Roughly 65% of annual rate as one-time
  const singlePremiumCost = Math.round(loanAmount * (singlePremiumRate / 100) * (monthsUntilRemoval / 12));

  // Lender-paid PMI (higher rate, no separate PMI)
  const lenderPaidRateIncrease = pmiRate * 0.035; // Roughly 0.035% rate increase per 0.1% PMI
  const lenderPaidRate = interestRate + lenderPaidRateIncrease;
  const lenderPaidMonthlyPI = monthlyRate === 0
    ? loanAmount / numberOfPayments
    : (loanAmount * (lenderPaidRate / 100 / 12) * Math.pow(1 + lenderPaidRate / 100 / 12, numberOfPayments)) /
      (Math.pow(1 + lenderPaidRate / 100 / 12, numberOfPayments) - 1);

  // Generate comparison scenarios at different down payments
  const scenarios: PMIScenario[] = [];
  for (const dp of [5, 10, 15, 20]) {
    const scenarioLoan = homePrice * (1 - dp / 100);
    const scenarioLTV = (scenarioLoan / homePrice) * 100;
    const scenarioRate = dp >= 20 ? 0 : getPMIRate(scenarioLTV, creditScore);
    const scenarioMonthlyPMI = (scenarioLoan * (scenarioRate / 100)) / 12;
    const scenarioMonthlyPI = monthlyRate === 0
      ? scenarioLoan / numberOfPayments
      : (scenarioLoan * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    let scenarioMonths = 0;
    if (dp < 20) {
      let bal = scenarioLoan;
      const target78 = homePrice * 0.78;
      for (let m = 1; m <= numberOfPayments; m++) {
        const intPmt = bal * monthlyRate;
        const prinPmt = scenarioMonthlyPI - intPmt;
        bal -= prinPmt;
        if (bal <= target78) {
          scenarioMonths = m;
          break;
        }
      }
    }

    scenarios.push({
      downPayment: `${dp}%`,
      downPaymentAmount: homePrice * (dp / 100),
      loanAmount: scenarioLoan,
      pmiRate: scenarioRate,
      monthlyPMI: Math.round(scenarioMonthlyPMI),
      annualPMI: Math.round(scenarioLoan * (scenarioRate / 100)),
      monthsUntilRemoval: scenarioMonths,
      totalPMICost: Math.round(scenarioMonthlyPMI * scenarioMonths),
      monthlyPaymentWithPMI: Math.round(scenarioMonthlyPI + scenarioMonthlyPMI),
    });
  }

  // Chart data
  const chartData = scenarios.map(s => ({
    name: s.downPayment,
    monthlyPMI: s.monthlyPMI,
    totalPMICost: s.totalPMICost,
    monthlyPayment: s.monthlyPaymentWithPMI,
  }));

  // Insights
  const insights: string[] = [];

  if (downPaymentPercent >= 20) {
    insights.push('With 20% or more down, you avoid PMI entirely. This saves you hundreds per month compared to a lower down payment.');
  } else {
    insights.push(
      `Your PMI rate is ${pmiRate.toFixed(2)}% ($${Math.round(monthlyPMI)}/month). PMI automatically drops off after ${monthsUntilRemoval} months (${(monthsUntilRemoval / 12).toFixed(1)} years) when your loan balance reaches 78% of the home value.`
    );

    insights.push(
      `Total PMI cost over ${(monthsUntilRemoval / 12).toFixed(1)} years: $${Math.round(totalPMICost).toLocaleString()}. That's the "cost" of putting less than 20% down.`
    );

    const extraDownNeeded = (homePrice * 0.20) - (homePrice * (downPaymentPercent / 100));
    if (extraDownNeeded > 0) {
      insights.push(
        `You'd need $${Math.round(extraDownNeeded).toLocaleString()} more in down payment to reach 20% and eliminate PMI entirely.`
      );
    }

    if (creditScore < 740) {
      const betterRate = getPMIRate(ltv, 760);
      const betterMonthly = (loanAmount * (betterRate / 100)) / 12;
      const savings = monthlyPMI - betterMonthly;
      if (savings > 10) {
        insights.push(
          `Improving your credit score to 760+ would reduce your PMI from $${Math.round(monthlyPMI)}/mo to $${Math.round(betterMonthly)}/mo — saving $${Math.round(savings)}/month.`
        );
      }
    }
  }

  insights.push(
    `You can request PMI removal when your loan reaches 80% LTV (balance of $${Math.round(homePrice * 0.80).toLocaleString()}). It's automatically removed at 78% LTV.`
  );

  return {
    summary: downPaymentPercent >= 20
      ? 'No PMI required with 20% or more down payment.'
      : `Monthly PMI: $${Math.round(monthlyPMI)}/month for ${(monthsUntilRemoval / 12).toFixed(1)} years. Total PMI cost: $${Math.round(totalPMICost).toLocaleString()}.`,
    details: {
      homePrice,
      loanAmount: Math.round(loanAmount),
      downPaymentPercent,
      ltv: Math.round(ltv * 10) / 10,
      creditScore,
      pmiRate,
      monthlyPMI: Math.round(monthlyPMI),
      annualPMI: Math.round(annualPMI),
      monthlyPI: Math.round(monthlyPI),
      monthlyPaymentWithPMI: Math.round(monthlyPI + monthlyPMI),
      monthsUntilRemoval,
      yearsUntilRemoval: Math.round((monthsUntilRemoval / 12) * 10) / 10,
      totalPMICost: Math.round(totalPMICost),
      singlePremiumCost: Math.round(singlePremiumCost),
      lenderPaidRate: Math.round(lenderPaidRate * 1000) / 1000,
      lenderPaidMonthlyPI: Math.round(lenderPaidMonthlyPI),
      targetBalance: Math.round(homePrice * 0.78),
      requestRemovalBalance: Math.round(homePrice * 0.80),
      noPMI: downPaymentPercent >= 20 ? 1 : 0,
    },
    chartData,
    insights,
  };
}
