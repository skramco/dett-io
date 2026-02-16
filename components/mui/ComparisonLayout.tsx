'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  ArrowForward,
  CompareArrows,
  ExpandMore,
} from '@mui/icons-material';
import { Header } from './Header';
import { Footer } from './Footer';
import { FAQJsonLd } from '@/components/JsonLd';
import type { ComparisonData } from '@/lib/comparisons/comparisonData';

interface ComparisonLayoutProps {
  data: ComparisonData;
}

export default function ComparisonLayout({ data }: ComparisonLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <FAQJsonLd questions={data.faq} />
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero */}
        <Box
          sx={{
            position: 'relative',
            pt: { xs: 4, md: 6 },
            pb: { xs: 6, md: 8 },
            bgcolor: 'grey.100',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
            backgroundImage: 'radial-gradient(circle, #D1D5DB 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(0, 99, 151, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Link href="/compare" style={{ textDecoration: 'none' }}>
                <Button
                  startIcon={<ArrowBack />}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    bgcolor: 'background.paper',
                    px: 2,
                    '&:hover': { color: 'primary.main', bgcolor: 'background.paper', boxShadow: 1 },
                  }}
                >
                  All Comparisons
                </Button>
              </Link>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: 3,
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CompareArrows sx={{ fontSize: 40 }} />
              </Paper>
              <Box sx={{ flex: 1 }}>
                <Chip
                  label="Comparison Guide"
                  size="small"
                  sx={{ mb: 2, bgcolor: 'secondary.light', color: 'secondary.dark', fontWeight: 600 }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{ fontSize: { xs: 28, sm: 36, md: 44 }, mb: 2, fontWeight: 600 }}
                >
                  {data.title}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: 700, fontWeight: 400, fontSize: { xs: '1rem', md: '1.125rem' } }}
                >
                  {data.subtitle}
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Overview */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Typography variant="h3" component="h2" sx={{ mb: 3, fontSize: { xs: 22, md: 28 } }}>
            Overview
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 800, lineHeight: 1.8 }}>
            {data.overview}
          </Typography>

          {/* Comparison Table */}
          <Typography variant="h3" component="h2" sx={{ mb: 3, fontSize: { xs: 22, md: 28 } }}>
            Side-by-Side Comparison
          </Typography>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ mb: 6, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 700, width: '30%' }}>Feature</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{data.optionAName}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'secondary.dark' }}>{data.optionBName}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.comparisonTable.map((row, i) => (
                  <TableRow key={i} sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{row.feature}</TableCell>
                    <TableCell>{row.optionA}</TableCell>
                    <TableCell>{row.optionB}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pros and Cons */}
          <Typography variant="h3" component="h2" sx={{ mb: 3, fontSize: { xs: 22, md: 28 } }}>
            Pros &amp; Cons
          </Typography>
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {/* Option A */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                  {data.optionAName}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'success.dark', mb: 1.5, fontWeight: 700 }}>
                  Advantages
                </Typography>
                <Stack spacing={1} sx={{ mb: 3 }}>
                  {data.prosA.map((pro, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                      <CheckCircle sx={{ color: 'success.main', fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                      <Typography variant="body2">{pro.text}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Typography variant="subtitle2" sx={{ color: 'error.dark', mb: 1.5, fontWeight: 700 }}>
                  Disadvantages
                </Typography>
                <Stack spacing={1}>
                  {data.consA.map((con, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                      <Cancel sx={{ color: 'error.main', fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                      <Typography variant="body2">{con.text}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>

            {/* Option B */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'secondary.dark' }}>
                  {data.optionBName}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'success.dark', mb: 1.5, fontWeight: 700 }}>
                  Advantages
                </Typography>
                <Stack spacing={1} sx={{ mb: 3 }}>
                  {data.prosB.map((pro, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                      <CheckCircle sx={{ color: 'success.main', fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                      <Typography variant="body2">{pro.text}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Typography variant="subtitle2" sx={{ color: 'error.dark', mb: 1.5, fontWeight: 700 }}>
                  Disadvantages
                </Typography>
                <Stack spacing={1}>
                  {data.consB.map((con, i) => (
                    <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                      <Cancel sx={{ color: 'error.main', fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                      <Typography variant="body2">{con.text}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* When to Choose */}
          <Typography variant="h3" component="h2" sx={{ mb: 3, fontSize: { xs: 22, md: 28 } }}>
            When to Choose Each Option
          </Typography>
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'primary.light',
                  bgcolor: 'rgba(0, 99, 151, 0.03)',
                  height: '100%',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                  Choose {data.optionAName} if...
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {data.whenToChooseA}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'secondary.light',
                  bgcolor: 'rgba(16, 185, 129, 0.03)',
                  height: '100%',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'secondary.dark' }}>
                  Choose {data.optionBName} if...
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {data.whenToChooseB}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Bottom Line */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 6,
              borderRadius: 3,
              bgcolor: 'grey.900',
              color: 'white',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: 20, md: 24 } }}>
              The Bottom Line
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'grey.300' }}>
              {data.bottomLine}
            </Typography>
          </Paper>

          {/* Related Calculators */}
          <Typography variant="h3" component="h2" sx={{ mb: 3, fontSize: { xs: 22, md: 28 } }}>
            Run the Numbers
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {data.relatedCalculators.map((calc, i) => (
              <Grid key={i} size={{ xs: 12, sm: 4 }}>
                <Link href={`/calculators/${calc.slug}`} style={{ textDecoration: 'none' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 4px 16px rgba(0, 99, 151, 0.12)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                      {calc.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {calc.why}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        Try it free
                      </Typography>
                      <ArrowForward sx={{ fontSize: 16, color: 'primary.main' }} />
                    </Stack>
                  </Paper>
                </Link>
              </Grid>
            ))}
          </Grid>

          {/* FAQ */}
          <Typography variant="h3" component="h2" sx={{ mb: 3, fontSize: { xs: 22, md: 28 } }}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mb: 6 }}>
            {data.faq.map((item, i) => (
              <Accordion
                key={i}
                elevation={0}
                disableGutters
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px !important',
                  mb: 2,
                  '&:before': { display: 'none' },
                  overflow: 'hidden',
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 3, py: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {/* Disclaimer */}
          <Box sx={{ px: 2, py: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', lineHeight: 1.7 }}>
              <strong>Disclaimer:</strong> This comparison is for educational purposes only. Loan terms, rates, and eligibility vary by lender and are based on your complete financial profile. Dett.io is not a lender, broker, or financial advisor. Consult qualified professionals before making financial decisions. See our <a href="/terms" style={{ color: 'inherit' }}>Terms of Use</a> for full details.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
