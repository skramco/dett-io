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
  learn: [
    { label: 'About Debt', href: '/learn' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
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
            <Typography 
              variant="h5" 
              sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}
            >
              Dett
            </Typography>
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
              Learn
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.learn.map((link) => (
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
        
        <Box 
          sx={{ 
            mt: 6, 
            pt: 4, 
            borderTop: '1px solid', 
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Dett. All rights reserved.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Made with clarity in mind.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
