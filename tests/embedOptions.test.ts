import { describe, expect, it } from 'vitest';
import { EMBED_AUDIENCES, EMBED_CALCULATOR_SLUGS, EMBED_CALCULATORS } from '../lib/embed/catalog';
import {
  appearanceFromSearch,
  buildEmbedSrc,
  iframeSnippet,
  loaderSnippet,
  sanitizeReferringDomain,
} from '../lib/embed/options';

describe('embed catalog (ENG-361)', () => {
  it('covers all 20 calculators', () => {
    expect(EMBED_CALCULATORS).toHaveLength(20);
    expect(EMBED_CALCULATOR_SLUGS).toEqual(
      expect.arrayContaining([
        'affordability',
        'mortgage-cost',
        'rent-vs-buy',
        'refinance',
        'dti',
        'fha',
        'va',
      ])
    );
  });

  it('keeps audience cards for realtors, brokers, lenders, and bloggers', () => {
    expect(EMBED_AUDIENCES.map((a) => a.id)).toEqual(['realtors', 'brokers', 'lenders', 'bloggers']);
  });
});

describe('embed appearance query params', () => {
  it('parses hex colors without a leading #', () => {
    const appearance = appearanceFromSearch('?primary=c026d3&mode=dark&title=0&charts=0&radius=8');
    expect(appearance.primary).toBe('#c026d3');
    expect(appearance.mode).toBe('dark');
    expect(appearance.showTitle).toBe(false);
    expect(appearance.showCharts).toBe(false);
    expect(appearance.radius).toBe(8);
  });

  it('builds a themed embed URL and auto-resize snippet', () => {
    const src = buildEmbedSrc(
      'affordability',
      appearanceFromSearch('?primary=c026d3&mode=dark&title=0'),
      { annualIncome: 150000 }
    );
    expect(src).toContain('https://dett.io/embed/affordability?');
    expect(src).toContain('primary=c026d3');
    expect(src).toContain('mode=dark');
    expect(src).toContain('title=0');
    expect(src).toContain('annualIncome=150000');

    const snippet = loaderSnippet(src, 'Affordability', appearanceFromSearch('?primary=c026d3&mode=dark'));
    expect(snippet).toContain('<iframe');
    expect(snippet).toContain('data-dett-embed="1"');
    expect(snippet).toContain('/embed.js');
    expect(iframeSnippet(src, 'Affordability', appearanceFromSearch('?height=700'))).not.toContain('embed.js');
  });
});

describe('embed referring-domain sanitizer', () => {
  it('keeps public hostnames and drops PII-ish or first-party values', () => {
    expect(sanitizeReferringDomain('https://www.broker-site.com/listings?q=1')).toBe('broker-site.com');
    expect(sanitizeReferringDomain('localhost')).toBeNull();
    expect(sanitizeReferringDomain('https://dett.io/embed/affordability')).toBeNull();
    expect(sanitizeReferringDomain('not a host')).toBeNull();
  });
});
