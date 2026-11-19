'use client';

import { Box, Alert, Typography } from '@mui/material';
import { AffordHouseBySalary } from '@/lib/guides/AffordHouseBySalary';
import { VaFundingFeeAndWaiver } from '@/lib/guides/VaFundingFeeAndWaiver';

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <Alert severity="info" sx={{ my: 3, borderRadius: 2, '& .MuiAlert-message': { width: '100%' } }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{children}</Typography>
    </Alert>
  );
}

function ShouldIRefinance() {
  return (
    <>
      <h2>The Simple Test</h2>
      <p>Refinancing makes sense when the savings outweigh the costs. That's it. Everything else is detail.</p>
      <p>The two numbers you need: <strong>how much you'll save per month</strong> and <strong>how much it costs to refinance</strong>. Divide the cost by the monthly savings, and you get your break-even point in months.</p>

      <h2>The Break-Even Formula</h2>
      <Box component="table">
        <thead><tr><th>Factor</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Current payment (P&I)</td><td>$2,400/mo</td></tr>
          <tr><td>New payment (P&I)</td><td>$2,100/mo</td></tr>
          <tr><td>Monthly savings</td><td>$300/mo</td></tr>
          <tr><td>Closing costs</td><td>$6,000</td></tr>
          <tr><td><strong>Break-even</strong></td><td><strong>20 months</strong></td></tr>
        </tbody>
      </Box>
      <p>If you plan to stay in your home longer than the break-even period, refinancing is likely worth it. If you might move sooner, it's probably not.</p>

      <h2>When Refinancing Makes Sense</h2>
      <ul>
        <li><strong>Rate drop of 0.75%+:</strong> The old "1% rule" is outdated. With today's closing costs, even a 0.75% drop can be worth it if you're staying 3+ years.</li>
        <li><strong>Removing PMI:</strong> If your home has appreciated enough to reach 80% LTV, refinancing can eliminate PMI and lower your payment.</li>
        <li><strong>Switching from ARM to fixed:</strong> If your ARM's fixed period is ending and rates are reasonable, locking in a fixed rate provides certainty.</li>
        <li><strong>Shortening your term:</strong> Going from 30 to 15 years dramatically reduces total interest, though your monthly payment will increase.</li>
      </ul>

      <h2>When Refinancing Doesn't Make Sense</h2>
      <ul>
        <li><strong>You're moving soon.</strong> If you can't recoup closing costs before you sell, you'll lose money.</li>
        <li><strong>You're far into your loan.</strong> If you're 20 years into a 30-year mortgage, most of your payment is already going to principal. Refinancing restarts the clock.</li>
        <li><strong>You're extending the term.</strong> Refinancing from a 30-year (with 25 years left) into a new 30-year lowers your payment but adds 5 years of payments.</li>
        <li><strong>The rate difference is small.</strong> A 0.25% drop on a $200K loan saves about $30/month. With $5,000 in closing costs, that's a 14-year break-even.</li>
      </ul>

      <Callout>Don't just compare monthly payments. Compare total cost over the remaining life of your current loan vs the new loan. A lower payment with a longer term can cost you more overall.</Callout>

      <h2>Hidden Costs to Watch For</h2>
      <ol>
        <li><strong>Origination fees:</strong> 0.5-1% of the loan amount</li>
        <li><strong>Appraisal:</strong> $400-600 (required for most refis)</li>
        <li><strong>Title insurance:</strong> $500-1,500</li>
        <li><strong>Prepaid interest:</strong> Interest from closing date to first payment</li>
        <li><strong>Escrow padding:</strong> Lenders may require a new escrow cushion</li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>Refinancing is a math problem, not an emotional one. Calculate your break-even, compare total costs, and make the decision based on how long you'll keep the loan. Use our Refinance Break-Even calculator to run your specific numbers.</p>
    </>
  );
}

function RentVsBuyGuide() {
  return (
    <>
      <h2>The Honest Answer</h2>
      <p>It depends. That's not a cop-out — it genuinely depends on your market, timeline, financial situation, and life plans. Anyone who says "buying is always better" or "renting is throwing money away" is oversimplifying.</p>

      <h2>When Buying Makes Sense</h2>
      <ul>
        <li><strong>You're staying 5+ years.</strong> The transaction costs of buying and selling (typically 8-10% combined) mean you need time to build enough equity and appreciation to come out ahead.</li>
        <li><strong>Your local rent-to-price ratio favors buying.</strong> If annual rent is more than 5% of the home's purchase price, buying starts to look attractive.</li>
        <li><strong>You want stability.</strong> Fixed-rate mortgages lock in your housing cost. Rent increases every year.</li>
        <li><strong>You'll actually maintain the home.</strong> Homeownership includes maintenance costs (1-2% of home value per year). If you'd neglect repairs, you'll lose money.</li>
      </ul>

      <h2>When Renting Makes Sense</h2>
      <ul>
        <li><strong>You might move in 1-3 years.</strong> Transaction costs will eat any equity you build.</li>
        <li><strong>Your market is overpriced.</strong> In some cities, renting and investing the difference beats buying by a wide margin.</li>
        <li><strong>You value flexibility.</strong> Job changes, relationship changes, lifestyle changes — renting lets you adapt quickly.</li>
        <li><strong>You'd be house-poor.</strong> If buying means draining your savings and maxing your budget, renting while you build a stronger financial position is smarter.</li>
      </ul>

      <h2>The Math Most People Get Wrong</h2>
      <p>The "rent is throwing money away" argument ignores several things:</p>
      <ol>
        <li><strong>Mortgage interest is also "thrown away."</strong> In the first years of a 30-year mortgage, 70-80% of your payment goes to interest, not equity.</li>
        <li><strong>Opportunity cost of the down payment.</strong> $60,000 invested in the S&P 500 has historically returned 7-10% annually. That's $4,200-$6,000/year in potential returns.</li>
        <li><strong>Hidden costs of ownership:</strong> Property taxes, insurance, maintenance, HOA fees, and repairs add 30-50% on top of your mortgage payment.</li>
        <li><strong>Home appreciation isn't guaranteed.</strong> National averages are 3-4% per year, but individual markets can be flat or negative for years.</li>
      </ol>

      <Callout>The best comparison isn't "rent vs mortgage payment." It's "total cost of renting (including invested savings) vs total cost of owning (including all hidden costs and opportunity costs)."</Callout>

      <h2>The 5-Year Rule</h2>
      <p>A simple heuristic: if you're staying less than 5 years, renting usually wins. If you're staying more than 7 years, buying usually wins. Between 5-7 years is the gray zone where the details matter.</p>

      <h2>The Bottom Line</h2>
      <p>Don't let social pressure or conventional wisdom make this decision for you. Run the actual numbers for your specific situation. Our Rent vs Buy calculator accounts for all the variables — appreciation, rent inflation, investment returns, tax benefits, and transaction costs.</p>
    </>
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

function HowMuchIsPMI() {
  return (
    <>
      <h2>What PMI Costs</h2>
      <p>Private Mortgage Insurance (PMI) typically costs <strong>0.3% to 1.5% of your loan amount per year</strong>, paid monthly. The exact rate depends on your credit score, down payment, and loan amount.</p>
      <Box component="table">
        <thead><tr><th>Credit Score</th><th>5% Down</th><th>10% Down</th><th>15% Down</th></tr></thead>
        <tbody>
          <tr><td>760+</td><td>0.30%</td><td>0.20%</td><td>0.15%</td></tr>
          <tr><td>720-759</td><td>0.45%</td><td>0.30%</td><td>0.20%</td></tr>
          <tr><td>680-719</td><td>0.65%</td><td>0.45%</td><td>0.30%</td></tr>
          <tr><td>640-679</td><td>0.90%</td><td>0.65%</td><td>0.45%</td></tr>
          <tr><td>620-639</td><td>1.20%</td><td>0.90%</td><td>0.65%</td></tr>
        </tbody>
      </Box>
      <p>On a $300,000 loan with 5% down and a 720 credit score, PMI would cost about $1,283/year or <strong>$107/month</strong>.</p>

      <h2>When PMI Drops Off</h2>
      <p>For conventional loans, PMI is removed in two ways:</p>
      <ul>
        <li><strong>Automatic removal at 78% LTV:</strong> Your lender must cancel PMI when your loan balance reaches 78% of the original home value, based on the amortization schedule.</li>
        <li><strong>Request removal at 80% LTV:</strong> You can request cancellation when you reach 80% LTV. This can happen faster if your home has appreciated.</li>
      </ul>

      <Callout>FHA loans are different. If you put less than 10% down on an FHA loan, MIP stays for the entire life of the loan. The only way to remove it is to refinance into a conventional loan.</Callout>

      <h2>5 Strategies to Avoid or Eliminate PMI</h2>
      <ol>
        <li><strong>Put 20% down.</strong> The most straightforward way. No PMI, period. But it requires significant savings.</li>
        <li><strong>Piggyback loan (80/10/10).</strong> Take a first mortgage for 80%, a second mortgage (HELOC) for 10%, and put 10% down. No PMI on the first mortgage, though the HELOC has a higher rate.</li>
        <li><strong>Lender-paid PMI (LPMI).</strong> The lender pays PMI in exchange for a higher interest rate. Good if you plan to stay long-term, since the higher rate is permanent.</li>
        <li><strong>Make extra payments.</strong> Pay down your principal faster to reach 80% LTV sooner. Even $200/month extra can shave years off your PMI.</li>
        <li><strong>Get a new appraisal.</strong> If your home has appreciated significantly, a new appraisal showing 80%+ equity can trigger PMI removal — even if your payment schedule hasn't reached that point yet.</li>
      </ol>

      <h2>Is PMI Always Bad?</h2>
      <p>Not necessarily. PMI lets you buy a home with less than 20% down. If home prices are rising 5% per year and you're paying 0.5% in PMI, you're still building equity faster than you're paying insurance. The key is whether the total cost of homeownership (including PMI) makes sense compared to renting and saving for a larger down payment.</p>

      <h2>The Bottom Line</h2>
      <p>PMI is a cost, not a penalty. It's the price of buying sooner with less money down. For many buyers, paying PMI for a few years is worth it to start building equity now rather than waiting years to save 20%. Use our PMI Calculator to see your exact cost and when it drops off.</p>
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
        <li><strong>Buy below your max approval.</strong> If you're approved for $400K, consider $325K-$350K. The breathing room is worth it.</li>
        <li><strong>Shop insurance aggressively.</strong> Homeowner's insurance rates vary dramatically. Get 5+ quotes.</li>
        <li><strong>Appeal your property tax assessment.</strong> Many homeowners overpay because they don't challenge their assessment.</li>
        <li><strong>Build a maintenance fund.</strong> Set aside 1% of your home's value per year from day one.</li>
        <li><strong>Avoid HOA-heavy properties</strong> unless the amenities genuinely add value to your life.</li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>Your mortgage payment is just the starting point. Understanding the true monthly cost of homeownership prevents financial surprises and helps you buy a home you can actually afford — not just one a lender will approve. Use our True Monthly Mortgage Cost calculator to see every component of your real payment.</p>
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
};
