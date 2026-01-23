'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import {
  BarChart,
  CheckCircle,
  MenuBook,
  AttachMoney,
  Autorenew,
  Bolt,
  ArrowForward,
} from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';

// SaaSable-inspired dotted background pattern
const dottedBackground = {
  backgroundImage: `radial-gradient(circle, #D1D5DB 1px, transparent 1px)`,
  backgroundSize: '24px 24px',
};

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero Section - SaaSable inspired with rounded bottom corners */}
        <Box 
          sx={{ 
            position: 'relative',
            pt: { xs: 8, md: 12 },
            pb: { xs: 10, md: 14 },
            bgcolor: 'grey.100',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
            ...dottedBackground,
          }}
        >
          <Container maxWidth="md">
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Chip
                label="100% Free • No Signup • No Spam"
                variant="outlined"
                sx={{ 
                  px: 2, 
                  py: 2.5,
                  bgcolor: 'background.paper',
                  '& .MuiChip-label': {
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'text.secondary',
                  }
                }}
              />
              
              <Typography 
                variant="h1" 
                component="h1"
                sx={{ 
                  maxWidth: 700,
                  fontSize: { xs: 36, sm: 48, md: 56 },
                }}
              >
                Make Smarter{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  Mortgage Decisions
                </Box>
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ maxWidth: 560, fontWeight: 400 }}
              >
                Crystal-clear calculators. No hidden fees. No email required. Just honest math to help you decide.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                <Button
                  component={Link}
                  href="/calculators"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                >
                  Start Calculating
                </Button>
                <Button
                  component={Link}
                  href="/learn"
                  variant="outlined"
                  size="large"
                  sx={{ 
                    borderColor: 'grey.300', 
                    color: 'text.primary',
                    bgcolor: 'background.paper',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'background.paper',
                    }
                  }}
                >
                  Learn the Basics
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* Why Dett Section */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Stack spacing={{ xs: 5, md: 7 }}>
              <Box textAlign="center">
                <Typography variant="h2" gutterBottom sx={{ fontSize: { xs: 32, md: 44 } }}>
                  Why Dett?
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                  Your first stop for mortgage decisions. No pressure, just clarity.
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {[
                  {
                    icon: <BarChart />,
                    iconBg: 'primary.light',
                    iconColor: 'primary.main',
                    title: 'Real Numbers',
                    description: 'See the full picture: principal, interest, taxes, insurance, HOA, PMI. Not just the pretty parts lenders show you.',
                  },
                  {
                    icon: <CheckCircle />,
                    iconBg: 'secondary.light',
                    iconColor: 'secondary.main',
                    title: 'Zero BS',
                    description: '100% free. No email required. No lead forms. No sales calls. No tricks. Just tools that actually help you.',
                  },
                  {
                    icon: <MenuBook />,
                    iconBg: 'primary.light',
                    iconColor: 'primary.main',
                    title: 'Learn First',
                    description: 'Understand how debt works before you commit. Knowledge is power, especially with your biggest purchase.',
                  },
                ].map((item, index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <Card sx={{ height: '100%', p: 1 }}>
                      <CardContent>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: item.iconBg,
                            mb: 3,
                          }}
                        >
                          <Box sx={{ color: item.iconColor, display: 'flex' }}>
                            {item.icon}
                          </Box>
                        </Avatar>
                        <Typography variant="h4" gutterBottom>
                          {item.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {item.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Container>
        </Box>

        {/* Popular Calculators Section */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
          <Container maxWidth="lg">
            <Stack spacing={{ xs: 5, md: 7 }}>
              <Box textAlign="center">
                <Typography variant="h2" gutterBottom sx={{ fontSize: { xs: 32, md: 44 } }}>
                  Popular Calculators
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                  Pick a question, get an answer. It's that simple.
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                {[
                  {
                    href: '/calculators/mortgage-cost',
                    icon: <AttachMoney />,
                    title: 'True Monthly Cost',
                    description: 'See your real payment including all fees',
                  },
                  {
                    href: '/calculators/refinance',
                    icon: <Autorenew />,
                    title: 'Refinance Worth It?',
                    description: 'Calculate break-even point and savings',
                  },
                  {
                    href: '/calculators/extra-payment',
                    icon: <Bolt />,
                    title: 'Extra Payments',
                    description: 'Pay off faster or invest? See the math',
                  },
                ].map((item, index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <Link href={item.href} style={{ textDecoration: 'none' }}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          p: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: 'primary.main',
                            '& .card-title': {
                              color: 'primary.main',
                            },
                          },
                        }}
                      >
                        <CardContent>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: 'primary.light',
                              mb: 3,
                            }}
                          >
                            <Box sx={{ color: 'primary.main', display: 'flex' }}>
                              {item.icon}
                            </Box>
                          </Avatar>
                          <Typography 
                            variant="h4" 
                            gutterBottom 
                            className="card-title"
                            sx={{ transition: 'color 0.2s' }}
                          >
                            {item.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {item.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
              
              <Box textAlign="center">
                <Button
                  component={Link}
                  href="/calculators"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                >
                  View All Calculators
                </Button>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Final CTA Section */}
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 }, 
            bgcolor: 'primary.main',
            borderTopLeftRadius: { xs: 24, md: 40 },
            borderTopRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="md">
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Typography 
                variant="h2" 
                sx={{ color: 'white', fontSize: { xs: 32, md: 44 } }}
              >
                Ready to Make Smarter Decisions?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ color: 'primary.light', maxWidth: 500, fontWeight: 400 }}
              >
                Start with any calculator. No signup, no spam, no strings attached.
              </Typography>
              <Button
                component={Link}
                href="/calculators"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                Get Started Free
              </Button>
            </Stack>
          </Container>
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
}
