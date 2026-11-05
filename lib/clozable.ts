// Clozable outbound-link configuration (ENG-337 / ENG-359).
//
// Clozable is Knowe LLC's mortgage-readiness product — a place to start
// getting ready to buy or refinance. Dett.io does not capture leads, collect
// contact info, or post to any Clozable endpoint. Every mention is a subtle
// external link to https://clozable.com (overridable via env).
//
// Kill switch: set NEXT_PUBLIC_CLOZABLE_CTA_ENABLED=false to hide every
// Clozable link at once. Defaults to enabled.

export const CLOZABLE_CTA_ENABLED =
  process.env.NEXT_PUBLIC_CLOZABLE_CTA_ENABLED !== 'false';

export const CLOZABLE_WAITLIST_URL =
  process.env.NEXT_PUBLIC_CLOZABLE_WAITLIST_URL || 'https://clozable.com';

export type ClozablePlacement =
  | 'calculator'
  | 'home'
  | 'about'
  | 'footer'
  | 'calculators';

const UTM_MEDIUM: Record<ClozablePlacement, string> = {
  calculator: 'calculator_cta',
  home: 'home_blurb',
  about: 'about_blurb',
  footer: 'footer',
  calculators: 'calculators_index',
};

export interface ClozableUrlOptions {
  placement?: ClozablePlacement;
  calculatorSlug?: string;
}

/**
 * Clozable URL with attribution params (no personal data — just which
 * surface the click came from). Calculator CTAs keep utm_medium=calculator_cta.
 */
export function getClozableUrl(options: ClozableUrlOptions = {}): string {
  const placement = options.placement ?? 'calculator';
  try {
    const url = new URL(CLOZABLE_WAITLIST_URL);
    url.searchParams.set('utm_source', 'dett.io');
    url.searchParams.set('utm_medium', UTM_MEDIUM[placement]);
    if (options.calculatorSlug) {
      url.searchParams.set('utm_content', options.calculatorSlug);
    }
    return url.toString();
  } catch {
    return CLOZABLE_WAITLIST_URL;
  }
}

/** Calculator CTA helper — keeps the original utm_medium=calculator_cta pattern. */
export function getClozableWaitlistUrl(calculatorSlug?: string): string {
  return getClozableUrl({ placement: 'calculator', calculatorSlug });
}

/** Short, claim-safe blurbs. No guarantees, approvals, rates, or features. */
export const CLOZABLE_BLURBS = {
  home: {
    before: 'When the numbers start to click, ',
    link: 'Clozable',
    after: ' is the best place to start getting ready to buy or refinance.',
  },
  calculators: {
    before: 'Run the numbers here first. ',
    link: 'Clozable',
    after: ' is next door when you want a place to start getting mortgage-ready.',
  },
  calculator: {
    before: 'Curious what comes after the estimates? ',
    link: 'Clozable',
    after: ' is a calm first stop if you\u2019re getting ready to buy or refinance \u2192',
  },
  footer: {
    before: 'Getting ready to buy or refinance? Start with ',
    link: 'Clozable',
    after: ' \u2014 a sibling Knowe product.',
  },
} as const;
