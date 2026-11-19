'use client';

import { Box, Alert, Typography } from '@mui/material';
import { AffordHouseBySalary } from '@/lib/guides/AffordHouseBySalary';
import { VaFundingFeeAndWaiver } from '@/lib/guides/VaFundingFeeAndWaiver';
import { HowMuchIsPMI } from '@/lib/guides/HowMuchIsPMI';
import { RentVsBuyGuide } from '@/lib/guides/RentVsBuyGuide';
import { ShouldIRefinance } from '@/lib/guides/ShouldIRefinance';
import { PayExtraMortgageOrInvest } from '@/lib/guides/PayExtraMortgageOrInvest';
import { CashOutRefinancePayCreditCardDebt } from '@/lib/guides/CashOutRefinancePayCreditCardDebt';
import { CarStudentLoansHouseAffordability } from '@/lib/guides/CarStudentLoansHouseAffordability';
import { DebtAvalancheVsSnowball } from '@/lib/guides/DebtAvalancheVsSnowball';
import { BalanceTransferVsPersonalLoan } from '@/lib/guides/BalanceTransferVsPersonalLoan';

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <Alert severity="info" sx={{ my: 3, borderRadius: 2, '& .MuiAlert-message': { width: '100%' } }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{children}</Typography>
    </Alert>
  );
}

function FHAvsConventional() {
  return (
    <>
      <h2>The Quick Comparison</h2>
      <Box component="table">
        <thead><tr><th>Feature</th><th>FHA</th><th>Conventional</th></tr></thead>
        <tbody>
          <tr><td>Min. Down Payment</td><td>3.5%</td><td>3% (first-time) / 5%</td></tr>
          <tr><td>Min. Credit Score</td><td>580 (3.5% down) / 500 (10% down)</td><td>620+</td></tr>
          <tr><td>Mortgage Insurance</td><td>Upfront MIP (1.75%) + Annual MIP</td><td>PMI (if &lt;20% down)</td></tr>
          <tr><td>MI Removal</td><td>Stays for life of loan (if &lt;10% down); 11 years (10%+ down)</td><td>Drops at 78-80% LTV</td></tr>
          <tr><td>Max DTI</td><td>Up to 57% (with compensating factors)</td><td>Up to 50%</td></tr>
          <tr><td>Loan Limits (2026)</td><td>$541,287 (most areas)</td><td>$832,750 (conforming)</td></tr>
          <tr><td>Property Requirements</td><td>Stricter (must meet HUD standards)</td><td>More flexible</td></tr>
        </tbody>
      </Box>

      <h2>When FHA Wins</h2>
      <ul>
        <li><strong>Credit score below 680.</strong> FHA rates are less sensitive to credit score. If your score is 580-660, FHA will likely offer better terms.</li>
        <li><strong>High DTI.</strong> FHA allows DTI up to 57% with compensating factors. If your debts are high relative to income, FHA is more forgiving.</li>
        <li><strong>Minimal savings.</strong> FHA's 3.5% down payment and the ability to use gift funds for the entire amount make it accessible.</li>
        <li><strong>Recent credit events.</strong> FHA has shorter waiting periods after bankruptcy (2 years) and foreclosure (3 years) compared to conventional.</li>
      </ul>

      <h2>When Conventional Wins</h2>
      <ul>
        <li><strong>Credit score above 720.</strong> You'll get the best conventional rates, and PMI will be cheaper than FHA MIP.</li>
        <li><strong>10%+ down payment.</strong> Conventional PMI drops off at 80% LTV. FHA MIP stays for the life of the loan (unless you put 10%+ down, then it drops after 11 years).</li>
        <li><strong>Higher-priced homes.</strong> Conventional loans have higher limits in some areas and don't have the same property condition requirements.</li>
        <li><strong>Investment properties.</strong> FHA is only for primary residences. Conventional allows investment properties and second homes.</li>
      </ul>

      <h2>The MIP vs PMI Cost Difference</h2>
      <p>This is where the real money is. On a $300,000 home with 5% down:</p>
      <Box component="table">
        <thead><tr><th>Cost</th><th>FHA</th><th>Conventional (720+ credit)</th></tr></thead>
        <tbody>
          <tr><td>Upfront fee</td><td>$4,988 (1.75% MIP)</td><td>$0</td></tr>
          <tr><td>Monthly MI</td><td>$165/mo (0.55% annual)</td><td>$95/mo</td></tr>
          <tr><td>MI duration</td><td>Life of loan</td><td>~7 years (to 78% LTV)</td></tr>
          <tr><td>Total MI cost (10 years)</td><td>$24,788</td><td>$7,980</td></tr>
        </tbody>
      </Box>

      <Callout>If you start with FHA and your credit improves, you can refinance into a conventional loan later to drop the MIP. Many buyers use FHA as a stepping stone.</Callout>

      <h2>The Bottom Line</h2>
      <p>FHA is a great tool for getting into homeownership when your credit or savings aren't perfect. Conventional is better when you have strong credit and can put more down. Run both scenarios with our calculators to see which saves you more in your specific situation.</p>
    </>
  );
}

function WhatAreClosingCosts() {
  return (
    <>
      <h2>The Short Version</h2>
      <p>Closing costs are the fees you pay to finalize your mortgage — typically <strong>2-5% of the home's purchase price</strong>. On a $300,000 home, that's $6,000 to $15,000 on top of your down payment.</p>

      <h2>The Complete Breakdown</h2>
      <h3>Lender Fees</h3>
      <ul>
        <li><strong>Origination fee (0.5-1%):</strong> The lender's charge for processing your loan. On a $300K loan, that's $1,500-$3,000.</li>
        <li><strong>Application fee ($300-500):</strong> Covers the cost of processing your application. Some lenders waive this.</li>
        <li><strong>Underwriting fee ($400-800):</strong> The cost of evaluating your loan application.</li>
        <li><strong>Credit report fee ($30-50):</strong> Pulling your credit from all three bureaus.</li>
      </ul>

      <h3>Third-Party Fees</h3>
      <ul>
        <li><strong>Appraisal ($400-600):</strong> A professional assessment of the home's value. Required by the lender.</li>
        <li><strong>Home inspection ($300-500):</strong> Not technically a closing cost, but you should always get one.</li>
        <li><strong>Title search ($200-400):</strong> Verifying the property's ownership history.</li>
        <li><strong>Title insurance ($500-2,000):</strong> Protects against ownership disputes. Lender's policy is required; owner's policy is optional but recommended.</li>
        <li><strong>Survey ($300-500):</strong> Confirming property boundaries. Not always required.</li>
        <li><strong>Attorney fees ($500-1,500):</strong> Required in some states for closing.</li>
      </ul>

      <h3>Prepaid Items</h3>
      <ul>
        <li><strong>Prepaid interest:</strong> Interest from your closing date to the end of that month.</li>
        <li><strong>Property tax escrow:</strong> 2-6 months of property taxes held in escrow.</li>
        <li><strong>Homeowner's insurance:</strong> First year's premium paid upfront, plus 2-3 months in escrow.</li>
      </ul>

      <h2>How to Reduce Closing Costs</h2>
      <ol>
        <li><strong>Shop around.</strong> Get Loan Estimates from at least 3 lenders. Lender fees vary significantly.</li>
        <li><strong>Negotiate.</strong> Origination fees, application fees, and some third-party fees are negotiable.</li>
        <li><strong>Ask for seller credits.</strong> In buyer's markets, sellers may agree to pay 2-3% of closing costs.</li>
        <li><strong>Choose a no-closing-cost loan.</strong> The lender covers costs in exchange for a slightly higher rate. Good if you're not staying long.</li>
        <li><strong>Close at the end of the month.</strong> This minimizes prepaid interest.</li>
      </ol>

      <Callout>Always compare the Loan Estimate (LE) to the Closing Disclosure (CD) you receive 3 days before closing. Some fees can increase, but many are capped by law.</Callout>

      <h2>The Bottom Line</h2>
      <p>Closing costs are a significant expense that catches many first-time buyers off guard. Budget for 3% of the purchase price as a starting estimate, and use our Closing Cost Estimator to get a detailed breakdown for your specific situation.</p>
    </>
  );
}

function TrueMonthlyPayment() {
  return (
    <>
      <h2>The Number Your Lender Quotes vs Reality</h2>
      <p>When a lender says "your payment will be $2,100," they usually mean principal and interest only. Your actual monthly cost is significantly higher. Here's what they're not emphasizing:</p>

      <h2>The Full PITI Breakdown</h2>
      <p>PITI stands for Principal, Interest, Taxes, and Insurance — the four core components of your monthly housing cost. But even PITI doesn't tell the whole story.</p>
      <Box component="table">
        <thead><tr><th>Component</th><th>Example ($350K home, 10% down, 6.75%)</th></tr></thead>
        <tbody>
          <tr><td>Principal & Interest</td><td>$2,043</td></tr>
          <tr><td>Property Tax (1.2%)</td><td>$350</td></tr>
          <tr><td>Homeowner's Insurance</td><td>$150</td></tr>
          <tr><td>PMI (10% down, 720 credit)</td><td>$95</td></tr>
          <tr><td>HOA (if applicable)</td><td>$200</td></tr>
          <tr><td><strong>True Monthly Cost</strong></td><td><strong>$2,838</strong></td></tr>
        </tbody>
      </Box>
      <p>That's <strong>$795 more per month</strong> than the P&I number alone — a 39% difference. This is why so many first-time buyers experience sticker shock after closing.</p>

      <h2>Costs That Don't Show Up in PITI</h2>
      <p>Even PITI + HOA + PMI doesn't capture everything. Budget for these too:</p>
      <ul>
        <li><strong>Maintenance (1-2% of home value/year):</strong> $3,500-$7,000/year or $290-$580/month. HVAC, roof, plumbing, appliances — things break.</li>
        <li><strong>Utilities:</strong> Typically $200-400/month more than an apartment. Larger space = higher bills.</li>
        <li><strong>Lawn care / landscaping:</strong> $50-200/month if you hire it out.</li>
        <li><strong>Pest control:</strong> $30-50/month in many areas.</li>
        <li><strong>Home warranty:</strong> $400-600/year (optional but recommended for older homes).</li>
      </ul>

      <Callout>A realistic "all-in" monthly housing cost is typically 40-60% higher than the P&I number alone. Always budget based on the full picture, not just the mortgage payment.</Callout>

      <h2>How to Keep Your True Cost Manageable</h2>
      <ol>
        <li><strong>Buy below the top of your range.</strong> If guidelines suggest up to $400K, consider $325K–$350K so the payment still fits after taxes and maintenance.</li>
        <li><strong>Shop insurance aggressively.</strong> Homeowner's insurance rates vary dramatically. Get 5+ quotes.</li>
        <li><strong>Appeal your property tax assessment.</strong> Many homeowners overpay because they don't challenge their assessment.</li>
        <li><strong>Build a maintenance fund.</strong> Set aside 1% of your home's value per year from day one.</li>
        <li><strong>Avoid HOA-heavy properties</strong> unless the amenities genuinely add value to your life.</li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>Your mortgage payment is just the starting point. Understanding the true monthly cost of homeownership prevents financial surprises and helps you buy a home that fits your budget — not only a payment that fits a guideline. Use our True Monthly Mortgage Cost calculator to see every component of your real payment.</p>
    </>
  );
}

export const guideContent: Record<string, React.FC> = {
  'how-much-house-can-i-afford-by-salary': AffordHouseBySalary,
  'should-i-refinance': ShouldIRefinance,
  'rent-vs-buy-guide': RentVsBuyGuide,
  'fha-vs-conventional': FHAvsConventional,
  'va-funding-fee-and-waiver': VaFundingFeeAndWaiver,
  'what-are-closing-costs': WhatAreClosingCosts,
  'how-much-is-pmi': HowMuchIsPMI,
  'true-monthly-mortgage-payment': TrueMonthlyPayment,
  'pay-extra-mortgage-or-invest': PayExtraMortgageOrInvest,
  'cash-out-refinance-pay-credit-card-debt': CashOutRefinancePayCreditCardDebt,
  'car-student-loans-house-affordability': CarStudentLoansHouseAffordability,
  'debt-avalanche-vs-snowball': DebtAvalancheVsSnowball,
  'balance-transfer-vs-personal-loan': BalanceTransferVsPersonalLoan,
};
