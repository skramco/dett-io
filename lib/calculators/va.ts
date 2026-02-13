import type { CalculatorResult } from './types';

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

// VA Funding Fee rates (as of current guidelines)
function getVAFundingFeeRate(
  downPaymentPercent: number,
  firstTimeUse: boolean,
  serviceType: string,
  disabilityExempt: boolean
): number {
  if (disabilityExempt) return 0;

  const isReservesGuard = serviceType === 'reserves-guard';

  if (downPaymentPercent >= 10) {
    return 1.25;
  } else if (downPaymentPercent >= 5) {
    return 1.5;
  } else {
    // Less than 5% down
    if (firstTimeUse) {
      return isReservesGuard ? 2.5 : 2.15;
    } else {
      return isReservesGuard ? 2.5 : 3.3;
    }
  }
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
  const fundingFeeRate = getVAFundingFeeRate(downPaymentPercent, firstTimeUse, serviceType, disabilityExempt);
  const fundingFee = Math.round(baseLoanAmount * (fundingFeeRate / 100));
  const totalLoanAmount = baseLoanAmount + fundingFee; // VA allows financing the funding fee

  // Monthly P&I on total loan (including financed funding fee)
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPI = monthlyRate === 0
    ? totalLoanAmount / numberOfPayments
    : (totalLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance;
  // VA loans have NO PMI — this is a key benefit

  // Total interest over life of loan
  const totalPaid = monthlyPI * numberOfPayments;
  const totalInterest = totalPaid - totalLoanAmount;

  // DTI check — VA uses residual income method but also checks DTI
  const housingDTI = monthlyGrossIncome > 0 ? (totalMonthlyPayment / monthlyGrossIncome) * 100 : 0;
  const totalDTI = monthlyGrossIncome > 0 ? ((totalMonthlyPayment + monthlyDebts) / monthlyGrossIncome) * 100 : 0;
  const meetsDTI = totalDTI <= 41; // VA guideline is 41%, but can go higher with compensating factors
  const meetsExtendedDTI = totalDTI <= 50;

  // Residual income estimate (simplified)
  const monthlyResidualIncome = monthlyGrossIncome * 0.75 - totalMonthlyPayment - monthlyDebts; // Rough after-tax estimate

  // Comparison: VA vs FHA vs Conventional
  // FHA comparison (3.5% down)
  const fhaDownPayment = homePrice * 0.035;
  const fhaLoanAmount = homePrice - fhaDownPayment;
  const fhaUpfrontMIP = fhaLoanAmount * 0.0175;
  const fhaTotalLoan = fhaLoanAmount + fhaUpfrontMIP;
  const fhaMonthlyPI = monthlyRate === 0
    ? fhaTotalLoan / numberOfPayments
    : (fhaTotalLoan * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const fhaMonthlyMIP = (fhaLoanAmount * 0.0055) / 12; // 0.55% annual MIP
  const fhaTotalMonthly = fhaMonthlyPI + fhaMonthlyMIP + monthlyPropertyTax + monthlyInsurance;

  // Conventional comparison (5% down)
  const convDownPayment = homePrice * 0.05;
  const convLoanAmount = homePrice - convDownPayment;
  const convMonthlyPI = monthlyRate === 0
    ? convLoanAmount / numberOfPayments
    : (convLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  const convPMIRate = 0.005; // ~0.5% estimate
  const convMonthlyPMI = (convLoanAmount * convPMIRate) / 12;
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
