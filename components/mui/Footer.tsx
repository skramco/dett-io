'use client';

import { Box, Container, Typography, Grid, Stack, Divider } from '@mui/material';
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
    { label: 'Learn About Debt', href: '/learn' },
  ],
  legal: [
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
              Free mortgage calculators. No ads, no lead capture, no BS. Built to help, not to sell.
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Calculators
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.calculators.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  style={{ textDecoration: 'none' }}
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
            <Stack spacing={1.5}>
              {footerLinks.resources.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  style={{ textDecoration: 'none' }}
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
              Legal
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  style={{ textDecoration: 'none' }}
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
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', lineHeight: 1.7, maxWidth: 900 }}>
            <strong>Disclaimer:</strong> Dett.io is an educational resource operated by Skramco Holdings LLC. Dett.io is not a mortgage lender, broker, financial advisor, or licensed professional of any kind. All calculator results, estimates, and content are for informational and educational purposes only and do not constitute financial, legal, or tax advice. Actual mortgage terms, rates, and eligibility are determined by lenders based on your complete financial profile. Consult qualified professionals before making financial decisions. See our{' '}
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
          <Typography variant="caption" color="text.disabled">
            © {new Date().getFullYear()} Skramco Holdings LLC d/b/a Dett.io. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="/privacy" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}>
                Privacy
              </Typography>
            </Link>
            <Link href="/terms" style={{ textDecoration: 'none' }}>
              <Typography variant="caption" sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}>
                Terms
              </Typography>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
