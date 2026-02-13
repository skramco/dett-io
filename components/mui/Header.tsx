'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close,
  Calculate,
  MenuBook,
  ArrowForward,
} from '@mui/icons-material';
import Link from 'next/link';

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 72 } }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      lineHeight: 1,
                      letterSpacing: -1,
                    }}
                  >
                    D
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  component="span"
                  sx={{
                    fontWeight: 800,
                    color: 'text.primary',
                    letterSpacing: -0.5,
                    fontSize: '1.35rem',
                  }}
                >
                  Dett
                  <Box component="span" sx={{ color: 'primary.main', fontSize: '0.5rem', verticalAlign: 'super', ml: 0.25 }}>
                    .io
                  </Box>
                </Typography>
              </Stack>
            </Link>

            {/* Desktop Nav */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Link href="/calculators" style={{ textDecoration: 'none' }}>
                <Button
                  color="inherit"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
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
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
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
                  sx={{ ml: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  Get Started
                </Button>
              </Link>
            </Stack>

            {/* Mobile Hamburger */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Menu
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ px: 1, py: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/calculators"
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Calculate sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="Calculators"
                secondary="20 free mortgage tools"
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/learn"
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <MenuBook sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="Learn"
                secondary="Debt basics & glossary"
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Box sx={{ px: 2, mt: 'auto', pb: 3 }}>
          <Button
            component={Link}
            href="/calculators"
            variant="contained"
            fullWidth
            endIcon={<ArrowForward />}
            onClick={() => setDrawerOpen(false)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, py: 1.25 }}
          >
            Get Started
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
