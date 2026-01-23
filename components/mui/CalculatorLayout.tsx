'use client';

import Link from "next/link";
import { ReactNode } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import { ArrowBack, Calculate } from '@mui/icons-material';
import { Header } from './Header';
import { Footer } from './Footer';

interface CalculatorLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

// Dotted background pattern
const dottedBackground = {
  backgroundImage: `radial-gradient(circle, #D1D5DB 1px, transparent 1px)`,
  backgroundSize: '24px 24px',
};

export default function CalculatorLayout({ children, title, description }: CalculatorLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
              background: 'linear-gradient(135deg, rgba(0, 99, 151, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
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
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(0, 99, 151, 0.08) 100%)',
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
                      color: 'primary.main',
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
                  bgcolor: 'primary.main',
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

        {/* Calculator content with enhanced styling */}
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
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
