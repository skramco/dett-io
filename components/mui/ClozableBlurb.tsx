'use client';

import { Box, Typography } from '@mui/material';
import { trackEvent } from '@/lib/analytics';
import {
  CLOZABLE_BLURBS,
  CLOZABLE_CTA_ENABLED,
  getClozableUrl,
  type ClozablePlacement,
} from '@/lib/clozable';

type BlurbPlacement = keyof typeof CLOZABLE_BLURBS;

const linkSx = {
  color: 'inherit',
  fontWeight: 500,
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
  textDecorationColor: 'currentColor',
  transition: 'color 0.2s',
  '&:hover': {
    color: '#196bc0',
  },
} as const;

export function ClozableLink({
  placement,
  calculatorSlug,
  children = 'Clozable',
}: {
  placement: ClozablePlacement;
  calculatorSlug?: string;
  children?: React.ReactNode;
}) {
  if (!CLOZABLE_CTA_ENABLED) {
    return <>{children}</>;
  }

  const href = getClozableUrl({ placement, calculatorSlug });

  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent('cta_click', {
          cta_label: `clozable_${placement}`,
          calculator_slug: calculatorSlug,
          link_url: href,
        });
      }}
      sx={linkSx}
    >
      {children}
    </Box>
  );
}

export function ClozableBlurb({
  placement,
  calculatorSlug,
  align = 'center',
}: {
  placement: BlurbPlacement;
  calculatorSlug?: string;
  align?: 'left' | 'center' | 'inherit';
}) {
  if (!CLOZABLE_CTA_ENABLED) return null;

  const copy = CLOZABLE_BLURBS[placement];
  const variant = placement === 'footer' ? 'caption' : 'body2';

  return (
    <Typography
      variant={variant}
      color="text.secondary"
      sx={{
        textAlign: align,
        lineHeight: 1.7,
        maxWidth: placement === 'footer' ? 280 : 520,
        mx: align === 'center' ? 'auto' : 0,
      }}
    >
      {copy.before}
      <ClozableLink placement={placement} calculatorSlug={calculatorSlug}>
        {copy.link}
      </ClozableLink>
      {copy.after}
    </Typography>
  );
}
