/**
 * Headline parity tests.
 *
 * Every calculator's headline numbers must agree with the shared reference
 * functions in lib/calculators/mortgageMath.ts. If a calculator re-implements
 * a formula and it drifts from the reference, these tests fail.
 *
 * Tolerances allow only for the display rounding each calculator applies
 * (Math.round / toFixed), never for formula differences.
 */
import { describe, expect, it } from 'vitest';
import {
  calculateAcceleration,
  calculateAffordability,
  calculateAmortization,
  calculateArmVsFixed,
  calculateBiweekly,
  calculateCashOutRefi,
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
import {
  backEndDtiPercent,
  breakEvenMonths,
  conventionalPmiRatePercent,
  fhaAnnualMipRatePercent,
  fhaMonthlyMip,
  fhaUpfrontMip,
  frontEndDtiPercent,
  ltvPercent,
  monthlyPayment,
  monthlyPmiAmount,
  monthsToReachLtv,
  remainingBalance,
  simulateBiweeklyPayoff,
  totalInterestOverTerm,
  vaFundingFeeRatePercent,
} from '../lib/calculators/mortgageMath';

const num = (v: number | string): number => v as number;

describe('amortization (reference calculator)', () => {
  const inputs = { loanAmount: 300000, interestRate: 6.5, loanTerm: 30 };
  const result = calculateAmortization(inputs);

  it('headline monthly payment matches the reference P&I', () => {
    expect(num(result.details.monthlyPayment)).toBeCloseTo(monthlyPayment(300000, 6.5, 360), 2);
  });

  it('headline total interest matches the reference schedule', () => {
    expect(num(result.details.totalInterest)).toBeCloseTo(totalInterestOverTerm(300000, 6.5, 360), -1);
  });

  it('schedule balances match the reference remaining balance', () => {
    const { schedule } = result.amortizationSchedule;
    expect(schedule[59].balance).toBeCloseTo(remainingBalance(300000, 6.5, 360, 60), 0);
    expect(schedule[schedule.length - 1].balance).toBeCloseTo(0, 0);
  });
});

describe('mortgage-cost', () => {
  const inputs = {
    homePrice: 450000,
    downPayment: 90000,
    interestRate: 6.75,
    loanTerm: 30,
    propertyTax: 5400,
    homeInsurance: 1800,
    hoaFees: 100,
    pmi: 0,
  };
  const result = calculateMortgageCost(inputs);
  const refPI = monthlyPayment(360000, 6.75, 360);

  it('headline P&I matches the reference', () => {
    expect(num(result.details.principalAndInterest)).toBeCloseTo(refPI, 1);
  });

  it('headline PITI is the sum of its reference parts', () => {
    const expected = refPI + 5400 / 12 + 1800 / 12 + 100;
    expect(num(result.details.totalMonthlyPayment)).toBeCloseTo(expected, 1);
  });

  it('headline total interest matches the reference', () => {
    expect(num(result.details.totalInterest)).toBeCloseTo(totalInterestOverTerm(360000, 6.75, 360), 0);
  });
});

describe('biweekly', () => {
  const inputs = { loanAmount: 300000, interestRate: 6.5, loanTerm: 30, biweeklyFee: 300 };
  const result = calculateBiweekly(inputs);
  const refPayment = monthlyPayment(300000, 6.5, 360);
  const refBiweekly = simulateBiweeklyPayoff(300000, 6.5, refPayment / 2, 720);

  it('headline monthly and biweekly payments match the reference', () => {
    expect(num(result.details.monthlyPayment)).toBeCloseTo(refPayment, 0);
    expect(num(result.details.biweeklyPayment)).toBeCloseTo(refPayment / 2, 0);
  });

  it('headline interest saved matches the reference simulation', () => {
    const refMonthlyInterest = refPayment * 360 - 300000;
    const refSaved = refMonthlyInterest - refBiweekly.totalInterest;
    expect(num(result.details.interestSaved)).toBeCloseTo(refSaved, -1);
  });

  it('headline payoff years match the reference simulation', () => {
    expect(num(result.details.biweeklyYears)).toBeCloseTo(refBiweekly.periods / 26, 1);
  });
});

describe('fha', () => {
  const inputs = {
    homePrice: 400000,
    downPaymentPercent: 3.5,
    interestRate: 6.5,
    loanTerm: 30,
    creditScore: 700,
    propertyTax: 4800,
    homeInsurance: 1600,
    monthlyGrossIncome: 10000,
    monthlyDebts: 500,
  };
  const result = calculateFHA(inputs);
  const baseLoan = 400000 * 0.965;
  const refUpfront = fhaUpfrontMip(baseLoan);
  const refAnnualRate = fhaAnnualMipRatePercent(baseLoan, ltvPercent(baseLoan, 400000), 30);
  const refMonthlyMip = fhaMonthlyMip(baseLoan, refAnnualRate);
  const refPI = monthlyPayment(baseLoan + refUpfront, 6.5, 360);

  it('headline upfront MIP matches the reference', () => {
    expect(num(result.details.upfrontMIP)).toBeCloseTo(refUpfront, 0);
  });

  it('headline monthly MIP matches the reference', () => {
    expect(num(result.details.monthlyMIP)).toBeCloseTo(refMonthlyMip, 0);
    expect(num(result.details.annualMIPRate)).toBe(refAnnualRate);
  });

  it('headline P&I and PITI match the reference', () => {
    expect(num(result.details.monthlyPI)).toBeCloseTo(refPI, 0);
    const expectedTotal = refPI + refMonthlyMip + 4800 / 12 + 1600 / 12;
    expect(num(result.details.totalMonthlyPayment)).toBeCloseTo(expectedTotal, 0);
  });

  it('headline DTI matches the reference helpers', () => {
    const total = refPI + refMonthlyMip + 4800 / 12 + 1600 / 12;
    expect(num(result.details.housingDTI)).toBeCloseTo(frontEndDtiPercent(total, 10000), 1);
    expect(num(result.details.totalDTI)).toBeCloseTo(backEndDtiPercent(total, 500, 10000), 1);
  });
});

describe('interest-sensitivity', () => {
  const inputs = {
    loanAmount: 350000,
    baseRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1500,
  };
  const result = calculateInterestSensitivity(inputs);

  it('headline base payment matches the reference', () => {
    expect(num(result.details.basePayment)).toBeCloseTo(monthlyPayment(350000, 6.5, 360), 0);
  });

  it('quarter-point impact matches payments recomputed from the reference', () => {
    const base = Math.round(monthlyPayment(350000, 6.5, 360));
    const up = Math.round(monthlyPayment(350000, 6.75, 360));
    const down = Math.round(monthlyPayment(350000, 6.25, 360));
    const expected = Math.round((up - base + (base - down)) / 2);
    expect(num(result.details.quarterPctImpact)).toBe(expected);
  });

  it('total interest at each rate matches the reference', () => {
    const point = result.chartData!.find((r) => r.rate === '7.50%')!;
    expect(num(point.totalInterest)).toBeCloseTo(totalInterestOverTerm(350000, 7.5, 360), -1);
  });
});

describe('points-buydown', () => {
  const inputs = {
    loanAmount: 400000,
    parRate: 7,
    loanTerm: 30,
    pointsCost: 8000,
    pointsRate: 6.5,
    lenderCredit: 4000,
    lenderCreditRate: 7.375,
    buydownType: 'none' as const,
    buydownCost: 0,
    yearsToHold: 7,
  };
  const result = calculatePointsBuydown(inputs);
  const parPayment = monthlyPayment(400000, 7, 360);
  const pointsPayment = monthlyPayment(400000, 6.5, 360);

  it('headline par payment matches the reference', () => {
    expect(num(result.details.parPayment)).toBeCloseTo(parPayment, 0);
  });

  it('points break-even matches the reference', () => {
    const monthlySavings = Math.round(parPayment) - Math.round(pointsPayment);
    const refBreakEven = breakEvenMonths(8000, monthlySavings);
    const insight = result.insights.find((i) => i.includes('breaks even'))!;
    expect(insight).toContain(`${Math.round(refBreakEven)} months`);
  });
});

describe('refinance', () => {
  const inputs = {
    currentBalance: 320000,
    currentRate: 7.5,
    currentMonthlyPayment: 2450,
    yearsRemaining: 27,
    newRate: 6.25,
    newTerm: 30,
    closingCosts: 6000,
  };
  const result = calculateRefinance(inputs);
  const refNewPayment = monthlyPayment(326000, 6.25, 360);
  // The entered $2,450 payment is materially above the scheduled P&I for this
  // balance/rate/term, so the calculator validates it and falls back to the
  // implied payment (ENG-318). The reference comparison must do the same.
  const refImpliedPayment = monthlyPayment(320000, 7.5, 27 * 12);

  it('headline new payment matches the reference', () => {
    expect(num(result.details.newMonthlyPayment)).toBeCloseTo(refNewPayment, 1);
  });

  it('flags the entered payment as mismatched and uses the implied P&I', () => {
    expect(num(result.details.paymentMismatch)).toBe(1);
    expect(num(result.details.impliedCurrentPayment)).toBeCloseTo(refImpliedPayment, 1);
    expect(num(result.details.currentMonthlyPayment)).toBeCloseTo(refImpliedPayment, 1);
  });

  it('headline break-even matches the reference', () => {
    const savings = refImpliedPayment - refNewPayment;
    expect(num(result.details.breakEvenMonths)).toBe(Math.ceil(breakEvenMonths(6000, savings)));
  });
});

describe('cash-out-refi', () => {
  const inputs = {
    currentBalance: 280000,
    currentRate: 5.5,
    yearsRemaining: 25,
    homeValue: 500000,
    cashOutAmount: 60000,
    newRate: 6.75,
    newTerm: 30,
    closingCosts: 7000,
    alternativeRate: 9,
  };
  const result = calculateCashOutRefi(inputs);

  it('headline payments match the reference', () => {
    expect(num(result.details.currentPayment)).toBeCloseTo(monthlyPayment(280000, 5.5, 300), 0);
    expect(num(result.details.newPayment)).toBeCloseTo(monthlyPayment(347000, 6.75, 360), 0);
  });

  it('headline LTV matches the reference', () => {
    expect(num(result.details.newLTV)).toBeCloseTo(ltvPercent(347000, 500000), 0);
  });
});

describe('recast-vs-refi', () => {
  const inputs = {
    currentBalance: 300000,
    currentRate: 6.5,
    yearsRemaining: 25,
    lumpSumAmount: 50000,
    recastFee: 350,
    newRate: 5.75,
    newTerm: 30,
    closingCosts: 6500,
  };
  const result = calculateRecastVsRefi(inputs);

  it('headline payments match the reference', () => {
    expect(num(result.details.currentPayment)).toBeCloseTo(monthlyPayment(300000, 6.5, 300), 0);
    expect(num(result.details.recastPayment)).toBeCloseTo(monthlyPayment(250000, 6.5, 300), 0);
    expect(num(result.details.refiPayment)).toBeCloseTo(monthlyPayment(250000, 5.75, 360), 0);
  });
});

describe('arm-vs-fixed', () => {
  const inputs = {
    loanAmount: 400000,
    fixedRate: 6.75,
    armInitialRate: 5.875,
    armFixedPeriod: 5,
    armAdjustmentCap: 2,
    armLifetimeCap: 5,
    armMargin: 2.75,
    loanTerm: 30,
    expectedIndexRate: 4,
  };
  const result = calculateArmVsFixed(inputs);

  it('headline fixed and ARM payments match the reference', () => {
    expect(num(result.details.fixedPayment)).toBeCloseTo(monthlyPayment(400000, 6.75, 360), 0);
    expect(num(result.details.armInitialPayment)).toBeCloseTo(monthlyPayment(400000, 5.875, 360), 0);
  });

  it('worst-case payment matches the reference at the capped rate', () => {
    const worstRate = Math.min(5.875 + 5, 6.75 + 3);
    expect(num(result.details.worstCasePayment)).toBeCloseTo(monthlyPayment(400000, worstRate, 360), 0);
  });
});

describe('timeline-simulator', () => {
  const inputs = {
    loanAmount: 400000,
    interestRate: 6.75,
    expectedMoveYear: 6,
    refiLikelihood: 30,
    armInitialRate: 5.875,
    armFixedPeriod: 7,
    pointsCost: 8000,
    pointsRate: 6.25,
  };
  const result = calculateTimelineSimulator(inputs);

  it('headline payments match the reference', () => {
    expect(num(result.details.fixedPayment)).toBeCloseTo(monthlyPayment(400000, 6.75, 360), 0);
    expect(num(result.details.armPayment)).toBeCloseTo(monthlyPayment(400000, 5.875, 360), 0);
  });

  it('remaining balances match the reference schedule', () => {
    const fixedRow = result.chartData!.find((r) => r.option === '30-Year Fixed (Par)')!;
    expect(num(fixedRow.remainingBalance)).toBeCloseTo(remainingBalance(400000, 6.75, 360, 72), 0);
  });
});

describe('extra-payment', () => {
  const inputs = {
    loanAmount: 300000,
    interestRate: 6.5,
    loanTerm: 30,
    extraMonthlyPayment: 200,
    extraAnnualPayment: 0,
    investmentReturn: 7,
  };
  const result = calculateExtraPayment(inputs);

  it('headline regular payment matches the reference', () => {
    expect(num(result.details.regularMonthlyPayment)).toBeCloseTo(monthlyPayment(300000, 6.5, 360), 1);
  });

  it('extra payments save interest and time', () => {
    expect(num(result.details.interestSaved)).toBeGreaterThan(0);
    expect(num(result.details.monthsSaved)).toBeGreaterThan(0);
  });

  it('effective return is the mortgage rate, not interest-saved ÷ extra-paid', () => {
    expect(num(result.details.effectiveReturnRate)).toBe(6.5);
    expect(result.insights.join(' ')).toMatch(/6\.5%/);
    expect(result.insights.join(' ')).not.toMatch(/195/);
    const fakeRatio =
      (num(result.details.interestSaved) / num(result.details.totalExtraPaid)) * 100;
    expect(result.insights.join(' ')).not.toContain(fakeRatio.toFixed(1));
  });

  it('compares net worth at the original term under both paths', () => {
    expect(num(result.details.horizonYears)).toBe(30);
    expect(num(result.details.prepayPortfolio)).toBeGreaterThan(0);
    expect(num(result.details.investmentValue)).toBeGreaterThan(0);
    expect(Number.isFinite(num(result.details.netWorthDifference))).toBe(true);
  });

  it('is unbiased: equal investment return and loan rate ends both paths equal', () => {
    const equal = calculateExtraPayment({ ...inputs, investmentReturn: 6.5 });
    expect(num(equal.details.netWorthDifference)).toBeCloseTo(0, 0);
  });

  it('does not produce NaN with zero extra payments', () => {
    const zero = calculateExtraPayment({ ...inputs, extraMonthlyPayment: 0 });
    expect(Number.isFinite(num(zero.details.interestSaved))).toBe(true);
    expect(Number.isFinite(num(zero.details.netWorthDifference))).toBe(true);
    expect(zero.insights.join(' ')).not.toMatch(/NaN/);
  });
});

describe('acceleration', () => {
  const inputs = {
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
  };
  const result = calculateAcceleration(inputs);

  it('headline base payment matches the reference', () => {
    expect(num(result.details.basePayment)).toBeCloseTo(monthlyPayment(300000, 6.5, 360), 0);
  });

  it('headline regular interest matches the reference', () => {
    expect(num(result.details.regularInterest)).toBeCloseTo(totalInterestOverTerm(300000, 6.5, 360), 0);
  });

  it('effective return is the mortgage rate', () => {
    expect(num(result.details.effectiveReturnRate)).toBe(6.5);
    expect(result.insights.join(' ')).toMatch(/6\.5%/);
  });

  it('compares net worth at the original term under both paths', () => {
    expect(num(result.details.horizonYears)).toBe(30);
    expect(num(result.details.prepayPortfolio)).toBeGreaterThan(0);
    expect(num(result.details.investPortfolio)).toBeGreaterThan(0);
    expect(Number.isFinite(num(result.details.netWorthDifference))).toBe(true);
  });

  it('is unbiased: equal investment return and loan rate ends both paths equal', () => {
    const equal = calculateAcceleration({
      ...inputs,
      extraAnnual: 1200,
      lumpSumAmount: 10000,
      lumpSumYear: 5,
      investmentReturn: 6.5,
    });
    expect(num(equal.details.netWorthDifference)).toBeCloseTo(0, 0);
  });
});

describe('affordability', () => {
  const inputs = {
    annualIncome: 120000,
    monthlyDebts: 500,
    downPayment: 60000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1500,
    hoaFees: 0,
  };
  const result = calculateAffordability(inputs);

  it('each tier payment is derived from the reference P&I at that price', () => {
    for (const tier of ['conservative', 'moderate', 'aggressive'] as const) {
      const price = num(result.details[`${tier}Price`]);
      const payment = num(result.details[`${tier}Payment`]);
      const loan = price - 60000;
      // PMI is part of the affordability back-solve when LTV > 80% (ENG-320),
      // at the calculator's assumed 0.5%/yr rate.
      const pmi = loan / price > 0.8 ? (loan * 0.005) / 12 : 0;
      const expected =
        monthlyPayment(loan, 6.5, 360) + pmi + (price * 1.2) / 100 / 12 + 1500 / 12;
      expect(payment).toBeCloseTo(expected, -1);
      expect(num(result.details[`${tier}PMI`])).toBeCloseTo(pmi, 0);
    }
  });

  it('tier payments respect their DTI caps', () => {
    const monthlyIncome = 120000 / 12;
    expect(num(result.details.conservativePayment)).toBeLessThanOrEqual(monthlyIncome * 0.28 + 1);
    expect(num(result.details.moderatePayment)).toBeLessThanOrEqual(monthlyIncome * 0.36 + 1);
    expect(num(result.details.aggressivePayment)).toBeLessThanOrEqual(monthlyIncome * 0.43 + 1);
  });
});

describe('down-payment', () => {
  const inputs = {
    homePrice: 400000,
    downPaymentPercent: 10,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1500,
    pmiRate: 0.5,
  };
  const result = calculateDownPayment(inputs);

  it("selected option's headline numbers match the reference", () => {
    expect(num(result.details.downPaymentAmount)).toBe(40000);
    expect(num(result.details.loanAmount)).toBe(360000);
    expect(num(result.details.monthlyPayment)).toBeCloseTo(monthlyPayment(360000, 6.5, 360), 0);
  });

  it('3% option matches the reference P&I, PMI, and removal month', () => {
    const loan3 = 400000 * 0.97;
    const refPI = monthlyPayment(loan3, 6.5, 360);
    const refPMI = monthlyPmiAmount(loan3, 0.5);
    const refMonths = monthsToReachLtv(loan3, 400000, 6.5, 360, 78);
    const expectedTotal = refPI + refPMI + (400000 * 1.2) / 100 / 12 + 1500 / 12;
    expect(num(result.details.option3Payment)).toBeCloseTo(expectedTotal, 0);
    expect(num(result.details.option3PMI)).toBeCloseTo(refPMI * refMonths, -1);
  });
});

describe('rent-vs-buy', () => {
  const inputs = {
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
    closingCosts: 8000,
    sellingCosts: 6,
    investmentReturn: 7,
    yearsToAnalyze: 10,
  };
  const result = calculateRentVsBuy(inputs);

  it('headline monthly P&I matches the reference', () => {
    expect(num(result.details.monthlyPI)).toBeCloseTo(monthlyPayment(320000, 6.5, 360), 0);
  });
});

describe('dti', () => {
  const inputs = {
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
  };
  const result = calculateDTI(inputs);
  const housing = 2100 + 4800 / 12 + 1600 / 12 + 50;
  const otherDebts = 450 + 300 + 120;

  it('headline DTI ratios match the reference helpers', () => {
    expect(num(result.details.frontEndDTI)).toBeCloseTo(frontEndDtiPercent(housing, 9000), 1);
    expect(num(result.details.backEndDTI)).toBeCloseTo(backEndDtiPercent(housing, otherDebts, 9000), 1);
  });
});

describe('pmi', () => {
  const inputs = {
    homePrice: 400000,
    downPaymentPercent: 10,
    loanAmount: 360000,
    interestRate: 6.5,
    loanTerm: 30,
    creditScore: 740,
    pmiType: 'borrower-paid' as const,
  };
  const result = calculatePMI(inputs);
  const ltv = ltvPercent(360000, 400000);
  const refRate = conventionalPmiRatePercent(ltv, 740);
  const refMonthly = monthlyPmiAmount(360000, refRate);
  const refMonths = monthsToReachLtv(360000, 400000, 6.5, 360, 78);

  it('headline PMI rate, monthly PMI, and removal month match the reference', () => {
    expect(num(result.details.pmiRate)).toBe(refRate);
    expect(num(result.details.monthlyPMI)).toBeCloseTo(refMonthly, 0);
    expect(num(result.details.monthsUntilRemoval)).toBe(refMonths);
    expect(num(result.details.ltv)).toBeCloseTo(ltv, 1);
  });

  it('headline P&I matches the reference', () => {
    expect(num(result.details.monthlyPI)).toBeCloseTo(monthlyPayment(360000, 6.5, 360), 0);
  });
});

describe('va', () => {
  const inputs = {
    homePrice: 400000,
    downPaymentPercent: 0,
    interestRate: 6.25,
    loanTerm: 30,
    serviceType: 'regular' as const,
    firstTimeUse: true,
    disabilityExempt: false,
    propertyTax: 4800,
    homeInsurance: 1600,
    monthlyGrossIncome: 9000,
    monthlyDebts: 400,
  };
  const result = calculateVA(inputs);
  const refFeeRate = vaFundingFeeRatePercent(0, true, 'regular', false);
  const refFee = Math.round(400000 * (refFeeRate / 100));
  const refPI = monthlyPayment(400000 + refFee, 6.25, 360);

  it('headline funding fee matches the reference', () => {
    expect(num(result.details.fundingFeeRate)).toBe(refFeeRate);
    expect(num(result.details.fundingFee)).toBe(refFee);
  });

  it('headline P&I and total payment match the reference', () => {
    expect(num(result.details.monthlyPI)).toBeCloseTo(refPI, 0);
    const expectedTotal = refPI + 4800 / 12 + 1600 / 12;
    expect(num(result.details.totalMonthlyPayment)).toBeCloseTo(expectedTotal, 0);
  });
});
