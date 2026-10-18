'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Stack,
} from '@mui/material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Box component="main" sx={{ flex: 1 }}>
        <Box
          sx={{
            pt: { xs: 6, md: 8 },
            pb: { xs: 6, md: 8 },
            bgcolor: 'grey.100',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 36, md: 48 } }}>
              About Dett.io
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 640 }}>
              Independent mortgage calculators with documented math — built because running the
              numbers on your biggest purchase shouldn&apos;t require handing over your email.
            </Typography>
          </Container>
        </Box>

        <Container
          maxWidth="md"
          sx={{
            py: { xs: 6, md: 8 },
            '& h2': { fontSize: { xs: 22, md: 26 }, fontWeight: 700, mt: 5, mb: 1.5 },
            '& p': { fontSize: '1rem', lineHeight: 1.8, color: 'text.secondary', mb: 2 },
            '& ul': { pl: 3, mb: 2, '& li': { fontSize: '1rem', lineHeight: 1.8, color: 'text.secondary', mb: 0.5 } },
          }}
        >
          <Stack spacing={0}>
            <h2>Who&apos;s behind this</h2>
            <p>
              Dett.io is built and operated by <strong>Skramco Holdings LLC</strong>, a Delaware
              limited liability company. We are a small team of software engineers who kept
              finding that the mortgage calculators ranking at the top of search results were
              designed to capture leads first and answer questions second — rate quotes behind
              email gates, &ldquo;results&rdquo; that trigger sales calls, and math that quietly
              flatters whichever loan product pays the referral fee.
            </p>
            <p>
              So we built the tool we wanted: calculators that use the same amortization math
              lenders use, show every formula behind every number, and never ask who you are.
            </p>

            <h2>Our independence</h2>
            <p>
              Dett.io is <strong>not</strong> a mortgage lender, broker, or advisor, and we are not
              owned by or affiliated with one. Specifically:
            </p>
            <ul>
              <li>We do not sell, rent, or share leads. There are no email gates or phone-number forms in front of any result.</li>
              <li>We do not accept payment from lenders to influence calculator results, defaults, or recommendations.</li>
              <li>Calculator inputs are processed in your browser and are not stored on our servers unless you explicitly email yourself a copy of your results.</li>
              <li>Where we link to external products or partners, those links are clearly labeled and never change the math.</li>
            </ul>

            <h2>How the math works</h2>
            <p>
              Every calculator documents its formulas, rate tables, and data sources — including
              Freddie Mac&apos;s Primary Mortgage Market Survey, FHFA loan limits, HUD&apos;s FHA
              mortgage insurance schedule, and the VA funding fee tables. Each calculator page
              shows when it was last reviewed. The full details are on our{' '}
              <Link href="/methodology" style={{ color: 'inherit' }}>Methodology page</Link>.
            </p>

            <h2>What we are not</h2>
            <p>
              We are engineers, not licensed financial professionals. Our calculators are
              educational tools that produce estimates — they are not loan offers,
              pre-qualifications, or financial advice. Before making decisions, compare official
              Loan Estimates from multiple lenders and consult qualified professionals. See our{' '}
              <Link href="/terms" style={{ color: 'inherit' }}>Terms of Use</Link> for full
              details.
            </p>

            <h2>Contact</h2>
            <p>
              Questions, corrections, or feedback? Email{' '}
              <a href="mailto:legal@dett.io" style={{ color: 'inherit' }}>legal@dett.io</a>. If you
              spot an error in our math, we want to know — accuracy is the whole point.
            </p>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
