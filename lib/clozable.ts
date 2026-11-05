// Clozable CTA configuration (ENG-337 / ENG-359).
//
// Scope: Clozable is NOT taking live leads yet.
// No lead capture forms, no contact info collection, no posting to any
// Clozable endpoint. The CTA is a single, subtle external link to
// Clozable's coming-soon / waitlist page only.
//
// Kill switch: set NEXT_PUBLIC_CLOZABLE_CTA_ENABLED=false to hide every
// Clozable link at once. Defaults to enabled.
export const CLOZABLE_CTA_ENABLED =
  process.env.NEXT_PUBLIC_CLOZABLE_CTA_ENABLED !== 'false';

// Clozable coming-soon / waitlist page. Override via env when the live
// flow is ready (no code change needed).
export const CLOZABLE_WAITLIST_URL =
  process.env.NEXT_PUBLIC_CLOZABLE_WAITLIST_URL || 'https://clozable.com';

/**
 * Waitlist URL with attribution params (no personal data — just which
 * calculator the click came from).
 */
export function getClozableWaitlistUrl(calculatorSlug?: string): string {
  try {
    const url = new URL(CLOZABLE_WAITLIST_URL);
    url.searchParams.set('utm_source', 'dett.io');
    url.searchParams.set('utm_medium', 'calculator_cta');
    if (calculatorSlug) url.searchParams.set('utm_content', calculatorSlug);
    return url.toString();
  } catch {
    return CLOZABLE_WAITLIST_URL;
  }
}
