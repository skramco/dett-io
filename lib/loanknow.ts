// LoanKnow CTA configuration (ENG-337 / ENG-359).
//
// Scope: LoanKnow is NOT taking live leads yet.
// No lead capture forms, no contact info collection, no posting to any
// LoanKnow endpoint. The CTA is a single, subtle external link to
// LoanKnow's coming-soon / waitlist page only.
//
// Kill switch: set NEXT_PUBLIC_LOANKNOW_CTA_ENABLED=false to hide every
// LoanKnow link at once. Defaults to enabled.
export const LOANKNOW_CTA_ENABLED =
  process.env.NEXT_PUBLIC_LOANKNOW_CTA_ENABLED !== 'false';

// LoanKnow coming-soon / waitlist page. Override via env when the live
// flow is ready (no code change needed).
export const LOANKNOW_WAITLIST_URL =
  process.env.NEXT_PUBLIC_LOANKNOW_WAITLIST_URL || 'https://loanknow.com';

/**
 * Waitlist URL with attribution params (no personal data — just which
 * calculator the click came from).
 */
export function getLoanKnowWaitlistUrl(calculatorSlug?: string): string {
  try {
    const url = new URL(LOANKNOW_WAITLIST_URL);
    url.searchParams.set('utm_source', 'dett.io');
    url.searchParams.set('utm_medium', 'calculator_cta');
    if (calculatorSlug) url.searchParams.set('utm_content', calculatorSlug);
    return url.toString();
  } catch {
    return LOANKNOW_WAITLIST_URL;
  }
}
