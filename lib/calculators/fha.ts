import type { CalculatorResult } from './types';

export interface FHAInputs {
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  creditScore: number;
  propertyTax: number;
  homeInsurance: number;
  monthlyGrossIncome: number;
  monthlyDebts: number;
}

export function calculateFHA(inputs: FHAInputs): CalculatorResult {
  const {
    homePrice,
    downPaymentPercent,
    interestRate,
    loanTerm,
    creditScore,
    propertyTax,
    homeInsurance,
    monthlyGrossIncome,
    monthlyDebts,
  } = inputs;

  const downPayment = homePrice * (downPaymentPercent / 100);
  const baseLoanAmount = homePrice - downPayment;

  // FHA MIP rates (as of current guidelines)
  // Upfront MIP: 1.75% of base loan amount
  const upfrontMIP = baseLoanAmount * 0.0175;
  const totalLoanAmount = baseLoanAmount + upfrontMIP; // FHA rolls upfront MIP into loan

  // Annual MIP rate depends on loan term, LTV, and loan amount
  const ltv = (baseLoanAmount / homePrice) * 100;
  let annualMIPRate: number;
  if (loanTerm <= 15) {
    if (ltv <= 90) annualMIPRate = 0.15;
    else annualMIPRate = 0.40;
  } else {
    if (baseLoanAmount <= 726200) {
      if (ltv <= 95) annualMIPRate = 0.50;
      else annualMIPRate = 0.55;
    } else {
      if (ltv <= 95) annualMIPRate = 0.70;
      else annualMIPRate = 0.75;
    }
  }

  const monthlyMIP = (baseLoanAmount * (annualMIPRate / 100)) / 12;

  // MIP duration
  // For 30-year loans with >10% down: 11 years. Otherwise: life of loan.
  const mipDurationYears = downPaymentPercent >= 10 ? 11 : loanTerm;
  const mipDurationMonths = mipDurationYears * 12;

  // Monthly P&I on total loan (including financed upfront MIP)
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPI = monthlyRate === 0
    ? totalLoanAmount / numberOfPayments
    : (totalLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const totalMonthlyPayment = monthlyPI + monthlyMIP + monthlyPropertyTax + monthlyInsurance;

  // Total interest over life of loan
  const totalPaid = monthlyPI * numberOfPayments;
  const totalInterest = totalPaid - totalLoanAmount;
  const totalMIPCost = monthlyMIP * mipDurationMonths + upfrontMIP;

  // DTI check
  const housingDTI = monthlyGrossIncome > 0 ? (totalMonthlyPayment / monthlyGrossIncome) * 100 : 0;
  const totalDTI = monthlyGrossIncome > 0 ? ((totalMonthlyPayment + monthlyDebts) / monthlyGrossIncome) * 100 : 0;

  // FHA eligibility
  const minDownPayment = creditScore >= 580 ? 3.5 : 10;
  const meetsDownPayment = downPaymentPercent >= minDownPayment;
  const meetsCreditScore = creditScore >= 500;
  const meetsDTI = totalDTI <= 57; // FHA can go up to 57% with compensating factors
  const meetsStandardDTI = totalDTI <= 43;

  // FHA loan limits (2024 baseline)
  const fhaLoanLimit = 498257; // Baseline, varies by county
  const highCostLimit = 1149825;
  const withinLoanLimit = baseLoanAmount <= highCostLimit;

  // Comparison: FHA vs Conventional
  const convDownPayment = homePrice * 0.05; // 5% conventional
  const convLoanAmount = homePrice - convDownPayment;
  const convMonthlyPI = monthlyRate === 0
    ? convLoanAmount / numberOfPayments
    : (convLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  // Conventional PMI estimate
  const convPMIRate = creditScore >= 740 ? 0.30 : creditScore >= 720 ? 0.47 : creditScore >= 700 ? 0.58 : 0.90;
  const convMonthlyPMI = (convLoanAmount * (convPMIRate / 100)) / 12;
  const convTotalMonthly = convMonthlyPI + convMonthlyPMI + monthlyPropertyTax + monthlyInsurance;

  // Chart data
  const chartData: Array<Record<string, number | string>> = [
    { name: 'Principal & Interest', value: Math.round(monthlyPI) },
    { name: 'Monthly MIP', value: Math.round(monthlyMIP) },
    { name: 'Property Tax', value: Math.round(monthlyPropertyTax) },
    { name: 'Insurance', value: Math.round(monthlyInsurance) },
  ];

  // Insights
  const insights: string[] = [];

  if (!meetsCreditScore) {
    insights.push(`A credit score of ${creditScore} is below the FHA minimum of 500. You'll need to improve your credit before applying for an FHA loan.`);
  } else if (creditScore < 580) {
    insights.push(`With a ${creditScore} credit score, FHA requires a minimum 10% down payment. Improving to 580+ would allow just 3.5% down.`);
  } else {
    insights.push(`With a ${creditScore} credit score, you qualify for FHA's minimum 3.5% down payment. Your actual down payment of ${downPaymentPercent}% ${meetsDownPayment ? 'meets' : 'is below'} this requirement.`);
  }

  insights.push(
    `FHA charges two types of mortgage insurance: an upfront premium of $${Math.round(upfrontMIP).toLocaleString()} (1.75% of loan, financed into the loan) and a monthly premium of $${Math.round(monthlyMIP)}/mo (${annualMIPRate}% annually).`
  );

  if (mipDurationYears < loanTerm) {
    insights.push(
      `With ${downPaymentPercent}% down, your monthly MIP drops off after ${mipDurationYears} years. Total MIP cost: $${Math.round(totalMIPCost).toLocaleString()}.`
    );
  } else {
    insights.push(
      `With less than 10% down on a 30-year FHA loan, MIP lasts the entire life of the loan. Total MIP cost: $${Math.round(totalMIPCost).toLocaleString()}. Consider refinancing to conventional once you reach 20% equity.`
    );
  }

  if (convTotalMonthly < totalMonthlyPayment && creditScore >= 680) {
    insights.push(
      `A conventional loan with 5% down would cost $${Math.round(convTotalMonthly).toLocaleString()}/mo vs FHA at $${Math.round(totalMonthlyPayment).toLocaleString()}/mo. With your credit score, conventional may be the better option.`
    );
  } else if (creditScore < 680) {
    insights.push(
      `FHA is likely your best option with a ${creditScore} credit score. Conventional loans typically require 680+ for competitive PMI rates.`
    );
  }

  if (totalDTI > 43 && totalDTI <= 57) {
    insights.push(`Your DTI of ${totalDTI.toFixed(1)}% exceeds the standard 43% limit but FHA may approve up to 57% with compensating factors (cash reserves, minimal payment increase, etc.).`);
  } else if (totalDTI > 57) {
    insights.push(`Your DTI of ${totalDTI.toFixed(1)}% exceeds even FHA's maximum of 57%. You'll need to reduce debts or increase income.`);
  }

  return {
    summary: `FHA monthly payment: $${Math.round(totalMonthlyPayment).toLocaleString()} (P&I: $${Math.round(monthlyPI).toLocaleString()} + MIP: $${Math.round(monthlyMIP)} + Tax/Ins: $${Math.round(monthlyPropertyTax + monthlyInsurance)})`,
    details: {
      homePrice,
      downPayment: Math.round(downPayment),
      downPaymentPercent,
      baseLoanAmount: Math.round(baseLoanAmount),
      upfrontMIP: Math.round(upfrontMIP),
      totalLoanAmount: Math.round(totalLoanAmount),
      monthlyPI: Math.round(monthlyPI),
      monthlyMIP: Math.round(monthlyMIP),
      annualMIPRate,
      monthlyPropertyTax: Math.round(monthlyPropertyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      totalMonthlyPayment: Math.round(totalMonthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalMIPCost: Math.round(totalMIPCost),
      mipDurationYears,
      housingDTI: Math.round(housingDTI * 10) / 10,
      totalDTI: Math.round(totalDTI * 10) / 10,
      minDownPayment,
      meetsDownPayment: meetsDownPayment ? 1 : 0,
      meetsCreditScore: meetsCreditScore ? 1 : 0,
      meetsDTI: meetsDTI ? 1 : 0,
      meetsStandardDTI: meetsStandardDTI ? 1 : 0,
      convTotalMonthly: Math.round(convTotalMonthly),
      convMonthlyPI: Math.round(convMonthlyPI),
      convMonthlyPMI: Math.round(convMonthlyPMI),
      ltv: Math.round(ltv * 10) / 10,
    },
    chartData,
    insights,
  };
}
