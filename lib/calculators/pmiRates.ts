/**
 * Shared PMI rate grid used by every calculator that estimates PMI.
 * Rates are approximate annual borrower-paid PMI rates (% of loan amount),
 * varying by LTV band and credit score tier.
 */
export function getPMIRate(ltv: number, creditScore: number): number {
  if (creditScore >= 760) {
    if (ltv <= 85) return 0.19;
    if (ltv <= 90) return 0.30;
    if (ltv <= 95) return 0.46;
    return 0.55;
  } else if (creditScore >= 740) {
    if (ltv <= 85) return 0.25;
    if (ltv <= 90) return 0.35;
    if (ltv <= 95) return 0.55;
    return 0.65;
  } else if (creditScore >= 720) {
    if (ltv <= 85) return 0.31;
    if (ltv <= 90) return 0.47;
    if (ltv <= 95) return 0.65;
    return 0.80;
  } else if (creditScore >= 700) {
    if (ltv <= 85) return 0.40;
    if (ltv <= 90) return 0.58;
    if (ltv <= 95) return 0.82;
    return 0.95;
  } else if (creditScore >= 680) {
    if (ltv <= 85) return 0.50;
    if (ltv <= 90) return 0.72;
    if (ltv <= 95) return 1.05;
    return 1.15;
  } else {
    if (ltv <= 85) return 0.65;
    if (ltv <= 90) return 0.90;
    if (ltv <= 95) return 1.25;
    return 1.50;
  }
}
