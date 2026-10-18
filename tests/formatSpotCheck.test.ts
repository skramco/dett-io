import { describe, expect, it } from 'vitest';
import {
  calculateAffordability,
  calculateAmortization,
  calculateMortgageCost,
  calculateRefinance,
} from '../lib/calculators';

/** "$1057k", "$481k" — compact abbreviations that must not appear on result surfaces. */
const COMPACT_K = /\$\d+(?:\.\d+)?k\b/i;
/** "$3,719.4" / "$2,335.00" — stray cents on whole-dollar surfaces. */
const STRAY_CENTS = /\$\d[\d,]*\.\d/;
/** "$480583" — four+ digits with no thousands separator. */
const BARE_THOUSANDS = /\$\d{4,}(?!\d)/;

function assertCleanCurrency(text: string, label: string) {
  expect(text, `${label} compact $Xk`).not.toMatch(COMPACT_K);
  expect(text, `${label} stray cents`).not.toMatch(STRAY_CENTS);
  expect(text, `${label} missing commas`).not.toMatch(BARE_THOUSANDS);
}

describe('calculator result-surface formatting (ENG-333)', () => {
  it('True Monthly Cost summary uses whole dollars with commas', () => {
    const result = calculateMortgageCost({
      homePrice: 450000,
      downPayment: 90000,
      interestRate: 6.75,
      loanTerm: 30,
      propertyTax: 5400,
      homeInsurance: 1800,
      hoaFees: 0,
      pmi: 0,
    });
    expect(result.summary).toContain('$2,935');
    expect(result.summary).toContain('$2,335');
    assertCleanCurrency(result.summary, 'mortgage-cost summary');
    result.insights.forEach((insight, i) => assertCleanCurrency(insight, `mortgage-cost insight ${i}`));
  });

  it('Refinance summary formats monthly and lifetime amounts as whole dollars', () => {
    const result = calculateRefinance({
      currentBalance: 320000,
      currentRate: 7.5,
      currentMonthlyPayment: 2237,
      yearsRemaining: 27,
      newRate: 6.25,
      newTerm: 30,
      closingCosts: 6000,
    });
    assertCleanCurrency(result.summary, 'refinance summary');
    result.insights.forEach((insight, i) => assertCleanCurrency(insight, `refinance insight ${i}`));
    expect(result.summary).toMatch(/\$\d{1,3}(?:,\d{3})+/);
  });

  it('Affordability summary formats income and home prices with commas', () => {
    const result = calculateAffordability({
      annualIncome: 120000,
      monthlyDebts: 500,
      downPayment: 60000,
      interestRate: 6.75,
      loanTerm: 30,
      propertyTaxRate: 1.2,
      homeInsuranceAnnual: 1800,
      hoaFees: 0,
    });
    assertCleanCurrency(result.summary, 'affordability summary');
    result.insights.forEach((insight, i) => assertCleanCurrency(insight, `affordability insight ${i}`));
    expect(result.summary).toContain('$10,000');
  });

  it('Amortization surfaces full totals instead of $Xk abbreviations', () => {
    const result = calculateAmortization({
      loanAmount: 360000,
      interestRate: 6.75,
      loanTerm: 30,
    });
    assertCleanCurrency(result.summary, 'amortization summary');
    result.insights.forEach((insight, i) => assertCleanCurrency(insight, `amortization insight ${i}`));
    expect(result.summary).toContain('$360,000');
    expect(result.insights.join(' ')).toMatch(/\$\d{1,3},\d{3}/);
  });
});
