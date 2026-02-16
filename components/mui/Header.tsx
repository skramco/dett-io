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
  Article,
  ArrowForward,
  CompareArrows,
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
              <Box
                component="img"
                src="/logo.png"
                alt="dett.io"
                sx={{ height: { xs: 32, md: 36 }, display: 'block' }}
              />
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
              <Link href="/guides" style={{ textDecoration: 'none' }}>
                <Button
                  color="inherit"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                  }}
                >
                  Guides
                </Button>
              </Link>
              <Link href="/compare" style={{ textDecoration: 'none' }}>
                <Button
                  color="inherit"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
                  }}
                >
                  Compare
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
              href="/guides"
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Article sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="Guides"
                secondary="Salary, decision & cost guides"
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href="/compare"
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CompareArrows sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="Compare"
                secondary="Side-by-side loan comparisons"
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
