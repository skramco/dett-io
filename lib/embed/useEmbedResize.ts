'use client';

import { useEffect } from 'react';

export const EMBED_RESIZE_SOURCE = 'dett-embed';

export function useEmbedResize(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    if (window.parent === window) return;

    const send = () => {
      const height = Math.ceil(
        Math.max(
          document.body?.scrollHeight ?? 0,
          document.documentElement?.scrollHeight ?? 0
        )
      );
      if (height < 1) return;
      window.parent.postMessage({ source: EMBED_RESIZE_SOURCE, type: 'resize', height }, '*');
    };

    send();
    const observer = new ResizeObserver(() => send());
    observer.observe(document.body);
    window.addEventListener('load', send);
    const interval = window.setInterval(send, 1000);
    const stopInterval = window.setTimeout(() => window.clearInterval(interval), 8000);

    return () => {
      observer.disconnect();
      window.removeEventListener('load', send);
      window.clearInterval(interval);
      window.clearTimeout(stopInterval);
    };
  }, [enabled]);
}
