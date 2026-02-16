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
import dynamic from 'next/dynamic';
const CalculatorWizard = dynamic(
  () => import('@/components/mui/calculator/CalculatorWizard').then((mod) => ({ default: mod.CalculatorWizard })),
  { ssr: false }
);
import { OrganizationJsonLd, WebSiteJsonLd, FAQJsonLd } from '@/components/JsonLd';

// SaaSable-inspired dotted background pattern
const dottedBackground = {
  backgroundImage: `radial-gradient(circle, #D1D5DB 1px, transparent 1px)`,
  backgroundSize: '24px 24px',
};

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <FAQJsonLd
        questions={[
          { question: 'How accurate are these mortgage calculators?', answer: 'Our calculators use the same amortization formulas that lenders use. Results are estimates based on the inputs you provide — actual rates, taxes, and insurance will vary by lender and location. Use our tools to get a realistic range before shopping for a loan.' },
          { question: 'Do I need to create an account?', answer: 'No. Every calculator on Dett.io works instantly with zero signup. You can optionally email yourself a copy of your results, but it is never required.' },
          { question: 'What is a good debt-to-income ratio for a mortgage?', answer: 'Most lenders prefer a total DTI below 43%, though FHA loans allow up to 50% in some cases. Use our DTI calculator to check where you stand before applying.' },
          { question: 'How much house can I afford on my salary?', answer: 'A common guideline is 3 to 4.5 times your annual gross income, but the real answer depends on your debts, down payment, interest rate, and local property taxes. Our affordability calculator factors in all of these variables.' },
          { question: 'Should I put 20% down on a house?', answer: 'Putting 20% down eliminates PMI, which saves hundreds per month. But it is not always the best strategy — our down payment calculator compares 5%, 10%, and 20% scenarios so you can see the tradeoffs.' },
        ]}
      />
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
          {/* Subtle decorative gradient orbs */}
          <Box
            sx={{
              position: 'absolute',
              top: '-10%',
              right: '-5%',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
              display: { xs: 'none', md: 'block' },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-15%',
              left: '-5%',
              width: 250,
              height: 250,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
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

              {/* Right side - Stacked stat cards */}
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box sx={{ position: 'relative', height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Main card */}
                  <Card
                    sx={{
                      width: '100%',
                      maxWidth: 380,
                      p: 0,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Card header */}
                    <Box sx={{ bgcolor: 'primary.main', px: 3, py: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.4)' }} />
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.4)' }} />
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.4)' }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                          dett.io/calculators/mortgage-cost
                        </Typography>
                      </Stack>
                    </Box>
                    <Stack spacing={0} sx={{ p: 3 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Your True Monthly Cost
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', my: 1 }}>
                        $2,847
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        {[
                          { label: 'Principal & Interest', value: '$2,271', pct: 80 },
                          { label: 'Property Tax', value: '$313', pct: 11 },
                          { label: 'Insurance', value: '$146', pct: 5 },
                          { label: 'PMI', value: '$117', pct: 4 },
                        ].map((item) => (
                          <Box key={item.label}>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.25 }}>
                              <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                              <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                            </Stack>
                            <Box sx={{ height: 4, bgcolor: 'grey.100', borderRadius: 2, overflow: 'hidden' }}>
                              <Box sx={{ height: '100%', width: `${item.pct}%`, bgcolor: 'primary.main', borderRadius: 2, opacity: 0.15 + (item.pct / 100) * 0.85 }} />
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </Stack>
                  </Card>

                  {/* Floating insight card - top right */}
                  <Card
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: -10,
                      px: 2,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      animation: 'floatUp 4s ease-in-out infinite',
                      '@keyframes floatUp': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-8px)' },
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>No hidden fees</Typography>
                    </Stack>
                  </Card>

                  {/* Floating insight card - bottom left */}
                  <Card
                    sx={{
                      position: 'absolute',
                      bottom: 30,
                      left: -20,
                      px: 2,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      animation: 'floatUp 4s ease-in-out infinite 1.5s',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BarChart sx={{ color: 'primary.main', fontSize: 18 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>20 calculators</Typography>
                    </Stack>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Stats Bar */}
        <Box sx={{ py: { xs: 4, md: 5 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="center">
              {[
                { value: '20', label: 'Free Calculators', suffix: '' },
                { value: '100', label: 'Free Forever', suffix: '%' },
                { value: '0', label: 'Emails Required', suffix: '' },
                { value: '0', label: 'Hidden Fees', suffix: '' },
              ].map((stat, i) => (
                <Grid size={{ xs: 6, sm: 3 }} key={i}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', fontSize: { xs: 32, md: 40 } }}>
                      {stat.value}{stat.suffix}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Calculator Wizard */}
        <Box
          sx={{
            py: { xs: 8, md: 10 },
            bgcolor: 'primary.main',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle pattern overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <Container maxWidth="md" sx={{ position: 'relative' }}>
            <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 5 }}>
              <Chip
                label="Interactive Guide"
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600 }}
              />
              <Typography
                variant="h2"
                sx={{ color: 'white', fontSize: { xs: 32, md: 40 } }}
              >
                Not sure where to start?
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, fontWeight: 400 }}
              >
                Answer a couple questions and we'll point you to the right calculator.
              </Typography>
            </Stack>
            <CalculatorWizard />
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

        {/* About / SEO Content Section */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 5, md: 8 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h2" gutterBottom sx={{ fontSize: { xs: 28, md: 36 } }}>
                  Why Free Mortgage Calculators Matter
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    A mortgage is the largest financial commitment most people will ever make. The difference between a 6.5% and 7% interest rate on a $400,000 loan is over $40,000 in total interest — yet most borrowers never run the numbers before signing. Dett.io exists to change that.
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    Our free mortgage calculators help you understand the true cost of homeownership before you talk to a lender. Calculate your monthly mortgage payment with taxes, insurance, PMI, and HOA fees included. Check how much house you can afford based on your income and debts. Compare refinancing scenarios to see if switching loans actually saves money after closing costs.
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    Unlike most mortgage sites, we don't collect your information or sell leads. There are no email gates, no phone number forms, and no sales calls. Every calculator is completely free, works instantly in your browser, and gives you honest results you can trust.
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h2" gutterBottom sx={{ fontSize: { xs: 28, md: 36 } }}>
                  Frequently Asked Questions
                </Typography>
                <Stack spacing={3}>
                  {[
                    {
                      q: 'How accurate are these mortgage calculators?',
                      a: 'Our calculators use the same amortization formulas that lenders use. Results are estimates based on the inputs you provide — actual rates, taxes, and insurance will vary by lender and location. Use our tools to get a realistic range before shopping for a loan.',
                    },
                    {
                      q: 'Do I need to create an account?',
                      a: 'No. Every calculator on Dett.io works instantly with zero signup. You can optionally email yourself a copy of your results, but it is never required.',
                    },
                    {
                      q: 'What is a good debt-to-income ratio for a mortgage?',
                      a: 'Most lenders prefer a total DTI below 43%, though FHA loans allow up to 50% in some cases. Use our DTI calculator to check where you stand before applying.',
                    },
                    {
                      q: 'How much house can I afford on my salary?',
                      a: 'A common guideline is 3 to 4.5 times your annual gross income, but the real answer depends on your debts, down payment, interest rate, and local property taxes. Our affordability calculator factors in all of these variables.',
                    },
                    {
                      q: 'Should I put 20% down on a house?',
                      a: 'Putting 20% down eliminates PMI, which saves hundreds per month. But it is not always the best strategy — our down payment calculator compares 5%, 10%, and 20% scenarios so you can see the tradeoffs.',
                    },
                  ].map((faq, i) => (
                    <Box key={i}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {faq.q}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {faq.a}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            </Grid>
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
