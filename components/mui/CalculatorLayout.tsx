'use client';

import Link from "next/link";
import { ReactNode, useEffect, useRef } from "react";
import { trackEvent } from '@/lib/analytics';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import { ArrowBack, Calculate, OpenInNew } from '@mui/icons-material';
import { Header } from './Header';
import { Footer } from './Footer';
import { RelatedCalculators } from './calculator/RelatedCalculators';
import { RelatedGuides } from './calculator/RelatedGuides';
import { LoanKnowCTA } from './calculator/LoanKnowCTA';
import { ActionBar } from './calculator/ActionBar';
import { ShowMeTheMath } from './calculator/ShowMeTheMath';
import { CalculatorJsonLd } from '@/components/JsonLd';
import { useIsEmbed } from '@/lib/embedContext';

interface RelatedCalculator {
  slug: string;
  name: string;
}

interface ActionBarData {
  summary: string;
  details: Record<string, number | string>;
  insights: string[];
  inputs: Record<string, unknown>;
}

interface CalculatorLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  relatedCalculators?: RelatedCalculator[];
  actionBarData?: ActionBarData;
  calculatorSlug?: string;
}

// Dotted background pattern
const dottedBackground = {
  backgroundImage: `radial-gradient(circle, #D1D5DB 1px, transparent 1px)`,
  backgroundSize: '24px 24px',
};

export default function CalculatorLayout({ children, title, description, relatedCalculators, actionBarData, calculatorSlug }: CalculatorLayoutProps) {
  const hasTracked = useRef(false);
  const isEmbed = useIsEmbed();

  useEffect(() => {
    if (actionBarData?.summary && calculatorSlug && !hasTracked.current) {
      hasTracked.current = true;
      trackEvent(isEmbed ? 'embed_calculator_used' : 'calculator_used', {
        calculator_slug: calculatorSlug,
        ...(isEmbed && { referrer: typeof window !== 'undefined' ? document.referrer : '' }),
      });
    }
  }, [actionBarData?.summary, calculatorSlug, isEmbed]);

  // ── Embed mode: stripped-down layout with branding bar ──
  if (isEmbed) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        {/* Embed header with title + description */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 2.5 },
            bgcolor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
              <Calculate sx={{ fontSize: 28, color: '#196bc0', mt: 0.3, flexShrink: 0 }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.15rem' }, lineHeight: 1.3 }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8rem', lineHeight: 1.4, display: { xs: 'none', sm: '-webkit-box' }, WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {description}
                </Typography>
              </Box>
            </Stack>
            <Chip
              label="Powered by Dett.io"
              size="small"
              component="a"
              href={`https://dett.io/calculators/${calculatorSlug}`}
              target="_blank"
              rel="noopener"
              clickable
              icon={<OpenInNew sx={{ fontSize: '14px !important' }} />}
              sx={{
                fontWeight: 600,
                fontSize: '0.7rem',
                bgcolor: '#196bc0',
                color: 'white',
                flexShrink: 0,
                mt: 0.3,
                '& .MuiChip-icon': { color: 'white' },
                '&:hover': { bgcolor: '#1a4f8f' },
              }}
            />
          </Stack>
        </Box>

        {/* Calculator content */}
        <Box component="main" sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: 3,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  border: '1px solid',
                  borderColor: 'divider',
                },
                '& input, & select': { borderRadius: 2 },
                '& .calculator-inputs': {
                  maxHeight: { xs: 'none', lg: 'calc(100vh - 200px)' },
                  overflowY: { xs: 'visible', lg: 'auto' },
                  overflowX: 'hidden',
                  position: { xs: 'relative', lg: 'sticky' },
                  top: { lg: 60 },
                  pr: { lg: 2 },
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-track': { background: '#f1f1f1', borderRadius: '4px' },
                  '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '4px' },
                },
              }}
            >
              <Box data-pdf-capture>{children}</Box>
            </Box>
          </Container>

          {/* Show Me the Math */}
          {calculatorSlug && actionBarData && actionBarData.details && (
            <Container maxWidth="lg" sx={{ pb: 2 }}>
              <ShowMeTheMath calculatorSlug={calculatorSlug} details={actionBarData.details} />
            </Container>
          )}

          {/* Action Bar (email, share, PDF) */}
          {actionBarData && actionBarData.summary && (
            <Container maxWidth="lg" sx={{ pb: 2 }}>
              <ActionBar
                calculatorName={title}
                summary={actionBarData.summary}
                details={actionBarData.details}
                insights={actionBarData.insights}
                inputs={actionBarData.inputs}
              />
            </Container>
          )}
        </Box>

        {/* Embed footer branding */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.5,
            bgcolor: 'grey.900',
            borderTop: '1px solid',
            borderColor: 'grey.800',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="caption" sx={{ color: 'grey.500' }}>
              Free calculator — estimates only, not financial advice
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography
                variant="caption"
                component="a"
                href="https://dett.io/calculators"
                target="_blank"
                rel="noopener"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { color: 'white' },
                }}
              >
                More calculators at dett.io
              </Typography>
              <OpenInNew sx={{ fontSize: 12, color: 'grey.500' }} />
            </Stack>
          </Stack>
        </Box>
      </Box>
    );
  }

  // ── Standard (non-embed) layout ──
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {calculatorSlug && (
        <CalculatorJsonLd name={title} description={description} slug={calculatorSlug} />
      )}
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero Section with gradient and decorative elements */}
        <Box 
          sx={{ 
            position: 'relative',
            pt: { xs: 4, md: 6 },
            pb: { xs: 6, md: 8 },
            bgcolor: 'grey.100',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
            ...dottedBackground,
            overflow: 'hidden',
          }}
        >
          {/* Decorative gradient orbs */}
          <Box
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(25, 107, 192, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -50,
              left: -50,
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(25, 107, 192, 0.08) 100%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            {/* Back link */}
            <Box sx={{ mb: 3 }}>
              <Link href="/calculators" style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<ArrowBack />}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    bgcolor: 'background.paper',
                    px: 2,
                    '&:hover': {
                      color: '#196bc0',
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                    },
                  }}
                >
                  All Calculators
                </Button>
              </Link>
            </Box>

            {/* Page header with icon */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#196bc0',
                  color: 'white',
                  borderRadius: 3,
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calculate sx={{ fontSize: 40 }} />
              </Paper>
              
              <Box sx={{ flex: 1 }}>
                <Chip
                  label="Free Calculator"
                  size="small"
                  sx={{ 
                    mb: 2,
                    bgcolor: 'secondary.light',
                    color: 'secondary.dark',
                    fontWeight: 600,
                  }}
                />
                <Typography 
                  variant="h1" 
                  component="h1"
                  sx={{ 
                    fontSize: { xs: 28, sm: 36, md: 44 },
                    mb: 2,
                    fontWeight: 600,
                  }}
                >
                  {title}
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ 
                    maxWidth: 700,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                  }}
                >
                  {description}
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Calculator content with enhanced styling and scrollable inputs */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 3,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                border: '1px solid',
                borderColor: 'divider',
              },
              '& input, & select': {
                borderRadius: 2,
              },
              // Make input panels scrollable
              '& .calculator-inputs': {
                maxHeight: { xs: 'none', lg: 'calc(100vh - 280px)' },
                overflowY: { xs: 'visible', lg: 'auto' },
                overflowX: 'hidden',
                position: { xs: 'relative', lg: 'sticky' },
                top: { lg: 100 },
                pr: { lg: 2 },
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#555',
                  },
                },
              },
            }}
          >
            <Box data-pdf-capture>
              {children}
            </Box>
          </Box>
        </Container>

        {/* Show Me the Math */}
        {calculatorSlug && actionBarData && actionBarData.details && (
          <Container maxWidth="lg" sx={{ pb: 2 }}>
            <ShowMeTheMath calculatorSlug={calculatorSlug} details={actionBarData.details} />
          </Container>
        )}

        {/* Action Bar */}
        {actionBarData && actionBarData.summary && (
          <Container maxWidth="lg" sx={{ pb: 2 }}>
            <ActionBar
              calculatorName={title}
              summary={actionBarData.summary}
              details={actionBarData.details}
              insights={actionBarData.insights}
              inputs={actionBarData.inputs}
            />
          </Container>
        )}

        {/* Related Calculators, Related Guides & LoanKnow CTA */}
        <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 } }}>
          {relatedCalculators && relatedCalculators.length > 0 && (
            <RelatedCalculators calculators={relatedCalculators} />
          )}
          {calculatorSlug && (
            <RelatedGuides calculatorSlug={calculatorSlug} />
          )}
          <LoanKnowCTA />
        </Container>

        {/* Calculator Disclaimer */}
        <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 } }}>
          <Box sx={{ px: 2, py: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', lineHeight: 1.7 }}>
              <strong>Important:</strong> This calculator provides estimates for educational purposes only. Results are not a loan offer, pre-qualification, pre-approval, or commitment to lend. Actual rates, terms, payments, and eligibility are determined by mortgage lenders based on your complete financial profile, credit history, property appraisal, and current market conditions. Dett.io is not a lender, broker, or financial advisor. Consult qualified professionals before making financial decisions. See our <a href="/terms" style={{ color: 'inherit' }}>Terms of Use</a> for full details.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
