'use client';

import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Stack,
  Avatar,
} from '@mui/material';
import {
  MenuBook,
  TrendingUp,
  Balance,
  Psychology,
} from '@mui/icons-material';
import { Header } from '@/components/mui/Header';
import { Footer } from '@/components/mui/Footer';

export default function LearnPage() {
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
          <Container maxWidth="md">
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Typography 
                variant="h1" 
                component="h1"
                sx={{ 
                  maxWidth: 700,
                  fontSize: { xs: 36, sm: 48, md: 56 },
                }}
              >
                Learn About Debt
              </Typography>
              
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ maxWidth: 560, fontWeight: 400 }}
              >
                Understanding debt is the first step to making better financial decisions.
              </Typography>
            </Stack>
          </Container>
        </Box>

        {/* Content Sections */}
        <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
          <Stack spacing={8}>
            {/* What is Debt */}
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.light' }}>
                  <MenuBook sx={{ color: 'primary.main' }} />
                </Avatar>
                <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 } }}>
                  What is Debt?
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Typography variant="body1" color="text.secondary">
                  Debt is money you borrow and promise to pay back, usually with interest. It's a tool that lets you buy things now and pay for them over time.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  When you take on debt, you're making a bet: that having the money now is worth more than the extra cost (interest) you'll pay later.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  For a home, this often makes sense. You get to live in the house while you pay for it, and homes typically appreciate in value.
                </Typography>
              </Stack>
            </Box>

            {/* How Interest Works */}
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'secondary.light' }}>
                  <TrendingUp sx={{ color: 'secondary.main' }} />
                </Avatar>
                <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 } }}>
                  How Interest Works
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Typography variant="body1" color="text.secondary">
                  Interest is the cost of borrowing money. It's calculated as a percentage of what you owe.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  With a mortgage, most of your early payments go toward interest, not principal. This is because interest is calculated on the remaining balance, which is highest at the start.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Over time, as you pay down the principal, more of each payment goes toward reducing what you owe rather than paying interest.
                </Typography>
              </Stack>
            </Box>

            {/* Good vs Bad Debt */}
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.light' }}>
                  <Balance sx={{ color: 'primary.main' }} />
                </Avatar>
                <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 } }}>
                  Good vs Bad Debt
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Typography variant="body1" color="text.secondary">
                  <strong>Good debt</strong> helps you build wealth or increase your earning potential. Mortgages and student loans often fall into this category.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Bad debt</strong> is used for things that lose value quickly or don't generate income. Credit card debt for consumer goods is a common example.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  The key difference: good debt is an investment in your future, while bad debt is paying extra for past consumption.
                </Typography>
              </Stack>
            </Box>

            {/* Making Smart Decisions */}
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'secondary.light' }}>
                  <Psychology sx={{ color: 'secondary.main' }} />
                </Avatar>
                <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 } }}>
                  Making Smart Decisions
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Typography variant="body1" color="text.secondary">
                  Before taking on debt, ask yourself:
                </Typography>
                <Box component="ul" sx={{ pl: 3, '& li': { mb: 1, color: 'text.secondary' } }}>
                  <li>Can I afford the monthly payments comfortably?</li>
                  <li>What's the total cost including interest?</li>
                  <li>Are there better alternatives?</li>
                  <li>How long will I keep this debt?</li>
                  <li>What happens if my situation changes?</li>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  Use our calculators to run the numbers and see the real cost of different debt scenarios. Knowledge is power when it comes to financial decisions.
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {/* CTA */}
          <Box 
            sx={{ 
              mt: 10,
              p: { xs: 4, md: 6 },
              bgcolor: 'primary.main',
              borderRadius: 5,
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" sx={{ color: 'white', mb: 2 }}>
              Ready to run the numbers?
            </Typography>
            <Typography variant="body1" sx={{ color: 'primary.light', mb: 3 }}>
              Try our calculators to see how debt decisions affect your finances.
            </Typography>
            <Link href="/calculators" style={{ textDecoration: 'none' }}>
              <Box
                component="button"
                sx={{
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
                View All Calculators
              </Box>
            </Link>
          </Box>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
}
