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
            overflow: 'hidden',
          }}
        >
          {/* Decorative floating elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              right: '5%',
              width: { xs: 80, md: 120 },
              height: { xs: 80, md: 120 },
              borderRadius: '50%',
              bgcolor: 'primary.light',
              opacity: 0.3,
              display: { xs: 'none', md: 'block' },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              left: '8%',
              width: { xs: 60, md: 100 },
              height: { xs: 60, md: 100 },
              borderRadius: '50%',
              bgcolor: 'secondary.light',
              opacity: 0.3,
              display: { xs: 'none', md: 'block' },
            }}
          />

          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              {/* Left side - Text content */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }} textAlign={{ xs: 'center', md: 'left' }}>
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
                    sx={{ fontWeight: 400 }}
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
              </Grid>

              {/* Right side - Visual representation */}
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Central calculator card mockup */}
                  <Card
                    sx={{
                      width: '100%',
                      maxWidth: 400,
                      p: 3,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                      transform: 'rotate(-2deg)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'rotate(0deg) scale(1.02)',
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                          <AttachMoney />
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          Mortgage Calculator
                        </Typography>
                      </Box>
                      
                      <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Loan Amount
                        </Typography>
                        <Typography variant="h5" fontWeight={600}>
                          $450,000
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid size={6}>
                          <Box sx={{ bgcolor: 'grey.100', p: 1.5, borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Rate
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              6.5%
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={6}>
                          <Box sx={{ bgcolor: 'grey.100', p: 1.5, borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Term
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              30 years
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'white', 
                          p: 2, 
                          borderRadius: 2,
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Monthly Payment
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          $2,844
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>

                  {/* Floating icon badges */}
                  <Avatar
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 40,
                      bgcolor: 'secondary.main',
                      width: 60,
                      height: 60,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' },
                      },
                    }}
                  >
                    <BarChart sx={{ fontSize: 32 }} />
                  </Avatar>

                  <Avatar
                    sx={{
                      position: 'absolute',
                      bottom: 40,
                      left: 20,
                      bgcolor: 'primary.light',
                      color: 'primary.main',
                      width: 50,
                      height: 50,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      animation: 'float 3s ease-in-out infinite 1s',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' },
                      },
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 28 }} />
                  </Avatar>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Social Proof Section */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack spacing={2}>
                  <Typography variant="overline" color="primary.main" fontWeight={600}>
                    Trusted by Home Buyers
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 } }}>
                    Real people making smarter decisions
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
                    Join thousands who've used our calculators to understand their mortgage options before talking to a lender.
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <Grid container spacing={2}>
                  {[
                    { name: 'Sarah M.', role: 'First-time buyer', initial: 'S', color: 'primary.main' },
                    { name: 'James K.', role: 'Refinancing', initial: 'J', color: 'secondary.main' },
                    { name: 'Maria R.', role: 'Investment property', initial: 'M', color: 'primary.main' },
                    { name: 'David L.', role: 'Home upgrade', initial: 'D', color: 'secondary.main' },
                  ].map((person, index) => (
                    <Grid size={{ xs: 6, sm: 3 }} key={index}>
                      <Stack alignItems="center" spacing={1}>
                        <Avatar
                          sx={{
                            width: { xs: 60, md: 80 },
                            height: { xs: 60, md: 80 },
                            bgcolor: person.color,
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            fontWeight: 600,
                          }}
                        >
                          {person.initial}
                        </Avatar>
                        <Box textAlign="center">
                          <Typography variant="body2" fontWeight={600}>
                            {person.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {person.role}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
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
