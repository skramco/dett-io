/**
 * "Show Me the Math" regression tests.
 *
 * The math panel renders each formula step's computedValue from the
 * calculator's `details` object. Historically, formula generators referenced
 * detail keys that calculators never produced, so users saw "$0", "0.0%", or
 * "N/A" instead of their real numbers.
 *
 * These tests run every calculator with realistic inputs, feed the real
 * `details` into the formula generators, and fail on any empty value.
 */
import { describe, expect, it } from 'vitest';
import { calculatorFormulas } from '../lib/calculators/formulas';
import {
  calculateAcceleration,
  calculateAffordability,
  calculateAmortization,
  calculateArmVsFixed,
  calculateBiweekly,
  calculateCashOutRefi,
  calculateClosingCosts,
  calculateDownPayment,
  calculateDTI,
  calculateExtraPayment,
  calculateFHA,
  calculateInterestSensitivity,
  calculateMortgageCost,
  calculatePMI,
  calculatePointsBuydown,
  calculateRecastVsRefi,
  calculateRefinance,
  calculateRentVsBuy,
  calculateTimelineSimulator,
  calculateVA,
} from '../lib/calculators';

/**
 * Representative inputs for each calculator slug. Values are chosen so that
 * every formula step has a real, non-empty computed value.
 */
const detailsBySlug: Record<string, Record<string, number | string>> = {
  affordability: calculateAffordability({
    annualIncome: 120000,
    monthlyDebts: 500,
    downPayment: 60000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1500,
    hoaFees: 0,
  }).details,
  'mortgage-cost': calculateMortgageCost({
    homePrice: 450000,
    downPayment: 45000, // 10% down → PMI applies, so the PMI step has a value
    interestRate: 6.75,
    loanTerm: 30,
    propertyTax: 5400,
    homeInsurance: 1800,
    hoaFees: 100,
    pmi: 2025,
  }).details,
  'down-payment': calculateDownPayment({
    homePrice: 400000,
    downPaymentPercent: 10,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1500,
    creditScore: 740,
  }).details,
  'rent-vs-buy': calculateRentVsBuy({
    homePrice: 400000,
    downPayment: 80000,
    interestRate: 6.5,
    loanTerm: 30,
    monthlyRent: 2600,
    rentInflation: 3,
    homeAppreciation: 4,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1500,
    maintenanceRate: 1,
    pmiRate: 0.5,
    closingCosts: 8000,
    sellingCosts: 6,
    investmentReturn: 6,
    yearsToAnalyze: 15,
  }).details,
  refinance: calculateRefinance({
    currentBalance: 320000,
    currentRate: 7.5,
    currentMonthlyPayment: 2450,
    yearsRemaining: 27,
    newRate: 6.25,
    newTerm: 30,
    closingCosts: 6000,
  }).details,
  'cash-out-refi': calculateCashOutRefi({
    currentBalance: 280000,
    currentRate: 5.5,
    yearsRemaining: 25,
    homeValue: 500000,
    cashOutAmount: 60000,
    newRate: 6.75,
    newTerm: 30,
    closingCosts: 7000,
    alternativeRate: 9,
  }).details,
  'recast-vs-refi': calculateRecastVsRefi({
    currentBalance: 300000,
    currentRate: 6.5,
    yearsRemaining: 25,
    lumpSumAmount: 50000,
    recastFee: 350,
    newRate: 5.75,
    newTerm: 30,
    closingCosts: 6500,
    savingsRate: 4,
  }).details,
  'points-buydown': calculatePointsBuydown({
    loanAmount: 400000,
    parRate: 7,
    loanTerm: 30,
    pointsCost: 8000,
    pointsRate: 6.5,
    lenderCredit: 4000,
    lenderCreditRate: 7.375,
    buydownType: '2-1',
    yearsToHold: 7,
  }).details,
  'arm-vs-fixed': calculateArmVsFixed({
    loanAmount: 400000,
    fixedRate: 6.75,
    armInitialRate: 5.875,
    armFixedPeriod: 5,
    armAdjustmentFrequency: 6,
    armInitialCap: 2,
    armAdjustmentCap: 1,
    armLifetimeCap: 5,
    armMargin: 2.75,
    loanTerm: 30,
    expectedIndexRate: 4,
  }).details,
  'timeline-simulator': calculateTimelineSimulator({
    loanAmount: 400000,
    interestRate: 6.75,
    expectedMoveYear: 7,
    armInitialRate: 5.875,
    armFixedPeriod: 5,
    armMargin: 2.75,
    expectedIndexRate: 5,
    armAdjustmentCap: 2,
    armLifetimeCap: 5,
    pointsCost: 8000,
    pointsRate: 6.25,
  }).details,
  'extra-payment': calculateExtraPayment({
    loanAmount: 300000,
    interestRate: 6.5,
    loanTerm: 30,
    extraMonthlyPayment: 200,
    extraAnnualPayment: 0,
    investmentReturn: 7,
  }).details,
  acceleration: calculateAcceleration({
    loanAmount: 300000,
    interestRate: 6.5,
    loanTerm: 30,
    extraMonthly: 300,
    extraAnnual: 0,
    lumpSumAmount: 0,
    lumpSumYear: 0,
    investmentReturn: 7,
    recastOption: false,
    recastFee: 250,
  }).details,
  biweekly: calculateBiweekly({
    loanAmount: 300000,
    interestRate: 6.5,
    loanTerm: 30,
    biweeklyFee: 300,
  }).details,
  'interest-sensitivity': calculateInterestSensitivity({
    loanAmount: 350000,
    baseRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1500,
  }).details,
  amortization: calculateAmortization({
    loanAmount: 300000,
    interestRate: 6.5,
    loanTerm: 30,
  }).details,
  dti: calculateDTI({
    monthlyGrossIncome: 9000,
    mortgagePayment: 2100,
    propertyTax: 4800,
    homeInsurance: 1600,
    hoaFees: 50,
    carPayments: 450,
    studentLoans: 300,
    creditCardMinimums: 120,
    personalLoans: 0,
    childSupport: 0,
    otherDebts: 0,
  }).details,
  'closing-costs': calculateClosingCosts({
    homePrice: 400000,
    downPaymentPercent: 10,
    interestRate: 6.5,
    loanTerm: 30,
    state: 'TX',
    isNewConstruction: false,
  }).details,
  pmi: calculatePMI({
    homePrice: 400000,
    downPaymentPercent: 10,
    loanAmount: 360000,
    interestRate: 6.5,
    loanTerm: 30,
    creditScore: 740,
    pmiType: 'borrower-paid',
  }).details,
  fha: calculateFHA({
    homePrice: 400000,
    downPaymentPercent: 3.5,
    interestRate: 6.5,
    loanTerm: 30,
    creditScore: 700,
    propertyTax: 4800,
    homeInsurance: 1600,
    monthlyGrossIncome: 10000,
    monthlyDebts: 500,
  }).details,
  va: calculateVA({
    homePrice: 400000,
    downPaymentPercent: 0,
    interestRate: 6.25,
    loanTerm: 30,
    loanPurpose: 'purchase',
    serviceType: 'regular',
    firstTimeUse: true,
    disabilityExempt: false,
    region: 'south',
    familySize: 3,
    propertyTax: 4800,
    homeInsurance: 1600,
    monthlyGrossIncome: 9000,
    monthlyDebts: 400,
  }).details,
};

/** Values that indicate a formula step failed to resolve a real number. */
const EMPTY_VALUES = new Set(['$0', '0.0%', '0.00%', '0%', 'N/A', '$NaN', '0 months', 'Month 0', 'Year 0']);

describe('Show Me the Math values', () => {
  it('has representative inputs for every calculator with formulas', () => {
    expect(Object.keys(detailsBySlug).sort()).toEqual(Object.keys(calculatorFormulas).sort());
  });

  for (const [slug, generator] of Object.entries(calculatorFormulas)) {
    it(`${slug}: every computed value is a real number (no $0 / 0.0% / N/A)`, () => {
      const details = detailsBySlug[slug];
      expect(details, `missing representative inputs for ${slug}`).toBeDefined();

      const formulaSets = generator(details);
      expect(formulaSets.length).toBeGreaterThan(0);

      for (const set of formulaSets) {
        for (const step of set.steps) {
          if (step.computedValue === undefined) continue;
          const value = step.computedValue;
          const context = `${slug} → "${set.title}" → "${step.label}" rendered "${value}"`;
          expect(EMPTY_VALUES.has(value), context).toBe(false);
          expect(value, context).not.toMatch(/NaN|undefined|Infinity/);
        }
      }
    });
  }

  it('pmi math card shows starting LTV, 80%/78% removal rules, and original-loan PMI (ENG-329)', () => {
    // Dett.io review scenario: $450k home, 10% down, 6.75%, 30yr, 740 score
    const details = calculatePMI({
      homePrice: 450000,
      downPaymentPercent: 10,
      loanAmount: 405000,
      interestRate: 6.75,
      loanTerm: 30,
      creditScore: 740,
      pmiType: 'borrower-paid',
    }).details;

    const steps = calculatorFormulas.pmi(details)[0].steps;
    const byLabel = Object.fromEntries(steps.map((s) => [s.label, s]));

    expect(byLabel['Starting LTV Ratio'].computedValue).toBe('90.0%');
    expect(byLabel['Monthly PMI'].computedValue).toBe('$118');
    expect(byLabel['Monthly PMI'].formula).toMatch(/Original Loan Amount/);
    expect(byLabel['Monthly PMI'].description).toMatch(/original loan amount/);
    expect(byLabel['Request Cancellation at 80% LTV'].computedValue).toBe('$360,000 balance');
    expect(byLabel['Request Cancellation at 80% LTV'].description).toMatch(/good payment history/);
    expect(byLabel['Automatic Removal at 78% LTV'].computedValue).toBe('Month 112 (~9.3 yrs)');
    expect(byLabel['Automatic Removal at 78% LTV'].description).toMatch(/automatically/);
    expect(steps.some((s) => s.computedValue === '0.0%' || s.computedValue === 'N/A')).toBe(false);
  });

  it('pmi math card shows Not required when down payment is 20% or more', () => {
    const details = calculatePMI({
      homePrice: 450000,
      downPaymentPercent: 20,
      loanAmount: 360000,
      interestRate: 6.75,
      loanTerm: 30,
      creditScore: 740,
      pmiType: 'borrower-paid',
    }).details;

    const steps = calculatorFormulas.pmi(details)[0].steps;
    expect(steps.find((s) => s.label === 'Starting LTV Ratio')?.computedValue).toBe('80.0%');
    expect(steps.find((s) => s.label === 'PMI Required?')?.computedValue).toBe('Not required');
    expect(steps.some((s) => s.label === 'Monthly PMI')).toBe(false);
  });

  it('rent-vs-buy shows Never within horizon when buying does not break even', () => {
    // Renting stays far cheaper, home barely appreciates → no crossover
    const details = calculateRentVsBuy({
      homePrice: 800000,
      downPayment: 160000,
      interestRate: 7.5,
      loanTerm: 30,
      monthlyRent: 1200,
      rentInflation: 1,
      homeAppreciation: 0,
      propertyTaxRate: 2,
      homeInsuranceAnnual: 3000,
      maintenanceRate: 2,
      pmiRate: 0.5,
      closingCosts: 15000,
      sellingCosts: 8,
      investmentReturn: 8,
      yearsToAnalyze: 10,
    }).details;

    const sets = calculatorFormulas['rent-vs-buy'](details);
    const breakEvenStep = sets[0].steps.find((s) => s.label === 'Break-Even Year')!;
    expect(breakEvenStep.computedValue).toBe('Never within horizon');
  });
});
