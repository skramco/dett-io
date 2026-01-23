'use client';

import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import {
  Calculate,
  TrendingDown,
  AttachMoney,
  Home,
  Autorenew,
  Savings,
  TrendingUp,
  Bolt,
  AccountBalance,
  TrackChanges,
  Schedule,
  BarChart,
  CalendarMonth,
} from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';

const calculatorCategories = [
  {
    category: "Buying a Home",
    description: "Starting your homeownership journey",
    calculators: [
      {
        id: "affordability",
        name: "How Much House Can I Afford?",
        description: "Calculate your max home price based on income, debts, and down payment.",
        icon: Home,
        href: "/calculators/affordability",
      },
      {
        id: "down-payment",
        name: "Down Payment Strategy",
        description: "Compare different down payment amounts and see PMI costs.",
        icon: AttachMoney,
        href: "/calculators/down-payment",
      },
      {
        id: "rent-vs-buy",
        name: "Rent vs Buy Analysis",
        description: "Full comparison including rent inflation and home appreciation.",
        icon: TrendingUp,
        href: "/calculators/rent-vs-buy",
      },
    ],
  },
  {
    category: "Current Homeowners",
    description: "Already own? Optimize your mortgage",
    calculators: [
      {
        id: "mortgage-cost",
        name: "True Monthly Cost",
        description: "See your real monthly payment including PITI, HOA, and PMI.",
        icon: Calculate,
        href: "/calculators/mortgage-cost",
      },
      {
        id: "refinance",
        name: "Refinance Break-Even",
        description: "Compare your current loan vs refinancing.",
        icon: Autorenew,
        href: "/calculators/refinance",
      },
      {
        id: "cash-out-refi",
        name: "Cash-Out Refinance",
        description: "Understand the true cost of pulling cash from your home.",
        icon: AccountBalance,
        href: "/calculators/cash-out-refi",
      },
      {
        id: "recast-vs-refi",
        name: "Recast vs Refinance",
        description: "Compare lump-sum recast, refinance, and simple prepayment.",
        icon: TrackChanges,
        href: "/calculators/recast-vs-refi",
      },
    ],
  },
  {
    category: "Rate & Structure",
    description: "Choosing the right loan structure",
    calculators: [
      {
        id: "points-buydown",
        name: "Points & Buydown",
        description: "Compare par rate, buying points, and lender credits.",
        icon: Bolt,
        href: "/calculators/points-buydown",
      },
      {
        id: "arm-vs-fixed",
        name: "ARM vs Fixed",
        description: "Model rate caps and adjustment timelines.",
        icon: TrendingDown,
        href: "/calculators/arm-vs-fixed",
      },
      {
        id: "timeline-simulator",
        name: "Decision Timeline",
        description: "Find the best mortgage structure for your timeline.",
        icon: Schedule,
        href: "/calculators/timeline-simulator",
      },
    ],
  },
  {
    category: "Payoff Strategy",
    description: "Pay off faster or build wealth?",
    calculators: [
      {
        id: "extra-payment",
        name: "Extra Payment Impact",
        description: "See how extra payments save interest and shorten your loan.",
        icon: Savings,
        href: "/calculators/extra-payment",
      },
      {
        id: "acceleration",
        name: "Acceleration Planner",
        description: "Compare prepayment, recast, and refinance strategies.",
        icon: TrendingUp,
        href: "/calculators/acceleration",
      },
      {
        id: "biweekly",
        name: "Biweekly Payments",
        description: "See the truth about biweekly payment programs.",
        icon: CalendarMonth,
        href: "/calculators/biweekly",
      },
    ],
  },
  {
    category: "Advanced Analysis",
    description: "Power user tools",
    calculators: [
      {
        id: "interest-sensitivity",
        name: "Rate Sensitivity",
        description: "See how rate changes affect your payment and total cost.",
        icon: BarChart,
        href: "/calculators/interest-sensitivity",
      },
    ],
  },
];

export default function CalculatorsPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Box component="main" sx={{ flex: 1 }}>
        {/* Hero Section */}
        <Box 
          sx={{ 
            pt: { xs: 6, md: 8 },
            pb: { xs: 8, md: 10 },
            bgcolor: 'grey.100',
            borderBottomLeftRadius: { xs: 24, md: 40 },
            borderBottomRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Chip
                label="100% Free • No Signup Required"
                variant="outlined"
                sx={{ 
                  px: 2, 
                  py: 2.5,
                  bgcolor: 'background.paper',
                }}
              />
              
              <Typography 
                variant="h1" 
                component="h1"
                sx={{ 
                  maxWidth: 800,
                  fontSize: { xs: 36, sm: 48, md: 56 },
                }}
              >
                Mortgage Calculators
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ maxWidth: 600, fontWeight: 400 }}
              >
                Crystal-clear calculators that show you the real numbers. Pick one and start calculating.
              </Typography>
            </Stack>
          </Container>
        </Box>

        {/* Calculator Categories */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Stack spacing={8}>
            {calculatorCategories.map((category, categoryIndex) => (
              <Box key={categoryIndex}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 }, mb: 1 }}>
                    {category.category}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                    {category.description}
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  {category.calculators.map((calc) => {
                    const Icon = calc.icon;
                    return (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={calc.id}>
                        <Link href={calc.href} style={{ textDecoration: 'none' }}>
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
                                <Icon sx={{ color: 'primary.main' }} />
                              </Avatar>
                              <Typography 
                                variant="h4" 
                                gutterBottom 
                                className="card-title"
                                sx={{ transition: 'color 0.2s' }}
                              >
                                {calc.name}
                              </Typography>
                              <Typography variant="body1" color="text.secondary">
                                {calc.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Link>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ))}
          </Stack>
        </Container>

        {/* CTA Section */}
        <Box 
          sx={{ 
            py: { xs: 8, md: 10 }, 
            bgcolor: 'primary.main',
            borderTopLeftRadius: { xs: 24, md: 40 },
            borderTopRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="md">
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography 
                variant="h2" 
                sx={{ color: 'white', fontSize: { xs: 32, md: 40 } }}
              >
                Not sure where to start?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ color: 'primary.light', maxWidth: 500, fontWeight: 400 }}
              >
                Learn the fundamentals of debt, interest, and how lenders think about your money.
              </Typography>
              <Link href="/learn" style={{ textDecoration: 'none' }}>
                <Box
                  component="button"
                  sx={{
                    mt: 2,
                    px: 4,
                    py: 1.75,
                    bgcolor: 'white',
                    color: 'primary.main',
                    border: 'none',
                    borderRadius: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Learn About Debt
                </Box>
              </Link>
            </Stack>
          </Container>
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
}

