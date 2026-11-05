import { describe, expect, it } from 'vitest';
import {
  CLOZABLE_BLURBS,
  CLOZABLE_WAITLIST_URL,
  getClozableUrl,
  getClozableWaitlistUrl,
} from '../lib/clozable';

const FORBIDDEN = /loanknow|guarantee|approv|funded|best rate|we.?ll get you/i;

describe('getClozableUrl', () => {
  it('keeps the calculator CTA UTM pattern', () => {
    const url = new URL(getClozableWaitlistUrl('refinance'));
    expect(url.origin + url.pathname).toBe(new URL(CLOZABLE_WAITLIST_URL).origin + new URL(CLOZABLE_WAITLIST_URL).pathname);
    expect(url.searchParams.get('utm_source')).toBe('dett.io');
    expect(url.searchParams.get('utm_medium')).toBe('calculator_cta');
    expect(url.searchParams.get('utm_content')).toBe('refinance');
  });

  it('tags each marketing surface with its own utm_medium', () => {
    expect(new URL(getClozableUrl({ placement: 'home' })).searchParams.get('utm_medium')).toBe(
      'home_blurb'
    );
    expect(new URL(getClozableUrl({ placement: 'about' })).searchParams.get('utm_medium')).toBe(
      'about_blurb'
    );
    expect(new URL(getClozableUrl({ placement: 'footer' })).searchParams.get('utm_medium')).toBe(
      'footer'
    );
    expect(
      new URL(getClozableUrl({ placement: 'calculators' })).searchParams.get('utm_medium')
    ).toBe('calculators_index');
  });
});

describe('CLOZABLE_BLURBS', () => {
  it('stays claim-safe and never reintroduces LoanKnow', () => {
    for (const [placement, copy] of Object.entries(CLOZABLE_BLURBS)) {
      const text = `${copy.before}${copy.link}${copy.after}`;
      expect(text, placement).not.toMatch(FORBIDDEN);
      expect(copy.link).toBe('Clozable');
    }
  });
});
