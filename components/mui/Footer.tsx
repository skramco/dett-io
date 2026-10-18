'use client';

import { Box, Container, Typography, Grid, Stack } from '@mui/material';
import Link from 'next/link';

const footerLinks = {
  calculators: [
    { label: 'Refinance', href: '/calculators/refinance' },
    { label: 'Extra Payments', href: '/calculators/extra-payment' },
    { label: 'Rent vs Buy', href: '/calculators/rent-vs-buy' },
    { label: 'View All', href: '/calculators' },
  ],
  resources: [
    { label: 'Mortgage Guides', href: '/guides' },
    { label: 'Loan Comparisons', href: '/compare' },
    { label: 'Learn About Debt', href: '/learn' },
    { label: 'Embed Calculators', href: '/partners' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Methodology', href: '/methodology' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.50',
        borderTop: '1px solid',
        borderColor: 'divider',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="dett.io"
              sx={{ height: 32, display: 'block', mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
              Free, independent mortgage calculators with documented formulas and cited data
              sources. Built by Knowe LLC — not a lender, and we don&apos;t sell leads.
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Calculators
            </Typography>
            <Stack spacing={0}>
              {footerLinks.calculators.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: 44 }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                      transition: 'color 0.2s',
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Resources
            </Typography>
            <Stack spacing={0}>
              {footerLinks.resources.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: 44 }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                      transition: 'color 0.2s',
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Company
            </Typography>
            <Stack spacing={0}>
              {footerLinks.company.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', minHeight: 44 }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                      transition: 'color 0.2s',
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Legal Disclaimer */}
        <Box sx={{ mt: 5, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.8125rem', lineHeight: 1.7, maxWidth: 900 }}>
            <strong>Disclaimer:</strong> Dett.io is an educational resource operated by Knowe LLC. Dett.io is not a mortgage lender, broker, financial advisor, or licensed professional of any kind. All calculator results, estimates, and content are for informational and educational purposes only and do not constitute financial, legal, or tax advice. Actual mortgage terms, rates, and eligibility are determined by lenders based on your complete financial profile. Consult qualified professionals before making financial decisions. See our{' '}
            <Link href="/terms" style={{ color: 'inherit' }}>Terms of Use</Link>{' '}and{' '}
            <Link href="/privacy" style={{ color: 'inherit' }}>Privacy Policy</Link>{' '}for full details.
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            mt: 3, 
            pt: 3, 
            borderTop: '1px solid', 
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} Knowe LLC. All rights reserved.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <Link
                href="https://knowe.one"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit' }}
              >
                Dett.io is a Knowe LLC company
              </Link>
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Link href="/about" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                About
              </Typography>
            </Link>
            <Link href="/privacy" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                Privacy
              </Typography>
            </Link>
            <Link href="/terms" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                Terms
              </Typography>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
