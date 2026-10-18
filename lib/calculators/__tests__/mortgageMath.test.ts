import { describe, it, expect } from 'vitest';
import {
  monthlyRate,
  monthlyPayment,
  principalFromPayment,
  remainingBalance,
  totalLoanInterest,
  amortize,
  ltvPercent,
  monthlyMortgageInsurance,
  monthsUntilLtv,
  frontEndDti,
  backEndDti,
  breakEvenMonths,
} from '../mortgageMath';

describe('monthlyRate', () => {
  it('converts an annual percentage to a monthly decimal', () => {
    expect(monthlyRate(6)).toBeCloseTo(0.005, 10);
    expect(monthlyRate(0)).toBe(0);
  });
});

describe('monthlyPayment', () => {
  it('matches the textbook value for a $300k, 6%, 30-year loan', () => {
    // Independently verified: 300000 * 0.005 * 1.005^360 / (1.005^360 - 1)
    expect(monthlyPayment(300_000, 6, 360)).toBeCloseTo(1798.65, 2);
  });

  it('matches the textbook value for a $400k, 6.5%, 30-year loan', () => {
    expect(monthlyPayment(400_000, 6.5, 360)).toBeCloseTo(2528.27, 2);
  });

  it('matches the textbook value for a $200k, 5%, 15-year loan', () => {
    expect(monthlyPayment(200_000, 5, 180)).toBeCloseTo(1581.59, 2);
  });

  it('handles a 0% rate as straight-line principal', () => {
    expect(monthlyPayment(360_000, 0, 360)).toBeCloseTo(1000, 10);
  });

  it('returns 0 for degenerate inputs instead of NaN/Infinity', () => {
    expect(monthlyPayment(0, 6, 360)).toBe(0);
    expect(monthlyPayment(-100, 6, 360)).toBe(0);
    expect(monthlyPayment(300_000, 6, 0)).toBe(0);
  });
});

describe('principalFromPayment', () => {
  it('is the inverse of monthlyPayment', () => {
    const payment = monthlyPayment(300_000, 6.5, 360);
    expect(principalFromPayment(payment, 6.5, 360)).toBeCloseTo(300_000, 4);
  });

  it('handles a 0% rate', () => {
    expect(principalFromPayment(1000, 0, 360)).toBe(360_000);
  });
});

describe('remainingBalance', () => {
  it('equals the principal at month 0 and ~0 at the final month', () => {
    expect(remainingBalance(300_000, 6, 360, 0)).toBeCloseTo(300_000, 6);
    expect(remainingBalance(300_000, 6, 360, 360)).toBeCloseTo(0, 6);
  });

  it('matches an iterative amortization at an arbitrary month', () => {
    const principal = 300_000;
    const rate = 6;
    const term = 360;
    const payment = monthlyPayment(principal, rate, term);
    let balance = principal;
    for (let m = 0; m < 60; m++) {
      balance -= payment - balance * monthlyRate(rate);
    }
    expect(remainingBalance(principal, rate, term, 60)).toBeCloseTo(balance, 4);
  });
});

describe('totalLoanInterest', () => {
  it('equals payment × term − principal', () => {
    const expected = monthlyPayment(300_000, 6, 360) * 360 - 300_000;
    expect(totalLoanInterest(300_000, 6, 360)).toBeCloseTo(expected, 6);
    expect(expected).toBeCloseTo(347_514.57, 0);
  });
});

describe('amortize', () => {
  it('reproduces scheduled totals with no extra payments', () => {
    const result = amortize({ principal: 300_000, annualRatePercent: 6, termMonths: 360 });
    expect(result.months).toBe(360);
    expect(result.totalInterest).toBeCloseTo(totalLoanInterest(300_000, 6, 360), 0);
    expect(result.totalPrincipal).toBeCloseTo(300_000, 4);
  });

  it('pays off early and saves interest with extra monthly payments', () => {
    const base = amortize({ principal: 300_000, annualRatePercent: 6, termMonths: 360 });
    const extra = amortize({
      principal: 300_000,
      annualRatePercent: 6,
      termMonths: 360,
      extraMonthly: 200,
    });
    expect(extra.months).toBeLessThan(base.months);
    expect(extra.totalInterest).toBeLessThan(base.totalInterest);
    expect(extra.totalPrincipal).toBeCloseTo(300_000, 4);
  });

  it('applies lump sums at the requested month', () => {
    const withLump = amortize({
      principal: 300_000,
      annualRatePercent: 6,
      termMonths: 360,
      lumpSum: 50_000,
      lumpSumMonth: 12,
    });
    expect(withLump.months).toBeLessThan(360);
    expect(withLump.totalPrincipal).toBeCloseTo(300_000, 4);
  });
});

describe('ltvPercent', () => {
  it('computes loan-to-value as a percentage', () => {
    expect(ltvPercent(80_000, 100_000)).toBe(80);
    expect(ltvPercent(96_500, 100_000)).toBeCloseTo(96.5, 10);
  });

  it('returns 0 when property value is 0', () => {
    expect(ltvPercent(100_000, 0)).toBe(0);
  });
});

describe('monthlyMortgageInsurance', () => {
  it('converts an annual MI rate to a monthly premium', () => {
    expect(monthlyMortgageInsurance(300_000, 0.55)).toBeCloseTo(137.5, 6);
    expect(monthlyMortgageInsurance(300_000, 0)).toBe(0);
  });
});

describe('monthsUntilLtv', () => {
  it('finds when a 90% LTV loan amortizes down to 78% LTV', () => {
    const homePrice = 400_000;
    const loan = 360_000; // 90% LTV
    const months = monthsUntilLtv(loan, homePrice, 6.5, 360, 78);
    expect(months).toBeGreaterThan(0);
    // Verify against the closed-form remaining balance
    expect(remainingBalance(loan, 6.5, 360, months)).toBeLessThanOrEqual(homePrice * 0.78);
    expect(remainingBalance(loan, 6.5, 360, months - 1)).toBeGreaterThan(homePrice * 0.78);
  });

  it('returns 0 for degenerate inputs', () => {
    expect(monthsUntilLtv(0, 400_000, 6.5, 360, 78)).toBe(0);
    expect(monthsUntilLtv(360_000, 0, 6.5, 360, 78)).toBe(0);
    expect(monthsUntilLtv(360_000, 400_000, 6.5, 0, 78)).toBe(0);
  });
});

describe('DTI helpers', () => {
  it('computes front-end and back-end DTI', () => {
    expect(frontEndDti(2000, 8000)).toBe(25);
    expect(backEndDti(2000, 800, 8000)).toBe(35);
  });

  it('returns 0 with no income instead of Infinity', () => {
    expect(frontEndDti(2000, 0)).toBe(0);
    expect(backEndDti(2000, 800, 0)).toBe(0);
  });
});

describe('breakEvenMonths', () => {
  it('divides upfront cost by monthly savings', () => {
    expect(breakEvenMonths(6000, 150)).toBe(40);
  });

  it('returns Infinity with no savings', () => {
    expect(breakEvenMonths(6000, 0)).toBe(Infinity);
    expect(breakEvenMonths(6000, -10)).toBe(Infinity);
  });
});
