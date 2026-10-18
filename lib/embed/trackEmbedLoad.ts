'use client';

import { trackEvent } from '@/lib/analytics';
import { sanitizeReferringDomain } from './options';

export function trackEmbedLoad(slug: string) {
  if (typeof window === 'undefined') return;

  const referrer = document.referrer || '';
  const domain = sanitizeReferringDomain(referrer);

  trackEvent('embed_loaded', {
    calculator_slug: slug,
    referring_domain: domain ?? 'unknown',
  });

  if (!domain) return;

  try {
    const key = `dett-embed-ping:${slug}:${domain}:${new Date().toISOString().slice(0, 10)}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, '1');
  } catch {
    // sessionStorage can throw in some iframe contexts — still ping once
  }

  fetch('/api/embed-analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, domain }),
    keepalive: true,
  }).catch(() => {
    // Analytics must never break the widget
  });
}
