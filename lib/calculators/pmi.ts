import type { CalculatorResult } from './types';
import {
  conventionalPmiRatePercent,
  ltvPercent,
  monthlyPayment,
  monthlyPmiAmount,
  monthsToReachLtv,
} from './mortgageMath';

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
  const ltv = ltvPercent(loanAmount, homePrice);
  const numberOfPayments = loanTerm * 12;

  // Base monthly P&I payment
  const monthlyPI = monthlyPayment(loanAmount, interestRate, numberOfPayments);

  // Current PMI rate
  const pmiRate = conventionalPmiRatePercent(ltv, creditScore);
  const monthlyPMI = monthlyPmiAmount(loanAmount, pmiRate);
  const annualPMI = loanAmount * (pmiRate / 100);

  // Months until PMI removal (when LTV reaches 78%)
  const monthsUntilRemoval = monthsToReachLtv(loanAmount, homePrice, interestRate, numberOfPayments, 78);

  const totalPMICost = monthlyPMI * monthsUntilRemoval;

  // Single premium PMI (upfront lump sum)
  const singlePremiumRate = pmiRate * 0.65; // Roughly 65% of annual rate as one-time
  const singlePremiumCost = Math.round(loanAmount * (singlePremiumRate / 100) * (monthsUntilRemoval / 12));

  // Lender-paid PMI (higher rate, no separate PMI)
  const lenderPaidRateIncrease = pmiRate * 0.035; // Roughly 0.035% rate increase per 0.1% PMI
  const lenderPaidRate = interestRate + lenderPaidRateIncrease;
  const lenderPaidMonthlyPI = monthlyPayment(loanAmount, lenderPaidRate, numberOfPayments);

  // Generate comparison scenarios at different down payments
  const scenarios: PMIScenario[] = [];
  for (const dp of [5, 10, 15, 20]) {
    const scenarioLoan = homePrice * (1 - dp / 100);
    const scenarioLTV = ltvPercent(scenarioLoan, homePrice);
    const scenarioRate = dp >= 20 ? 0 : conventionalPmiRatePercent(scenarioLTV, creditScore);
    const scenarioMonthlyPMI = monthlyPmiAmount(scenarioLoan, scenarioRate);
    const scenarioMonthlyPI = monthlyPayment(scenarioLoan, interestRate, numberOfPayments);

    const scenarioMonths = dp < 20
      ? monthsToReachLtv(scenarioLoan, homePrice, interestRate, numberOfPayments, 78)
      : 0;

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
      `Your PMI rate is ${pmiRate.toFixed(2)}% ($${Math.round(monthlyPMI)}/month), calculated on your original loan amount — not your current balance. PMI is automatically removed after ${monthsUntilRemoval} months (${(monthsUntilRemoval / 12).toFixed(1)} years) when your loan balance reaches 78% of the original home value.`
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
      const betterRate = conventionalPmiRatePercent(ltv, 760);
      const betterMonthly = monthlyPmiAmount(loanAmount, betterRate);
      const savings = monthlyPMI - betterMonthly;
      if (savings > 10) {
        insights.push(
          `Improving your credit score to 760+ would reduce your PMI from $${Math.round(monthlyPMI)}/mo to $${Math.round(betterMonthly)}/mo — saving $${Math.round(savings)}/month.`
        );
      }
    }
  }

  insights.push(
    `Two removal rules: you can request cancellation once your balance reaches 80% of the original home value ($${Math.round(homePrice * 0.80).toLocaleString()}, good payment history required), and your lender must remove PMI automatically at 78% ($${Math.round(homePrice * 0.78).toLocaleString()}).`
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
