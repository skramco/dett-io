/**
 * "Show Me the Math" regression tests.
 *
 * The ShowMeTheMath panel feeds each calculator's `result.details` straight
 * into the formula generator registered for that calculator's slug. When a
 * generator reads a detail key the calculator does not produce, the panel
 * silently renders "$0", "0.0%" or "N/A" chips. These tests run every
 * calculator with a realistic scenario (where every headline value is
 * meaningfully non-zero) and fail on any degenerate computed value.
 */
import { describe, it, expect } from 'vitest';
import { calculatorFormulas } from '../formulas';
import type { CalculatorResult } from '../types';
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

/**
 * Calculator results keyed by the `calculatorSlug` each page passes to
 * <ShowMeTheMath /> (see app/calculators/<slug>/page.tsx).
 */
const resultsBySlug: Record<string, CalculatorResult> = {
  affordability: calculateAffordability(fx.affordabilityInputs),
  'mortgage-cost': calculateMortgageCost(fx.mortgageCostInputs),
  'down-payment': calculateDownPayment(fx.downPaymentInputs),
  'rent-vs-buy': calculateRentVsBuy(fx.rentVsBuyInputs),
  refinance: calculateRefinance(fx.refinanceInputs),
  'cash-out-refi': calculateCashOutRefi(fx.cashOutRefiInputs),
  'recast-vs-refi': calculateRecastVsRefi(fx.recastVsRefiInputs),
  'points-buydown': calculatePointsBuydown(fx.pointsBuydownInputs),
  'arm-vs-fixed': calculateArmVsFixed(fx.armVsFixedInputs),
  'timeline-simulator': calculateTimelineSimulator(fx.timelineSimulatorInputs),
  'extra-payment': calculateExtraPayment(fx.extraPaymentInputs),
  acceleration: calculateAcceleration(fx.accelerationInputs),
  biweekly: calculateBiweekly(fx.biweeklyInputs),
  'interest-sensitivity': calculateInterestSensitivity(fx.interestSensitivityInputs),
  amortization: calculateAmortization(fx.amortizationInputs),
  dti: calculateDTI(fx.dtiInputs),
  'closing-costs': calculateClosingCosts(fx.closingCostsInputs),
  pmi: calculatePMI(fx.pmiInputs),
  fha: calculateFHA(fx.fhaInputs),
  va: calculateVA(fx.vaInputs),
};

/**
 * Values that indicate a formula generator read a missing or empty detail
 * key. With the realistic fixtures above, none of these should ever appear.
 */
const DEGENERATE_VALUE = /^(\$0|0(\.0+)?%|N\/A|Never|\$?NaN%?|undefined|null|\$undefined|0 months|Month 0|Year 0)$/;

describe('every calculator slug with a formula generator has a calculator result to test', () => {
  it('covers all registered formula generators', () => {
    expect(Object.keys(resultsBySlug).sort()).toEqual(
      expect.arrayContaining(Object.keys(calculatorFormulas).sort())
    );
  });
});

describe.each(Object.keys(calculatorFormulas))('"Show Me the Math" values for %s', (slug) => {
  const result = resultsBySlug[slug];

  it('has a calculator result fixture', () => {
    expect(result).toBeDefined();
  });

  const formulaSets = calculatorFormulas[slug](result.details);

  it('produces at least one formula set', () => {
    expect(formulaSets.length).toBeGreaterThan(0);
    expect(formulaSets.every((set) => set.steps.length > 0)).toBe(true);
  });

  const computedSteps = formulaSets.flatMap((set) =>
    set.steps
      .filter((step) => step.computedValue !== undefined)
      .map((step) => ({ set: set.title, label: step.label, value: step.computedValue as string }))
  );

  it.each(computedSteps)('“$label” shows a real value (got “$value”)', ({ value }) => {
    expect(value).not.toMatch(DEGENERATE_VALUE);
    expect(value).not.toContain('NaN');
    expect(value).not.toContain('undefined');
    expect(value).not.toContain('Infinity');
  });
});
