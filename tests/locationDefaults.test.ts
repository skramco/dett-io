import { describe, expect, it } from 'vitest';
import { calculateClosingCosts, STATE_CLOSING_CUSTOMS } from '../lib/calculators/closingCosts';
import {
  applyLocationToClosingCosts,
  applyLocationToMortgageCost,
  estimateClosingCostsFromLocation,
  NATIONAL_HOUSING_DEFAULTS,
  resolveLocationDefaults,
  STATE_HOUSING_DEFAULTS,
  zipToState,
} from '../lib/locations';
import type { MortgageCostInputs } from '../lib/calculators/types';
import type { ClosingCostInputs } from '../lib/calculators/closingCosts';

describe('zipToState', () => {
  it('maps representative ZIPs to the correct state', () => {
    const samples: Record<string, string> = {
      '02115': 'MA',
      '05501': 'MA',
      '02903': 'RI',
      '03101': 'NH',
      '04101': 'ME',
      '05401': 'VT',
      '06103': 'CT',
      '07102': 'NJ',
      '10001': 'NY',
      '19103': 'PA',
      '19901': 'DE',
      '20001': 'DC',
      '20175': 'VA',
      '21201': 'MD',
      '23219': 'VA',
      '25301': 'WV',
      '27601': 'NC',
      '29201': 'SC',
      '30303': 'GA',
      '33101': 'FL',
      '35203': 'AL',
      '37201': 'TN',
      '39201': 'MS',
      '39901': 'GA',
      '40202': 'KY',
      '43215': 'OH',
      '46204': 'IN',
      '48201': 'MI',
      '50309': 'IA',
      '53202': 'WI',
      '55401': 'MN',
      '57104': 'SD',
      '58102': 'ND',
      '59101': 'MT',
      '60601': 'IL',
      '63101': 'MO',
      '66101': 'KS',
      '68102': 'NE',
      '70112': 'LA',
      '72201': 'AR',
      '73102': 'OK',
      '78701': 'TX',
      '80202': 'CO',
      '82001': 'WY',
      '83702': 'ID',
      '84101': 'UT',
      '85003': 'AZ',
      '87102': 'NM',
      '89101': 'NV',
      '94105': 'CA',
      '96813': 'HI',
      '97201': 'OR',
      '98101': 'WA',
      '99501': 'AK',
    };
    for (const [zip, state] of Object.entries(samples)) {
      expect(zipToState(zip), zip).toBe(state);
    }
  });

  it('returns null for incomplete, territorial, and unknown ZIPs', () => {
    expect(zipToState('12')).toBeNull();
    expect(zipToState('9021')).toBeNull();
    expect(zipToState('00901')).toBeNull(); // Puerto Rico
    expect(zipToState('96910')).toBeNull(); // Guam
    expect(zipToState('abcdef')).toBeNull();
  });
});

describe('resolveLocationDefaults', () => {
  it('uses national averages when no state or ZIP is set', () => {
    const d = resolveLocationDefaults({ state: '', zip: '' }, 450000);
    expect(d.state).toBe('');
    expect(d.propertyTaxRate).toBe(NATIONAL_HOUSING_DEFAULTS.propertyTaxRate);
    expect(d.insuranceRate).toBe(NATIONAL_HOUSING_DEFAULTS.insuranceRate);
    expect(d.attorneyFee).toBe(0);
  });

  it('lets a complete ZIP override the selected state', () => {
    const d = resolveLocationDefaults({ state: 'CA', zip: '10001' }, 450000);
    expect(d.state).toBe('NY');
    expect(d.stateName).toBe('New York');
  });

  it('changes property tax and insurance by state', () => {
    const nj = resolveLocationDefaults({ state: 'NJ', zip: '' }, 450000);
    const hi = resolveLocationDefaults({ state: 'HI', zip: '' }, 450000);
    expect(nj.propertyTaxRate).toBe(STATE_HOUSING_DEFAULTS.NJ.propertyTaxRate);
    expect(hi.propertyTaxRate).toBe(STATE_HOUSING_DEFAULTS.HI.propertyTaxRate);
    expect(nj.propertyTaxRate).toBeGreaterThan(hi.propertyTaxRate);
    expect(nj.annualPropertyTax).toBe(Math.round((450000 * nj.propertyTaxRate) / 100));
    expect(nj.annualInsurance).toBe(Math.round((450000 * nj.insuranceRate) / 100));
  });

  it('uses ZIP metro overrides for tax, insurance, and transfer tax', () => {
    const nyc = resolveLocationDefaults({ state: '', zip: '10001' }, 450000);
    const nyState = resolveLocationDefaults({ state: 'NY', zip: '' }, 450000);
    expect(nyc.sourceLabel).toContain('New York City');
    expect(nyc.propertyTaxRate).toBe(0.88);
    expect(nyc.transferTaxRate).toBe(1.4);
    expect(nyc.transferTaxRate).toBeGreaterThan(nyState.transferTaxRate);

    const miami = resolveLocationDefaults({ state: 'FL', zip: '33101' }, 450000);
    const florida = resolveLocationDefaults({ state: 'FL', zip: '' }, 450000);
    expect(miami.insuranceRate).toBeGreaterThan(florida.insuranceRate);

    const houston = resolveLocationDefaults({ state: 'TX', zip: '77002' }, 450000);
    expect(houston.propertyTaxRate).toBe(1.77);
    expect(houston.insuranceRate).toBe(1.15);
  });

  it('covers all 50 states + DC with plausible rates', () => {
    expect(Object.keys(STATE_HOUSING_DEFAULTS)).toHaveLength(51);
    for (const [code, row] of Object.entries(STATE_HOUSING_DEFAULTS)) {
      expect(row.propertyTaxRate).toBeGreaterThan(0);
      expect(row.propertyTaxRate).toBeLessThan(3);
      expect(row.insuranceRate).toBeGreaterThan(0);
      expect(row.insuranceRate).toBeLessThan(2);
      expect(STATE_CLOSING_CUSTOMS[code]).toBeDefined();
    }
  });
});

describe('location-driven closing customs', () => {
  const base: ClosingCostInputs = {
    homePrice: 450000,
    downPaymentPercent: 20,
    interestRate: 6.75,
    loanTerm: 30,
    state: 'CA',
    zip: '',
    isNewConstruction: false,
  };

  it('CA has no attorney fee; NY does', () => {
    const ca = calculateClosingCosts({ ...base, state: 'CA' });
    const ny = calculateClosingCosts({ ...base, state: 'NY' });
    expect(ca.lineItems.some((i) => i.name.startsWith('Attorney'))).toBe(false);
    const nyAttorney = ny.lineItems.find((i) => i.name.startsWith('Attorney'));
    expect(nyAttorney?.amount).toBe(1500);
    expect((ny.details.totalClosingCosts as number) > (ca.details.totalClosingCosts as number)).toBe(true);
  });

  it('applyLocationToClosingCosts feeds tax, insurance, and ZIP transfer-tax overrides', () => {
    const houston = resolveLocationDefaults({ state: 'TX', zip: '77002' }, 450000);
    const houstonInputs = applyLocationToClosingCosts(base, houston);
    expect(houstonInputs.state).toBe('TX');
    expect(houstonInputs.propertyTaxRate).toBe(1.77);
    expect(houstonInputs.prepaidInsurance).toBe(houston.annualInsurance);
    expect(calculateClosingCosts(houstonInputs).lineItems.some((i) => i.name.startsWith('Attorney'))).toBe(false);

    const nyc = resolveLocationDefaults({ state: 'NY', zip: '10001' }, 450000);
    const nycInputs = applyLocationToClosingCosts(base, nyc);
    expect(nycInputs.transferTax).toBe(nyc.transferTaxOverride);
    const transfer = calculateClosingCosts(nycInputs).lineItems.find((i) => i.name.startsWith('Transfer Tax'));
    expect(transfer?.amount).toBe(nyc.transferTax);
    expect(nyc.transferTax).toBeGreaterThan(0);
  });

  it('TX has no transfer tax at the state level', () => {
    const tx = calculateClosingCosts({ ...base, state: 'TX' });
    expect(tx.lineItems.some((i) => i.name.startsWith('Transfer Tax'))).toBe(false);
  });
});

describe('applyLocationToMortgageCost', () => {
  const base: MortgageCostInputs = {
    homePrice: 450000,
    downPayment: 90000,
    interestRate: 6.75,
    loanTerm: 30,
    propertyTax: 5400,
    homeInsurance: 1800,
    hoaFees: 0,
    state: '',
    zip: '',
  };

  it('replaces tax and insurance dollars from the location', () => {
    const resolved = resolveLocationDefaults({ state: 'NJ', zip: '' }, 450000);
    const next = applyLocationToMortgageCost(base, resolved);
    expect(next.propertyTax).toBe(resolved.annualPropertyTax);
    expect(next.homeInsurance).toBe(resolved.annualInsurance);
    expect(next.propertyTax).not.toBe(base.propertyTax);
  });
});

describe('estimateClosingCostsFromLocation', () => {
  it('uses 3% of price for the U.S. average and the engine once a state is set', () => {
    const national = resolveLocationDefaults({ state: '', zip: '' }, 450000);
    expect(
      estimateClosingCostsFromLocation(national, {
        homePrice: 450000,
        downPaymentPercent: 20,
        interestRate: 6.75,
        loanTerm: 30,
      }),
    ).toBe(13500);

    const ny = resolveLocationDefaults({ state: 'NY', zip: '' }, 450000);
    const nyCosts = estimateClosingCostsFromLocation(ny, {
      homePrice: 450000,
      downPaymentPercent: 20,
      interestRate: 6.75,
      loanTerm: 30,
    });
    const engine = calculateClosingCosts({
      homePrice: 450000,
      downPaymentPercent: 20,
      interestRate: 6.75,
      loanTerm: 30,
      state: 'NY',
      isNewConstruction: false,
      propertyTaxRate: ny.propertyTaxRate,
      prepaidInsurance: ny.annualInsurance,
    });
    expect(nyCosts).toBe(engine.details.netClosingCosts);
  });
});
