import { describe, expect, it } from 'vitest';
import {
  calculateVA,
  getRequiredResidualIncome,
  getResidualIncomeTable,
  VA_RESIDUAL_INCOME_80K_PLUS,
  VA_RESIDUAL_INCOME_UNDER_80K,
} from '../lib/calculators/va';
import { vaFundingFeeRatePercent } from '../lib/calculators/mortgageMath';
import type { VAInputs } from '../lib/calculators/va';

const baseInputs: VAInputs = {
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
};

describe('VA residual income tables', () => {
  it('uses the $80k+ table for typical purchase loans', () => {
    expect(getResidualIncomeTable(80000)).toBe(VA_RESIDUAL_INCOME_80K_PLUS);
    expect(getResidualIncomeTable(79999)).toBe(VA_RESIDUAL_INCOME_UNDER_80K);
  });

  it('looks up residual income by region and family size', () => {
    expect(getRequiredResidualIncome('south', 3, 400000)).toBe(889);
    expect(getRequiredResidualIncome('west', 1, 400000)).toBe(491);
    expect(getRequiredResidualIncome('northeast', 5, 400000)).toBe(1062);
    expect(getRequiredResidualIncome('midwest', 2, 50000)).toBe(641);
  });

  it('adds $80 per member over 5, capped at a family of 7', () => {
    expect(getRequiredResidualIncome('south', 6, 400000)).toBe(1039 + 80);
    expect(getRequiredResidualIncome('south', 7, 400000)).toBe(1039 + 160);
    expect(getRequiredResidualIncome('south', 10, 400000)).toBe(1039 + 160);
  });
});

describe('calculateVA qualification', () => {
  it('does not emit a hard DTI pass/fail flag', () => {
    const result = calculateVA(baseInputs);
    expect(result.details.meetsDTI).toBeUndefined();
    expect(result.details.meetsExtendedDTI).toBeUndefined();
    expect(result.details).toHaveProperty('dtiAboveGuideline');
  });

  it('raises the residual guideline by 20% when DTI exceeds 41%', () => {
    const highDti = calculateVA({
      ...baseInputs,
      monthlyGrossIncome: 4000,
      monthlyDebts: 800,
    });
    expect(highDti.details.dtiAboveGuideline).toBe(1);
    expect(highDti.details.totalDTI as number).toBeGreaterThan(41);
    expect(highDti.details.effectiveRequiredResidual).toBe(
      Math.round((highDti.details.requiredResidualIncome as number) * 1.2)
    );
    expect(highDti.insights.some((i) => i.includes('no hard DTI cap'))).toBe(true);
  });

  it('matches the shared funding-fee helper for purchase, IRRRL, and cash-out', () => {
    const purchase = calculateVA(baseInputs);
    expect(purchase.details.fundingFeeRate).toBe(vaFundingFeeRatePercent(0, true, 'regular', false, 'purchase'));

    const irrrl = calculateVA({ ...baseInputs, loanPurpose: 'irrrl' });
    expect(irrrl.details.fundingFeeRate).toBe(0.5);

    const cashOut = calculateVA({ ...baseInputs, loanPurpose: 'cash-out', firstTimeUse: false });
    expect(cashOut.details.fundingFeeRate).toBe(3.3);
  });

  it('treats Reserve/Guard the same as regular military and exempts surviving spouses', () => {
    const reserve = calculateVA({ ...baseInputs, serviceType: 'reserves-guard' });
    expect(reserve.details.fundingFeeRate).toBe(2.15);

    const spouse = calculateVA({ ...baseInputs, serviceType: 'surviving-spouse' });
    expect(spouse.details.fundingFeeRate).toBe(0);
    expect(spouse.details.feeExempt).toBe(1);
  });
});
