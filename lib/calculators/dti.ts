import type { CalculatorResult } from './types';

export interface DTIInputs {
  monthlyGrossIncome: number;
  mortgagePayment: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  carPayments: number;
  studentLoans: number;
  creditCardMinimums: number;
  personalLoans: number;
  childSupport: number;
  otherDebts: number;
}

export function calculateDTI(inputs: DTIInputs): CalculatorResult {
  const {
    monthlyGrossIncome,
    mortgagePayment,
    propertyTax,
    homeInsurance,
    hoaFees,
    carPayments,
    studentLoans,
    creditCardMinimums,
    personalLoans,
    childSupport,
    otherDebts,
  } = inputs;

  const monthlyPropertyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;

  // Front-end DTI: housing costs only
  const housingCosts = mortgagePayment + monthlyPropertyTax + monthlyInsurance + hoaFees;
  const frontEndDTI = monthlyGrossIncome > 0 ? (housingCosts / monthlyGrossIncome) * 100 : 0;

  // Back-end DTI: all debts
  const nonHousingDebts = carPayments + studentLoans + creditCardMinimums + personalLoans + childSupport + otherDebts;
  const totalMonthlyDebts = housingCosts + nonHousingDebts;
  const backEndDTI = monthlyGrossIncome > 0 ? (totalMonthlyDebts / monthlyGrossIncome) * 100 : 0;

  // Remaining income
  const remainingIncome = monthlyGrossIncome - totalMonthlyDebts;
  const remainingPercent = monthlyGrossIncome > 0 ? (remainingIncome / monthlyGrossIncome) * 100 : 0;

  // DTI rating
  const getDTIRating = (dti: number): string => {
    if (dti <= 28) return 'Excellent';
    if (dti <= 36) return 'Good';
    if (dti <= 43) return 'Acceptable';
    if (dti <= 50) return 'High';
    return 'Very High';
  };

  const frontEndRating = getDTIRating(frontEndDTI);
  const backEndRating = getDTIRating(backEndDTI);

  // Max mortgage payment at different DTI thresholds
  const maxAt28 = monthlyGrossIncome * 0.28 - nonHousingDebts;
  const maxAt36 = monthlyGrossIncome * 0.36 - nonHousingDebts;
  const maxAt43 = monthlyGrossIncome * 0.43 - nonHousingDebts;
  const maxAt50 = monthlyGrossIncome * 0.50 - nonHousingDebts;

  // Chart data: debt breakdown
  const chartData: Array<Record<string, number | string>> = [];
  if (mortgagePayment > 0) chartData.push({ name: 'Mortgage P&I', value: mortgagePayment });
  if (monthlyPropertyTax > 0) chartData.push({ name: 'Property Tax', value: Math.round(monthlyPropertyTax) });
  if (monthlyInsurance > 0) chartData.push({ name: 'Insurance', value: Math.round(monthlyInsurance) });
  if (hoaFees > 0) chartData.push({ name: 'HOA', value: hoaFees });
  if (carPayments > 0) chartData.push({ name: 'Car Payments', value: carPayments });
  if (studentLoans > 0) chartData.push({ name: 'Student Loans', value: studentLoans });
  if (creditCardMinimums > 0) chartData.push({ name: 'Credit Cards', value: creditCardMinimums });
  if (personalLoans > 0) chartData.push({ name: 'Personal Loans', value: personalLoans });
  if (childSupport > 0) chartData.push({ name: 'Child Support', value: childSupport });
  if (otherDebts > 0) chartData.push({ name: 'Other Debts', value: otherDebts });

  // Insights
  const insights: string[] = [];

  if (frontEndDTI <= 28) {
    insights.push(`Your front-end DTI of ${frontEndDTI.toFixed(1)}% is excellent. Most lenders prefer housing costs under 28% of gross income.`);
  } else if (frontEndDTI <= 36) {
    insights.push(`Your front-end DTI of ${frontEndDTI.toFixed(1)}% is acceptable but above the ideal 28%. Consider a less expensive home or larger down payment.`);
  } else {
    insights.push(`Your front-end DTI of ${frontEndDTI.toFixed(1)}% is high. Most conventional loans require under 28-31%. You may need to reduce housing costs or increase income.`);
  }

  if (backEndDTI <= 36) {
    insights.push(`Your total DTI of ${backEndDTI.toFixed(1)}% is strong. You have good financial flexibility with ${remainingPercent.toFixed(0)}% of income remaining.`);
  } else if (backEndDTI <= 43) {
    insights.push(`Your total DTI of ${backEndDTI.toFixed(1)}% is at the upper limit for most conventional loans (43% max). FHA loans may allow up to 50%.`);
  } else if (backEndDTI <= 50) {
    insights.push(`Your total DTI of ${backEndDTI.toFixed(1)}% exceeds conventional loan limits (43%). FHA loans may still qualify you at up to 50% with compensating factors.`);
  } else {
    insights.push(`Your total DTI of ${backEndDTI.toFixed(1)}% exceeds most loan program limits. Consider paying down debts before applying for a mortgage.`);
  }

  if (nonHousingDebts > 0) {
    const largestDebt = [
      { name: 'car payments', amount: carPayments },
      { name: 'student loans', amount: studentLoans },
      { name: 'credit cards', amount: creditCardMinimums },
      { name: 'personal loans', amount: personalLoans },
    ].sort((a, b) => b.amount - a.amount)[0];

    if (largestDebt.amount > 0) {
      const dtiReduction = (largestDebt.amount / monthlyGrossIncome) * 100;
      insights.push(`Your largest non-housing debt is ${largestDebt.name} at $${largestDebt.amount.toLocaleString()}/mo. Eliminating it would reduce your DTI by ${dtiReduction.toFixed(1)} percentage points.`);
    }
  }

  insights.push(`With your income, the maximum total housing payment to stay at 28% DTI is $${Math.max(0, Math.round(monthlyGrossIncome * 0.28)).toLocaleString()}/month.`);

  return {
    summary: `Front-end DTI: ${frontEndDTI.toFixed(1)}% (${frontEndRating}) | Back-end DTI: ${backEndDTI.toFixed(1)}% (${backEndRating})`,
    details: {
      frontEndDTI: Math.round(frontEndDTI * 10) / 10,
      backEndDTI: Math.round(backEndDTI * 10) / 10,
      frontEndRating,
      backEndRating,
      housingCosts: Math.round(housingCosts),
      nonHousingDebts: Math.round(nonHousingDebts),
      totalMonthlyDebts: Math.round(totalMonthlyDebts),
      remainingIncome: Math.round(remainingIncome),
      remainingPercent: Math.round(remainingPercent),
      monthlyGrossIncome,
      maxHousingAt28: Math.max(0, Math.round(monthlyGrossIncome * 0.28)),
      maxTotalAt36: Math.max(0, Math.round(maxAt36)),
      maxTotalAt43: Math.max(0, Math.round(maxAt43)),
      maxTotalAt50: Math.max(0, Math.round(maxAt50)),
    },
    chartData,
    insights,
  };
}
