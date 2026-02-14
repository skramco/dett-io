'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import {
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  Avatar,
  Fade,
  Chip,
} from '@mui/material';
import {
  Home,
  AttachMoney,
  Autorenew,
  TrendingUp,
  Savings,
  ArrowForward,
  ArrowBack,
  RestartAlt,
} from '@mui/icons-material';

interface WizardStep {
  question: string;
  options: {
    label: string;
    icon: React.ReactNode;
    description: string;
    next: string | null; // null = show result
    result?: WizardResult;
  }[];
}

interface WizardResult {
  title: string;
  description: string;
  calculators: { name: string; href: string; why: string }[];
}

const wizardSteps: Record<string, WizardStep> = {
  start: {
    question: "What's your situation?",
    options: [
      {
        label: "I'm looking to buy",
        icon: <Home />,
        description: "First-time or repeat buyer",
        next: 'buying',
      },
      {
        label: "I already own a home",
        icon: <Autorenew />,
        description: "Refinance, pay off faster, or tap equity",
        next: 'owning',
      },
      {
        label: "I'm comparing loan options",
        icon: <TrendingUp />,
        description: "ARM vs fixed, points, rate analysis",
        next: 'comparing',
      },
      {
        label: "I want to pay off faster",
        icon: <Savings />,
        description: "Extra payments, biweekly, acceleration",
        next: 'payoff',
      },
    ],
  },
  buying: {
    question: "What do you need help with?",
    options: [
      {
        label: "How much can I afford?",
        icon: <Home />,
        description: "Based on income, debts, and down payment",
        next: null,
        result: {
          title: "Start with Affordability",
          description: "These calculators will help you figure out your budget and what to expect.",
          calculators: [
            { name: "How Much House Can I Afford?", href: "/calculators/affordability", why: "Your starting point — see your max price based on income" },
            { name: "DTI Calculator", href: "/calculators/dti", why: "Check if your debt ratios qualify for a mortgage" },
            { name: "Down Payment Strategy", href: "/calculators/down-payment", why: "Compare 5%, 10%, and 20% down options" },
          ],
        },
      },
      {
        label: "What will my payment be?",
        icon: <AttachMoney />,
        description: "Full PITI breakdown with all costs",
        next: null,
        result: {
          title: "Understand Your True Cost",
          description: "Most calculators only show P&I. These show you the full picture.",
          calculators: [
            { name: "True Monthly Mortgage Cost", href: "/calculators/mortgage-cost", why: "See PITI + HOA + PMI — your real monthly cost" },
            { name: "PMI Calculator", href: "/calculators/pmi", why: "See your PMI cost and when it drops off" },
            { name: "Closing Cost Estimator", href: "/calculators/closing-costs", why: "Know how much cash you need at closing" },
          ],
        },
      },
      {
        label: "Should I rent or buy?",
        icon: <TrendingUp />,
        description: "Long-term financial comparison",
        next: null,
        result: {
          title: "Rent vs Buy Analysis",
          description: "Compare the long-term financial impact of renting vs buying.",
          calculators: [
            { name: "Rent vs Buy Analysis", href: "/calculators/rent-vs-buy", why: "Full comparison with appreciation, rent inflation, and investment alternatives" },
            { name: "How Much House Can I Afford?", href: "/calculators/affordability", why: "See what you could buy with your current finances" },
          ],
        },
      },
      {
        label: "FHA or VA loan options",
        icon: <Home />,
        description: "Government-backed loan programs",
        next: null,
        result: {
          title: "Government Loan Programs",
          description: "FHA and VA loans offer lower down payments and better terms for eligible borrowers.",
          calculators: [
            { name: "FHA Loan Calculator", href: "/calculators/fha", why: "3.5% down with 580+ credit — see your MIP costs" },
            { name: "VA Loan Calculator", href: "/calculators/va", why: "$0 down, no PMI — the best mortgage benefit available" },
            { name: "DTI Calculator", href: "/calculators/dti", why: "Check if you meet FHA/VA debt ratio requirements" },
          ],
        },
      },
    ],
  },
  owning: {
    question: "What are you trying to do?",
    options: [
      {
        label: "Lower my monthly payment",
        icon: <AttachMoney />,
        description: "Refinance or recast options",
        next: null,
        result: {
          title: "Lower Your Payment",
          description: "Compare your options for reducing your monthly mortgage payment.",
          calculators: [
            { name: "Should I Refinance?", href: "/calculators/refinance", why: "See if a new rate saves you money after closing costs" },
            { name: "Recast vs Refinance", href: "/calculators/recast-vs-refi", why: "If you have a lump sum, recasting may be cheaper than refinancing" },
            { name: "Amortization Schedule", href: "/calculators/amortization", why: "See your current payment breakdown month by month" },
          ],
        },
      },
      {
        label: "Access my home equity",
        icon: <Home />,
        description: "Cash-out refinance analysis",
        next: null,
        result: {
          title: "Tap Your Equity",
          description: "Understand the true cost of borrowing against your home.",
          calculators: [
            { name: "Cash-Out Refinance", href: "/calculators/cash-out-refi", why: "See the real cost of pulling cash from your equity" },
            { name: "Should I Refinance?", href: "/calculators/refinance", why: "Compare your current loan to a new one" },
          ],
        },
      },
      {
        label: "Pay off my mortgage faster",
        icon: <Savings />,
        description: "Extra payments and acceleration",
        next: 'payoff',
      },
      {
        label: "See my current loan breakdown",
        icon: <TrendingUp />,
        description: "Amortization and payment analysis",
        next: null,
        result: {
          title: "Understand Your Loan",
          description: "See exactly where every dollar of your payment goes.",
          calculators: [
            { name: "Amortization Schedule", href: "/calculators/amortization", why: "Month-by-month breakdown of principal vs interest" },
            { name: "True Monthly Mortgage Cost", href: "/calculators/mortgage-cost", why: "See your full PITI payment breakdown" },
            { name: "Rate Sensitivity", href: "/calculators/interest-sensitivity", why: "See how rate changes would affect your payment" },
          ],
        },
      },
    ],
  },
  comparing: {
    question: "What are you comparing?",
    options: [
      {
        label: "ARM vs Fixed rate",
        icon: <TrendingUp />,
        description: "Adjustable vs fixed-rate mortgages",
        next: null,
        result: {
          title: "ARM vs Fixed Analysis",
          description: "Compare the risk and reward of adjustable-rate vs fixed-rate mortgages.",
          calculators: [
            { name: "ARM vs Fixed Rate", href: "/calculators/arm-vs-fixed", why: "Model rate adjustments and compare total costs" },
            { name: "Decision Timeline", href: "/calculators/timeline-simulator", why: "Find the best option based on how long you'll stay" },
          ],
        },
      },
      {
        label: "Buying points vs par rate",
        icon: <AttachMoney />,
        description: "Is paying points worth it?",
        next: null,
        result: {
          title: "Points & Rate Analysis",
          description: "Decide whether buying points, taking lender credits, or paying par rate is best.",
          calculators: [
            { name: "Points & Buydown", href: "/calculators/points-buydown", why: "Compare points, lender credits, and temporary buydowns" },
            { name: "Rate Sensitivity", href: "/calculators/interest-sensitivity", why: "See how each rate change affects your payment" },
          ],
        },
      },
      {
        label: "How long I'll stay matters",
        icon: <Home />,
        description: "Timeline-based loan decisions",
        next: null,
        result: {
          title: "Timeline-Based Decision",
          description: "Your optimal loan structure depends on how long you plan to keep the home.",
          calculators: [
            { name: "Decision Timeline", href: "/calculators/timeline-simulator", why: "Compare strategies based on your expected timeline" },
            { name: "ARM vs Fixed Rate", href: "/calculators/arm-vs-fixed", why: "ARMs can save money if you're moving in 5-7 years" },
            { name: "Should I Refinance?", href: "/calculators/refinance", why: "See if refinancing makes sense at your timeline" },
          ],
        },
      },
    ],
  },
  payoff: {
    question: "How do you want to accelerate?",
    options: [
      {
        label: "Extra monthly payments",
        icon: <AttachMoney />,
        description: "Add extra to each payment",
        next: null,
        result: {
          title: "Extra Payment Strategy",
          description: "See how extra payments can dramatically shorten your loan and save interest.",
          calculators: [
            { name: "Extra Payment Impact", href: "/calculators/extra-payment", why: "See years saved and interest avoided with extra payments" },
            { name: "Acceleration Planner", href: "/calculators/acceleration", why: "Compare prepaying vs investing the difference" },
          ],
        },
      },
      {
        label: "Biweekly payments",
        icon: <Autorenew />,
        description: "Pay every two weeks instead of monthly",
        next: null,
        result: {
          title: "Biweekly Payment Strategy",
          description: "Biweekly payments make one extra payment per year — for free.",
          calculators: [
            { name: "Biweekly Payments", href: "/calculators/biweekly", why: "See the truth about biweekly programs and the free DIY alternative" },
            { name: "Extra Payment Impact", href: "/calculators/extra-payment", why: "Compare biweekly to monthly extra payments" },
          ],
        },
      },
      {
        label: "Lump sum (recast or prepay)",
        icon: <Savings />,
        description: "Apply a large payment to principal",
        next: null,
        result: {
          title: "Lump Sum Strategy",
          description: "Compare the best ways to use a lump sum: recast, refinance, or prepay.",
          calculators: [
            { name: "Recast vs Refinance", href: "/calculators/recast-vs-refi", why: "Compare recasting ($250 fee) vs refinancing (closing costs)" },
            { name: "Acceleration Planner", href: "/calculators/acceleration", why: "See the impact of a lump sum on your payoff timeline" },
            { name: "Extra Payment Impact", href: "/calculators/extra-payment", why: "Model ongoing extra payments after your lump sum" },
          ],
        },
      },
    ],
  },
};

export function CalculatorWizard() {
  const [currentStep, setCurrentStep] = useState('start');
  const [result, setResult] = useState<WizardResult | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const step = wizardSteps[currentStep];

  const handleOptionClick = (option: typeof step.options[0]) => {
    if (currentStep === 'start') {
      trackEvent('wizard_started', { wizard_path: option.label });
    }
    if (option.next) {
      setHistory(prev => [...prev, currentStep]);
      setCurrentStep(option.next);
    } else if (option.result) {
      setHistory(prev => [...prev, currentStep]);
      setResult(option.result);
      trackEvent('wizard_completed', {
        wizard_path: [...history, currentStep].join(' > '),
      });
    }
  };

  const handleBack = () => {
    if (result) {
      setResult(null);
      return;
    }
    const prev = history[history.length - 1];
    if (prev) {
      setHistory(h => h.slice(0, -1));
      setCurrentStep(prev);
    }
  };

  const handleReset = () => {
    setCurrentStep('start');
    setResult(null);
    setHistory([]);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      {/* Navigation */}
      {(history.length > 0 || result) && (
        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Button
            size="small"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ color: 'white', textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Back
          </Button>
          <Button
            size="small"
            startIcon={<RestartAlt />}
            onClick={handleReset}
            sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Start Over
          </Button>
        </Stack>
      )}

      {/* Result View */}
      {result ? (
        <Fade in>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              {result.title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
              {result.description}
            </Typography>

            <Stack spacing={2}>
              {result.calculators.map((calc, i) => (
                <Link key={i} href={calc.href} style={{ textDecoration: 'none' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.95)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {calc.name}
                          </Typography>
                          {i === 0 && (
                            <Chip
                              label="Recommended"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                bgcolor: 'primary.light',
                                color: 'primary.main',
                              }}
                            />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {calc.why}
                        </Typography>
                      </Box>
                      <ArrowForward sx={{ color: 'primary.main', ml: 2 }} />
                    </Stack>
                  </Paper>
                </Link>
              ))}
            </Stack>
          </Box>
        </Fade>
      ) : (
        /* Question View */
        <Fade in key={currentStep}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 4 }}>
              {step.question}
            </Typography>

            <Stack spacing={2}>
              {step.options.map((option, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  onClick={() => handleOptionClick(option)}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.4)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.15)',
                        width: 44,
                        height: 44,
                      }}
                    >
                      {option.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
                        {option.label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {option.description}
                      </Typography>
                    </Box>
                    <ArrowForward sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Fade>
      )}
    </Box>
  );
}
