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

        </Container>

        {/* Mortgage Glossary */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
          <Container maxWidth="lg">
            <Stack spacing={4}>
              <Box textAlign="center">
                <Typography variant="overline" color="primary.main" fontWeight={600}>
                  Mortgage Glossary
                </Typography>
                <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 36 } }}>
                  Common Terms You Should Know
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
                  Navigate through these essential mortgage and debt terms to build your financial vocabulary.
                </Typography>
              </Box>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2,
                mt: 4,
              }}>
                {[
                  { term: 'Amortization', def: 'The process of paying off a loan over time through regular payments that cover both principal and interest.' },
                  { term: 'APR (Annual Percentage Rate)', def: 'The yearly cost of a loan including interest and fees, expressed as a percentage.' },
                  { term: 'ARM (Adjustable-Rate Mortgage)', def: 'A mortgage with an interest rate that can change periodically based on market conditions.' },
                  { term: 'Appraisal', def: 'A professional assessment of a property\'s market value, required by lenders before approving a mortgage.' },
                  { term: 'Closing Costs', def: 'Fees and expenses paid at the closing of a real estate transaction, typically 2-5% of the purchase price.' },
                  { term: 'Debt-to-Income Ratio (DTI)', def: 'The percentage of your monthly income that goes toward debt payments. Lenders use this to assess loan eligibility.' },
                  { term: 'Down Payment', def: 'The upfront cash payment made when purchasing a home, typically 3-20% of the purchase price.' },
                  { term: 'Equity', def: 'The difference between your home\'s current market value and the amount you owe on your mortgage.' },
                  { term: 'Escrow', def: 'An account where funds are held by a third party to pay property taxes and insurance on behalf of the homeowner.' },
                  { term: 'Fixed-Rate Mortgage', def: 'A mortgage with an interest rate that remains constant throughout the life of the loan.' },
                  { term: 'HOA (Homeowners Association)', def: 'An organization that makes and enforces rules for a community, typically charging monthly or annual fees.' },
                  { term: 'Interest', def: 'The cost of borrowing money, calculated as a percentage of the loan amount.' },
                  { term: 'Loan-to-Value Ratio (LTV)', def: 'The ratio of the loan amount to the property\'s value, expressed as a percentage.' },
                  { term: 'PMI (Private Mortgage Insurance)', def: 'Insurance required by lenders when down payment is less than 20%, protecting the lender if you default.' },
                  { term: 'Points', def: 'Upfront fees paid to the lender to reduce your interest rate. One point equals 1% of the loan amount.' },
                  { term: 'Pre-approval', def: 'A lender\'s conditional commitment to lend you a specific amount based on verified financial information.' },
                  { term: 'Pre-qualification', def: 'An estimate of how much you can borrow based on self-reported financial information.' },
                  { term: 'Principal', def: 'The original amount of money borrowed, not including interest.' },
                  { term: 'PITI', def: 'Principal, Interest, Taxes, and Insurance - the four components of a typical monthly mortgage payment.' },
                  { term: 'Refinance', def: 'Replacing your current mortgage with a new one, typically to get a better interest rate or change loan terms.' },
                  { term: 'Term', def: 'The length of time you have to repay a loan, commonly 15 or 30 years for mortgages.' },
                  { term: 'Title', def: 'Legal ownership of a property, transferred from seller to buyer at closing.' },
                  { term: 'Underwriting', def: 'The process lenders use to assess the risk of lending to you and determine loan approval.' },
                  { term: 'Appreciation', def: 'The increase in a property\'s value over time due to market conditions.' },
                  { term: 'Balloon Payment', def: 'A large, lump-sum payment due at the end of a loan term.' },
                  { term: 'Cap', def: 'A limit on how much an ARM\'s interest rate can increase, either per adjustment period or over the loan\'s lifetime.' },
                  { term: 'Cash-Out Refinance', def: 'Refinancing for more than you owe and taking the difference in cash.' },
                  { term: 'Conforming Loan', def: 'A mortgage that meets the standards set by Fannie Mae and Freddie Mac, with loan limits that vary by location.' },
                  { term: 'Contingency', def: 'A condition that must be met for a real estate contract to be binding, such as passing inspection.' },
                  { term: 'Conventional Loan', def: 'A mortgage not insured or guaranteed by the federal government.' },
                  { term: 'Credit Score', def: 'A numerical representation of your creditworthiness, typically ranging from 300 to 850.' },
                  { term: 'Deed', def: 'A legal document that transfers property ownership from seller to buyer.' },
                  { term: 'Default', def: 'Failure to make required loan payments, which can lead to foreclosure.' },
                  { term: 'Depreciation', def: 'A decrease in property value over time.' },
                  { term: 'Earnest Money', def: 'A deposit made to show you\'re serious about buying a home, typically 1-3% of the purchase price.' },
                  { term: 'FHA Loan', def: 'A mortgage insured by the Federal Housing Administration, allowing lower down payments and credit scores.' },
                  { term: 'Forbearance', def: 'A temporary postponement of mortgage payments granted by the lender during financial hardship.' },
                  { term: 'Foreclosure', def: 'The legal process by which a lender takes possession of a property due to the borrower\'s failure to pay.' },
                  { term: 'Grace Period', def: 'A period after the payment due date during which you can make a payment without penalty.' },
                  { term: 'Home Inspection', def: 'A thorough examination of a property\'s condition by a professional inspector before purchase.' },
                  { term: 'Jumbo Loan', def: 'A mortgage that exceeds conforming loan limits, typically requiring higher credit scores and larger down payments.' },
                  { term: 'Lien', def: 'A legal claim against a property, often used to secure payment of a debt.' },
                  { term: 'Mortgage Broker', def: 'A professional who connects borrowers with lenders and helps find the best loan terms.' },
                  { term: 'Origination Fee', def: 'A fee charged by lenders for processing a new loan application, typically 0.5-1% of the loan amount.' },
                  { term: 'Rate Lock', def: 'An agreement that guarantees a specific interest rate for a set period, usually 30-60 days.' },
                  { term: 'Recast', def: 'Recalculating your monthly payment after making a large principal payment, without refinancing.' },
                  { term: 'Second Mortgage', def: 'An additional loan taken out on a property that already has a mortgage, such as a home equity loan.' },
                  { term: 'Short Sale', def: 'Selling a property for less than the amount owed on the mortgage, with lender approval.' },
                  { term: 'Title Insurance', def: 'Insurance that protects against losses from defects in the title or ownership disputes.' },
                  { term: 'VA Loan', def: 'A mortgage guaranteed by the Department of Veterans Affairs, available to eligible veterans and service members.' },
                  { term: 'Yield Spread Premium', def: 'Compensation paid to a mortgage broker for securing a loan with an interest rate higher than the lender\'s minimum.' },
                ].map((item, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      p: 2.5, 
                      bgcolor: 'white',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'grey.200',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      {item.term}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.def}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* CTA */}
        <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
          <Box 
            sx={{ 
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
