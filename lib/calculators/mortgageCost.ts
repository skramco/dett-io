import type { MortgageCostInputs, CalculatorResult } from './types';
import { getAnnualPMIRate } from './pmiRates';

export function calculateMortgageCost(inputs: MortgageCostInputs): CalculatorResult {
  const {
    homePrice,
    downPayment,
    interestRate,
    loanTerm,
    propertyTax,
    homeInsurance,
    hoaFees,
    pmi,
    creditScore,
  } = inputs;

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  const principalAndInterest =
    monthlyRate === 0
      ? loanAmount / numberOfPayments
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;

  // PMI applies when LTV > 80%. A user-supplied annual PMI amount overrides
  // the estimate from the shared LTV × credit score rate grid.
  const ltv = homePrice > 0 ? (loanAmount / homePrice) * 100 : 0;
  let pmiRate = 0;
  let annualPMI = 0;
  if (ltv > 80) {
    pmiRate = getAnnualPMIRate(ltv, creditScore);
    annualPMI = pmi && pmi > 0 ? pmi : loanAmount * (pmiRate / 100);
  }
  const monthlyPMI = annualPMI / 12;

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
    const rateNote = pmi && pmi > 0
      ? ''
      : ` (${pmiRate.toFixed(2)}% of your loan annually${creditScore ? `, based on a ${creditScore} credit score` : ''})`;
    insights.push(
      `You're paying $${monthlyPMI.toFixed(2)}/month in PMI${rateNote} because your down payment is less than 20%. This adds $${(monthlyPMI * 12).toFixed(0)}/year until you reach 20% equity.`
    );
  }

  if (totalInterest > loanAmount) {
    insights.push(
      `Over ${loanTerm} years, you'll pay $${totalInterest.toFixed(0)} in interest - that's ${((totalInterest / loanAmount) * 100).toFixed(0)}% of your loan amount.`
    );
  }

  const pitiPercentage = ((principalAndInterest / totalMonthlyPayment) * 100).toFixed(0);
  insights.push(
    `Principal & interest is only ${pitiPercentage}% of your true monthly cost. The rest is taxes, insurance, and fees.`
  );

  if (hoaFees > 0) {
    insights.push(
      `HOA fees add $${(hoaFees * 12).toFixed(0)}/year to your housing costs.`
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
    summary: `Your true monthly mortgage cost is $${totalMonthlyPayment.toFixed(2)}, not just the $${principalAndInterest.toFixed(2)} principal and interest most calculators show.`,
    details: {
      totalMonthlyPayment: parseFloat(totalMonthlyPayment.toFixed(2)),
      principalAndInterest: parseFloat(principalAndInterest.toFixed(2)),
      monthlyPropertyTax: parseFloat(monthlyPropertyTax.toFixed(2)),
      monthlyInsurance: parseFloat(monthlyInsurance.toFixed(2)),
      monthlyHOA: parseFloat(hoaFees.toFixed(2)),
      monthlyPMI: parseFloat(monthlyPMI.toFixed(2)),
      pmiRate: parseFloat(pmiRate.toFixed(2)),
      ltv: parseFloat(ltv.toFixed(1)),
      loanAmount: parseFloat(loanAmount.toFixed(2)),
      downPaymentPercent: parseFloat(downPaymentPercent.toFixed(2)),
      totalPaid: parseFloat(totalPaid.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
    },
    chartData,
    insights,
  };
}
