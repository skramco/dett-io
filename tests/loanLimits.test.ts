import { describe, expect, it } from 'vitest';
import { calculateAffordability, calculateFHA } from '../lib/calculators';
import {
  CONFORMING_HIGH_COST_LIMIT,
  CONFORMING_LOAN_LIMIT,
  FHA_LOAN_LIMIT_CEILING,
  FHA_LOAN_LIMIT_FLOOR,
  LOAN_LIMIT_YEAR,
  isJumboLoan,
} from '../lib/calculators/loanLimits';

describe('2026 loan limits', () => {
  it('matches the official one-unit figures', () => {
    expect(LOAN_LIMIT_YEAR).toBe(2026);
    expect(CONFORMING_LOAN_LIMIT).toBe(832750);
    expect(CONFORMING_HIGH_COST_LIMIT).toBe(1249125);
    expect(FHA_LOAN_LIMIT_FLOOR).toBe(541287);
    expect(FHA_LOAN_LIMIT_CEILING).toBe(1249125);
  });

  it('flags jumbo only above the conforming baseline', () => {
    expect(isJumboLoan(CONFORMING_LOAN_LIMIT)).toBe(false);
    expect(isJumboLoan(CONFORMING_LOAN_LIMIT + 1)).toBe(true);
  });
});

describe('FHA calculator loan limits and MIP duration', () => {
  const baseInputs = {
    interestRate: 6.5,
    loanTerm: 30,
    creditScore: 700,
    propertyTax: 4800,
    homeInsurance: 1600,
    monthlyGrossIncome: 20000,
    monthlyDebts: 500,
  };

  it('ends MIP at 11 years at exactly 10% down and lasts the term below that', () => {
    const withTen = calculateFHA({
      ...baseInputs,
      homePrice: 400000,
      downPaymentPercent: 10,
    });
    const withFive = calculateFHA({
      ...baseInputs,
      homePrice: 400000,
      downPaymentPercent: 5,
    });
    expect(withTen.details.mipDurationYears).toBe(11);
    expect(withFive.details.mipDurationYears).toBe(30);
  });

  it('exposes 2026 FHA limits and does not flag a standard loan as jumbo', () => {
    const result = calculateFHA({
      ...baseInputs,
      homePrice: 400000,
      downPaymentPercent: 3.5,
    });
    expect(result.details.loanLimitYear).toBe(2026);
    expect(result.details.fhaLoanLimitFloor).toBe(FHA_LOAN_LIMIT_FLOOR);
    expect(result.details.fhaLoanLimitCeiling).toBe(FHA_LOAN_LIMIT_CEILING);
    expect(result.details.conformingLoanLimit).toBe(CONFORMING_LOAN_LIMIT);
    expect(result.details.withinFhaFloor).toBe(1);
    expect(result.details.withinFhaCeiling).toBe(1);
    expect(result.details.isJumbo).toBe(0);
  });

  it('flags a high-cost county loan that is still under the FHA ceiling', () => {
    const result = calculateFHA({
      ...baseInputs,
      homePrice: 600000,
      downPaymentPercent: 3.5,
    });
    expect(result.details.baseLoanAmount).toBeGreaterThan(FHA_LOAN_LIMIT_FLOOR);
    expect(result.details.withinFhaFloor).toBe(0);
    expect(result.details.withinFhaCeiling).toBe(1);
    expect(result.insights.some((insight) => insight.includes('High-cost counties'))).toBe(true);
  });

  it('flags jumbo when the base loan exceeds the conforming limit', () => {
    const result = calculateFHA({
      ...baseInputs,
      homePrice: 900000,
      downPaymentPercent: 3.5,
    });
    expect(result.details.isJumbo).toBe(1);
    expect(result.insights.some((insight) => insight.toLowerCase().includes('jumbo'))).toBe(true);
  });
});

describe('affordability jumbo flags', () => {
  it('flags jumbo tiers when the loan is above the conforming limit', () => {
    const result = calculateAffordability({
      annualIncome: 400000,
      monthlyDebts: 0,
      downPayment: 100000,
      interestRate: 6.5,
      loanTerm: 30,
      propertyTaxRate: 1.2,
      homeInsuranceAnnual: 2400,
      hoaFees: 0,
    });
    expect(result.details.loanLimitYear).toBe(2026);
    expect(result.details.conformingLoanLimit).toBe(CONFORMING_LOAN_LIMIT);
    expect(result.details.aggressiveIsJumbo).toBe(1);
    expect(
      result.insights.some((insight) => insight.toLowerCase().includes('jumbo'))
    ).toBe(true);
  });

  it('does not flag jumbo for a typical conforming scenario', () => {
    const result = calculateAffordability({
      annualIncome: 120000,
      monthlyDebts: 500,
      downPayment: 60000,
      interestRate: 6.5,
      loanTerm: 30,
      propertyTaxRate: 1.2,
      homeInsuranceAnnual: 1500,
      hoaFees: 0,
    });
    expect(result.details.conservativeIsJumbo).toBe(0);
    expect(result.details.moderateIsJumbo).toBe(0);
    expect(result.details.aggressiveIsJumbo).toBe(0);
  });
});
