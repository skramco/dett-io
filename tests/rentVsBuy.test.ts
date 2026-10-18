import { describe, expect, it } from 'vitest';
import { calculateRentVsBuy, RENT_VS_BUY_SCENARIO_ASSUMPTIONS } from '../lib/calculators/rentVsBuy';
import type { RentVsBuyInputs } from '../lib/calculators/types';

const base = (overrides: Partial<RentVsBuyInputs> = {}): RentVsBuyInputs => ({
  homePrice: 400000,
  downPayment: 80000,
  interestRate: 6.5,
  loanTerm: 30,
  monthlyRent: 2200,
  rentInflation: 3,
  homeAppreciation: 3.5,
  propertyTaxRate: 1.2,
  homeInsuranceAnnual: 1500,
  maintenanceRate: 1,
  pmiRate: 0.5,
  closingCosts: 8000,
  sellingCosts: 6,
  investmentReturn: 7,
  yearsToAnalyze: 10,
  ...overrides,
});

describe('calculateRentVsBuy scenario range', () => {
  it('keeps the base-path headline while adding a sampled range', () => {
    const result = calculateRentVsBuy(base());
    expect(Number(result.details.mcSamples)).toBe(RENT_VS_BUY_SCENARIO_ASSUMPTIONS.samples);
    expect(Number(result.details.p10Difference)).toBeLessThanOrEqual(Number(result.details.p50Difference));
    expect(Number(result.details.p50Difference)).toBeLessThanOrEqual(Number(result.details.p90Difference));
    expect(Number(result.details.pctBuyWins)).toBeGreaterThanOrEqual(0);
    expect(Number(result.details.pctBuyWins)).toBeLessThanOrEqual(100);
    expect(Number(result.details.optimisticDifference)).toBeGreaterThan(
      Number(result.details.pessimisticDifference)
    );
  });

  it('joint named paths move appreciation, rent inflation, and returns together', () => {
    const result = calculateRentVsBuy(base());
    expect(Number(result.details.optimisticAppreciation)).toBeCloseTo(5.5, 5);
    expect(Number(result.details.optimisticRentInflation)).toBeCloseTo(4, 5);
    expect(Number(result.details.optimisticInvestmentReturn)).toBeCloseTo(5.5, 5);
    expect(Number(result.details.pessimisticAppreciation)).toBeCloseTo(1.5, 5);
    expect(Number(result.details.pessimisticRentInflation)).toBeCloseTo(2, 5);
    expect(Number(result.details.pessimisticInvestmentReturn)).toBeCloseTo(8.5, 5);
  });

  it('chartData includes percentile bands, not only the base path', () => {
    const result = calculateRentVsBuy(base());
    const yearly = result.chartData as Array<{
      year: number;
      buyNetWorth: number;
      rentNetWorth: number;
      diffP10: number;
      diffP50: number;
      diffP90: number;
    }>;
    expect(yearly).toHaveLength(10);
    const last = yearly[yearly.length - 1];
    expect(last.diffP10).toBeLessThanOrEqual(last.diffP50);
    expect(last.diffP50).toBeLessThanOrEqual(last.diffP90);
    expect(last.year).toBe(10);
  });

  it('is deterministic for the same inputs', () => {
    const a = calculateRentVsBuy(base());
    const b = calculateRentVsBuy(base());
    expect(a.details.p10Difference).toBe(b.details.p10Difference);
    expect(a.details.pctBuyWins).toBe(b.details.pctBuyWins);
  });

  it('buying-hostile rents report a low win share without breaking the base path', () => {
    const result = calculateRentVsBuy(
      base({
        homePrice: 800000,
        downPayment: 160000,
        monthlyRent: 1200,
        homeAppreciation: 0,
        rentInflation: 1,
        investmentReturn: 8,
        propertyTaxRate: 2,
        maintenanceRate: 2,
        sellingCosts: 8,
      })
    );
    expect(Number(result.details.baseDifference)).toBeLessThan(0);
    expect(result.details.baseCrossover).toBe('Never');
    expect(Number(result.details.pctBuyWins)).toBeLessThan(50);
  });
});
