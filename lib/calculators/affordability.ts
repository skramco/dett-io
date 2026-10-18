import type { AffordabilityInputs, CalculatorResult } from './types';
import { LOAN_LIMIT_YEAR, CONFORMING_LIMIT, CONFORMING_LIMIT_HIGH_COST, isJumboLoan } from './loanLimits';

export function calculateAffordability(inputs: AffordabilityInputs): CalculatorResult {
  const {
    annualIncome,
    monthlyDebts,
    downPayment,
    interestRate,
    loanTerm,
    propertyTaxRate,
    homeInsuranceAnnual,
    hoaFees,
  } = inputs;

  const monthlyIncome = annualIncome / 12;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;

  // Calculate max home prices at different DTI ratios
  const dtiRatios = {
    conservative: 0.28, // 28% front-end DTI
    moderate: 0.36,     // 36% front-end DTI
    aggressive: 0.43,   // 43% front-end DTI (max for most loans)
  };

  const results: Record<string, any> = {};
  
  Object.entries(dtiRatios).forEach(([level, dtiRatio]) => {
    const maxMonthlyPayment = monthlyIncome * dtiRatio;
    const availableForPITI = maxMonthlyPayment - hoaFees;
    
    // Estimate property tax and insurance per month per $100k of home value
    const taxInsPerMonth = (propertyTaxRate / 100 / 12) + (homeInsuranceAnnual / 12);
    
    // Binary search for max home price
    let low = 50000;
    let high = 5000000;
    let maxHomePrice = 0;
    
    while (high - low > 100) {
      const mid = (low + high) / 2;
      const loanAmount = mid - downPayment;
      
      if (loanAmount <= 0) {
        low = mid;
        continue;
      }
      
      const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                       (Math.pow(1 + monthlyRate, numPayments) - 1);
      const monthlyTaxIns = (mid * propertyTaxRate / 100 / 12) + (homeInsuranceAnnual / 12);
      const totalPITI = monthlyPI + monthlyTaxIns;
      
      if (totalPITI <= availableForPITI) {
        maxHomePrice = mid;
        low = mid;
      } else {
        high = mid;
      }
    }
    
    const loanAmount = maxHomePrice - downPayment;
    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                     (Math.pow(1 + monthlyRate, numPayments) - 1);
    const monthlyTaxIns = (maxHomePrice * propertyTaxRate / 100 / 12) + (homeInsuranceAnnual / 12);
    const totalPITI = monthlyPI + monthlyTaxIns + hoaFees;
    
    results[`${level}Price`] = Math.round(maxHomePrice);
    results[`${level}Payment`] = Math.round(totalPITI);
    results[`${level}DTI`] = Math.round((totalPITI / monthlyIncome) * 100);
  });

  // Calculate back-end DTI (includes all debts)
  const backEndDTI = ((results.moderatePayment + monthlyDebts) / monthlyIncome) * 100;

  // Jumbo check against the 2026 conforming loan limit
  const moderateLoanAmount = Math.max(0, results.moderatePrice - downPayment);
  const aggressiveLoanAmount = Math.max(0, results.aggressivePrice - downPayment);
  const moderateIsJumbo = isJumboLoan(moderateLoanAmount);
  const aggressiveIsJumbo = isJumboLoan(aggressiveLoanAmount);

  const insights: string[] = [];
  
  insights.push(
    `Conservative ($${results.conservativePrice.toLocaleString()}): Safest option with breathing room for unexpected expenses`
  );
  
  insights.push(
    `Moderate ($${results.moderatePrice.toLocaleString()}): Balanced approach - most common choice for stable income`
  );
  
  insights.push(
    `Aggressive ($${results.aggressivePrice.toLocaleString()}): Maximum qualification - leaves little room for error`
  );

  if (backEndDTI > 43) {
    insights.push(
      `⚠️ Your total debt payments (${Math.round(backEndDTI)}% DTI) may limit qualification. Consider paying down debts first.`
    );
  }

  if (downPayment < results.conservativePrice * 0.2) {
    insights.push(
      `💡 With less than 20% down, you'll likely pay PMI. Budget an extra $${Math.round((results.moderatePrice - downPayment) * 0.005 / 12)}/month.`
    );
  }

  if (moderateIsJumbo) {
    insights.push(
      `A loan of $${Math.round(moderateLoanAmount).toLocaleString()} at your moderate price exceeds the ${LOAN_LIMIT_YEAR} conforming limit of $${CONFORMING_LIMIT.toLocaleString()} in most counties — jumbo territory, which typically means a 700+ credit score, 10-20% down, and larger reserves. High-cost counties have limits up to $${CONFORMING_LIMIT_HIGH_COST.toLocaleString()}.`
    );
  } else if (aggressiveIsJumbo) {
    insights.push(
      `At the top of your range, the loan amount ($${Math.round(aggressiveLoanAmount).toLocaleString()}) would exceed the ${LOAN_LIMIT_YEAR} conforming limit of $${CONFORMING_LIMIT.toLocaleString()} in most counties and require a jumbo loan. Staying below the limit usually gets you better terms.`
    );
  }

  const summary = `Based on $${monthlyIncome.toLocaleString()}/month income, you can afford $${results.conservativePrice.toLocaleString()} (safe) to $${results.aggressivePrice.toLocaleString()} (max).`;

  return {
    summary,
    details: {
      monthlyIncome: Math.round(monthlyIncome),
      monthlyDebts,
      conservativePrice: results.conservativePrice,
      conservativePayment: results.conservativePayment,
      conservativeDTI: results.conservativeDTI,
      moderatePrice: results.moderatePrice,
      moderatePayment: results.moderatePayment,
      moderateDTI: results.moderateDTI,
      aggressivePrice: results.aggressivePrice,
      aggressivePayment: results.aggressivePayment,
      aggressiveDTI: results.aggressiveDTI,
      backEndDTI: Math.round(backEndDTI),
      loanLimitYear: LOAN_LIMIT_YEAR,
      conformingLimit: CONFORMING_LIMIT,
      moderateIsJumbo: moderateIsJumbo ? 1 : 0,
      aggressiveIsJumbo: aggressiveIsJumbo ? 1 : 0,
    },
    chartData: [
      { level: 'Conservative\n(28% DTI)', price: results.conservativePrice, payment: results.conservativePayment },
      { level: 'Moderate\n(36% DTI)', price: results.moderatePrice, payment: results.moderatePayment },
      { level: 'Aggressive\n(43% DTI)', price: results.aggressivePrice, payment: results.aggressivePayment },
    ],
    insights,
  };
}
