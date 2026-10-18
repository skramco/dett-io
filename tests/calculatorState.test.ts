import { describe, expect, it } from 'vitest';
import {
  applyInputsToUrl,
  buildExportDocument,
  buildShareUrl,
  formatInputLabel,
  formatInputValue,
  parseInputsFromLocation,
  parseInputsFromSearchParams,
  pickSerializableInputs,
  serializeInputs,
} from '../lib/share/calculatorState';

const defaults = {
  homePrice: 450000,
  interestRate: 6.5,
  loanTerm: 30,
  state: 'CA',
  isNewConstruction: false,
  firstTimeUse: true,
};

describe('serializeInputs / parseInputsFromSearchParams', () => {
  it('round-trips numbers, strings, and booleans', () => {
    const params = serializeInputs({
      homePrice: 500000,
      interestRate: 5.875,
      state: 'TX',
      isNewConstruction: true,
      firstTimeUse: false,
    });

    expect(params.get('homePrice')).toBe('500000');
    expect(params.get('interestRate')).toBe('5.875');
    expect(params.get('state')).toBe('TX');
    expect(params.get('isNewConstruction')).toBe('true');
    expect(params.get('firstTimeUse')).toBe('false');

    expect(parseInputsFromSearchParams(params, defaults)).toEqual({
      homePrice: 500000,
      interestRate: 5.875,
      state: 'TX',
      isNewConstruction: true,
      firstTimeUse: false,
    });
  });

  it('ignores unknown keys, empty strings, and invalid numbers', () => {
    const params = new URLSearchParams({
      homePrice: 'not-a-number',
      utm_source: 'newsletter',
      loanTerm: '15',
      extra: '1',
    });

    expect(parseInputsFromSearchParams(params, defaults)).toEqual({
      loanTerm: 15,
    });
  });

  it('returns null when no known inputs are present', () => {
    expect(parseInputsFromSearchParams(new URLSearchParams('utm_source=share'), defaults)).toBeNull();
  });
});

describe('parseInputsFromLocation', () => {
  it('prefers query params over hash params', () => {
    expect(
      parseInputsFromLocation('?homePrice=400000', defaults, '#homePrice=1&state=NY')
    ).toEqual({ homePrice: 400000 });
  });

  it('falls back to hash params when the query string has no inputs', () => {
    expect(parseInputsFromLocation('', defaults, '#state=NY&firstTimeUse=false')).toEqual({
      state: 'NY',
      firstTimeUse: false,
    });
  });
});

describe('buildShareUrl / applyInputsToUrl', () => {
  it('encodes current inputs into a deep link and preserves unrelated params', () => {
    const url = buildShareUrl(
      'https://dett.io',
      '/calculators/affordability',
      { annualIncome: 150000, monthlyDebts: 400 },
      '?utm_source=share',
      ''
    );

    expect(url).toBe(
      'https://dett.io/calculators/affordability?utm_source=share&annualIncome=150000&monthlyDebts=400'
    );
  });

  it('replaces stale input params without dropping the path', () => {
    const next = applyInputsToUrl(
      'https://dett.io/calculators/closing-costs?homePrice=100&state=CA&embed=1',
      { homePrice: 600000, state: 'TX' },
      ['homePrice', 'state']
    );

    expect(next).toBe('/calculators/closing-costs?embed=1&homePrice=600000&state=TX');
  });
});

describe('buildExportDocument', () => {
  it('includes current inputs and headline results', () => {
    const doc = buildExportDocument({
      calculatorName: 'How Much House Can I Afford?',
      summary: 'You can afford about $520,000.',
      details: { moderatePrice: 520000, backEndDTI: 36 },
      insights: ['Keep housing under 30% of income.'],
      inputs: { annualIncome: 120000, interestRate: 6.5, firstTimeUse: true },
      generatedAt: new Date('2026-10-18T12:00:00Z'),
    });

    expect(doc.calculatorName).toBe('How Much House Can I Afford?');
    expect(doc.summary).toBe('You can afford about $520,000.');
    expect(doc.inputRows).toEqual([
      { key: 'annualIncome', label: 'Annual Income', value: '$120,000' },
      { key: 'interestRate', label: 'Interest Rate', value: '6.5%' },
      { key: 'firstTimeUse', label: 'First Time Use', value: 'Yes' },
    ]);
    expect(doc.resultRows).toEqual([
      { key: 'moderatePrice', label: 'Moderate Price', value: '$520,000' },
      { key: 'backEndDTI', label: 'Back End DTI', value: '36%' },
    ]);
    expect(doc.insights).toEqual(['Keep housing under 30% of income.']);
  });
});

describe('pickSerializableInputs', () => {
  it('keeps primitives and drops objects, nulls, and empty strings', () => {
    expect(
      pickSerializableInputs({
        homePrice: 400000,
        state: 'CA',
        firstTimeUse: true,
        notes: '',
        nested: { skip: true },
        empty: null,
      })
    ).toEqual({
      homePrice: 400000,
      state: 'CA',
      firstTimeUse: true,
    });
  });
});

describe('format helpers', () => {
  it('humanizes camelCase keys', () => {
    expect(formatInputLabel('downPaymentPercent')).toBe('Down Payment Percent');
  });

  it('formats booleans and percents', () => {
    expect(formatInputValue('recastOption', false)).toBe('No');
    expect(formatInputValue('interestRate', 6.125)).toBe('6.125%');
  });
});
