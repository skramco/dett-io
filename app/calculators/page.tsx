'use client';

import { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
  CheckCircle,
  ArrowForward,
  Shield,
} from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';
import { CalculatorWizard } from '@/components/mui/calculator/CalculatorWizard';

const calculatorDetails = {
  affordability: {
    outputs: ['Maximum home price you can afford', 'Recommended monthly payment range', 'Down payment needed', 'Estimated closing costs', 'Debt-to-income ratio analysis'],
    value: 'Prevents you from overextending financially and helps you shop within a realistic budget. Shows exactly how much house you can afford based on your income, debts, and down payment.',
  },
  'down-payment': {
    outputs: ['Monthly payment comparison at different down payment levels', 'PMI costs and when it drops off', 'Total interest paid over loan life', 'Break-even analysis for larger down payments'],
    value: 'Helps you decide whether to put down 5%, 10%, or 20%. Shows the real cost of PMI and how much you save in interest with a larger down payment.',
  },
  'rent-vs-buy': {
    outputs: ['5-year cost comparison', 'Break-even timeline', 'Wealth accumulation projection', 'Tax benefit analysis', 'Opportunity cost of down payment'],
    value: 'Answers the biggest question: should you rent or buy? Includes rent inflation, home appreciation, maintenance costs, and investment alternatives.',
  },
  'mortgage-cost': {
    outputs: ['True monthly payment (PITI + HOA + PMI)', 'Principal and interest breakdown', 'Annual housing costs', 'Percentage of income going to housing'],
    value: 'Shows your REAL monthly payment including all the costs lenders don\'t emphasize. No surprises when you see your first mortgage statement.',
  },
  refinance: {
    outputs: ['Monthly payment savings', 'Break-even point in months', 'Total interest saved over loan life', 'Closing cost analysis', 'Net benefit calculation'],
    value: 'Tells you if refinancing is worth it. Shows exactly when you\'ll break even on closing costs and how much you\'ll save long-term.',
  },
  'cash-out-refi': {
    outputs: ['New monthly payment', 'Cash received', 'True cost of cash (APR)', 'Comparison to HELOC or personal loan', 'Long-term cost analysis'],
    value: 'Shows the real cost of pulling equity from your home. Helps you decide if cash-out refinancing beats other borrowing options.',
  },
  'recast-vs-refi': {
    outputs: ['Monthly payment reduction for each option', 'Total costs comparison', 'Interest savings analysis', 'Best option recommendation based on your timeline'],
    value: 'Compares three ways to use a lump sum: (1) Recast - make a large principal payment and have your lender recalculate a lower monthly payment for a small fee (~$250), (2) Refinance - get a new loan with better terms but pay closing costs (~2-5% of loan), or (3) Prepay Only - make principal-only payments to save interest without changing your monthly payment. Shows which strategy saves you the most money based on your situation.',
  },
  'points-buydown': {
    outputs: ['Break-even timeline for buying points', 'Total interest saved', 'Effective interest rate', 'Comparison: points vs. lender credits'],
    value: 'Answers whether you should pay points to lower your rate. Shows exactly when you\'ll break even and if it\'s worth the upfront cost.',
  },
  'arm-vs-fixed': {
    outputs: ['Payment comparison over time', 'Worst-case scenario with rate caps', 'Break-even analysis', 'Total cost comparison at different timelines'],
    value: 'Models how an ARM could adjust over time vs. a fixed rate. Shows if the lower initial rate is worth the risk based on how long you\'ll keep the loan.',
  },
  'timeline-simulator': {
    outputs: ['Best loan structure for your timeline', 'Cost comparison: 15-year vs. 30-year vs. ARM', 'Total interest paid', 'Optimal strategy recommendation'],
    value: 'Matches your loan structure to your life plans. If you\'re moving in 5 years, you need different advice than someone staying 30 years.',
  },
  'extra-payment': {
    outputs: ['Years saved on loan term', 'Total interest saved', 'New payoff date', 'Monthly vs. annual extra payment comparison'],
    value: 'Shows the dramatic impact of extra payments. See how paying just $200 extra per month can save you years and tens of thousands in interest.',
  },
  acceleration: {
    outputs: ['Comparison of prepayment strategies', 'Optimal acceleration plan', 'Interest savings for each strategy', 'Payoff timeline comparison'],
    value: 'Compares different ways to pay off your mortgage faster: extra monthly payments, annual lump sums, biweekly payments, or refinancing to a shorter term.',
  },
  biweekly: {
    outputs: ['True savings from biweekly payments', 'Comparison to monthly extra payments', 'Program fee analysis', 'DIY biweekly strategy'],
    value: 'Exposes the truth about biweekly payment programs. Shows you can get the same benefit by making one extra payment per year without paying fees.',
  },
  'interest-sensitivity': {
    outputs: ['Payment change per 0.25% rate change', 'Total cost at different rates', 'Rate lock decision analysis', 'Refinance trigger points'],
    value: 'Shows how sensitive your payment is to rate changes. Helps you decide if you should lock your rate now or wait, and when refinancing makes sense.',
  },
  amortization: {
    outputs: ['Complete month-by-month payment schedule', 'Principal vs interest breakdown per payment', 'Yearly summary with running balance', 'Impact of extra payments on payoff timeline', 'Cumulative interest and principal totals'],
    value: 'See exactly where every dollar of your mortgage payment goes. The full amortization table shows how your balance decreases over time and how much of each payment is interest vs principal.',
  },
  dti: {
    outputs: ['Front-end DTI ratio (housing only)', 'Back-end DTI ratio (all debts)', 'Qualification status for Conventional, FHA, VA loans', 'Debt breakdown visualization', 'Maximum housing payment at each DTI threshold'],
    value: 'DTI is the #1 factor lenders use to determine how much mortgage you qualify for. See both your front-end and back-end ratios and understand exactly what lenders see.',
  },
  'closing-costs': {
    outputs: ['Itemized closing cost estimate', 'Lender fees vs third-party fees', 'Prepaid items breakdown', 'Total cash needed at closing', 'Seller credit scenarios'],
    value: 'Closing costs are 2-5% of your home price and often catch buyers off guard. Get a detailed estimate so you know exactly how much cash you need beyond your down payment.',
  },
  pmi: {
    outputs: ['Monthly PMI cost by credit score', 'When PMI drops off automatically', 'PMI at different down payment levels', 'Total lifetime PMI cost', 'How to request early PMI removal'],
    value: 'PMI is required when you put less than 20% down. See exactly how much it costs, when it drops off, and whether a larger down payment is worth it to avoid PMI.',
  },
  fha: {
    outputs: ['Total monthly FHA payment with MIP', 'Upfront & monthly MIP costs', 'FHA eligibility check (credit, DTI, down payment)', 'FHA vs Conventional comparison', 'MIP duration and total cost'],
    value: 'FHA loans allow as little as 3.5% down with a 580+ credit score. See your full payment including mortgage insurance and whether FHA or conventional is the better deal.',
  },
  va: {
    outputs: ['Total monthly VA payment (no PMI)', 'VA funding fee calculation', 'VA vs FHA vs Conventional comparison', 'DTI and residual income check', 'Funding fee by down payment tier'],
    value: 'VA loans offer $0 down and no PMI — the best mortgage benefit available. See your funding fee, compare loan types, and understand the full financial advantage of your VA benefit.',
  },
};

const categoryColors: Record<string, { bg: string; fg: string }> = {
  'Buying a Home': { bg: '#EBF5FF', fg: '#006397' },
  'Current Homeowners': { bg: '#FFF7ED', fg: '#C2410C' },
  'Rate & Structure': { bg: '#F0FDF4', fg: '#15803D' },
  'Payoff Strategy': { bg: '#FAF5FF', fg: '#7E22CE' },
  'Advanced Analysis': { bg: '#FEF2F2', fg: '#B91C1C' },
};

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
      {
        id: "dti",
        name: "DTI Calculator",
        description: "Check your debt-to-income ratio — the #1 number lenders care about.",
        icon: BarChart,
        href: "/calculators/dti",
      },
      {
        id: "closing-costs",
        name: "Closing Cost Estimator",
        description: "Estimate your total closing costs and cash needed at the table.",
        icon: AttachMoney,
        href: "/calculators/closing-costs",
      },
      {
        id: "pmi",
        name: "PMI Calculator",
        description: "See your PMI cost and when it drops off based on credit score.",
        icon: AccountBalance,
        href: "/calculators/pmi",
      },
      {
        id: "fha",
        name: "FHA Loan Calculator",
        description: "Calculate your FHA payment with MIP and check eligibility.",
        icon: AccountBalance,
        href: "/calculators/fha",
      },
      {
        id: "va",
        name: "VA Loan Calculator",
        description: "$0 down, no PMI — calculate your VA loan payment and funding fee.",
        icon: Shield,
        href: "/calculators/va",
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
      {
        id: "amortization",
        name: "Amortization Schedule",
        description: "See every payment broken down month by month.",
        icon: BarChart,
        href: "/calculators/amortization",
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
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCalculatorClick = (calcId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedCalculator(calcId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCalculator(null);
  };

  const handleProceed = () => {
    if (selectedCalculator) {
      const calc = calculatorCategories
        .flatMap(cat => cat.calculators)
        .find(c => c.id === selectedCalculator);
      if (calc) {
        window.location.href = calc.href;
      }
    }
  };

  const currentCalcDetails = selectedCalculator ? calculatorDetails[selectedCalculator as keyof typeof calculatorDetails] : null;
  const currentCalc = selectedCalculator ? calculatorCategories
    .flatMap(cat => cat.calculators)
    .find(c => c.id === selectedCalculator) : null;

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

        {/* Happy Homeowners Visual */}
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Typography variant="overline" color="primary.main" fontWeight={600}>
                    Calculate with Confidence
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 } }}>
                    Know your numbers before you commit
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
                    Join thousands who've used our calculators to make informed decisions about their biggest investment.
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container spacing={2}>
                  {[
                    { emoji: '🏡', label: 'Happy in their home', color: 'primary.light' },
                    { emoji: '✨', label: 'Clear on the numbers', color: 'secondary.light' },
                    { emoji: '💪', label: 'Confident in their choice', color: 'primary.light' },
                    { emoji: '🎯', label: 'On track financially', color: 'secondary.light' },
                  ].map((item, index) => (
                    <Grid size={{ xs: 6 }} key={index}>
                      <Card 
                        sx={{ 
                          p: 3, 
                          textAlign: 'center',
                          bgcolor: item.color,
                          border: 'none',
                        }}
                      >
                        <Typography sx={{ fontSize: '3rem', mb: 1 }}>
                          {item.emoji}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {item.label}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Calculator Categories */}
        <Box>
          {calculatorCategories.map((category, categoryIndex) => (
            <Box 
              key={categoryIndex}
              sx={{ 
                py: { xs: 6, md: 8 },
                bgcolor: categoryIndex % 2 === 0 ? 'background.paper' : 'grey.50',
              }}
            >
              <Container maxWidth="lg">
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
                        <Box onClick={(e) => handleCalculatorClick(calc.id, e)} style={{ textDecoration: 'none', cursor: 'pointer' }}>
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
                                  bgcolor: categoryColors[category.category]?.bg || 'primary.light',
                                  mb: 3,
                                }}
                              >
                                <Icon sx={{ color: categoryColors[category.category]?.fg || 'primary.main' }} />
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
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Container>
            </Box>
          ))}
        </Box>

        {/* Calculator Wizard */}
        <Box 
          sx={{ 
            py: { xs: 8, md: 10 }, 
            bgcolor: 'primary.main',
            borderTopLeftRadius: { xs: 24, md: 40 },
            borderTopRightRadius: { xs: 24, md: 40 },
          }}
        >
          <Container maxWidth="md">
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
      </Box>
      
      <Footer />

      {/* Calculator Details Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        {currentCalc && currentCalcDetails && (
          <>
            <DialogTitle>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                  {currentCalc.icon && <currentCalc.icon />}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {currentCalc.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentCalc.description}
                  </Typography>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ pt: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom color="primary.main" fontWeight={600}>
                    What You'll Get:
                  </Typography>
                  <List dense>
                    {currentCalcDetails.outputs.map((output, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle sx={{ color: 'primary.main', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={output}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom color="primary.main" fontWeight={600}>
                    Why It's Valuable:
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {currentCalcDetails.value}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button onClick={handleCloseModal} variant="outlined">
                Cancel
              </Button>
              <Button 
                onClick={handleProceed} 
                variant="contained" 
                endIcon={<ArrowForward />}
                size="large"
              >
                Open Calculator
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

