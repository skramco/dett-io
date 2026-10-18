import { formatCurrency } from '../format';
import type { CalculatorResult } from './types';
import {
  backEndDtiPercent,
  conventionalPmiRatePercent,
  fhaAnnualMipRatePercent,
  fhaMipDurationYears,
  fhaMonthlyMip,
  fhaUpfrontMip,
  frontEndDtiPercent,
  ltvPercent,
  monthlyPayment,
  monthlyPmiAmount,
} from './mortgageMath';
import {
  LOAN_LIMIT_YEAR,
  CONFORMING_LOAN_LIMIT,
  FHA_LOAN_LIMIT_FLOOR,
  FHA_LOAN_LIMIT_CEILING,
  isJumboLoan,
} from './loanLimits';

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
  const upfrontMIP = fhaUpfrontMip(baseLoanAmount);
  const totalLoanAmount = baseLoanAmount + upfrontMIP; // FHA rolls upfront MIP into loan

  // Annual MIP rate depends on loan term, LTV, and loan amount
  const ltv = ltvPercent(baseLoanAmount, homePrice);
  const annualMIPRate = fhaAnnualMipRatePercent(baseLoanAmount, ltv, loanTerm);

  const monthlyMIP = fhaMonthlyMip(baseLoanAmount, annualMIPRate);

  // MIP duration (HUD Handbook 4000.1): with a down payment of 10% or more
  // (LTV <= 90% at origination), MIP ends after 11 years. Otherwise it lasts
  // the full loan term.
  const mipDurationYears = fhaMipDurationYears(downPaymentPercent, loanTerm);
  const mipDurationMonths = mipDurationYears * 12;

  // Monthly P&I on total loan (including financed upfront MIP)
  const numberOfPayments = loanTerm * 12;
  const monthlyPI = monthlyPayment(totalLoanAmount, interestRate, numberOfPayments);

  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const totalMonthlyPayment = monthlyPI + monthlyMIP + monthlyPropertyTax + monthlyInsurance;

  // Total interest over life of loan
  const totalPaid = monthlyPI * numberOfPayments;
  const totalInterest = totalPaid - totalLoanAmount;
  const totalMIPCost = monthlyMIP * mipDurationMonths + upfrontMIP;

  // DTI check
  const housingDTI = frontEndDtiPercent(totalMonthlyPayment, monthlyGrossIncome);
  const totalDTI = backEndDtiPercent(totalMonthlyPayment, monthlyDebts, monthlyGrossIncome);

  // FHA eligibility
  const minDownPayment = creditScore >= 580 ? 3.5 : 10;
  const meetsDownPayment = downPaymentPercent >= minDownPayment;
  const meetsCreditScore = creditScore >= 500;
  const meetsDTI = totalDTI <= 57; // FHA can go up to 57% with compensating factors
  const meetsStandardDTI = totalDTI <= 43;

  // FHA county loan limits (one-unit). The floor applies in most counties;
  // high-cost counties go up to the ceiling. FHA limits apply to the base
  // loan amount (financed upfront MIP may exceed the limit).
  const withinFhaFloor = baseLoanAmount <= FHA_LOAN_LIMIT_FLOOR;
  const withinFhaCeiling = baseLoanAmount <= FHA_LOAN_LIMIT_CEILING;
  // Jumbo applies to the conventional alternative: above the conforming limit.
  const isJumbo = isJumboLoan(baseLoanAmount);

  // Comparison: FHA vs Conventional
  const convDownPayment = homePrice * 0.05; // 5% conventional
  const convLoanAmount = homePrice - convDownPayment;
  const convMonthlyPI = monthlyPayment(convLoanAmount, interestRate, numberOfPayments);
  // Conventional PMI estimate from the shared LTV/credit-score rate table
  const convPMIRate = conventionalPmiRatePercent(ltvPercent(convLoanAmount, homePrice), creditScore);
  const convMonthlyPMI = monthlyPmiAmount(convLoanAmount, convPMIRate);
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
    insights.push(`With a ${creditScore} credit score, FHA guidelines typically allow the minimum 3.5% down payment. Your down payment of ${downPaymentPercent}% ${meetsDownPayment ? 'meets' : 'is below'} that typical guideline.`);
  }

  insights.push(
    `FHA charges two types of mortgage insurance: an upfront premium of ${formatCurrency(upfrontMIP)} (1.75% of loan, financed into the loan) and a monthly premium of ${formatCurrency(monthlyMIP)}/mo (${annualMIPRate}% annually).`
  );

  if (mipDurationYears < loanTerm) {
    insights.push(
      `With ${downPaymentPercent}% down (10% or more), your monthly MIP drops off after ${mipDurationYears} years instead of lasting the full loan term. Total MIP cost: ${formatCurrency(totalMIPCost)}.`
    );
  } else {
    insights.push(
      `With less than 10% down, FHA MIP lasts the entire life of the loan. Total MIP cost: ${formatCurrency(totalMIPCost)}. Consider refinancing to conventional once you reach 20% equity, or putting 10%+ down to limit MIP to 11 years.`
    );
  }

  if (!withinFhaCeiling) {
    insights.push(
      `Your base loan of ${formatCurrency(baseLoanAmount)} is above the ${LOAN_LIMIT_YEAR} FHA ceiling of ${formatCurrency(FHA_LOAN_LIMIT_CEILING)} — the maximum even in the highest-cost counties — so this scenario wouldn't fit an FHA loan. A jumbo loan is the more likely route at this amount.`
    );
  } else if (!withinFhaFloor) {
    insights.push(
      `Your base loan of ${formatCurrency(baseLoanAmount)} is above the ${LOAN_LIMIT_YEAR} FHA limit of ${formatCurrency(FHA_LOAN_LIMIT_FLOOR)} that applies in most counties. High-cost counties allow up to ${formatCurrency(FHA_LOAN_LIMIT_CEILING)}, so check your county's limit on HUD's lookup tool before counting on FHA.`
    );
  }

  if (isJumbo) {
    insights.push(
      `At ${formatCurrency(baseLoanAmount)}, the loan is above the ${LOAN_LIMIT_YEAR} conforming limit of ${formatCurrency(CONFORMING_LOAN_LIMIT)} (most counties), so the conventional alternative would be a jumbo loan — typically requiring higher credit scores, larger down payments, and sometimes different pricing.`
    );
  }

  if (convTotalMonthly < totalMonthlyPayment && creditScore >= 680) {
    insights.push(
      `A conventional loan with 5% down would cost ${formatCurrency(convTotalMonthly)}/mo vs FHA at ${formatCurrency(totalMonthlyPayment)}/mo. With your credit score, conventional may be the better option.`
    );
  } else if (creditScore < 680) {
    insights.push(
      `FHA is likely your best option with a ${creditScore} credit score. Conventional loans typically require 680+ for competitive PMI rates.`
    );
  }

  if (totalDTI > 43 && totalDTI <= 57) {
    insights.push(`Your DTI of ${totalDTI.toFixed(1)}% exceeds the standard 43% guideline, but FHA guidelines can extend up to 57% with compensating factors (cash reserves, minimal payment increase, etc.).`);
  } else if (totalDTI > 57) {
    insights.push(`Your DTI of ${totalDTI.toFixed(1)}% exceeds even FHA's maximum of 57%. You'll need to reduce debts or increase income.`);
  }

  return {
    summary: `FHA monthly payment: ${formatCurrency(totalMonthlyPayment)} (P&I: ${formatCurrency(monthlyPI)} + MIP: ${formatCurrency(monthlyMIP)} + Tax/Ins: ${formatCurrency(monthlyPropertyTax + monthlyInsurance)})`,
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
      loanLimitYear: LOAN_LIMIT_YEAR,
      conformingLoanLimit: CONFORMING_LOAN_LIMIT,
      fhaLoanLimitFloor: FHA_LOAN_LIMIT_FLOOR,
      fhaLoanLimitCeiling: FHA_LOAN_LIMIT_CEILING,
      withinFhaFloor: withinFhaFloor ? 1 : 0,
      withinFhaCeiling: withinFhaCeiling ? 1 : 0,
      isJumbo: isJumbo ? 1 : 0,
    },
    chartData,
    insights,
  };
}
