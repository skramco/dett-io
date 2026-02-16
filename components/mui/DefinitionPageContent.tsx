'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircleOutline,
  Calculate,
  MenuBook,
  ArrowBack,
} from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import { DefinitionJsonLd, FAQJsonLd } from '@/components/JsonLd';
import type { Definition } from '@/lib/definitions/definitionData';

export function DefinitionPageContent({ definition }: { definition: Definition }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <DefinitionJsonLd
        term={definition.term}
        definition={definition.shortDefinition}
        slug={definition.slug}
      />
      <FAQJsonLd questions={definition.faq} />

      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero */}
        <Box
          sx={{
            pt: { xs: 6, md: 8 },
            pb: { xs: 6, md: 8 },
            bgcolor: 'grey.50',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="md">
            <Link
              href="/learn"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}
            >
              <ArrowBack sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
                Back to Glossary
              </Typography>
            </Link>

            <Chip
              label="Mortgage Term"
              size="small"
              sx={{ mb: 2, bgcolor: 'primary.50', color: 'primary.main', fontWeight: 600 }}
            />

            <Typography
              variant="h1"
              component="h1"
              sx={{ fontSize: { xs: 32, sm: 40, md: 48 }, mb: 2 }}
            >
              {definition.term}
            </Typography>

            {/* Direct answer — the #1 thing AI models look for */}
            <Typography
              variant="h6"
              component="p"
              data-speakable
              sx={{
                fontWeight: 400,
                color: 'text.secondary',
                maxWidth: 700,
                lineHeight: 1.6,
              }}
            >
              {definition.shortDefinition}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Stack spacing={6}>
            {/* Full Explanation */}
            <Box>
              <Typography variant="h4" component="h2" sx={{ mb: 2, fontSize: { xs: 24, md: 28 } }}>
                How It Works
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                data-speakable
                sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}
              >
                {definition.fullExplanation}
              </Typography>
            </Box>

            {/* Key Facts */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: 'grey.50',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h5" component="h2" sx={{ mb: 2.5, fontWeight: 700 }}>
                Key Facts
              </Typography>
              <Stack spacing={1.5}>
                {definition.keyFacts.map((fact, i) => (
                  <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                    <CheckCircleOutline sx={{ color: 'primary.main', fontSize: 20, mt: 0.3 }} />
                    <Typography variant="body1" color="text.secondary">
                      {fact}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            {/* Example */}
            {definition.example && (
              <Box>
                <Typography variant="h4" component="h2" sx={{ mb: 2, fontSize: { xs: 24, md: 28 } }}>
                  Example
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    bgcolor: 'primary.50',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'primary.100',
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                    {definition.example}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Related Calculators */}
            {definition.relatedCalculators.length > 0 && (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Calculate sx={{ color: 'primary.main' }} />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                    Try the Calculator
                  </Typography>
                </Stack>
                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                  {definition.relatedCalculators.map((calc) => (
                    <Chip
                      key={calc.slug}
                      label={calc.name}
                      component={Link}
                      href={`/calculators/${calc.slug}`}
                      clickable
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 1,
                        py: 2.5,
                        fontSize: '0.9rem',
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.50',
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* FAQ */}
            {definition.faq.length > 0 && (
              <Box>
                <Typography variant="h4" component="h2" sx={{ mb: 2, fontSize: { xs: 24, md: 28 } }}>
                  Frequently Asked Questions
                </Typography>
                {definition.faq.map((item, i) => (
                  <Accordion
                    key={i}
                    elevation={0}
                    disableGutters
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '12px !important',
                      mb: 1.5,
                      '&:before': { display: 'none' },
                      overflow: 'hidden',
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography sx={{ fontWeight: 600 }}>{item.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {item.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}

            {/* Back to Glossary CTA */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                bgcolor: 'grey.900',
                borderRadius: 4,
                textAlign: 'center',
              }}
            >
              <MenuBook sx={{ color: 'grey.400', fontSize: 40, mb: 1 }} />
              <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 700 }}>
                Explore More Terms
              </Typography>
              <Typography variant="body2" sx={{ color: 'grey.400', mb: 3 }}>
                Build your mortgage vocabulary with our complete glossary.
              </Typography>
              <Chip
                label="View Full Glossary"
                component={Link}
                href="/learn"
                clickable
                sx={{
                  bgcolor: 'white',
                  color: 'grey.900',
                  fontWeight: 700,
                  px: 2,
                  py: 2.5,
                  fontSize: '0.95rem',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              />
            </Paper>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
