import { formatCurrency } from '../format';
import type { MortgageCostInputs, CalculatorResult } from './types';
import {
  conventionalPmiRatePercent,
  DEFAULT_PMI_CREDIT_SCORE,
  ltvPercent,
  monthlyPayment,
  monthlyPmiAmount,
  PMI_LTV_THRESHOLD_PERCENT,
} from './mortgageMath';

export function calculateMortgageCost(inputs: MortgageCostInputs): CalculatorResult {
  const {
    homePrice,
    downPayment,
    interestRate,
    loanTerm,
    propertyTax,
    homeInsurance,
    hoaFees,
    creditScore = DEFAULT_PMI_CREDIT_SCORE,
    pmi = 0,
  } = inputs;

  const loanAmount = homePrice - downPayment;
  const numberOfPayments = loanTerm * 12;

  const principalAndInterest = monthlyPayment(loanAmount, interestRate, numberOfPayments);

  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;

  // PMI applies only when LTV > 80% (down payment under 20%). A manual
  // annual override takes precedence; otherwise estimate from the shared
  // LTV × credit score rate grid.
  const ltv = ltvPercent(loanAmount, homePrice);
  let monthlyPMI = 0;
  let pmiRate = 0;
  let pmiEstimated = false;
  if (ltv > PMI_LTV_THRESHOLD_PERCENT) {
    if (pmi > 0) {
      monthlyPMI = pmi / 12;
      pmiRate = loanAmount > 0 ? (pmi / loanAmount) * 100 : 0;
    } else {
      pmiRate = conventionalPmiRatePercent(ltv, creditScore);
      monthlyPMI = monthlyPmiAmount(loanAmount, pmiRate);
      pmiEstimated = true;
    }
  }

  const totalMonthlyPayment =
    principalAndInterest +
    monthlyPropertyTax +
    monthlyInsurance +
    hoaFees +
    monthlyPMI;

  const totalPaid = totalMonthlyPayment * numberOfPayments;
  const totalInterest = principalAndInterest * numberOfPayments - loanAmount;
  const downPaymentPercent = (downPayment / homePrice) * 100;

  const insights: string[] = [];

  if (monthlyPMI > 0) {
    insights.push(
      pmiEstimated
        ? `You're paying an estimated ${formatCurrency(monthlyPMI)}/month in PMI (${pmiRate.toFixed(2)}% annually at ${ltv.toFixed(0)}% LTV and a ${creditScore} credit score) because your down payment is less than 20%. This adds ${formatCurrency(monthlyPMI * 12)}/year until you reach 20% equity.`
        : `You're paying ${formatCurrency(monthlyPMI)}/month in PMI because your down payment is less than 20%. This adds ${formatCurrency(monthlyPMI * 12)}/year.`
    );
  }

  if (totalInterest > loanAmount) {
    insights.push(
      `Over ${loanTerm} years, you'll pay ${formatCurrency(totalInterest)} in interest - that's ${((totalInterest / loanAmount) * 100).toFixed(0)}% of your loan amount.`
    );
  }

  const pitiPercentage = ((principalAndInterest / totalMonthlyPayment) * 100).toFixed(0);
  insights.push(
    `Principal & interest is only ${pitiPercentage}% of your true monthly cost. The rest is taxes, insurance, and fees.`
  );

  if (hoaFees > 0) {
    insights.push(
      `HOA fees add ${formatCurrency(hoaFees * 12)}/year to your housing costs.`
    );
  }

  const chartData = [
    { name: 'Principal & Interest', value: principalAndInterest, percentage: (principalAndInterest / totalMonthlyPayment) * 100 },
    { name: 'Property Tax', value: monthlyPropertyTax, percentage: (monthlyPropertyTax / totalMonthlyPayment) * 100 },
    { name: 'Home Insurance', value: monthlyInsurance, percentage: (monthlyInsurance / totalMonthlyPayment) * 100 },
    { name: 'HOA Fees', value: hoaFees, percentage: (hoaFees / totalMonthlyPayment) * 100 },
    { name: 'PMI', value: monthlyPMI, percentage: (monthlyPMI / totalMonthlyPayment) * 100 },
  ].filter(item => item.value > 0);

  return {
    summary: `Your true monthly mortgage cost is ${formatCurrency(totalMonthlyPayment)}, not just the ${formatCurrency(principalAndInterest)} principal and interest most calculators show.`,
    details: {
      totalMonthlyPayment: parseFloat(totalMonthlyPayment.toFixed(2)),
      principalAndInterest: parseFloat(principalAndInterest.toFixed(2)),
      monthlyPropertyTax: parseFloat(monthlyPropertyTax.toFixed(2)),
      monthlyInsurance: parseFloat(monthlyInsurance.toFixed(2)),
      monthlyHOA: parseFloat(hoaFees.toFixed(2)),
      monthlyPMI: parseFloat(monthlyPMI.toFixed(2)),
      annualPMI: Math.round(monthlyPMI * 12),
      pmiRate: parseFloat(pmiRate.toFixed(2)),
      pmiEstimated: pmiEstimated ? 1 : 0,
      ltv: parseFloat(ltv.toFixed(1)),
      creditScore,
      loanAmount: parseFloat(loanAmount.toFixed(2)),
      downPaymentPercent: parseFloat(downPaymentPercent.toFixed(2)),
      totalPaid: parseFloat(totalPaid.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
    },
    chartData,
    insights,
  };
}
