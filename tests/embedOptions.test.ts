import { describe, expect, it } from 'vitest';
import {
  buildEmbedSrc,
  DEFAULT_EMBED_OPTIONS,
  parseEmbedOptions,
  serializeEmbedOptions,
} from '../lib/embed/options';
import { referringDomainFrom } from '../lib/embed/referrer';
import { EMBED_CALCULATOR_SLUGS, isEmbedCalculatorSlug } from '../lib/embed/catalog';

describe('parseEmbedOptions', () => {
  it('returns defaults for an empty query string', () => {
    expect(parseEmbedOptions('')).toEqual(DEFAULT_EMBED_OPTIONS);
  });

  it('parses theme, colors, font, radius, and visibility flags', () => {
    const options = parseEmbedOptions(
      'primary=112233&accent=abcdef&bg=000&font=serif&theme=dark&radius=8&title=0&charts=false'
    );
    expect(options.primaryColor).toBe('#112233');
    expect(options.accentColor).toBe('#abcdef');
    expect(options.backgroundColor).toBe('#000000');
    expect(options.font).toBe('serif');
    expect(options.theme).toBe('dark');
    expect(options.borderRadius).toBe(8);
    expect(options.showTitle).toBe(false);
    expect(options.showCharts).toBe(false);
  });

  it('collects numeric calculator inputs and ignores reserved keys', () => {
    const options = parseEmbedOptions('homePrice=500000&interestRate=6.25&theme=light&bogus=abc');
    expect(options.inputs).toEqual({ homePrice: 500000, interestRate: 6.25 });
    expect(options.theme).toBe('light');
  });

  it('clamps radius and falls back on invalid colors', () => {
    const options = parseEmbedOptions('primary=not-a-color&radius=99');
    expect(options.primaryColor).toBe(DEFAULT_EMBED_OPTIONS.primaryColor);
    expect(options.borderRadius).toBe(32);
  });
});

describe('serializeEmbedOptions', () => {
  it('omits default theme values and includes custom inputs', () => {
    const params = serializeEmbedOptions({
      ...DEFAULT_EMBED_OPTIONS,
      primaryColor: '#ff5500',
      showTitle: false,
      inputs: { homePrice: 400000 },
    });
    expect(params.get('primary')).toBe('ff5500');
    expect(params.get('title')).toBe('0');
    expect(params.get('homePrice')).toBe('400000');
    expect(params.get('theme')).toBeNull();
    expect(params.get('font')).toBeNull();
  });

  it('builds a widget URL with only the non-default query', () => {
    expect(buildEmbedSrc('affordability', DEFAULT_EMBED_OPTIONS)).toBe(
      'https://dett.io/embed/affordability'
    );
    expect(
      buildEmbedSrc('affordability', {
        ...DEFAULT_EMBED_OPTIONS,
        theme: 'dark',
        inputs: { annualIncome: 150000 },
      })
    ).toBe('https://dett.io/embed/affordability?theme=dark&annualIncome=150000');
  });
});

describe('referringDomainFrom', () => {
  it('extracts a hostname from a full URL and drops path/query', () => {
    expect(referringDomainFrom('https://blog.example.com/posts/mortgage?ref=1')).toBe(
      'blog.example.com'
    );
  });

  it('accepts a bare hostname and localhost', () => {
    expect(referringDomainFrom('partner.site')).toBe('partner.site');
    expect(referringDomainFrom('localhost')).toBe('localhost');
  });

  it('rejects missing, malformed, or userinfo-looking values', () => {
    expect(referringDomainFrom(null)).toBeNull();
    expect(referringDomainFrom('')).toBeNull();
    expect(referringDomainFrom('not a domain')).toBeNull();
    expect(referringDomainFrom('https://user:pass@evil.test')).toBe('evil.test');
  });
});

describe('embed catalog', () => {
  it('covers all 20 calculators', () => {
    expect(EMBED_CALCULATOR_SLUGS).toHaveLength(20);
    expect(isEmbedCalculatorSlug('affordability')).toBe(true);
    expect(isEmbedCalculatorSlug('not-a-calc')).toBe(false);
  });
});
