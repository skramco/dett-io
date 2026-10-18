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
  AttachMoney,
  Home,
  Autorenew,
  Savings,
  TrendingUp,
  AccountBalance,
  TrackChanges,
  Schedule,
  BarChart,
  CheckCircle,
  ArrowForward,
  Shield,
  EventAvailable,
  Functions,
  MenuBook,
  VerifiedUser,
  Code,
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
    outputs: ['5-year cost comparison', 'Break-even timeline', 'Wealth accumulation projection', 'P10–P90 scenario range', 'Share of paths where buying wins'],
    value: 'Answers the biggest question: should you rent or buy? Includes rent inflation, home appreciation, maintenance costs, investment alternatives, and a Monte Carlo range instead of a single path.',
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
    outputs: ['New monthly payment', 'Cash received', 'Extra interest vs keeping current mortgage', 'Implied cash cost (IRR, educational — not an APR)', 'Keep mortgage + HELOC blended-rate comparison'],
    value: 'Shows the real cost of pulling equity from your home. Helps you decide if cash-out refinancing beats other borrowing options.',
  },
  'recast-vs-refi': {
    outputs: ['Monthly payment reduction for each option', 'Total costs comparison', 'Interest savings analysis', 'Best option recommendation based on your timeline'],
    value: 'Compares three ways to use a lump sum: (1) Recast - make a large principal payment and have your lender recalculate a lower monthly payment for a small fee (~$250), (2) Refinance - get a new loan with better terms but pay closing costs (~2-5% of loan), or (3) Prepay Only - make principal-only payments to save interest without changing your monthly payment. Shows which strategy saves you the most money based on your situation.',
  },
  'loan-timeline': {
    outputs: ['Best loan structure for your timeline', 'Net cost comparison: 30-year vs. points vs. ARM vs. 15-year', 'Named falling / expected / rising ARM rate paths', 'Monte Carlo P10–P90 payment band', 'Cap-driven worst-case ARM payment'],
    value: 'Matches your loan structure to your life plans. Compares fixed rates, discount points, ARMs (with named rate paths and a Monte Carlo range, not just a teaser vs worst case), and 15-year terms by what they actually cost over your expected stay.',
  },
  payoff: {
    outputs: ['Years saved and interest avoided for every strategy', 'Extra monthly, annual, and lump-sum payment impact', 'True biweekly savings and the free DIY alternative', 'Prepay vs invest comparison', 'New payoff date'],
    value: 'One tool for every way to pay off faster: extra payments, lump sums, and biweekly schedules. Exposes fee-charging biweekly programs and shows whether investing the extra cash would beat prepaying.',
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
    outputs: ['Front-end DTI ratio (housing only)', 'Back-end DTI ratio (all debts)', 'Comparison to typical Conventional, FHA, and VA guidelines', 'Debt breakdown visualization', 'Maximum housing payment at each DTI threshold'],
    value: 'DTI is one of the first numbers lenders review when sizing a mortgage. See both your front-end and back-end ratios and understand exactly what lenders see.',
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
    outputs: ['Total monthly FHA payment with MIP', 'Upfront & monthly MIP costs', 'FHA guideline check (credit, DTI, down payment)', 'FHA vs Conventional comparison', 'MIP duration and total cost'],
    value: 'FHA loans allow as little as 3.5% down with a 580+ credit score. See your full payment including mortgage insurance and whether FHA or conventional is the better deal.',
  },
  va: {
    outputs: ['Total monthly VA payment (no PMI)', 'VA funding fee calculation (purchase, IRRRL, cash-out)', 'VA vs FHA vs Conventional comparison', 'Residual income guidance by region and family size', 'Funding fee by down payment and use tier'],
    value: 'VA loans offer $0 down and no PMI — the best mortgage benefit available. See your funding fee, compare loan types, and understand the full financial advantage of your VA benefit.',
  },
};

const categoryColors: Record<string, { bg: string; fg: string }> = {
  'Buying a Home': { bg: '#EBF5FF', fg: '#196bc0' },
  'Current Homeowners': { bg: '#FFF7ED', fg: '#C2410C' },
  'Rate & Structure': { bg: '#F0FDF4', fg: '#15803D' },
  'Payoff Strategy': { bg: '#FAF5FF', fg: '#7E22CE' },
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
        description: "Full comparison including a scenario range, not a single path.",
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
        description: "Calculate your FHA payment with MIP and compare against typical FHA guidelines.",
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
        id: "loan-timeline",
        name: "Best Loan for My Timeline",
        description: "Compare fixed, points, ARM, and 15-year options — with ARM rate-path Monte Carlo — for how long you'll stay.",
        icon: Schedule,
        href: "/calculators/loan-timeline",
      },
      {
        id: "interest-sensitivity",
        name: "Rate Sensitivity",
        description: "See how rate changes affect your payment and total cost.",
        icon: BarChart,
        href: "/calculators/interest-sensitivity",
      },
    ],
  },
  {
    category: "Payoff Strategy",
    description: "Pay off faster or build wealth?",
    calculators: [
      {
        id: "payoff",
        name: "Pay Off Faster",
        description: "Extra payments, lump sums, and biweekly strategies — all in one tool.",
        icon: Savings,
        href: "/calculators/payoff",
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
              <Link href="/scenario" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: 'background.paper',
                    px: 2.5,
                  }}
                >
                  Set up My scenario — enter numbers once
                </Button>
              </Link>
            </Stack>
          </Container>
        </Box>

        {/* Trust Signals */}
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
                    Every result is backed by documented formulas and cited data sources, and each
                    calculator shows when it was last reviewed. See{' '}
                    <Link href="/methodology" style={{ color: 'inherit', fontWeight: 600 }}>
                      how our math works
                    </Link>{' '}
                    and{' '}
                    <Link href="/about" style={{ color: 'inherit', fontWeight: 600 }}>
                      who builds these tools
                    </Link>.
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Grid container spacing={2}>
                  {[
                    { icon: Functions, label: 'Documented formulas', detail: 'Expand "Show Me the Math" on any result' },
                    { icon: MenuBook, label: 'Cited data sources', detail: 'Freddie Mac PMMS, FHFA, HUD, VA tables' },
                    { icon: VerifiedUser, label: 'Independent', detail: 'Not a lender — no leads sold, ever' },
                    { icon: EventAvailable, label: 'Dated reviews', detail: '"Last updated" shown on every calculator' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Grid size={{ xs: 6 }} key={index}>
                        <Card sx={{ p: 3, height: '100%' }}>
                          <Icon sx={{ color: 'primary.main', fontSize: 28, mb: 1 }} />
                          <Typography variant="body2" fontWeight={600}>
                            {item.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {item.detail}
                          </Typography>
                        </Card>
                      </Grid>
                    );
                  })}
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
                sx={{ bgcolor: 'primary.dark', color: 'white', fontWeight: 600 }}
              />
              <Typography 
                variant="h2" 
                sx={{ color: 'white', fontSize: { xs: 32, md: 40 } }}
              >
                Not sure where to start?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ color: '#EBF5FF', maxWidth: 500, fontWeight: 400 }}
              >
                Answer a couple questions and we'll point you to the right calculator.
              </Typography>
            </Stack>
            <CalculatorWizard />
          </Container>
        </Box>

        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'grey.50' }}>
          <Container maxWidth="md">
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: 24, md: 32 } }}>
                Embed these calculators on your site
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
                Realtors, brokers, lenders, and bloggers: add any calculator to your website. Free, forever. No signup.
              </Typography>
              <Button
                component={Link}
                href="/embed"
                variant="contained"
                startIcon={<Code />}
                endIcon={<ArrowForward />}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Get the embed code
              </Button>
            </Stack>
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

