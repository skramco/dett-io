'use client';

import { AppBar, Toolbar, Typography, Button, Container, Box, Stack } from '@mui/material';
import Link from 'next/link';

export function Header() {
  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 72 } }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h5"
              component="span"
              sx={{ 
                fontWeight: 700, 
                color: 'primary.main',
                letterSpacing: -0.5,
              }}
            >
              Dett
            </Typography>
          </Link>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Link href="/calculators" style={{ textDecoration: 'none' }}>
              <Button 
                color="inherit" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                }}
              >
                Calculators
              </Button>
            </Link>
            <Link href="/learn" style={{ textDecoration: 'none' }}>
              <Button 
                color="inherit" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                }}
              >
                Learn
              </Button>
            </Link>
            <Link href="/calculators" style={{ textDecoration: 'none' }}>
              <Button 
                variant="contained" 
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              >
                Get Started
              </Button>
            </Link>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
