import type { AffordabilityInputs, CalculatorResult } from './types';
import {
  conventionalPmiRatePercent,
  DEFAULT_PMI_CREDIT_SCORE,
  ltvPercent,
  monthlyPayment,
  monthlyPmiAmount,
} from './mortgageMath';
import {
  LOAN_LIMIT_YEAR,
  CONFORMING_LOAN_LIMIT,
  CONFORMING_HIGH_COST_LIMIT,
  isJumboLoan,
} from './loanLimits';

type BindingConstraint = 'front-end' | 'back-end';

interface TierLimits {
  /** Max housing payment as a share of gross monthly income (front-end DTI). */
  frontEnd: number;
  /** Max housing payment + other debts as a share of gross monthly income (back-end DTI). */
  backEnd: number;
}

// Conservative follows the classic 28/36 rule; moderate and aggressive are
// back-end (total debt) limits of 36% and 43% respectively.
const TIERS: Record<string, TierLimits> = {
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
    creditScore = DEFAULT_PMI_CREDIT_SCORE,
  } = inputs;

  const monthlyIncome = annualIncome / 12;
  const numPayments = loanTerm * 12;

  // Full monthly housing cost (P&I + tax + insurance + PMI + HOA) at a given price.
  const housingPaymentAt = (homePrice: number) => {
    const loanAmount = Math.max(0, homePrice - downPayment);
    const monthlyPI = monthlyPayment(loanAmount, interestRate, numPayments);
    // PMI rate from the shared LTV × credit score grid (0 when LTV ≤ 80%).
    const pmiRate = conventionalPmiRatePercent(ltvPercent(loanAmount, homePrice), creditScore);
    const monthlyPMI = monthlyPmiAmount(loanAmount, pmiRate);
    const monthlyTaxIns = (homePrice * propertyTaxRate / 100 / 12) + (homeInsuranceAnnual / 12);
    return {
      total: monthlyPI + monthlyPMI + monthlyTaxIns + hoaFees,
      monthlyPI,
      monthlyPMI,
      pmiRate,
    };
  };

  const results: Record<string, number> = {};
  const binding: Record<string, BindingConstraint> = {};

  Object.entries(TIERS).forEach(([level, limits]) => {
    // Front-end cap: housing payment alone vs income.
    const frontEndCap = monthlyIncome * limits.frontEnd;
    // Back-end cap: housing payment must leave room for other monthly debts.
    const backEndCap = monthlyIncome * limits.backEnd - monthlyDebts;
    const maxHousingPayment = Math.max(0, Math.min(frontEndCap, backEndCap));
    binding[level] = backEndCap < frontEndCap ? 'back-end' : 'front-end';

    // Binary search for the max home price whose full payment (incl. PMI) fits the cap.
    let low = 0;
    let high = 10000000;
    let maxHomePrice = 0;

    while (high - low > 100) {
      const mid = (low + high) / 2;
      if (housingPaymentAt(mid).total <= maxHousingPayment) {
        maxHomePrice = mid;
        low = mid;
      } else {
        high = mid;
      }
    }

    const payment = maxHomePrice > 0
      ? housingPaymentAt(maxHomePrice)
      : { total: 0, monthlyPI: 0, monthlyPMI: 0, pmiRate: 0 };

    const loanAmount = Math.max(0, Math.round(maxHomePrice) - downPayment);
    results[`${level}Price`] = Math.round(maxHomePrice);
    results[`${level}Payment`] = Math.round(payment.total);
    results[`${level}PMI`] = Math.round(payment.monthlyPMI);
    results[`${level}PMIRate`] = payment.pmiRate;
    results[`${level}LoanAmount`] = loanAmount;
    results[`${level}IsJumbo`] = isJumboLoan(loanAmount) ? 1 : 0;
    // Front-end DTI: housing payment as % of income.
    results[`${level}DTI`] = Math.round((payment.total / monthlyIncome) * 100);
    // Back-end DTI: housing payment + other debts as % of income.
    results[`${level}BackEndDTI`] = Math.round(((payment.total + monthlyDebts) / monthlyIncome) * 100);
  });

  // Back-end DTI at the recommended (moderate) price, including all debts.
  const backEndDTI = results.moderateBackEndDTI;

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

  if (monthlyDebts > 0 && binding.moderate === 'back-end') {
    insights.push(
      `Your $${monthlyDebts.toLocaleString()}/month in other debts is the binding constraint: the 36% back-end rule caps your housing payment at $${Math.round(Math.max(0, monthlyIncome * 0.36 - monthlyDebts)).toLocaleString()}/month instead of $${Math.round(monthlyIncome * 0.36).toLocaleString()}. Paying down debts raises your budget dollar-for-dollar.`
    );
  }

  if (monthlyDebts > monthlyIncome * 0.36) {
    insights.push(
      `⚠️ Your other debt payments alone exceed 36% of income, leaving no room for a housing payment at the recommended DTI. Consider paying down debts first.`
    );
  } else if (backEndDTI > 43) {
    insights.push(
      `⚠️ Your total debt payments (${Math.round(backEndDTI)}% DTI) may limit qualification. Consider paying down debts first.`
    );
  }

  if (results.moderateIsJumbo === 1) {
    insights.push(
      `At the recommended price, your loan of $${results.moderateLoanAmount.toLocaleString()} would exceed the ${LOAN_LIMIT_YEAR} conforming limit of $${CONFORMING_LOAN_LIMIT.toLocaleString()} that applies in most counties — jumbo territory, which typically means higher credit score and down payment requirements. High-cost counties have conforming limits up to $${CONFORMING_HIGH_COST_LIMIT.toLocaleString()}.`
    );
  } else if (results.aggressiveIsJumbo === 1) {
    insights.push(
      `At the aggressive price, your loan of $${results.aggressiveLoanAmount.toLocaleString()} would exceed the ${LOAN_LIMIT_YEAR} conforming limit of $${CONFORMING_LOAN_LIMIT.toLocaleString()} (most counties), so you'd likely need a jumbo loan at the top of your range. Staying at or below the moderate price keeps you in conforming territory.`
    );
  }

  if (results.moderatePMI > 0) {
    insights.push(
      `💡 Your down payment is below 20% at the recommended price, so $${results.moderatePMI.toLocaleString()}/month PMI is already included in these payments. PMI drops off once you reach 20% equity.`
    );
  }

  const summary = `Based on $${monthlyIncome.toLocaleString()}/month income, you can afford $${results.conservativePrice.toLocaleString()} (safe) to $${results.aggressivePrice.toLocaleString()} (max).`;

  return {
    summary,
    details: {
      monthlyIncome: Math.round(monthlyIncome),
      monthlyDebts,
      creditScore,
      conservativePrice: results.conservativePrice,
      conservativePayment: results.conservativePayment,
      conservativeDTI: results.conservativeDTI,
      conservativeBackEndDTI: results.conservativeBackEndDTI,
      conservativePMI: results.conservativePMI,
      conservativeBinding: binding.conservative,
      conservativeLoanAmount: results.conservativeLoanAmount,
      conservativeIsJumbo: results.conservativeIsJumbo,
      moderatePrice: results.moderatePrice,
      moderatePayment: results.moderatePayment,
      moderateDTI: results.moderateDTI,
      moderateBackEndDTI: results.moderateBackEndDTI,
      moderatePMI: results.moderatePMI,
      moderatePMIRate: results.moderatePMIRate,
      moderateBinding: binding.moderate,
      moderateLoanAmount: results.moderateLoanAmount,
      moderateIsJumbo: results.moderateIsJumbo,
      aggressivePrice: results.aggressivePrice,
      aggressivePayment: results.aggressivePayment,
      aggressiveDTI: results.aggressiveDTI,
      aggressiveBackEndDTI: results.aggressiveBackEndDTI,
      aggressivePMI: results.aggressivePMI,
      aggressiveBinding: binding.aggressive,
      aggressiveLoanAmount: results.aggressiveLoanAmount,
      aggressiveIsJumbo: results.aggressiveIsJumbo,
      conformingLoanLimit: CONFORMING_LOAN_LIMIT,
      loanLimitYear: LOAN_LIMIT_YEAR,
      backEndDTI,
      maxHomePrice: results.moderatePrice,
    },
    chartData: [
      { level: 'Conservative\n(28/36 rule)', price: results.conservativePrice, payment: results.conservativePayment },
      { level: 'Moderate\n(36% back-end)', price: results.moderatePrice, payment: results.moderatePayment },
      { level: 'Aggressive\n(43% back-end)', price: results.aggressivePrice, payment: results.aggressivePayment },
    ],
    insights,
  };
}
