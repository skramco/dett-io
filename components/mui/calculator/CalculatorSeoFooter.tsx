'use client';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { ExpandMore, HelpOutline, FactCheck } from '@mui/icons-material';
import { calculatorFaqs } from '@/lib/seo/calculatorFaqs';
import { getCalculatorLastUpdated } from '@/lib/seo/contentDates';
import {
  CALCULATOR_RATE_KEYS,
  DEFAULT_RATES,
  RATE_LABELS,
  RATE_SOURCE,
  RATES_AS_OF_LABEL,
  formatRate,
} from '@/lib/rates/defaultRates';

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

interface CalculatorSeoFooterProps {
  calculatorSlug: string;
}

/**
 * Visible FAQ + methodology/sources/last-updated sections rendered on every
 * calculator page (non-embed). The FAQ content mirrors the FAQPage JSON-LD
 * emitted from the route layout — both read from lib/seo/calculatorFaqs.ts.
 */
export function CalculatorSeoFooter({ calculatorSlug }: CalculatorSeoFooterProps) {
  const faqs = calculatorFaqs[calculatorSlug] ?? [];
  const rateKeys = CALCULATOR_RATE_KEYS[calculatorSlug] ?? [];
  const lastUpdated = getCalculatorLastUpdated(calculatorSlug);

  return (
    <Box>
      {/* FAQ section */}
      {faqs.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <HelpOutline sx={{ color: '#196bc0' }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Frequently Asked Questions
            </Typography>
          </Stack>
          {faqs.map((faq) => (
            <Accordion
              key={faq.question}
              disableGutters
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '12px !important',
                mb: 1,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography component="h3" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Methodology, sources & last updated */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          bgcolor: 'grey.50',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <FactCheck sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 700 }}>
            Methodology &amp; Data Sources
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.8 }}>
          Calculations use standard amortization formulas on the inputs you provide. Where
          available, the &ldquo;Show Me the Math&rdquo; section above walks through the exact
          formulas behind your result.
          {rateKeys.length > 0 && (
            <>
              {' '}Default interest rate{rateKeys.length > 1 ? 's' : ''} (
              {rateKeys
                .map((key) => `${RATE_LABELS[key]}: ${formatRate(DEFAULT_RATES[key])}`)
                .join(' · ')}
              ) {rateKeys.length > 1 ? 'are' : 'is'} based on national averages from the{' '}
              <MuiLink href={RATE_SOURCE.url} target="_blank" rel="noopener noreferrer">
                {RATE_SOURCE.name}
              </MuiLink>
              , {RATES_AS_OF_LABEL}. Replace defaults with your actual quote for precise results.
            </>
          )}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
          Content reviewed by the Dett.io editorial team. Last updated:{' '}
          <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>.
        </Typography>
      </Box>
    </Box>
  );
}
