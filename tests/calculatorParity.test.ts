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
  calculateAffordability,
  calculateAmortization,
  calculateCashOutRefi,
  calculateClosingCosts,
  calculateDownPayment,
  calculateDTI,
  calculateFHA,
  calculateInterestSensitivity,
  calculateLoanTimeline,
  calculateMortgageCost,
  calculatePayoff,
  calculatePMI,
  calculateRecastVsRefi,
  calculateRefinance,
  calculateRentVsBuy,
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
  remainingBalanceWithPayment,
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

  it('includes grid PMI when LTV is above 80% and no override is set', () => {
    const withPmi = calculateMortgageCost({
      ...inputs,
      downPayment: 45000, // 10% down → 90% LTV
      pmi: 0,
      creditScore: 740,
    });
    const loan = 405000;
    const refRate = conventionalPmiRatePercent(ltvPercent(loan, 450000), 740);
    const refPMI = monthlyPmiAmount(loan, refRate);
    expect(refRate).toBe(0.35);
    expect(num(withPmi.details.monthlyPMI)).toBeCloseTo(refPMI, 1);
    expect(num(withPmi.details.pmiEstimated)).toBe(1);
    expect(num(withPmi.details.totalMonthlyPayment)).toBeCloseTo(
      monthlyPayment(loan, 6.75, 360) + 5400 / 12 + 1800 / 12 + 100 + refPMI,
      1
    );
  });

  it('honors a manual annual PMI override and zeros PMI at 20% down', () => {
    const override = calculateMortgageCost({
      ...inputs,
      downPayment: 45000,
      pmi: 2400,
      creditScore: 740,
    });
    expect(num(override.details.monthlyPMI)).toBeCloseTo(200, 1);
    expect(num(override.details.pmiEstimated)).toBe(0);

    const twentyPercent = calculateMortgageCost({
      ...inputs,
      downPayment: 90000,
      pmi: 2400,
    });
    expect(num(twentyPercent.details.monthlyPMI)).toBe(0);
  });
});

describe('payoff biweekly', () => {
  const inputs = { loanAmount: 300000, interestRate: 6.5, loanTerm: 30, biweeklyFee: 300 };
  const result = calculatePayoff(inputs);
  const refPayment = monthlyPayment(300000, 6.5, 360);
  const refBiweekly = simulateBiweeklyPayoff(300000, 6.5, refPayment / 2, 720);

  it('headline monthly and biweekly payments match the reference', () => {
    expect(num(result.details.monthlyPayment)).toBeCloseTo(refPayment, 0);
    expect(num(result.details.biweeklyPayment)).toBeCloseTo(refPayment / 2, 0);
  });

  it('headline interest saved matches the reference simulation', () => {
    const refMonthlyInterest = refPayment * 360 - 300000;
    const refSaved = refMonthlyInterest - refBiweekly.totalInterest;
    expect(num(result.details.biweeklyInterestSaved)).toBeCloseTo(refSaved, -1);
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
    yearsToHold: 7,
  };
  const result = calculateLoanTimeline({
    ...inputs,
    expectedYearsInHome: inputs.yearsToHold,
    armInitialRate: 5.875,
    armFixedPeriod: 5,
    armMargin: 2.75,
    armAdjustmentCap: 2,
    armLifetimeCap: 5,
    expectedIndexRate: 4,
    fifteenYearRate: 6.5,
  });
  const parPayment = monthlyPayment(400000, 7, 360);
  const pointsPayment = monthlyPayment(400000, 6.5, 360);
  const creditPayment = monthlyPayment(400000, 7.375, 360);
  const holdMonths = 84;
  const parEnding = remainingBalance(400000, 7, 360, holdMonths);
  const pointsEnding = remainingBalance(400000, 6.5, 360, holdMonths);
  const creditEnding = remainingBalance(400000, 7.375, 360, holdMonths);

  it('headline par payment matches the reference', () => {
    expect(num(result.details.parPayment)).toBeCloseTo(parPayment, 0);
  });

  it('ending balances match the reference schedule', () => {
    expect(num(result.details.parEndingBalance)).toBeCloseTo(parEnding, 0);
    expect(num(result.details.pointsEndingBalance)).toBeCloseTo(pointsEnding, 0);
  });

  it('net cost includes remaining balance so points beat credits when balances diverge', () => {
    const parCost = Math.round(parPayment * holdMonths + parEnding - 400000);
    const pointsCost = Math.round(8000 + pointsPayment * holdMonths + pointsEnding - 400000);
    const creditCost = Math.round(-4000 + creditPayment * holdMonths + creditEnding - 400000);

    const parRow = result.chartData!.find((r) => r.option === 'Par Rate')!;
    const pointsRow = result.chartData!.find((r) => r.option === 'Buy Points')!;
    const creditRow = result.chartData!.find((r) => r.option === 'Lender Credit')!;

    expect(num(parRow.totalCost)).toBeCloseTo(parCost, -1);
    expect(num(pointsRow.totalCost)).toBeCloseTo(pointsCost, -1);
    expect(num(creditRow.totalCost)).toBeCloseTo(creditCost, -1);
    expect(num(pointsRow.totalCost)).toBeLessThan(num(parRow.totalCost));
    expect(num(parRow.totalCost)).toBeLessThan(num(creditRow.totalCost));
  });

  it('points break-even counts payment savings plus faster principal paydown', () => {
    const monthlySavings = Math.round(parPayment) - Math.round(pointsPayment);
    let inclusiveBreakEven = 0;
    for (let month = 1; month <= 360; month++) {
      const savings =
        monthlySavings * month +
        (remainingBalance(400000, 7, 360, month) - remainingBalance(400000, 6.5, 360, month));
      if (savings >= 8000) {
        inclusiveBreakEven = month;
        break;
      }
    }
    const insight = result.insights.find((i) => i.includes('breaking even'))!;
    expect(insight).toContain(`${inclusiveBreakEven} months`);
    expect(inclusiveBreakEven).toBeLessThan(breakEvenMonths(8000, monthlySavings));
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

  it('does not report a fabricated effectiveRate', () => {
    expect(result.details.effectiveRate).toBeUndefined();
  });

  it('reports a blended keep + HELOC note rate vs the refi rate', () => {
    const expected = (280000 * 5.5 + 60000 * 9) / (280000 + 60000);
    expect(num(result.details.blendedKeepRate)).toBeCloseTo(expected, 2);
  });
});

describe('cash-out-refi Dett.io review scenario (ENG-326)', () => {
  const result = calculateCashOutRefi({
    currentBalance: 280000,
    currentRate: 4.5,
    yearsRemaining: 25,
    homeValue: 500000,
    cashOutAmount: 50000,
    newRate: 6.75,
    newTerm: 30,
    closingCosts: 8000,
    alternativeRate: 10,
  });

  it('matches the reviewed payments and extra interest (dollar cost, not a rate)', () => {
    expect(num(result.details.currentPayment)).toBe(1556);
    expect(num(result.details.newPayment)).toBe(2192);
    expect(num(result.details.totalInterestIncrease)).toBe(264315);
    expect(result.details.effectiveRate).toBeUndefined();
  });

  it('reports a true IRR on incremental cash flows, labeled as educational', () => {
    expect(num(result.details.impliedCashCostIrr)).toBeCloseTo(15.54, 1);
    expect(result.insights.join(' ')).toMatch(/educational estimate, not an APR/i);
  });

  it('compares the keep + HELOC blended note rate against the full-refi rate', () => {
    expect(num(result.details.blendedKeepRate)).toBeCloseTo(5.33, 2);
    expect(result.insights.join(' ')).toMatch(/5\.33%/);
    expect(result.insights.join(' ')).toMatch(/6\.75%/);
  });

  it('suppresses IRR when incremental flows change sign (shorter new term)', () => {
    const shorter = calculateCashOutRefi({
      currentBalance: 280000,
      currentRate: 4.5,
      yearsRemaining: 25,
      homeValue: 500000,
      cashOutAmount: 50000,
      newRate: 6.75,
      newTerm: 15,
      closingCosts: 8000,
      alternativeRate: 10,
    });
    expect(num(shorter.details.impliedCashCostIrr)).toBe(0);
    expect(shorter.insights.join(' ')).toMatch(/isn't meaningful/i);
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
    savingsRate: 4,
  };
  const result = calculateRecastVsRefi(inputs);

  it('headline payments match the reference', () => {
    expect(num(result.details.currentPayment)).toBeCloseTo(monthlyPayment(300000, 6.5, 300), 0);
    expect(num(result.details.recastPayment)).toBeCloseTo(monthlyPayment(250000, 6.5, 300), 0);
    expect(num(result.details.refiPayment)).toBeCloseTo(monthlyPayment(250000, 5.75, 360), 0);
  });

  it('compares every option over the current loan remaining term', () => {
    expect(num(result.details.horizonYears)).toBe(25);
    expect(result.chartData).toHaveLength(3);
    for (const row of result.chartData ?? []) {
      expect(row).toHaveProperty('remainingBalance');
      expect(row).toHaveProperty('netCost');
      expect(row).toHaveProperty('cashFlowValue');
    }
  });

  it('remaining balances at the horizon match the reference schedule', () => {
    const currentPayment = monthlyPayment(300000, 6.5, 300);
    expect(num(result.details.recastRemainingBalance)).toBeCloseTo(
      remainingBalance(250000, 6.5, 300, 300),
      0
    );
    expect(num(result.details.refiRemainingBalance)).toBeCloseTo(
      remainingBalance(250000, 5.75, 360, 300),
      0
    );
    expect(num(result.details.prepayRemainingBalance)).toBeCloseTo(
      remainingBalanceWithPayment(250000, 6.5, currentPayment, 300),
      0
    );
  });

  it('recommendation matches the lowest net-cost option', () => {
    const recast = num(result.details.recastNetCost);
    const refi = num(result.details.refiNetCost);
    const prepay = num(result.details.prepayNetCost);
    const lowest = Math.min(recast, refi, prepay);
    const winner =
      recast === lowest ? 'Recast' : refi === lowest ? 'Refinance' : 'Prepay Only';
    expect(result.details.bestOption).toBe(winner);
    expect(result.summary).toContain(winner);
    expect(result.insights.some((tip) => tip.includes(winner) && tip.includes('💡'))).toBe(true);
  });

  it('gives recast and refinance the same net cost when rate, term, and fees match', () => {
    const tied = calculateRecastVsRefi({
      ...inputs,
      newRate: 6.5,
      newTerm: 25,
      closingCosts: 350,
    });
    expect(num(tied.details.recastNetCost)).toBe(num(tied.details.refiNetCost));
    expect(num(tied.details.recastPayment)).toBe(num(tied.details.refiPayment));
  });

  it('ties recast and prepay when the savings rate equals the loan rate', () => {
    const tied = calculateRecastVsRefi({
      ...inputs,
      recastFee: 0,
      savingsRate: 6.5,
    });
    expect(num(tied.details.recastNetCost)).toBeCloseTo(num(tied.details.prepayNetCost), 0);
  });

  it('credits invested cash flow: 4% prefers prepay, 8% flips to refinance', () => {
    const pageDefaults = {
      currentBalance: 320000,
      currentRate: 6.5,
      yearsRemaining: 27,
      lumpSumAmount: 50000,
      recastFee: 250,
      newRate: 6.0,
      newTerm: 30,
      closingCosts: 6000,
      savingsRate: 4,
    };
    const atFour = calculateRecastVsRefi(pageDefaults);
    const atEight = calculateRecastVsRefi({ ...pageDefaults, savingsRate: 8 });
    expect(atFour.details.bestOption).toBe('Prepay Only');
    expect(num(atFour.details.refiRemainingBalance)).toBeGreaterThan(0);
    expect(atEight.details.bestOption).toBe('Refinance');
    expect(atFour.summary).toContain('Prepay Only');
    expect(atEight.summary).toContain('Refinance');
  });
});

describe('loan-timeline ARM (ENG-330)', () => {
  const inputs = {
    loanAmount: 400000,
    loanTerm: 30,
    expectedYearsInHome: 30,
    parRate: 6.75,
    pointsRate: 6.25,
    pointsCost: 0,
    armInitialRate: 5.875,
    armFixedPeriod: 5,
    armAdjustmentFrequency: 6,
    armInitialCap: 2,
    armAdjustmentCap: 1,
    armLifetimeCap: 5,
    armMargin: 2.75,
    expectedIndexRate: 4,
  };
  const result = calculateLoanTimeline(inputs);

  it('headline fixed and ARM payments match the reference', () => {
    expect(num(result.details.fixedPayment)).toBeCloseTo(monthlyPayment(400000, 6.75, 360), 0);
    expect(num(result.details.armInitialPayment)).toBeCloseTo(monthlyPayment(400000, 5.875, 360), 0);
  });

  it('worst-case rate is initial + lifetime cap, payment follows the amortized path', () => {
    const lifetimeMax = 5.875 + 5;
    const dayOneMaxPayment = monthlyPayment(400000, lifetimeMax, 360);
    expect(num(result.details.worstCaseRate)).toBeCloseTo(lifetimeMax, 3);
    // Peak payment is lower than charging the max rate from day one because
    // the loan amortizes at the initial rate through the fixed period.
    expect(num(result.details.worstCasePayment)).toBeLessThan(dayOneMaxPayment);
    expect(num(result.details.worstCasePayment)).toBeGreaterThan(num(result.details.armInitialPayment));
  });
});

describe('loan-timeline (ENG-324)', () => {
  const inputs = {
    loanAmount: 400000,
    loanTerm: 30,
    parRate: 6.75,
    expectedYearsInHome: 6,
    armInitialRate: 5.875,
    armFixedPeriod: 7,
    armMargin: 2.75,
    expectedIndexRate: 5,
    armAdjustmentCap: 2,
    armLifetimeCap: 5,
    pointsCost: 8000,
    pointsRate: 6.25,
  };
  const result = calculateLoanTimeline(inputs);

  it('headline payments match the reference', () => {
    expect(num(result.details.fixedPayment)).toBeCloseTo(monthlyPayment(400000, 6.75, 360), 0);
    expect(num(result.details.armPayment)).toBeCloseTo(monthlyPayment(400000, 5.875, 360), 0);
  });

  it('remaining balances match the reference schedule', () => {
    const fixedRow = result.chartData!.find((r) => r.option === '30-Year Fixed (Par)')!;
    expect(num(fixedRow.remainingBalance)).toBeCloseTo(remainingBalance(400000, 6.75, 360, 72), 0);
  });

  it('ranks options by net cost (payments + closing − equity), not payments only', () => {
    const primary = ['30-Year Fixed (Par)', '30-Year Fixed (Points)', `${inputs.armFixedPeriod}-Year ARM`, '15-Year Fixed'];
    for (const name of primary) {
      const row = result.chartData!.find((r) => r.option === name)!;
      const totalPaid = num(row.totalPaid);
      const balance = num(row.remainingBalance);
      const closing = name === '30-Year Fixed (Points)' ? 8000 : 0;
      const equity = 400000 - balance;
      expect(num(row.netCost)).toBeCloseTo(totalPaid + closing - equity, 0);
    }
    expect(result.details.bestOption).toBeTruthy();
    expect(num(result.details.bestNetCost)).toBe(
      Math.min(...result.scenarios.map((row) => row.netCost))
    );
  });
});

describe('payoff extra-payment (ENG-323)', () => {
  const inputs = {
    loanAmount: 300000,
    interestRate: 6.5,
    loanTerm: 30,
    extraMonthlyPayment: 200,
    extraAnnualPayment: 0,
    investmentReturn: 7,
  };
  const result = calculatePayoff(inputs);

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
    const equal = calculatePayoff({ ...inputs, investmentReturn: 6.5 });
    expect(num(equal.details.netWorthDifference)).toBeCloseTo(0, 0);
  });

  it('does not produce NaN with zero extra payments', () => {
    const zero = calculatePayoff({ ...inputs, extraMonthlyPayment: 0 });
    expect(Number.isFinite(num(zero.details.interestSaved))).toBe(true);
    expect(Number.isFinite(num(zero.details.netWorthDifference))).toBe(true);
    expect(zero.insights.join(' ')).not.toMatch(/NaN/);
  });
});

describe('payoff acceleration (ENG-323)', () => {
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
  const result = calculatePayoff(inputs);

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
    const equal = calculatePayoff({
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
      // using the shared LTV × credit score grid (typical-borrower 740 fallback).
      const pmi = monthlyPmiAmount(loan, conventionalPmiRatePercent(ltvPercent(loan, price), 740));
      const expected =
        monthlyPayment(loan, 6.5, 360) + pmi + (price * 1.2) / 100 / 12 + 1500 / 12;
      expect(payment).toBeCloseTo(expected, -1);
      expect(num(result.details[`${tier}PMI`])).toBeCloseTo(pmi, 0);
    }
  });

  it('lower credit raises PMI and lowers the max affordable price', () => {
    const weakerCredit = calculateAffordability({ ...inputs, creditScore: 680 });
    expect(num(weakerCredit.details.moderatePMI)).toBeGreaterThan(num(result.details.moderatePMI));
    expect(num(weakerCredit.details.moderatePrice)).toBeLessThan(num(result.details.moderatePrice));
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
    creditScore: 740,
  };
  const result = calculateDownPayment(inputs);

  it("selected option's headline numbers match the reference", () => {
    expect(num(result.details.downPaymentAmount)).toBe(40000);
    expect(num(result.details.loanAmount)).toBe(360000);
    expect(num(result.details.monthlyPayment)).toBeCloseTo(monthlyPayment(360000, 6.5, 360), 0);
  });

  it('3% option matches the reference P&I, LTV-banded PMI, and removal month', () => {
    const loan3 = 400000 * 0.97;
    const refRate = conventionalPmiRatePercent(ltvPercent(loan3, 400000), 740);
    const refPI = monthlyPayment(loan3, 6.5, 360);
    const refPMI = monthlyPmiAmount(loan3, refRate);
    const refMonths = monthsToReachLtv(loan3, 400000, 6.5, 360, 78);
    const expectedTotal = refPI + refPMI + (400000 * 1.2) / 100 / 12 + 1500 / 12;
    expect(num(result.details.option3PmiRate)).toBe(refRate);
    expect(num(result.details.option3PmiMonths)).toBe(refMonths);
    expect(num(result.details.option3Payment)).toBeCloseTo(expectedTotal, 0);
    expect(num(result.details.option3PMI)).toBeCloseTo(refPMI * refMonths, -1);
  });

  it('PMI rate is cheaper at 15% down than at 3% down', () => {
    const rate3 = conventionalPmiRatePercent(97, 740);
    const rate15 = conventionalPmiRatePercent(85, 740);
    expect(rate3).toBeGreaterThan(rate15);
    expect(num(result.details.option3PmiRate)).toBe(rate3);
    expect(num(result.details.option15PmiRate)).toBe(rate15);
  });

  it('20% cash-to-close matches the Closing Costs calculator', () => {
    const closing = calculateClosingCosts({
      homePrice: 400000,
      downPaymentPercent: 20,
      interestRate: 6.5,
      loanTerm: 30,
      state: 'CA',
      isNewConstruction: false,
      propertyTaxRate: 1.2,
      prepaidInsurance: 1500,
    });
    const expected = 80000 + (closing.details.totalClosingCosts as number);
    expect(num(result.details.option20CashToClose)).toBe(Math.round(expected));
    expect(num(result.details.option20ClosingCosts)).toBe(Math.round(closing.details.totalClosingCosts as number));
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
    pmiRate: 0.5,
    closingCosts: 8000,
    sellingCosts: 6,
    investmentReturn: 7,
    yearsToAnalyze: 10,
  };
  const result = calculateRentVsBuy(inputs);
  const refPI = monthlyPayment(320000, 6.5, 360);

  it('headline monthly P&I matches the reference', () => {
    expect(num(result.details.monthlyPI)).toBeCloseTo(refPI, 0);
  });

  it('zero-rate P&I is principal divided by term months', () => {
    const zeroRate = calculateRentVsBuy({ ...inputs, interestRate: 0 });
    expect(num(zeroRate.details.monthlyPI)).toBeCloseTo(320000 / 360, 0);
  });

  it('year-1 buy-side monthly total is P&I + tax + insurance + maintenance (no PMI at 20% down)', () => {
    const expected = refPI + (400000 * 1.2) / 100 / 12 + 1500 / 12 + (400000 * 1) / 100 / 12;
    expect(num(result.details.monthlyPMI)).toBe(0);
    expect(num(result.details.monthlyBuyTotal)).toBeCloseTo(expected, 0);
  });

  it('horizon comparison nets selling costs and seeds rent with cash to close', () => {
    expect(num(result.details.cashToClose)).toBe(88000);
    const homeValueAtHorizon = 400000 * Math.pow(1.035, 10);
    expect(num(result.details.sellingCostAtHorizon)).toBeCloseTo(homeValueAtHorizon * 0.06, -1);
  });
});

describe('rent-vs-buy with PMI', () => {
  const result = calculateRentVsBuy({
    homePrice: 400000,
    downPayment: 40000,
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
  });
  const loan = 360000;
  const refPI = monthlyPayment(loan, 6.5, 360);
  const refPMI = monthlyPmiAmount(loan, 0.5);

  it('includes PMI in the year-1 monthly buy total until 78% LTV', () => {
    expect(num(result.details.monthlyPMI)).toBeCloseTo(refPMI, 0);
    const expected =
      refPI + (400000 * 1.2) / 100 / 12 + 1500 / 12 + (400000 * 1) / 100 / 12 + refPMI;
    expect(num(result.details.monthlyBuyTotal)).toBeCloseTo(expected, 0);
    expect(num(result.details.pmiEndMonth)).toBe(monthsToReachLtv(loan, 400000, 6.5, 360, 78));
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

  it('reports 0 PMI at 20% down instead of the ≤85 LTV band rate', () => {
    const twenty = calculatePMI({ ...inputs, downPaymentPercent: 20 });
    expect(num(twenty.details.pmiRate)).toBe(0);
    expect(num(twenty.details.monthlyPMI)).toBe(0);
    expect(num(twenty.details.noPMI)).toBe(1);
  });
});

describe('va', () => {
  const inputs = {
    homePrice: 400000,
    downPaymentPercent: 0,
    interestRate: 6.25,
    loanTerm: 30,
    loanPurpose: 'purchase' as const,
    serviceType: 'regular' as const,
    firstTimeUse: true,
    disabilityExempt: false,
    region: 'south' as const,
    familySize: 3,
    propertyTax: 4800,
    homeInsurance: 1600,
    monthlyGrossIncome: 9000,
    monthlyDebts: 400,
  };
  const result = calculateVA(inputs);
  const refFeeRate = vaFundingFeeRatePercent(0, true, 'regular', false, 'purchase');
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

  it('conventional comparison PMI uses the shared grid, not a flat 0.5%', () => {
    const convLoan = 400000 * 0.95; // 5% down
    const refRate = conventionalPmiRatePercent(ltvPercent(convLoan, 400000));
    const refPMI = monthlyPmiAmount(convLoan, refRate);
    expect(refRate).not.toBe(0.5);
    expect(num(result.details.convMonthlyPMI)).toBeCloseTo(refPMI, 0);
  });
});
