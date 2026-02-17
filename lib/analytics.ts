// Google Tag Manager + GA4 event tracking utility

export const GTM_ID = 'GTM-NCF9263G';

// Type-safe event names
export type AnalyticsEvent =
  | 'calculator_used'
  | 'calculator_result_emailed'
  | 'calculator_link_shared'
  | 'calculator_pdf_downloaded'
  | 'embed_calculator_used'
  | 'embed_click_through'
  | 'wizard_started'
  | 'wizard_completed'
  | 'guide_read'
  | 'show_me_the_math_opened'
  | 'cta_click'
  | 'outbound_click';

interface EventParams {
  calculator_slug?: string;
  guide_slug?: string;
  wizard_path?: string;
  cta_label?: string;
  link_url?: string;
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Push a custom event to the GTM dataLayer.
 * Safe to call even if GTM hasn't loaded — events queue in dataLayer.
 */
export function trackEvent(event: AnalyticsEvent, params?: EventParams) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...params,
  });
}

/**
 * Push a virtual pageview to the dataLayer (useful for SPA navigation).
 * GA4 Enhanced Measurement handles most pageviews, but this ensures
 * dynamic route changes are captured.
 */
export function trackPageView(url: string) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_path: url,
  });
}
