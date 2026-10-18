/**
 * Headline regression tests.
 *
 * Every calculator's headline numbers are recomputed here from the shared
 * reference functions in `mortgageMath.ts` (which match the verified-correct
 * amortization, mortgage-cost P&I, biweekly, FHA, interest-sensitivity and
 * points break-even behavior). If a calculator's internal math ever diverges
 * from the reference — e.g. a copy-pasted formula drifting — these tests fail.
 */
import { describe, it, expect } from 'vitest';
import {
  monthlyPayment,
  totalLoanInterest,
  amortize,
  ltvPercent,
  monthlyMortgageInsurance,
  monthsUntilLtv,
  frontEndDti,
  backEndDti,
  breakEvenMonths,
} from '../mortgageMath';
import { calculateMortgageCost } from '../mortgageCost';
import { calculateAmortization } from '../amortization';
import { calculateRefinance } from '../refinance';
import { calculateExtraPayment } from '../extraPayment';
import { calculateAffordability } from '../affordability';
import { calculateDownPayment } from '../downPayment';
import { calculateRentVsBuy } from '../rentVsBuy';
import { calculatePointsBuydown } from '../pointsBuydown';
import { calculateArmVsFixed } from '../armVsFixed';
import { calculateCashOutRefi } from '../cashOutRefi';
import { calculateRecastVsRefi } from '../recastVsRefi';
import { calculateAcceleration } from '../acceleration';
import { calculateBiweekly } from '../biweekly';
import { calculateInterestSensitivity } from '../interestSensitivity';
import { calculateTimelineSimulator } from '../timelineSimulator';
import { calculateDTI } from '../dti';
import { calculateClosingCosts } from '../closingCosts';
import { calculatePMI } from '../pmi';
import { calculateFHA } from '../fha';
import { calculateVA } from '../va';
import * as fx from './fixtures';

const num = (v: number | string): number => {
  expect(typeof v, `expected a number but got "${v}"`).toBe('number');
  return v as number;
};

describe('mortgage-cost headline numbers match the reference', () => {
  const { details } = calculateMortgageCost(fx.mortgageCostInputs);
  const loan = fx.mortgageCostInputs.homePrice - fx.mortgageCostInputs.downPayment;
  const term = fx.mortgageCostInputs.loanTerm * 12;

  it('monthly P&I', () => {
    expect(num(details.principalAndInterest)).toBeCloseTo(
      monthlyPayment(loan, fx.mortgageCostInputs.interestRate, term),
      2
    );
  });

  it('total interest', () => {
    expect(num(details.totalInterest)).toBeCloseTo(
      totalLoanInterest(loan, fx.mortgageCostInputs.interestRate, term),
      1
    );
  });

  it('PITI composition', () => {
    const expected =
      num(details.principalAndInterest) +
      fx.mortgageCostInputs.propertyTax / 12 +
      fx.mortgageCostInputs.homeInsurance / 12 +
      fx.mortgageCostInputs.hoaFees +
      (fx.mortgageCostInputs.pmi ?? 0) / 12;
    expect(num(details.totalMonthlyPayment)).toBeCloseTo(expected, 1);
  });
});

describe('amortization headline numbers match the reference', () => {
  const result = calculateAmortization(fx.amortizationInputs);
  const { loanAmount, interestRate, loanTerm } = fx.amortizationInputs;
  const term = loanTerm * 12;

  it('monthly payment', () => {
    expect(num(result.details.monthlyPayment)).toBeCloseTo(
      monthlyPayment(loanAmount, interestRate, term),
      2
    );
  });

  it('total interest matches the reference amortization engine', () => {
    const ref = amortize({ principal: loanAmount, annualRatePercent: interestRate, termMonths: term });
    expect(num(result.details.totalInterest)).toBeCloseTo(ref.totalInterest, -1);
  });

  it('schedule fully pays off the loan', () => {
    const { schedule } = result.amortizationSchedule;
    expect(schedule.length).toBe(term);
    expect(schedule[schedule.length - 1].balance).toBeCloseTo(0, 1);
  });

  it('with extra payments, interest saved matches the reference engine', () => {
    const extra = calculateAmortization({ ...fx.amortizationInputs, extraMonthlyPayment: 300 });
    const refBase = amortize({ principal: loanAmount, annualRatePercent: interestRate, termMonths: term });
    const refExtra = amortize({
      principal: loanAmount,
      annualRatePercent: interestRate,
      termMonths: term,
      extraMonthly: 300,
    });
    expect(num(extra.details.numberOfPayments)).toBe(refExtra.months);
    expect(num(extra.details.interestSaved)).toBeCloseTo(refBase.totalInterest - refExtra.totalInterest, -1);
  });
});

describe('refinance headline numbers match the reference', () => {
  const { details } = calculateRefinance(fx.refinanceInputs);
  const { currentBalance, closingCosts, newRate, newTerm, currentMonthlyPayment } = fx.refinanceInputs;
  const refNewPayment = monthlyPayment(currentBalance + closingCosts, newRate, newTerm * 12);

  it('new monthly payment', () => {
    expect(num(details.newMonthlyPayment)).toBeCloseTo(refNewPayment, 2);
  });

  it('monthly savings and break-even', () => {
    const savings = currentMonthlyPayment - refNewPayment;
    expect(num(details.monthlySavings)).toBeCloseTo(savings, 2);
    expect(num(details.breakEvenMonths)).toBe(Math.ceil(breakEvenMonths(closingCosts, savings)));
  });
});

describe('extra-payment headline numbers match the reference', () => {
  const { details } = calculateExtraPayment(fx.extraPaymentInputs);
  const { loanAmount, interestRate, loanTerm } = fx.extraPaymentInputs;
  const term = loanTerm * 12;
  const payment = monthlyPayment(loanAmount, interestRate, term);

  it('regular monthly payment', () => {
    expect(num(details.regularMonthlyPayment)).toBeCloseTo(payment, 2);
  });

  it('interest saved matches the reference engine (within one payment of rounding)', () => {
    const refBase = amortize({ principal: loanAmount, annualRatePercent: interestRate, termMonths: term });
    const refExtra = amortize({
      principal: loanAmount,
      annualRatePercent: interestRate,
      termMonths: term,
      extraMonthly: fx.extraPaymentInputs.extraMonthlyPayment,
      extraAnnual: fx.extraPaymentInputs.extraAnnualPayment,
    });
    const refSaved = refBase.totalInterest - refExtra.totalInterest;
    expect(Math.abs(num(details.interestSaved) - refSaved)).toBeLessThan(payment);
    expect(num(details.monthsWithExtra)).toBe(refExtra.months);
  });
});

describe('affordability headline numbers match the reference', () => {
  const { details } = calculateAffordability(fx.affordabilityInputs);
  const { annualIncome, downPayment, interestRate, loanTerm, propertyTaxRate, homeInsuranceAnnual, hoaFees } =
    fx.affordabilityInputs;
  const monthlyIncome = annualIncome / 12;
  const term = loanTerm * 12;

  const pitiFor = (price: number) =>
    monthlyPayment(price - downPayment, interestRate, term) +
    (price * propertyTaxRate) / 100 / 12 +
    homeInsuranceAnnual / 12 +
    hoaFees;

  it.each([
    ['conservative', 0.28],
    ['moderate', 0.36],
    ['aggressive', 0.43],
  ])('%s price respects its DTI cap and its payment matches the reference', (level, cap) => {
    const price = num(details[`${level}Price`]);
    const payment = num(details[`${level}Payment`]);
    expect(price).toBeGreaterThan(downPayment);
    // The reported payment must be recomputable from the reference formula
    expect(payment).toBeCloseTo(pitiFor(price), -1);
    // And must not exceed the DTI cap (allow $2 slack for the $100 search granularity + rounding)
    expect(payment).toBeLessThanOrEqual(monthlyIncome * cap + 2);
  });
});

describe('down-payment headline numbers match the reference', () => {
  const { details } = calculateDownPayment(fx.downPaymentInputs);
  const { homePrice, downPaymentPercent, interestRate, loanTerm, propertyTaxRate, homeInsuranceAnnual, pmiRate } =
    fx.downPaymentInputs;
  const term = loanTerm * 12;

  it('20%-down option payment', () => {
    const loan = homePrice * 0.8;
    const expected =
      monthlyPayment(loan, interestRate, term) +
      (homePrice * propertyTaxRate) / 100 / 12 +
      homeInsuranceAnnual / 12;
    expect(num(details.option20Payment)).toBeCloseTo(expected, -1);
  });

  it('3%-down option payment includes PMI', () => {
    const loan = homePrice * 0.97;
    const expected =
      monthlyPayment(loan, interestRate, term) +
      monthlyMortgageInsurance(loan, pmiRate) +
      (homePrice * propertyTaxRate) / 100 / 12 +
      homeInsuranceAnnual / 12;
    expect(num(details.option3Payment)).toBeCloseTo(expected, -1);
  });

  it('selected scenario P&I (used by Show Me the Math)', () => {
    const loan = homePrice * (1 - downPaymentPercent / 100);
    expect(num(details.monthlyPayment)).toBeCloseTo(monthlyPayment(loan, interestRate, term), -1);
    expect(num(details.loanAmount)).toBeCloseTo(loan, -1);
  });
});

describe('rent-vs-buy headline numbers match the reference', () => {
  const { details } = calculateRentVsBuy(fx.rentVsBuyInputs);
  const { homePrice, downPayment, interestRate, loanTerm } = fx.rentVsBuyInputs;

  it('monthly P&I', () => {
    expect(num(details.monthlyPI)).toBeCloseTo(
      monthlyPayment(homePrice - downPayment, interestRate, loanTerm * 12),
      -1
    );
  });
});

describe('points-buydown headline numbers match the reference', () => {
  const { details } = calculatePointsBuydown(fx.pointsBuydownInputs);
  const { loanAmount, parRate, pointsRate, pointsCost, loanTerm, yearsToHold } = fx.pointsBuydownInputs;
  const term = loanTerm * 12;
  const parPayment = monthlyPayment(loanAmount, parRate, term);
  const pointsPayment = monthlyPayment(loanAmount, pointsRate, term);

  it('par payment', () => {
    expect(num(details.parPayment)).toBeCloseTo(parPayment, -1);
  });

  it('points break-even is recoverable from the reference formulas', () => {
    const be = breakEvenMonths(pointsCost, parPayment - pointsPayment);
    expect(be).toBeGreaterThan(0);
    expect(be).toBeLessThan(term);
    // For a 7-year hold with break-even ~5 years, buying points must win
    if (be < yearsToHold * 12) {
      const parCost = parPayment * yearsToHold * 12;
      const pointsTotalCost = pointsPayment * yearsToHold * 12 + pointsCost;
      expect(pointsTotalCost).toBeLessThan(parCost);
    }
  });

  it('best option has the lowest reference total cost', () => {
    const hold = yearsToHold * 12;
    const costs: Record<string, number> = {
      'Par Rate': parPayment * hold,
      'Buy Points': pointsPayment * hold + pointsCost,
      'Lender Credit':
        monthlyPayment(loanAmount, fx.pointsBuydownInputs.lenderCreditRate, term) * hold -
        fx.pointsBuydownInputs.lenderCredit,
    };
    const best = Object.entries(costs).sort((a, b) => a[1] - b[1])[0];
    expect(details.bestOption).toBe(best[0]);
    expect(num(details.bestTotalCost)).toBeCloseTo(best[1], -1);
  });
});

describe('arm-vs-fixed headline numbers match the reference', () => {
  const { details } = calculateArmVsFixed(fx.armVsFixedInputs);
  const { loanAmount, fixedRate, armInitialRate, loanTerm } = fx.armVsFixedInputs;
  const term = loanTerm * 12;

  it('fixed payment', () => {
    expect(num(details.fixedPayment)).toBeCloseTo(monthlyPayment(loanAmount, fixedRate, term), -1);
  });

  it('ARM initial payment', () => {
    expect(num(details.armInitialPayment)).toBeCloseTo(monthlyPayment(loanAmount, armInitialRate, term), -1);
  });
});

describe('cash-out-refi headline numbers match the reference', () => {
  const { details } = calculateCashOutRefi(fx.cashOutRefiInputs);
  const { currentBalance, currentRate, yearsRemaining, cashOutAmount, newRate, newTerm, closingCosts, homeValue } =
    fx.cashOutRefiInputs;

  it('current and new payments', () => {
    expect(num(details.currentPayment)).toBeCloseTo(
      monthlyPayment(currentBalance, currentRate, yearsRemaining * 12),
      -1
    );
    const newLoan = currentBalance + cashOutAmount + closingCosts;
    expect(num(details.newLoanAmount)).toBe(newLoan);
    expect(num(details.newPayment)).toBeCloseTo(monthlyPayment(newLoan, newRate, newTerm * 12), -1);
  });

  it('new LTV', () => {
    const newLoan = currentBalance + cashOutAmount + closingCosts;
    expect(num(details.newLTV)).toBeCloseTo(ltvPercent(newLoan, homeValue), 0);
  });
});

describe('recast-vs-refi headline numbers match the reference', () => {
  const { details } = calculateRecastVsRefi(fx.recastVsRefiInputs);
  const { currentBalance, currentRate, yearsRemaining, lumpSumAmount, newRate, newTerm } = fx.recastVsRefiInputs;
  const remainingTerm = yearsRemaining * 12;

  it('current, recast and refi payments', () => {
    expect(num(details.currentPayment)).toBeCloseTo(
      monthlyPayment(currentBalance, currentRate, remainingTerm),
      -1
    );
    expect(num(details.recastPayment)).toBeCloseTo(
      monthlyPayment(currentBalance - lumpSumAmount, currentRate, remainingTerm),
      -1
    );
    expect(num(details.refiPayment)).toBeCloseTo(
      monthlyPayment(currentBalance - lumpSumAmount, newRate, newTerm * 12),
      -1
    );
  });
});

describe('acceleration headline numbers match the reference', () => {
  const { details } = calculateAcceleration(fx.accelerationInputs);
  const { loanAmount, interestRate, loanTerm, extraMonthly } = fx.accelerationInputs;
  const term = loanTerm * 12;
  const basePayment = monthlyPayment(loanAmount, interestRate, term);

  it('base payment and regular interest', () => {
    expect(num(details.basePayment)).toBeCloseTo(basePayment, -1);
    expect(num(details.regularInterest)).toBeCloseTo(totalLoanInterest(loanAmount, interestRate, term), -1);
  });

  it('prepay scenario tracks the reference engine', () => {
    const ref = amortize({
      principal: loanAmount,
      annualRatePercent: interestRate,
      termMonths: term,
      extraMonthly,
    });
    expect(num(details.prepayYears)).toBeCloseTo(ref.months / 12, 1);
    // The calculator does not cap the final payment, so allow one payment of slack
    expect(Math.abs(num(details.prepayInterest) - ref.totalInterest)).toBeLessThan(basePayment + extraMonthly);
  });
});

describe('biweekly headline numbers match the reference', () => {
  const { details } = calculateBiweekly(fx.biweeklyInputs);
  const { loanAmount, interestRate, loanTerm } = fx.biweeklyInputs;
  const term = loanTerm * 12;
  const payment = monthlyPayment(loanAmount, interestRate, term);

  it('monthly and biweekly payments', () => {
    expect(num(details.monthlyPayment)).toBeCloseTo(payment, -1);
    expect(num(details.biweeklyPayment)).toBeCloseTo(payment / 2, -1);
  });

  it('monthly-plan interest matches the reference', () => {
    expect(num(details.monthlyInterest)).toBeCloseTo(totalLoanInterest(loanAmount, interestRate, term), -1);
  });

  it('biweekly saves interest and pays off early', () => {
    expect(num(details.interestSaved)).toBeGreaterThan(0);
    expect(num(details.biweeklyYears)).toBeLessThan(loanTerm);
    // Identity: interestSaved = monthlyInterest − biweeklyInterest
    expect(num(details.interestSaved)).toBe(num(details.monthlyInterest) - num(details.biweeklyInterest));
  });
});

describe('interest-sensitivity headline numbers match the reference', () => {
  const { details } = calculateInterestSensitivity(fx.interestSensitivityInputs);
  const { loanAmount, baseRate, loanTerm } = fx.interestSensitivityInputs;
  const term = loanTerm * 12;

  it('base payment and interest', () => {
    expect(num(details.basePayment)).toBeCloseTo(monthlyPayment(loanAmount, baseRate, term), -1);
    expect(num(details.baseInterest)).toBeCloseTo(totalLoanInterest(loanAmount, baseRate, term), -1);
  });

  it('quarter-point impact', () => {
    const up = monthlyPayment(loanAmount, baseRate + 0.25, term);
    const down = monthlyPayment(loanAmount, baseRate - 0.25, term);
    expect(num(details.quarterPctImpact)).toBeCloseTo((up - down) / 2, -1);
  });
});

describe('timeline-simulator headline numbers match the reference', () => {
  const { details } = calculateTimelineSimulator(fx.timelineSimulatorInputs);
  const { loanAmount, interestRate, armInitialRate } = fx.timelineSimulatorInputs;

  it('fixed and ARM payments', () => {
    expect(num(details.fixedPayment)).toBeCloseTo(monthlyPayment(loanAmount, interestRate, 360), -1);
    expect(num(details.armPayment)).toBeCloseTo(monthlyPayment(loanAmount, armInitialRate, 360), -1);
  });
});

describe('dti headline numbers match the reference', () => {
  const { details } = calculateDTI(fx.dtiInputs);
  const i = fx.dtiInputs;
  const housing = i.mortgagePayment + i.propertyTax / 12 + i.homeInsurance / 12 + i.hoaFees;
  const otherDebts =
    i.carPayments + i.studentLoans + i.creditCardMinimums + i.personalLoans + i.childSupport + i.otherDebts;

  it('front-end and back-end DTI', () => {
    expect(num(details.frontEndDTI)).toBeCloseTo(frontEndDti(housing, i.monthlyGrossIncome), 1);
    expect(num(details.backEndDTI)).toBeCloseTo(backEndDti(housing, otherDebts, i.monthlyGrossIncome), 1);
  });
});

describe('closing-costs headline numbers are internally consistent', () => {
  const { details } = calculateClosingCosts(fx.closingCostsInputs);

  it('total equals the sum of the categories', () => {
    expect(num(details.totalClosingCosts)).toBe(
      num(details.lenderFees) + num(details.thirdPartyFees) + num(details.governmentFees) + num(details.prepaidItems)
    );
  });

  it('cash needed equals down payment plus net closing costs', () => {
    expect(num(details.totalCashNeeded)).toBeCloseTo(
      num(details.downPayment) + num(details.netClosingCosts),
      0
    );
  });
});

describe('pmi headline numbers match the reference', () => {
  const { details } = calculatePMI(fx.pmiInputs);
  const { homePrice, downPaymentPercent, interestRate, loanTerm } = fx.pmiInputs;
  const loan = homePrice * (1 - downPaymentPercent / 100);
  const term = loanTerm * 12;

  it('LTV and monthly P&I', () => {
    expect(num(details.ltv)).toBeCloseTo(ltvPercent(loan, homePrice), 1);
    expect(num(details.monthlyPI)).toBeCloseTo(monthlyPayment(loan, interestRate, term), -1);
  });

  it('monthly PMI derives from the annual PMI rate', () => {
    expect(num(details.monthlyPMI)).toBeCloseTo(
      monthlyMortgageInsurance(loan, num(details.pmiRate)),
      -1
    );
  });

  it('months until removal match the reference', () => {
    expect(num(details.monthsUntilRemoval)).toBe(monthsUntilLtv(loan, homePrice, interestRate, term, 78));
    expect(num(details.monthsUntilRemoval)).toBeGreaterThan(0);
  });
});

describe('fha headline numbers match the reference', () => {
  const { details } = calculateFHA(fx.fhaInputs);
  const { homePrice, downPaymentPercent, interestRate, loanTerm, propertyTax, homeInsurance } = fx.fhaInputs;
  const baseLoan = homePrice * (1 - downPaymentPercent / 100);
  const upfrontMIP = baseLoan * 0.0175;
  const totalLoan = baseLoan + upfrontMIP;
  const term = loanTerm * 12;

  it('upfront MIP is 1.75% of the base loan', () => {
    expect(num(details.upfrontMIP)).toBeCloseTo(upfrontMIP, -1);
    expect(num(details.totalLoanAmount)).toBeCloseTo(totalLoan, -1);
  });

  it('monthly P&I on the total loan', () => {
    expect(num(details.monthlyPI)).toBeCloseTo(monthlyPayment(totalLoan, interestRate, term), -1);
  });

  it('monthly MIP uses the 0.55% annual rate for >95% LTV 30-year loans', () => {
    expect(num(details.monthlyMIP)).toBeCloseTo(monthlyMortgageInsurance(baseLoan, 0.55), -1);
  });

  it('total monthly payment composition', () => {
    const expected =
      monthlyPayment(totalLoan, interestRate, term) +
      monthlyMortgageInsurance(baseLoan, 0.55) +
      propertyTax / 12 +
      homeInsurance / 12;
    expect(num(details.totalMonthlyPayment)).toBeCloseTo(expected, -1);
  });
});

describe('va headline numbers match the reference', () => {
  const { details } = calculateVA(fx.vaInputs);
  const { homePrice, interestRate, loanTerm, propertyTax, homeInsurance } = fx.vaInputs;
  const baseLoan = homePrice; // 0% down
  const fundingFee = Math.round(baseLoan * 0.0215); // first use, regular military, 0% down
  const totalLoan = baseLoan + fundingFee;
  const term = loanTerm * 12;

  it('funding fee for first-use regular military with 0% down is 2.15%', () => {
    expect(num(details.fundingFeeRate)).toBe(2.15);
    expect(num(details.fundingFee)).toBe(fundingFee);
  });

  it('monthly P&I on the total loan (fee financed)', () => {
    expect(num(details.monthlyPI)).toBeCloseTo(monthlyPayment(totalLoan, interestRate, term), -1);
  });

  it('total payment composition has no PMI', () => {
    const expected = monthlyPayment(totalLoan, interestRate, term) + propertyTax / 12 + homeInsurance / 12;
    expect(num(details.totalMonthlyPayment)).toBeCloseTo(expected, -1);
  });
});
