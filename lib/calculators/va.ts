import type { CalculatorResult } from './types';
import {
  backEndDtiPercent,
  fhaMonthlyMip,
  fhaUpfrontMip,
  frontEndDtiPercent,
  monthlyPayment,
  monthlyPmiAmount,
  vaFundingFeeRatePercent,
  type VALoanPurpose,
} from './mortgageMath';

export type { VALoanPurpose };
export type VARegion = 'northeast' | 'midwest' | 'south' | 'west';

export interface VAInputs {
  homePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  loanPurpose: VALoanPurpose;
  serviceType: 'regular' | 'reserves-guard' | 'surviving-spouse';
  firstTimeUse: boolean;
  disabilityExempt: boolean;
  region: VARegion;
  familySize: number;
  propertyTax: number;
  homeInsurance: number;
  monthlyGrossIncome: number;
  monthlyDebts: number;
}

export const VA_REGION_LABELS: Record<VARegion, string> = {
  northeast: 'Northeast',
  midwest: 'Midwest',
  south: 'South',
  west: 'West',
};

// VA residual income guidelines (VA Lenders Handbook, Pamphlet 26-7, Ch. 4).
// Monthly residual income required by region, indexed by family size (1-5).
// For families larger than 5, add $80 per additional member (up to 7).
export const VA_RESIDUAL_INCOME_80K_PLUS: Record<VARegion, number[]> = {
  northeast: [450, 755, 909, 1025, 1062],
  midwest: [441, 738, 889, 1003, 1039],
  south: [441, 738, 889, 1003, 1039],
  west: [491, 823, 990, 1117, 1158],
};

export const VA_RESIDUAL_INCOME_UNDER_80K: Record<VARegion, number[]> = {
  northeast: [390, 654, 788, 888, 921],
  midwest: [382, 641, 772, 868, 902],
  south: [382, 641, 772, 868, 902],
  west: [425, 713, 859, 967, 1004],
};

export function getResidualIncomeTable(loanAmount: number): Record<VARegion, number[]> {
  return loanAmount >= 80000 ? VA_RESIDUAL_INCOME_80K_PLUS : VA_RESIDUAL_INCOME_UNDER_80K;
}

export function getRequiredResidualIncome(
  region: VARegion,
  familySize: number,
  loanAmount: number
): number {
  const row = getResidualIncomeTable(loanAmount)[region];
  const size = Math.max(1, Math.round(familySize));
  if (size <= 5) return row[size - 1];
  // VA guidance: add $80 per family member over 5, up to a family of 7
  return row[4] + 80 * Math.min(size - 5, 2);
}

export function calculateVA(inputs: VAInputs): CalculatorResult {
  const {
    homePrice,
    downPaymentPercent,
    interestRate,
    loanTerm,
    loanPurpose = 'purchase',
    serviceType,
    firstTimeUse,
    disabilityExempt,
    region = 'south',
    familySize = 3,
    propertyTax,
    homeInsurance,
    monthlyGrossIncome,
    monthlyDebts,
  } = inputs;

  const isPurchase = loanPurpose === 'purchase';
  const downPayment = homePrice * (downPaymentPercent / 100);
  const baseLoanAmount = homePrice - downPayment;

  // VA Funding Fee — shared mortgage-math is the single source of truth
  const fundingFeeRate = vaFundingFeeRatePercent(
    downPaymentPercent,
    firstTimeUse,
    serviceType,
    disabilityExempt,
    loanPurpose
  );
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

  // DTI — VA treats 41% as a guideline, not a hard cutoff. Qualification
  // centers on residual income; higher DTIs are approved with sufficient
  // residual income and compensating factors.
  const housingDTI = frontEndDtiPercent(totalMonthlyPayment, monthlyGrossIncome);
  const totalDTI = backEndDtiPercent(totalMonthlyPayment, monthlyDebts, monthlyGrossIncome);

  // Residual income estimate (simplified — actual underwriting subtracts
  // taxes, child care, utilities/maintenance, and other obligations)
  const monthlyResidualIncome = monthlyGrossIncome * 0.75 - totalMonthlyPayment - monthlyDebts;

  // VA residual income guideline for this region/family size/loan amount
  const requiredResidualIncome = getRequiredResidualIncome(region, familySize, totalLoanAmount);
  // When DTI exceeds 41%, VA guidance calls for residual income at least 20%
  // above the guideline (absent other compensating factors)
  const dtiAboveGuideline = totalDTI > 41;
  const effectiveRequiredResidual = dtiAboveGuideline
    ? requiredResidualIncome * 1.2
    : requiredResidualIncome;
  const residualIncomeSurplus = monthlyResidualIncome - effectiveRequiredResidual;

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
  const convMonthlyPMI = monthlyPmiAmount(convLoanAmount, 0.5); // ~0.5%/yr estimate
  const convTotalMonthly = convMonthlyPI + convMonthlyPMI + monthlyPropertyTax + monthlyInsurance;

  // Savings from no PMI
  const pmiSavingsVsConv = convMonthlyPMI;

  // Chart data — payment breakdown
  const chartData: Array<Record<string, number | string>> = [
    { name: 'Principal & Interest', value: Math.round(monthlyPI) },
    { name: 'Property Tax', value: Math.round(monthlyPropertyTax) },
    { name: 'Insurance', value: Math.round(monthlyInsurance) },
  ];

  // Insights
  const insights: string[] = [];

  insights.push(
    `VA loans require no down payment and no monthly mortgage insurance — saving you $${Math.round(pmiSavingsVsConv)}/month vs a conventional loan with PMI.`
  );

  if (fundingFee > 0) {
    if (loanPurpose === 'irrrl') {
      insights.push(
        `The IRRRL (streamline refinance) funding fee is a flat 0.5% ($${fundingFee.toLocaleString()}) — the lowest VA fee tier, regardless of prior use or equity.`
      );
    } else if (loanPurpose === 'cash-out') {
      insights.push(
        `The cash-out refinance funding fee is ${fundingFeeRate}% ($${fundingFee.toLocaleString()}) for ${firstTimeUse ? 'first' : 'subsequent'} use. Unlike purchase loans, equity or down payment does not reduce this fee.`
      );
    } else {
      insights.push(
        `The VA funding fee is ${fundingFeeRate}% ($${fundingFee.toLocaleString()}), financed into the loan. ${firstTimeUse ? 'First-time' : 'Subsequent'} use rate applies. Putting 5%+ down reduces this fee significantly.`
      );
    }
  } else if (serviceType === 'surviving-spouse' && !disabilityExempt) {
    insights.push(
      `Eligible surviving spouses receiving Dependency and Indemnity Compensation are exempt from the VA funding fee — saving $${Math.round(baseLoanAmount * 0.0215).toLocaleString()} vs a typical first-use borrower.`
    );
  } else {
    insights.push(
      `You're exempt from the VA funding fee due to disability status, saving you $${Math.round(baseLoanAmount * 0.0215).toLocaleString()} that most VA borrowers pay.`
    );
  }

  if (serviceType === 'reserves-guard') {
    insights.push(
      `Since 2020, Reserve and National Guard members pay the same funding fee rates as active-duty service members — the old higher Reserve/Guard tier no longer applies.`
    );
  }

  const vaVsFHA = fhaTotalMonthly - totalMonthlyPayment;
  const vaVsConv = convTotalMonthly - totalMonthlyPayment;
  if (isPurchase && vaVsFHA > 0) {
    insights.push(
      `VA saves you $${Math.round(vaVsFHA)}/month vs FHA ($${Math.round(vaVsFHA * 12).toLocaleString()}/year) — primarily because VA has no monthly mortgage insurance.`
    );
  }
  if (isPurchase && vaVsConv > 0) {
    insights.push(
      `VA saves you $${Math.round(vaVsConv)}/month vs conventional with 5% down ($${Math.round(vaVsConv * 12).toLocaleString()}/year).`
    );
  } else if (isPurchase && vaVsConv < 0) {
    insights.push(
      `In this scenario, a conventional loan with 5% down would cost $${Math.round(-vaVsConv)}/month less than VA, because the financed funding fee outweighs the PMI difference. VA may still win if minimizing upfront cash matters most to you.`
    );
  }

  // Residual income guidance — VA's primary affordability measure
  const residualContext = `VA guidance for a ${familySize}-person household in the ${VA_REGION_LABELS[region]} is $${Math.round(effectiveRequiredResidual).toLocaleString()}/month residual income${dtiAboveGuideline ? ' (20% above the standard table because DTI exceeds 41%)' : ''}.`;
  if (residualIncomeSurplus >= 0) {
    insights.push(
      `Your estimated residual income of $${Math.round(monthlyResidualIncome).toLocaleString()}/month is above the guideline. ${residualContext}`
    );
  } else {
    insights.push(
      `Your estimated residual income of $${Math.round(monthlyResidualIncome).toLocaleString()}/month falls short of the guideline by $${Math.abs(Math.round(residualIncomeSurplus)).toLocaleString()}. ${residualContext} Lenders weigh residual income alongside the full picture — this is guidance, not a denial.`
    );
  }

  if (dtiAboveGuideline) {
    insights.push(
      `Your DTI of ${totalDTI.toFixed(1)}% is above VA's 41% guideline, but VA has no hard DTI cap. Loans above 41% DTI are routinely approved when residual income exceeds the regional guideline by 20% or other compensating factors exist.`
    );
  }

  if (isPurchase && downPaymentPercent === 0 && fundingFeeRate > 1.5) {
    insights.push(
      `Putting just 5% down ($${Math.round(homePrice * 0.05).toLocaleString()}) would reduce your funding fee from ${fundingFeeRate}% to 1.5%, saving $${Math.round(baseLoanAmount * (fundingFeeRate / 100) - baseLoanAmount * 0.015).toLocaleString()}.`
    );
  }

  const purposeLabel = loanPurpose === 'irrrl' ? 'VA IRRRL' : loanPurpose === 'cash-out' ? 'VA cash-out refi' : 'VA';
  return {
    summary: `${purposeLabel} monthly payment: $${Math.round(totalMonthlyPayment).toLocaleString()} with no PMI. Funding fee: $${fundingFee.toLocaleString()} (${fundingFeeRate}%).`,
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
      dtiAboveGuideline: dtiAboveGuideline ? 1 : 0,
      monthlyResidualIncome: Math.round(monthlyResidualIncome),
      requiredResidualIncome: Math.round(requiredResidualIncome),
      effectiveRequiredResidual: Math.round(effectiveRequiredResidual),
      residualIncomeSurplus: Math.round(residualIncomeSurplus),
      fhaTotalMonthly: Math.round(fhaTotalMonthly),
      fhaDownPayment: Math.round(fhaDownPayment),
      fhaMonthlyMIP: Math.round(fhaMonthlyMIP),
      convTotalMonthly: Math.round(convTotalMonthly),
      convDownPayment: Math.round(convDownPayment),
      convMonthlyPMI: Math.round(convMonthlyPMI),
      pmiSavingsVsConv: Math.round(pmiSavingsVsConv),
      feeExempt: fundingFeeRate === 0 ? 1 : 0,
    },
    chartData,
    insights,
  };
}
