import type { CalculatorResult } from './types';
import {
  backEndDtiPercent,
  conventionalPmiRatePercent,
  fhaMonthlyMip,
  fhaUpfrontMip,
  frontEndDtiPercent,
  ltvPercent,
  monthlyPayment,
  monthlyPmiAmount,
  vaFundingFeeRatePercent,
} from './mortgageMath';

export interface VAInputs {
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  serviceType: 'regular' | 'reserves-guard' | 'surviving-spouse';
  firstTimeUse: boolean;
  disabilityExempt: boolean;
  propertyTax: number;
  homeInsurance: number;
  monthlyGrossIncome: number;
  monthlyDebts: number;
}

export function calculateVA(inputs: VAInputs): CalculatorResult {
  const {
    homePrice,
    downPaymentPercent,
    interestRate,
    loanTerm,
    serviceType,
    firstTimeUse,
    disabilityExempt,
    propertyTax,
    homeInsurance,
    monthlyGrossIncome,
    monthlyDebts,
  } = inputs;

  const downPayment = homePrice * (downPaymentPercent / 100);
  const baseLoanAmount = homePrice - downPayment;

  // VA Funding Fee
  const fundingFeeRate = vaFundingFeeRatePercent(downPaymentPercent, firstTimeUse, serviceType, disabilityExempt);
  const fundingFee = Math.round(baseLoanAmount * (fundingFeeRate / 100));
  const totalLoanAmount = baseLoanAmount + fundingFee; // VA allows financing the funding fee

  // Monthly P&I on total loan (including financed funding fee)
  const numberOfPayments = loanTerm * 12;
  const monthlyPI = monthlyPayment(totalLoanAmount, interestRate, numberOfPayments);

  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance;
  // VA loans have NO PMI — this is a key benefit

  // Total interest over life of loan
  const totalPaid = monthlyPI * numberOfPayments;
  const totalInterest = totalPaid - totalLoanAmount;

  // DTI check — VA uses residual income method but also checks DTI
  const housingDTI = frontEndDtiPercent(totalMonthlyPayment, monthlyGrossIncome);
  const totalDTI = backEndDtiPercent(totalMonthlyPayment, monthlyDebts, monthlyGrossIncome);
  const meetsDTI = totalDTI <= 41; // VA guideline is 41%, but can go higher with compensating factors
  const meetsExtendedDTI = totalDTI <= 50;

  // Residual income estimate (simplified)
  const monthlyResidualIncome = monthlyGrossIncome * 0.75 - totalMonthlyPayment - monthlyDebts; // Rough after-tax estimate

  // Comparison: VA vs FHA vs Conventional
  // FHA comparison (3.5% down)
  const fhaDownPayment = homePrice * 0.035;
  const fhaLoanAmount = homePrice - fhaDownPayment;
  const fhaUpfrontMIP = fhaUpfrontMip(fhaLoanAmount);
  const fhaTotalLoan = fhaLoanAmount + fhaUpfrontMIP;
  const fhaMonthlyPI = monthlyPayment(fhaTotalLoan, interestRate, numberOfPayments);
  const fhaMonthlyMIP = fhaMonthlyMip(fhaLoanAmount, 0.55); // 0.55% annual MIP
  const fhaTotalMonthly = fhaMonthlyPI + fhaMonthlyMIP + monthlyPropertyTax + monthlyInsurance;

  // Conventional comparison (5% down)
  const convDownPayment = homePrice * 0.05;
  const convLoanAmount = homePrice - convDownPayment;
  const convMonthlyPI = monthlyPayment(convLoanAmount, interestRate, numberOfPayments);
  // Conventional PMI from the shared LTV × credit grid (typical-borrower fallback).
  const convPMIRate = conventionalPmiRatePercent(ltvPercent(convLoanAmount, homePrice));
  const convMonthlyPMI = monthlyPmiAmount(convLoanAmount, convPMIRate);
  const convTotalMonthly = convMonthlyPI + convMonthlyPMI + monthlyPropertyTax + monthlyInsurance;

  // Savings from no PMI
  const pmiSavingsVsConv = convMonthlyPMI;
  const mipSavingsVsFHA = fhaMonthlyMIP;

  // Chart data — payment breakdown
  const chartData: Array<Record<string, number | string>> = [
    { name: 'Principal & Interest', value: Math.round(monthlyPI) },
    { name: 'Property Tax', value: Math.round(monthlyPropertyTax) },
    { name: 'Insurance', value: Math.round(monthlyInsurance) },
  ];

  // Comparison chart data
  const comparisonData: Array<Record<string, number | string>> = [
    { name: 'VA Loan', payment: Math.round(totalMonthlyPayment), downPayment: Math.round(downPayment), mortgageInsurance: 0 },
    { name: 'FHA Loan', payment: Math.round(fhaTotalMonthly), downPayment: Math.round(fhaDownPayment), mortgageInsurance: Math.round(fhaMonthlyMIP) },
    { name: 'Conventional', payment: Math.round(convTotalMonthly), downPayment: Math.round(convDownPayment), mortgageInsurance: Math.round(convMonthlyPMI) },
  ];

  // Insights
  const insights: string[] = [];

  insights.push(
    `VA loans require no down payment and no monthly mortgage insurance — saving you $${Math.round(pmiSavingsVsConv)}/month vs a conventional loan with PMI.`
  );

  if (fundingFee > 0) {
    insights.push(
      `The VA funding fee is ${fundingFeeRate}% ($${fundingFee.toLocaleString()}), financed into the loan. ${firstTimeUse ? 'First-time' : 'Subsequent'} use rate applies. Putting 5%+ down reduces this fee significantly.`
    );
  } else {
    insights.push(
      `You're exempt from the VA funding fee due to disability status, saving you $${Math.round(baseLoanAmount * 0.0215).toLocaleString()} that most VA borrowers pay.`
    );
  }

  const vaVsFHA = fhaTotalMonthly - totalMonthlyPayment;
  const vaVsConv = convTotalMonthly - totalMonthlyPayment;
  if (vaVsFHA > 0) {
    insights.push(
      `VA saves you $${Math.round(vaVsFHA)}/month vs FHA ($${Math.round(vaVsFHA * 12).toLocaleString()}/year) — primarily because VA has no monthly mortgage insurance.`
    );
  }
  if (vaVsConv > 0) {
    insights.push(
      `VA saves you $${Math.round(vaVsConv)}/month vs conventional with 5% down ($${Math.round(vaVsConv * 12).toLocaleString()}/year).`
    );
  } else if (vaVsConv < 0) {
    insights.push(
      `In this scenario, a conventional loan with 5% down would cost $${Math.round(-vaVsConv)}/month less than VA, because the financed funding fee outweighs the PMI difference. VA may still win if minimizing upfront cash matters most to you.`
    );
  }

  if (totalDTI > 41 && totalDTI <= 50) {
    insights.push(
      `Your DTI of ${totalDTI.toFixed(1)}% exceeds the 41% guideline, but VA may approve with sufficient residual income. Your estimated residual income is $${Math.round(monthlyResidualIncome).toLocaleString()}/month.`
    );
  } else if (totalDTI > 50) {
    insights.push(
      `Your DTI of ${totalDTI.toFixed(1)}% is high even for VA loans. Consider reducing debts or increasing income before applying.`
    );
  }

  if (downPaymentPercent === 0 && !disabilityExempt) {
    insights.push(
      `Putting just 5% down ($${Math.round(homePrice * 0.05).toLocaleString()}) would reduce your funding fee from ${fundingFeeRate}% to 1.5%, saving $${Math.round(baseLoanAmount * (fundingFeeRate / 100) - baseLoanAmount * 0.015).toLocaleString()}.`
    );
  }

  return {
    summary: `VA monthly payment: $${Math.round(totalMonthlyPayment).toLocaleString()} with $0 down and no PMI. Funding fee: $${fundingFee.toLocaleString()} (${fundingFeeRate}%).`,
    details: {
      homePrice,
      downPayment: Math.round(downPayment),
      downPaymentPercent,
      baseLoanAmount: Math.round(baseLoanAmount),
      fundingFeeRate,
      fundingFee,
      totalLoanAmount: Math.round(totalLoanAmount),
      monthlyPI: Math.round(monthlyPI),
      monthlyPropertyTax: Math.round(monthlyPropertyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      totalMonthlyPayment: Math.round(totalMonthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(totalPaid),
      housingDTI: Math.round(housingDTI * 10) / 10,
      totalDTI: Math.round(totalDTI * 10) / 10,
      meetsDTI: meetsDTI ? 1 : 0,
      meetsExtendedDTI: meetsExtendedDTI ? 1 : 0,
      monthlyResidualIncome: Math.round(monthlyResidualIncome),
      fhaTotalMonthly: Math.round(fhaTotalMonthly),
      fhaDownPayment: Math.round(fhaDownPayment),
      fhaMonthlyMIP: Math.round(fhaMonthlyMIP),
      convTotalMonthly: Math.round(convTotalMonthly),
      convDownPayment: Math.round(convDownPayment),
      convMonthlyPMI: Math.round(convMonthlyPMI),
      pmiSavingsVsConv: Math.round(pmiSavingsVsConv),
      disabilityExempt: disabilityExempt ? 1 : 0,
    },
    chartData,
    insights,
  };
}
