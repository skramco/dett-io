import { describe, expect, it } from 'vitest';
import {
  armAdjustedRate,
  backEndDtiPercent,
  breakEvenMonths,
  conventionalPmiRatePercent,
  FHA_UPFRONT_MIP_PERCENT,
  fhaAnnualMipRatePercent,
  fhaMonthlyMip,
  fhaUpfrontMip,
  frontEndDtiPercent,
  loanAmountFromPayment,
  ltvPercent,
  monthlyPayment,
  monthlyPmiAmount,
  monthsToReachLtv,
  remainingBalance,
  simulateBiweeklyPayoff,
  toMonthlyRate,
  totalInterestOverTerm,
  vaFundingFeeRatePercent as vaFundingFee,
} from '../lib/calculators/mortgageMath';

describe('monthlyPayment', () => {
  it('matches the industry-standard P&I for $300k @ 6.5% / 30yr', () => {
    expect(monthlyPayment(300000, 6.5, 360)).toBeCloseTo(1896.2, 1);
  });

  it('matches the industry-standard P&I for $100k @ 6% / 15yr', () => {
    expect(monthlyPayment(100000, 6, 180)).toBeCloseTo(843.86, 1);
  });

  it('matches the industry-standard P&I for $400k @ 7% / 30yr', () => {
    expect(monthlyPayment(400000, 7, 360)).toBeCloseTo(2661.21, 1);
  });

  it('falls back to straight-line principal at 0% interest', () => {
    expect(monthlyPayment(240000, 0, 240)).toBeCloseTo(1000, 10);
  });

  it('returns 0 for a zero-month term', () => {
    expect(monthlyPayment(100000, 5, 0)).toBe(0);
  });
});

describe('loanAmountFromPayment', () => {
  it('inverts monthlyPayment (round trip)', () => {
    const payment = monthlyPayment(350000, 6.25, 360);
    expect(loanAmountFromPayment(payment, 6.25, 360)).toBeCloseTo(350000, 4);
  });

  it('handles 0% interest', () => {
    expect(loanAmountFromPayment(1000, 0, 240)).toBe(240000);
  });
});

describe('toMonthlyRate', () => {
  it('converts an annual percentage to a monthly decimal', () => {
    expect(toMonthlyRate(6)).toBeCloseTo(0.005, 12);
    expect(toMonthlyRate(0)).toBe(0);
  });
});

describe('remainingBalance', () => {
  it('equals the principal before any payments', () => {
    expect(remainingBalance(300000, 6.5, 360, 0)).toBe(300000);
  });

  it('reaches zero at the end of the term', () => {
    expect(remainingBalance(300000, 6.5, 360, 360)).toBeCloseTo(0, 4);
  });

  it('decreases monotonically', () => {
    const b60 = remainingBalance(300000, 6.5, 360, 60);
    const b120 = remainingBalance(300000, 6.5, 360, 120);
    expect(b60).toBeGreaterThan(b120);
    expect(b60).toBeLessThan(300000);
  });
});

describe('totalInterestOverTerm', () => {
  it('equals payment × n − principal', () => {
    const expected = monthlyPayment(300000, 6.5, 360) * 360 - 300000;
    expect(totalInterestOverTerm(300000, 6.5, 360)).toBeCloseTo(expected, 6);
  });

  it('is zero at 0% interest', () => {
    expect(totalInterestOverTerm(120000, 0, 120)).toBeCloseTo(0, 6);
  });
});

describe('ltvPercent', () => {
  it('computes loan-to-value as a percentage', () => {
    expect(ltvPercent(360000, 400000)).toBe(90);
  });

  it('returns 0 for a zero home value', () => {
    expect(ltvPercent(100000, 0)).toBe(0);
  });
});

describe('monthsToReachLtv', () => {
  it('finds when a 90% LTV loan amortizes to 78%', () => {
    const months = monthsToReachLtv(360000, 400000, 6.5, 360, 78);
    expect(months).toBeGreaterThan(0);
    // Verify against the schedule: balance crosses the target exactly at that month
    const target = 400000 * 0.78;
    expect(remainingBalance(360000, 6.5, 360, months)).toBeLessThanOrEqual(target);
    expect(remainingBalance(360000, 6.5, 360, months - 1)).toBeGreaterThan(target);
  });

  it('returns the first month when the loan already sits at the target', () => {
    // Loan starts at 90% LTV, so a 90%+ target is met with the first payment
    expect(monthsToReachLtv(360000, 400000, 6.5, 360, 90)).toBe(1);
  });
});

describe('PMI helpers', () => {
  it('computes monthly PMI from an annual rate', () => {
    expect(monthlyPmiAmount(360000, 0.5)).toBeCloseTo(150, 6);
  });

  it('charges higher PMI rates for higher LTV and lower credit', () => {
    expect(conventionalPmiRatePercent(95, 760)).toBeLessThan(conventionalPmiRatePercent(97, 760));
    expect(conventionalPmiRatePercent(90, 760)).toBeLessThan(conventionalPmiRatePercent(90, 650));
    expect(conventionalPmiRatePercent(90, 740)).toBe(0.35);
    expect(conventionalPmiRatePercent(95, 700)).toBe(0.82);
  });
});

describe('DTI helpers', () => {
  it('computes front-end DTI', () => {
    expect(frontEndDtiPercent(2800, 10000)).toBeCloseTo(28, 10);
  });

  it('computes back-end DTI', () => {
    expect(backEndDtiPercent(2800, 800, 10000)).toBeCloseTo(36, 10);
  });

  it('returns 0 instead of dividing by zero income', () => {
    expect(frontEndDtiPercent(2800, 0)).toBe(0);
    expect(backEndDtiPercent(2800, 800, 0)).toBe(0);
  });
});

describe('FHA helpers', () => {
  it('charges 1.75% upfront MIP', () => {
    expect(FHA_UPFRONT_MIP_PERCENT).toBe(1.75);
    expect(fhaUpfrontMip(400000)).toBeCloseTo(7000, 6);
  });

  it('selects the annual MIP rate by term, LTV, and loan size', () => {
    expect(fhaAnnualMipRatePercent(300000, 96.5, 30)).toBe(0.55);
    expect(fhaAnnualMipRatePercent(300000, 93, 30)).toBe(0.5);
    expect(fhaAnnualMipRatePercent(800000, 96.5, 30)).toBe(0.75);
    expect(fhaAnnualMipRatePercent(800000, 93, 30)).toBe(0.7);
    expect(fhaAnnualMipRatePercent(300000, 88, 15)).toBe(0.15);
    expect(fhaAnnualMipRatePercent(300000, 96.5, 15)).toBe(0.4);
  });

  it('computes monthly MIP from the annual rate', () => {
    expect(fhaMonthlyMip(300000, 0.55)).toBeCloseTo(137.5, 6);
  });
});

describe('VA funding fee', () => {
  it('is waived for disability-exempt borrowers', () => {
    expect(vaFundingFee(0, true, 'regular', true)).toBe(0);
  });

  it('follows the down-payment tiers for regular service', () => {
    expect(vaFundingFee(0, true, 'regular', false)).toBe(2.15);
    expect(vaFundingFee(0, false, 'regular', false)).toBe(3.3);
    expect(vaFundingFee(5, true, 'regular', false)).toBe(1.5);
    expect(vaFundingFee(10, false, 'regular', false)).toBe(1.25);
  });

  it('uses reserves/guard rates below 5% down', () => {
    expect(vaFundingFee(0, true, 'reserves-guard', false)).toBe(2.5);
    expect(vaFundingFee(0, false, 'reserves-guard', false)).toBe(2.5);
  });
});

describe('armAdjustedRate', () => {
  it('moves to the fully indexed rate when below the caps', () => {
    expect(armAdjustedRate(5.5, 2, 2.75, 2, 5.5, 5)).toBeCloseTo(4.75, 10);
  });

  it('is limited by the periodic adjustment cap', () => {
    expect(armAdjustedRate(5.5, 6, 2.75, 2, 5.5, 6)).toBeCloseTo(7.5, 10);
  });

  it('is limited by the lifetime cap', () => {
    expect(armAdjustedRate(9.5, 8, 2.75, 2, 5.5, 5)).toBeCloseTo(10.5, 10);
  });

  it('caps downward moves symmetrically and floors at the margin', () => {
    expect(armAdjustedRate(7, 1, 2.75, 1, 5.75, 5)).toBeCloseTo(6, 10);
    expect(armAdjustedRate(3.5, 0, 2.75, 2, 5.75, 5)).toBeCloseTo(2.75, 10);
  });

  it('hits the adjustment cap when the index is infinite (worst-case step)', () => {
    expect(armAdjustedRate(5.75, Number.POSITIVE_INFINITY, 2.75, 2, 5.75, 5)).toBeCloseTo(7.75, 10);
    expect(armAdjustedRate(9.75, Number.POSITIVE_INFINITY, 2.75, 1, 5.75, 5)).toBeCloseTo(10.75, 10);
  });
});

describe('simulateBiweeklyPayoff', () => {
  it('pays off faster than the monthly schedule and saves interest', () => {
    const termMonths = 360;
    const payment = monthlyPayment(300000, 6.5, termMonths);
    const result = simulateBiweeklyPayoff(300000, 6.5, payment / 2, termMonths * 2);
    expect(result.periods / 26).toBeLessThan(30);
    expect(result.periods / 26).toBeGreaterThan(20);
    const monthlyTotalInterest = payment * termMonths - 300000;
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalInterest).toBeLessThan(monthlyTotalInterest);
  });
});

describe('breakEvenMonths', () => {
  it('divides upfront cost by monthly savings', () => {
    expect(breakEvenMonths(6000, 200)).toBe(30);
  });

  it('returns Infinity when there are no savings', () => {
    expect(breakEvenMonths(6000, 0)).toBe(Infinity);
    expect(breakEvenMonths(6000, -50)).toBe(Infinity);
  });
});
