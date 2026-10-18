import { describe, expect, it } from 'vitest';
import {
  createLocalScenarioStore,
  formatScenarioChip,
  getDownPaymentPercent,
  getLoanAmount,
  hasScenarioValues,
  mapInputsToProfile,
  mapProfileToInputs,
  parseScenario,
  scenarioMappedKeys,
  type ScenarioProfile,
} from '../lib/scenario';

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
  };
}

const profile: ScenarioProfile = {
  version: 1,
  updatedAt: '2026-10-18T00:00:00.000Z',
  annualIncome: 150000,
  monthlyDebts: 650,
  homePrice: 500000,
  interestRate: 6.25,
  downPayment: 100000,
  loanTerm: 30,
  creditScore: 760,
  propertyTaxRate: 1.1,
  homeInsuranceAnnual: 2100,
  hoaFees: 75,
};

describe('parseScenario', () => {
  it('accepts a valid profile and drops non-numeric junk', () => {
    const parsed = parseScenario({
      version: 1,
      updatedAt: '2026-10-18T12:00:00.000Z',
      annualIncome: 120000,
      homePrice: 'oops',
      interestRate: 6.5,
      extra: true,
    });
    expect(parsed).toMatchObject({ annualIncome: 120000, interestRate: 6.5 });
    expect(parsed?.homePrice).toBeUndefined();
  });

  it('returns null for empty or invalid payloads', () => {
    expect(parseScenario(null)).toBeNull();
    expect(parseScenario({})).toBeNull();
    expect(parseScenario({ annualIncome: '120k' })).toBeNull();
  });
});

describe('local scenario store', () => {
  it('round-trips through storage and clears', () => {
    const store = createLocalScenarioStore(memoryStorage());
    expect(store.load()).toBeNull();
    store.save(profile);
    expect(store.load()).toMatchObject({
      annualIncome: 150000,
      homePrice: 500000,
      interestRate: 6.25,
    });
    store.clear();
    expect(store.load()).toBeNull();
  });

  it('survives corrupt JSON', () => {
    const raw = memoryStorage();
    raw.setItem('dett.scenario.v1', '{not json');
    const store = createLocalScenarioStore(raw);
    expect(store.load()).toBeNull();
  });
});

describe('mapProfileToInputs', () => {
  it('prefills affordability from income, debts, down payment, and rate', () => {
    const defaults = {
      annualIncome: 120000,
      monthlyDebts: 500,
      downPayment: 80000,
      interestRate: 6.75,
      loanTerm: 30,
      propertyTaxRate: 1.2,
      homeInsuranceAnnual: 1800,
      hoaFees: 0,
    };
    expect(mapProfileToInputs(defaults, profile)).toEqual({
      annualIncome: 150000,
      monthlyDebts: 650,
      downPayment: 100000,
      interestRate: 6.25,
      loanTerm: 30,
      propertyTaxRate: 1.1,
      homeInsuranceAnnual: 2100,
      hoaFees: 75,
    });
  });

  it('derives loan amount, down-payment percent, and monthly income', () => {
    const defaults = {
      homePrice: 450000,
      downPaymentPercent: 10,
      loanAmount: 405000,
      interestRate: 6.75,
      monthlyGrossIncome: 10000,
      creditScore: 740,
    };
    expect(mapProfileToInputs(defaults, profile)).toEqual({
      homePrice: 500000,
      downPaymentPercent: 20,
      loanAmount: 400000,
      interestRate: 6.25,
      monthlyGrossIncome: 12500,
      creditScore: 760,
    });
  });

  it('collapses monthly debts into DTI otherDebts and zeros the default split', () => {
    const defaults = {
      monthlyGrossIncome: 10000,
      mortgagePayment: 2200,
      propertyTax: 5400,
      homeInsurance: 1800,
      hoaFees: 0,
      carPayments: 450,
      studentLoans: 300,
      creditCardMinimums: 150,
      personalLoans: 0,
      childSupport: 0,
      otherDebts: 0,
    };
    const mapped = mapProfileToInputs(defaults, profile);
    expect(mapped.monthlyGrossIncome).toBe(12500);
    expect(mapped.otherDebts).toBe(650);
    expect(mapped.carPayments).toBe(0);
    expect(mapped.studentLoans).toBe(0);
    expect(mapped.creditCardMinimums).toBe(0);
    expect(mapped.propertyTax).toBe(5500); // 500000 * 1.1%
    expect(mapped.homeInsurance).toBe(2100);
    expect(mapped.hoaFees).toBe(75);
    expect(mapped.mortgagePayment).toBeUndefined();
  });

  it('does not overwrite current-loan refinance fields', () => {
    const defaults = {
      currentBalance: 320000,
      currentRate: 7.5,
      currentMonthlyPayment: 2306,
      yearsRemaining: 27,
      newRate: 6.75,
      newTerm: 30,
      closingCosts: 8000,
    };
    expect(mapProfileToInputs(defaults, profile)).toEqual({
      newRate: 6.25,
      newTerm: 30,
    });
  });

  it('shifts ARM/points offsets by the same delta as the mapped rate', () => {
    const defaults = {
      loanAmount: 360000,
      parRate: 6.75,
      pointsRate: 6.25,
      lenderCreditRate: 7.0,
      armInitialRate: 5.75,
      fifteenYearRate: 6.0,
      loanTerm: 30,
    };
    const mapped = mapProfileToInputs(defaults, profile);
    expect(mapped.parRate).toBe(6.25);
    expect(mapped.pointsRate).toBe(5.75);
    expect(mapped.lenderCreditRate).toBe(6.5);
    expect(mapped.armInitialRate).toBe(5.25);
    expect(mapped.fifteenYearRate).toBe(5.5);
    expect(mapped.loanAmount).toBe(400000);
  });

  it('prefills Pay Off Faster loan amount, rate, and term', () => {
    const defaults = {
      loanAmount: 360000,
      interestRate: 6.75,
      loanTerm: 30,
      extraMonthlyPayment: 300,
      investmentReturn: 7,
    };
    expect(mapProfileToInputs(defaults, profile)).toEqual({
      loanAmount: 400000,
      interestRate: 6.25,
      loanTerm: 30,
    });
  });

  it('lets URL query params win over the profile', () => {
    const defaults = {
      homePrice: 450000,
      interestRate: 6.75,
      annualIncome: 120000,
    };
    const url = new URLSearchParams('homePrice=275000');
    expect(mapProfileToInputs(defaults, profile, url)).toEqual({
      interestRate: 6.25,
      annualIncome: 150000,
    });
  });

  it('ignores profile fields the calculator does not have', () => {
    const defaults = { extraMonthlyPayment: 300, loanAmount: 360000 };
    expect(mapProfileToInputs(defaults, profile)).toEqual({ loanAmount: 400000 });
  });
});

describe('mapInputsToProfile', () => {
  it('merges calculator inputs without wiping unrelated profile fields', () => {
    const existing: ScenarioProfile = {
      version: 1,
      updatedAt: '2026-01-01T00:00:00.000Z',
      annualIncome: 150000,
      monthlyDebts: 650,
    };
    const merged = mapInputsToProfile(
      { homePrice: 410000, downPayment: 82000, interestRate: 6.5 },
      existing
    );
    expect(merged.annualIncome).toBe(150000);
    expect(merged.monthlyDebts).toBe(650);
    expect(merged.homePrice).toBe(410000);
    expect(merged.downPayment).toBe(82000);
    expect(merged.interestRate).toBe(6.5);
  });

  it('reconstructs annual income and monthly debts from DTI inputs', () => {
    const merged = mapInputsToProfile(
      {
        monthlyGrossIncome: 8000,
        carPayments: 400,
        studentLoans: 200,
        creditCardMinimums: 50,
        personalLoans: 0,
        childSupport: 0,
        otherDebts: 100,
      },
      { version: 1, updatedAt: '2026-01-01T00:00:00.000Z' }
    );
    expect(merged.annualIncome).toBe(96000);
    expect(merged.monthlyDebts).toBe(750);
  });
});

describe('helpers', () => {
  it('derives down payment percent and loan amount', () => {
    expect(getDownPaymentPercent(profile)).toBe(20);
    expect(getLoanAmount(profile)).toBe(400000);
    expect(getLoanAmount({ version: 1, updatedAt: '', homePrice: 400000 })).toBeUndefined();
  });

  it('reports whether a profile has any values', () => {
    expect(hasScenarioValues(profile)).toBe(true);
    expect(hasScenarioValues({ version: 1, updatedAt: 'x' })).toBe(false);
    expect(hasScenarioValues(null)).toBe(false);
  });

  it('lists mapped keys for a calculator defaults object', () => {
    const keys = scenarioMappedKeys({
      homePrice: 1,
      interestRate: 1,
      extraMonthlyPayment: 1,
    });
    expect(keys.sort()).toEqual(['homePrice', 'interestRate']);
  });

  it('formats chip labels', () => {
    expect(formatScenarioChip('annualIncome', 150000)).toBe('$150,000');
    expect(formatScenarioChip('monthlyDebts', 650)).toBe('$650/mo');
    expect(formatScenarioChip('interestRate', 6.25)).toBe('6.25%');
    expect(formatScenarioChip('loanTerm', 30)).toBe('30-year');
  });
});
