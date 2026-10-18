'use client';

import { RefObject, useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { Box, Paper, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
  estimateBarRect,
  isHeadlineBelowViewport,
  isKeyboardOpen,
  shouldHideForEditedField,
  stickyBarPlacement,
  STICKY_BAR_HEIGHT_PX,
} from '@/lib/hooks/stickyResultBar';

const subscribeNoop = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

export interface StickyResultBarProps {
  label: string;
  value: string;
  /**
   * Element containing the full headline result (typically the HeroMetric).
   * The bar hides once that element is on screen; tapping scrolls to it.
   */
  watchRef?: RefObject<HTMLElement | null>;
}

/**
 * Compact live result bar for viewports below the theme `sm` breakpoint (768px).
 *
 * Shared with ENG-335: same component name/API so the accessibility PR can
 * reuse this instead of adding a second mortgage-cost-only bar.
 *
 * The headline's aria-live region (in HeroMetric) announces updates; this
 * control is a plain button so VoiceOver does not double-speak the number.
 */
export function StickyResultBar({ label, value, watchRef }: StickyResultBarProps) {
  const isClient = useIsClient();
  const [headlineBelow, setHeadlineBelow] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [viewportOffset, setViewportOffset] = useState({ top: 0, bottom: 0 });
  const [hideForField, setHideForField] = useState(false);

  useEffect(() => {
    const target = watchRef?.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeadlineBelow(
          isHeadlineBelowViewport(entry.isIntersecting, entry.boundingClientRect.top)
        );
      },
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchRef]);

  useEffect(() => {
    const syncViewport = () => {
      const vv = window.visualViewport;
      const height = vv?.height ?? window.innerHeight;
      const offsetTop = vv?.offsetTop ?? 0;
      const keyboard = isKeyboardOpen(window.innerHeight, height);
      const bottomGap = window.innerHeight - height - offsetTop;
      setKeyboardOpen(keyboard);
      setViewportOffset({ top: offsetTop, bottom: Math.max(0, bottomGap) });

      const placement = stickyBarPlacement(keyboard);
      const viewportBottom = offsetTop + height;
      const barRect = estimateBarRect({
        placement,
        viewportTop: offsetTop,
        viewportBottom,
        barHeight: STICKY_BAR_HEIGHT_PX,
      });
      setHideForField(
        shouldHideForEditedField({
          activeElement: document.activeElement,
          barRect,
        })
      );
    };

    const vv = window.visualViewport;
    vv?.addEventListener('resize', syncViewport);
    vv?.addEventListener('scroll', syncViewport);
    window.addEventListener('resize', syncViewport);
    document.addEventListener('focusin', syncViewport);
    document.addEventListener('focusout', syncViewport);
    return () => {
      vv?.removeEventListener('resize', syncViewport);
      vv?.removeEventListener('scroll', syncViewport);
      window.removeEventListener('resize', syncViewport);
      document.removeEventListener('focusin', syncViewport);
      document.removeEventListener('focusout', syncViewport);
    };
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const html = document.documentElement;
    html.style.scrollPaddingTop = 'calc(72px + env(safe-area-inset-top, 0px))';
    html.style.scrollPaddingBottom = 'calc(80px + env(safe-area-inset-bottom, 0px))';
    return () => {
      html.style.scrollPaddingTop = '';
      html.style.scrollPaddingBottom = '';
    };
  }, [isClient]);

  const placement = stickyBarPlacement(keyboardOpen);
  const show = headlineBelow && !hideForField;

  const handleClick = () => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    watchRef?.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  if (!isClient) return null;

  const bar = (
    <Paper
      component="button"
      type="button"
      onClick={handleClick}
      aria-label={`${label}: ${value}. View full results`}
      data-sticky-result-bar=""
      elevation={8}
      square
      sx={{
        display: { xs: 'flex', sm: 'none' },
        position: 'fixed',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: (theme) => theme.zIndex.appBar,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 2.5,
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        textAlign: 'left',
        font: 'inherit',
        background: 'linear-gradient(135deg, #196bc0 0%, #0F4F8F 100%)',
        transition: 'transform 0.2s ease, visibility 0.2s, top 0.2s ease, bottom 0.2s ease',
        visibility: show ? 'visible' : 'hidden',
        WebkitTapHighlightColor: 'transparent',
        ...(placement === 'top'
          ? {
              top: viewportOffset.top,
              bottom: 'auto',
              pt: 'calc(10px + env(safe-area-inset-top, 0px))',
              pb: 1.25,
              borderBottom: '1px solid',
              borderBottomColor: 'rgba(255,255,255,0.2)',
              transform: show ? 'translateY(0)' : 'translateY(-110%)',
            }
          : {
              top: 'auto',
              bottom: viewportOffset.bottom,
              pt: 1.25,
              pb: 'calc(10px + env(safe-area-inset-bottom, 0px))',
              borderTop: '1px solid',
              borderTopColor: 'rgba(255,255,255,0.2)',
              transform: show ? 'translateY(0)' : 'translateY(110%)',
            }),
        '&:focus-visible': {
          outline: '3px solid #FDE047',
          outlineOffset: -3,
        },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{ display: 'block', color: '#EBF5FF', fontWeight: 500, lineHeight: 1.2 }}
        >
          {label}
        </Typography>
        <Typography variant="h6" component="span" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
          {value}
        </Typography>
      </Box>
      {placement === 'top' ? (
        <KeyboardArrowDown sx={{ flexShrink: 0, fontSize: 28, opacity: 0.9 }} aria-hidden />
      ) : (
        <KeyboardArrowUp sx={{ flexShrink: 0, fontSize: 28, opacity: 0.9 }} aria-hidden />
      )}
    </Paper>
  );

  return createPortal(bar, document.body);
}
