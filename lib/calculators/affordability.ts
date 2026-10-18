import type { AffordabilityInputs, CalculatorResult } from './types';

// Estimated annual PMI rate (as a fraction of loan amount) when LTV > 80%.
const PMI_ANNUAL_RATE = 0.005;
const PMI_LTV_THRESHOLD = 0.80;

interface DtiTier {
  /** Max housing payment as a share of gross monthly income (front-end DTI). */
  frontEnd: number;
  /** Max housing payment + other debts as a share of gross monthly income (back-end DTI). */
  backEnd: number;
}

// conservative = classic 28/36 rule; moderate = 36% total DTI; aggressive = 43% total DTI (QM max)
const DTI_TIERS: Record<string, DtiTier> = {
  conservative: { frontEnd: 0.28, backEnd: 0.36 },
  moderate: { frontEnd: 0.36, backEnd: 0.36 },
  aggressive: { frontEnd: 0.43, backEnd: 0.43 },
};

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

  const monthlyPIFor = (loanAmount: number) =>
    loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  // PMI applies when the down payment covers less than 20% of the price (LTV > 80%)
  const monthlyPMIFor = (homePrice: number, loanAmount: number) => {
    if (homePrice <= 0 || loanAmount <= 0) return 0;
    const ltv = loanAmount / homePrice;
    return ltv > PMI_LTV_THRESHOLD ? (loanAmount * PMI_ANNUAL_RATE) / 12 : 0;
  };

  // Full monthly housing cost at a given price: P&I + taxes + insurance + HOA + PMI
  const totalMonthlyCostFor = (homePrice: number) => {
    const loanAmount = homePrice - downPayment;
    if (loanAmount <= 0) {
      return (homePrice * propertyTaxRate / 100 / 12) + (homeInsuranceAnnual / 12) + hoaFees;
    }
    const monthlyPI = monthlyPIFor(loanAmount);
    const monthlyTaxIns = (homePrice * propertyTaxRate / 100 / 12) + (homeInsuranceAnnual / 12);
    return monthlyPI + monthlyTaxIns + hoaFees + monthlyPMIFor(homePrice, loanAmount);
  };

  const results: Record<string, number | string> = {};

  Object.entries(DTI_TIERS).forEach(([level, tier]) => {
    // Front-end constraint: housing payment alone vs income.
    // Back-end constraint: housing payment + other monthly debts vs income.
    const frontEndMax = monthlyIncome * tier.frontEnd;
    const backEndMax = monthlyIncome * tier.backEnd - monthlyDebts;
    const maxMonthlyPayment = Math.max(0, Math.min(frontEndMax, backEndMax));
    const bindingConstraint = backEndMax < frontEndMax ? 'back-end' : 'front-end';
    const bindingRatio = bindingConstraint === 'back-end' ? tier.backEnd : tier.frontEnd;

    // Binary search for max home price whose full monthly cost fits the budget
    let low = 0;
    let high = 5000000;
    let maxHomePrice = 0;

    while (high - low > 100) {
      const mid = (low + high) / 2;
      if (totalMonthlyCostFor(mid) <= maxMonthlyPayment) {
        maxHomePrice = mid;
        low = mid;
      } else {
        high = mid;
      }
    }

    const loanAmount = Math.max(0, maxHomePrice - downPayment);
    const monthlyPMI = monthlyPMIFor(maxHomePrice, loanAmount);
    const totalPayment = maxHomePrice > 0 ? totalMonthlyCostFor(maxHomePrice) : 0;
    const frontEndDTI = (totalPayment / monthlyIncome) * 100;
    const backEndDTI = ((totalPayment + monthlyDebts) / monthlyIncome) * 100;

    const constraintLabel = bindingConstraint === 'back-end'
      ? `${Math.round(bindingRatio * 100)}% back-end DTI (includes your other debts)`
      : `${Math.round(bindingRatio * 100)}% front-end DTI (housing only)`;

    results[`${level}Price`] = Math.round(maxHomePrice);
    results[`${level}Payment`] = Math.round(totalPayment);
    results[`${level}PMI`] = Math.round(monthlyPMI);
    results[`${level}DTI`] = Math.round(frontEndDTI);
    results[`${level}BackEndDTI`] = Math.round(backEndDTI);
    results[`${level}Binding`] = bindingConstraint;
    results[`${level}BindingRatio`] = Math.round(bindingRatio * 100);
    results[`${level}ConstraintLabel`] = constraintLabel;
  });

  // Back-end DTI of the recommended (moderate) option, including all debts
  const backEndDTI = (((results.moderatePayment as number) + monthlyDebts) / monthlyIncome) * 100;

  const bindingWord = (level: string) =>
    results[`${level}Binding`] === 'back-end'
      ? `${results[`${level}BindingRatio`]}% back-end DTI (housing + debts)`
      : `${results[`${level}BindingRatio`]}% front-end DTI (housing only)`;

  const insights: string[] = [];

  insights.push(
    `Conservative ($${(results.conservativePrice as number).toLocaleString()}): Safest option with breathing room — limited by ${bindingWord('conservative')}`
  );

  insights.push(
    `Moderate ($${(results.moderatePrice as number).toLocaleString()}): Balanced approach — limited by ${bindingWord('moderate')}`
  );

  insights.push(
    `Aggressive ($${(results.aggressivePrice as number).toLocaleString()}): Maximum qualification — limited by ${bindingWord('aggressive')}`
  );

  if (backEndDTI > 43) {
    insights.push(
      `⚠️ Your total debt payments (${Math.round(backEndDTI)}% DTI) may limit qualification. Consider paying down debts first.`
    );
  }

  if ((results.moderatePMI as number) > 0) {
    insights.push(
      `💡 Your down payment is under 20% at the recommended price, so ~$${(results.moderatePMI as number).toLocaleString()}/month of PMI is already included in these payments. Reaching 20% down would remove it and raise your buying power.`
    );
  }

  const summary = `Based on $${monthlyIncome.toLocaleString()}/month income and $${monthlyDebts.toLocaleString()}/month debts, you can afford $${(results.conservativePrice as number).toLocaleString()} (safe) to $${(results.aggressivePrice as number).toLocaleString()} (max).`;

  return {
    summary,
    details: {
      monthlyIncome: Math.round(monthlyIncome),
      monthlyDebts,
      maxHomePrice: results.moderatePrice,
      conservativePrice: results.conservativePrice,
      conservativePayment: results.conservativePayment,
      conservativeDTI: results.conservativeDTI,
      conservativeBackEndDTI: results.conservativeBackEndDTI,
      conservativePMI: results.conservativePMI,
      conservativeBinding: results.conservativeBinding,
      conservativeBindingRatio: results.conservativeBindingRatio,
      conservativeConstraintLabel: results.conservativeConstraintLabel,
      moderatePrice: results.moderatePrice,
      moderatePayment: results.moderatePayment,
      moderateDTI: results.moderateDTI,
      moderateBackEndDTI: results.moderateBackEndDTI,
      moderatePMI: results.moderatePMI,
      moderateBinding: results.moderateBinding,
      moderateBindingRatio: results.moderateBindingRatio,
      moderateConstraintLabel: results.moderateConstraintLabel,
      aggressivePrice: results.aggressivePrice,
      aggressivePayment: results.aggressivePayment,
      aggressiveDTI: results.aggressiveDTI,
      aggressiveBackEndDTI: results.aggressiveBackEndDTI,
      aggressivePMI: results.aggressivePMI,
      aggressiveBinding: results.aggressiveBinding,
      aggressiveBindingRatio: results.aggressiveBindingRatio,
      aggressiveConstraintLabel: results.aggressiveConstraintLabel,
      backEndDTI: Math.round(backEndDTI),
    },
    chartData: [
      { level: `Conservative\n(${results.conservativeBindingRatio}% ${results.conservativeBinding})`, price: results.conservativePrice, payment: results.conservativePayment },
      { level: `Moderate\n(${results.moderateBindingRatio}% ${results.moderateBinding})`, price: results.moderatePrice, payment: results.moderatePayment },
      { level: `Aggressive\n(${results.aggressiveBindingRatio}% ${results.aggressiveBinding})`, price: results.aggressivePrice, payment: results.aggressivePayment },
    ],
    insights,
  };
}
