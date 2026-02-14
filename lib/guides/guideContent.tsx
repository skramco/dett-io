'use client';

import { Box, Alert, Typography } from '@mui/material';

function SalaryTable({ salary, monthly, maxHome28, maxHome36, downPayment5, downPayment10, downPayment20 }: {
  salary: string; monthly: string; maxHome28: string; maxHome36: string;
  downPayment5: string; downPayment10: string; downPayment20: string;
}) {
  return (
    <Box component="table">
      <thead>
        <tr><th>Metric</th><th>Amount</th></tr>
      </thead>
      <tbody>
        <tr><td>Gross Annual Income</td><td>{salary}</td></tr>
        <tr><td>Gross Monthly Income</td><td>{monthly}</td></tr>
        <tr><td>Max Housing Payment (28% DTI)</td><td>${(parseFloat(monthly.replace(/[$,]/g, '')) * 0.28).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</td></tr>
        <tr><td>Max Home Price (28% front-end DTI)</td><td>{maxHome28}</td></tr>
        <tr><td>Max Home Price (36% back-end DTI)</td><td>{maxHome36}</td></tr>
        <tr><td>Down Payment at 5%</td><td>{downPayment5}</td></tr>
        <tr><td>Down Payment at 10%</td><td>{downPayment10}</td></tr>
        <tr><td>Down Payment at 20%</td><td>{downPayment20}</td></tr>
      </tbody>
    </Box>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <Alert severity="info" sx={{ my: 3, borderRadius: 2, '& .MuiAlert-message': { width: '100%' } }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{children}</Typography>
    </Alert>
  );
}

function AffordHouse40K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $40,000 salary, you can likely afford a home in the <strong>$120,000 to $170,000</strong> range. It's tight, but absolutely possible — especially with FHA loans, down payment assistance, and smart location choices.</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$40,000" monthly="$3,333" maxHome28="$140,000" maxHome36="$170,000" downPayment5="$7,000" downPayment10="$14,000" downPayment20="$28,000" />

      <h2>What Lenders See</h2>
      <p>At $40K, your gross monthly income is about $3,333. The 28% front-end DTI rule gives you a maximum housing payment of roughly <strong>$933 per month</strong>. That's your ceiling for principal, interest, taxes, insurance, and any PMI or HOA fees combined.</p>
      <p>The challenge at this income level isn't qualification — it's finding a home in your price range that doesn't need major repairs. Lenders will approve you, but the real question is whether the housing stock in your area works at $120K-$170K.</p>

      <h2>Loan Programs That Help</h2>
      <p>At $40K, government-backed loans are your best friend:</p>
      <ul>
        <li><strong>FHA loans:</strong> 3.5% down with a 580+ credit score. On a $140K home, that's just $4,900 down.</li>
        <li><strong>USDA loans:</strong> 0% down in eligible rural and suburban areas. Income limits vary by county, but $40K typically qualifies.</li>
        <li><strong>VA loans:</strong> 0% down, no PMI if you're a veteran or active military.</li>
        <li><strong>State/local programs:</strong> Many states offer $5,000-$15,000 in down payment assistance for buyers under median income.</li>
      </ul>

      <Callout>USDA loans are underrated at this income level. If you're open to suburban or rural areas, you can buy with zero down payment and no PMI — a massive advantage.</Callout>

      <h2>The Real Monthly Cost</h2>
      <p>On a $140,000 home with 3.5% down (FHA) at 6.75%:</p>
      <ul>
        <li><strong>Principal & Interest:</strong> ~$876/month</li>
        <li><strong>Property Taxes:</strong> ~$145/month (varies by location)</li>
        <li><strong>Insurance:</strong> ~$100/month</li>
        <li><strong>FHA MIP:</strong> ~$80/month</li>
        <li><strong>Total:</strong> ~$1,200/month</li>
      </ul>
      <p>That's about 36% of gross income — above the ideal 28% but within FHA's allowable limits. You'll need minimal other debt to make this work.</p>

      <h2>Strategies to Make It Work</h2>
      <ol>
        <li><strong>Eliminate all other debt first.</strong> At $40K, every dollar of monthly debt directly competes with your mortgage qualification.</li>
        <li><strong>Target USDA-eligible areas.</strong> Zero down payment changes the math completely.</li>
        <li><strong>Apply for down payment assistance.</strong> Many programs are specifically designed for your income level.</li>
        <li><strong>Consider a fixer-upper with an FHA 203(k) loan.</strong> Buy below market and finance the repairs into the mortgage.</li>
        <li><strong>Get a roommate.</strong> $400-600/month in rental income makes the payment very manageable.</li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>$40K is the entry point for homeownership, and it requires discipline and creativity. But thousands of people buy homes at this income level every year. The key is using every advantage available — government loans, assistance programs, and strategic location choices. Don't let anyone tell you it's impossible.</p>
    </>
  );
}

function AffordHouse50K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $50,000 salary, you can likely afford a home in the <strong>$150,000 to $200,000</strong> range, depending on your debts, down payment, and location. That assumes a 6.5-7% interest rate and keeping your housing costs at or below 28% of gross income.</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$50,000" monthly="$4,167" maxHome28="$175,000" maxHome36="$200,000" downPayment5="$8,750" downPayment10="$17,500" downPayment20="$35,000" />

      <h2>What Lenders Look At</h2>
      <p>Lenders care about three things: your <strong>debt-to-income ratio (DTI)</strong>, your <strong>credit score</strong>, and your <strong>down payment</strong>.</p>
      <p>At $50K, your gross monthly income is about $4,167. The standard guideline is that your total housing payment (principal, interest, taxes, and insurance) shouldn't exceed 28% of that — roughly <strong>$1,167 per month</strong>.</p>
      <p>But that's just the front-end ratio. Lenders also look at your back-end DTI, which includes all monthly debts. If you have a $300 car payment and $200 in student loans, that's $500 less room for housing.</p>

      <h2>The Real Monthly Cost</h2>
      <p>Most people focus on the mortgage payment, but your true monthly cost includes:</p>
      <ul>
        <li><strong>Principal & Interest:</strong> The actual loan payment</li>
        <li><strong>Property Taxes:</strong> Typically 1-2% of home value per year</li>
        <li><strong>Homeowner's Insurance:</strong> $100-200/month</li>
        <li><strong>PMI:</strong> $50-150/month if you put less than 20% down</li>
        <li><strong>HOA:</strong> $0-400/month depending on the property</li>
      </ul>
      <p>On a $175,000 home with 5% down, your true monthly cost is likely around <strong>$1,350-$1,500</strong> — which may push past the 28% guideline.</p>

      <Callout>At $50K, FHA loans are worth exploring. They allow 3.5% down with a 580+ credit score, which means you'd only need about $6,125 for a $175K home.</Callout>

      <h2>Strategies to Make It Work</h2>
      <ol>
        <li><strong>Pay down existing debt first.</strong> Every $100 in monthly debt payments reduces your buying power by roughly $15,000-$20,000.</li>
        <li><strong>Look into FHA loans.</strong> Lower down payment requirements and more flexible credit standards.</li>
        <li><strong>Consider first-time buyer programs.</strong> Many states offer down payment assistance for buyers under certain income thresholds.</li>
        <li><strong>House hack.</strong> Buy a duplex, live in one unit, rent the other. The rental income can offset your mortgage.</li>
        <li><strong>Be realistic about location.</strong> $175K buys very different homes in different markets.</li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>A $50K salary absolutely can buy you a home — you just need to be strategic about it. Focus on minimizing debt, saving for a down payment, and choosing a home that fits comfortably within your budget. The worst thing you can do is stretch to the maximum a lender will approve.</p>
    </>
  );
}

function AffordHouse60K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $60,000 salary, you can likely afford a home in the <strong>$200,000 to $250,000</strong> range. This assumes manageable existing debt, a reasonable down payment, and current interest rates around 6.5-7%.</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$60,000" monthly="$5,000" maxHome28="$215,000" maxHome36="$250,000" downPayment5="$10,750" downPayment10="$21,500" downPayment20="$43,000" />

      <h2>What $60K Actually Gets You</h2>
      <p>At $60K gross, your monthly income is $5,000. Following the 28% rule, your maximum housing payment is <strong>$1,400 per month</strong>. That's a meaningful step up from a $50K salary — roughly $230 more per month for housing.</p>
      <p>With a 10% down payment on a $215,000 home at 6.75%, your principal and interest payment would be about $1,256. Add taxes, insurance, and PMI, and you're looking at roughly <strong>$1,550-$1,700</strong> total.</p>

      <h2>The Debt Factor</h2>
      <p>Your existing debts are the biggest variable. Here's how common debts affect your buying power:</p>
      <Box component="table">
        <thead><tr><th>Monthly Debt</th><th>Reduction in Buying Power</th></tr></thead>
        <tbody>
          <tr><td>$200 (car payment)</td><td>-$30,000 to -$35,000</td></tr>
          <tr><td>$300 (student loans)</td><td>-$45,000 to -$50,000</td></tr>
          <tr><td>$500 (car + student loans)</td><td>-$75,000 to -$85,000</td></tr>
        </tbody>
      </Box>
      <p>This is why paying down debt before buying is so powerful. Eliminating a $300/month student loan payment could add $45,000+ to your home buying budget.</p>

      <h2>Down Payment Strategies</h2>
      <p>At $60K, saving 20% ($43,000) for a $215K home is a stretch. Here are more realistic options:</p>
      <ul>
        <li><strong>5% down ($10,750):</strong> Conventional loan with PMI. PMI adds roughly $80-120/month.</li>
        <li><strong>3.5% down ($7,525):</strong> FHA loan. Lower barrier but includes upfront and monthly MIP.</li>
        <li><strong>0% down:</strong> VA loan (if eligible) or USDA loan (rural areas). No down payment and no PMI.</li>
      </ul>

      <Callout>Don't forget closing costs — typically 2-5% of the home price. On a $215K home, that's $4,300-$10,750 on top of your down payment.</Callout>

      <h2>The Bottom Line</h2>
      <p>$60K puts you in a solid position to buy in many markets. The key is keeping your total housing cost under 30% of gross income and having a realistic plan for the down payment and closing costs. Run the numbers with our calculators before you start shopping.</p>
    </>
  );
}

function AffordHouse65K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $65,000 salary, you can likely afford a home in the <strong>$215,000 to $270,000</strong> range. You're past the entry-level squeeze and into territory where conventional loans with reasonable terms are well within reach.</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$65,000" monthly="$5,417" maxHome28="$230,000" maxHome36="$270,000" downPayment5="$11,500" downPayment10="$23,000" downPayment20="$46,000" />

      <h2>The $65K Advantage</h2>
      <p>At $65K gross, your monthly income is $5,417. The 28% rule gives you a housing budget of <strong>$1,517 per month</strong>. That's a comfortable step above the $50-60K range — enough to access homes in the low-to-mid $200s in most non-coastal markets.</p>
      <p>You're also in a strong position for conventional loans with as little as 3-5% down, and your income is high enough that FHA's mortgage insurance premium becomes less attractive compared to conventional PMI that drops off at 20% equity.</p>

      <h2>What Your Payment Looks Like</h2>
      <p>On a $230,000 home with 10% down at 6.75%:</p>
      <Box component="table">
        <thead><tr><th>Component</th><th>Monthly Cost</th></tr></thead>
        <tbody>
          <tr><td>Principal & Interest</td><td>$1,343</td></tr>
          <tr><td>Property Taxes</td><td>$192</td></tr>
          <tr><td>Insurance</td><td>$130</td></tr>
          <tr><td>PMI</td><td>$95</td></tr>
          <tr><td><strong>Total</strong></td><td><strong>$1,760</strong></td></tr>
        </tbody>
      </Box>
      <p>That's about 32% of gross income — slightly above the 28% ideal but well within most lenders' comfort zone if you have minimal other debt.</p>

      <Callout>At $65K, you're in the sweet spot for conventional 97 loans (3% down) if you're a first-time buyer. That's just $6,900 down on a $230K home.</Callout>

      <h2>The Debt Equation</h2>
      <p>Your existing monthly debts are the biggest swing factor:</p>
      <ul>
        <li><strong>$0 in monthly debt:</strong> You can comfortably target $250K+</li>
        <li><strong>$300/month (car payment):</strong> Reduces buying power by ~$45,000</li>
        <li><strong>$500/month (car + student loans):</strong> Reduces buying power by ~$75,000</li>
      </ul>
      <p>If you're carrying significant debt, paying it down before buying is the single most powerful thing you can do.</p>

      <h2>Strategies at $65K</h2>
      <ol>
        <li><strong>Compare conventional vs FHA carefully.</strong> At this income, conventional with PMI often beats FHA's lifetime MIP.</li>
        <li><strong>Target 10% down if possible.</strong> It significantly reduces your PMI rate and monthly payment.</li>
        <li><strong>Don't forget closing costs.</strong> Budget $5,000-$12,000 on top of your down payment.</li>
        <li><strong>Shop multiple lenders.</strong> Rate differences of 0.25% save thousands over the life of the loan.</li>
        <li><strong>Consider buying in an up-and-coming area.</strong> Your budget goes further, and you build equity as the area appreciates.</li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>$65K is a solid income for home buying. You have enough to qualify for good loan terms without being stretched thin. The key is keeping your total debt manageable and not buying at the absolute top of your approval range. Leave yourself a cushion.</p>
    </>
  );
}

function AffordHouse75K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $75,000 salary, you can likely afford a home in the <strong>$250,000 to $325,000</strong> range. This is the income level where conventional loans with competitive terms become very accessible.</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$75,000" monthly="$6,250" maxHome28="$275,000" maxHome36="$325,000" downPayment5="$13,750" downPayment10="$27,500" downPayment20="$55,000" />

      <h2>The Sweet Spot</h2>
      <p>$75K is often considered the "sweet spot" for first-time home buyers. Your monthly gross of $6,250 gives you a 28% housing budget of <strong>$1,750 per month</strong> — enough to comfortably afford a home in the mid-$200s to low-$300s in most markets outside of major coastal cities.</p>

      <h2>What Your Payment Actually Looks Like</h2>
      <p>Let's break down a $275,000 home with 10% down at 6.75%:</p>
      <Box component="table">
        <thead><tr><th>Component</th><th>Monthly Cost</th></tr></thead>
        <tbody>
          <tr><td>Principal & Interest</td><td>$1,605</td></tr>
          <tr><td>Property Tax (1.2%)</td><td>$275</td></tr>
          <tr><td>Homeowner's Insurance</td><td>$145</td></tr>
          <tr><td>PMI (10% down)</td><td>$95</td></tr>
          <tr><td><strong>Total PITI + PMI</strong></td><td><strong>$2,120</strong></td></tr>
        </tbody>
      </Box>
      <p>That $2,120 is 34% of your gross income — above the 28% guideline but within the 36% back-end limit if you have minimal other debt. This is where the trade-off between "what you can afford" and "what's comfortable" matters.</p>

      <h2>The Comfortable vs Maximum Budget</h2>
      <ul>
        <li><strong>Conservative ($225K-$250K):</strong> Payment around $1,600-$1,800. Plenty of breathing room for savings, emergencies, and lifestyle.</li>
        <li><strong>Moderate ($250K-$300K):</strong> Payment around $1,800-$2,200. Comfortable if you have low debt and stable income.</li>
        <li><strong>Aggressive ($300K-$325K):</strong> Payment around $2,200-$2,400. Tight budget with little margin for error.</li>
      </ul>

      <Callout>Just because a lender approves you for $325K doesn't mean you should spend $325K. The most financially secure homeowners spend less than their maximum approval.</Callout>

      <h2>Smart Moves at $75K</h2>
      <ol>
        <li><strong>Target 10% down.</strong> It's a good balance between reducing PMI costs and not depleting your savings.</li>
        <li><strong>Keep 3-6 months of expenses in reserve</strong> after closing. Don't drain your savings for the down payment.</li>
        <li><strong>Compare loan types.</strong> At $75K with good credit, conventional loans often beat FHA on total cost.</li>
        <li><strong>Consider buying points</strong> if you plan to stay 5+ years. At this price range, buying down your rate by 0.25% saves meaningful money over time.</li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>$75K gives you real options in most housing markets. Focus on the monthly payment you're comfortable with — not the maximum you qualify for — and you'll be in great shape.</p>
    </>
  );
}

function AffordHouse80K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On an $80,000 salary, you can likely afford a home in the <strong>$275,000 to $350,000</strong> range, depending on your debt load and down payment.</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$80,000" monthly="$6,667" maxHome28="$295,000" maxHome36="$350,000" downPayment5="$14,750" downPayment10="$29,500" downPayment20="$59,000" />

      <h2>What $80K Buys in Today's Market</h2>
      <p>At $80K, your 28% housing budget is <strong>$1,867 per month</strong>. That's enough for a solid home in most mid-tier markets. In expensive metros (San Francisco, New York, Boston), you'll still face challenges. In the Midwest, South, and many suburbs, you'll have plenty of options.</p>

      <h2>The PMI Question</h2>
      <p>At this income level, the down payment decision becomes important. Here's how PMI affects your payment on a $295K home:</p>
      <Box component="table">
        <thead><tr><th>Down Payment</th><th>PMI/Month</th><th>Total Payment</th></tr></thead>
        <tbody>
          <tr><td>5% ($14,750)</td><td>$130</td><td>$2,175</td></tr>
          <tr><td>10% ($29,500)</td><td>$90</td><td>$2,005</td></tr>
          <tr><td>15% ($44,250)</td><td>$45</td><td>$1,870</td></tr>
          <tr><td>20% ($59,000)</td><td>$0</td><td>$1,780</td></tr>
        </tbody>
      </Box>
      <p>The jump from 5% to 10% down saves about $170/month. From 10% to 20% saves another $225/month — but requires an additional $29,500 in cash. Whether that's worth it depends on your savings timeline and what else you'd do with that money.</p>

      <Callout>PMI isn't forever. On a conventional loan, it drops off automatically when you reach 78% LTV. On a $295K home with 10% down, that's roughly 7-8 years — or sooner if your home appreciates.</Callout>

      <h2>Closing Costs to Budget For</h2>
      <p>On a $295K home, expect closing costs of <strong>$5,900 to $14,750</strong> (2-5%). Common costs include:</p>
      <ul>
        <li><strong>Origination fee:</strong> 0.5-1% of loan amount</li>
        <li><strong>Appraisal:</strong> $400-600</li>
        <li><strong>Title insurance:</strong> $1,000-2,000</li>
        <li><strong>Prepaid taxes and insurance:</strong> 2-6 months upfront</li>
      </ul>

      <h2>The Bottom Line</h2>
      <p>$80K is a strong income for homeownership. You have enough flexibility to choose between a lower price with more savings cushion, or a higher price that stretches your budget. The right choice depends on your risk tolerance and long-term plans.</p>
    </>
  );
}

function AffordHouse90K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $90,000 salary, you can likely afford a home in the <strong>$325,000 to $400,000</strong> range. At this income, you have real flexibility — the question shifts from "can I buy?" to "how much should I buy?"</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$90,000" monthly="$7,500" maxHome28="$325,000" maxHome36="$400,000" downPayment5="$16,250" downPayment10="$32,500" downPayment20="$65,000" />

      <h2>The $90K Sweet Spot</h2>
      <p>At $90K gross, your monthly income is $7,500. The 28% rule gives you <strong>$2,100 per month</strong> for housing — enough to comfortably afford homes in the mid-$300s in most markets, and even higher if you have minimal debt.</p>
      <p>This is the income level where you start having real choices: newer construction vs. established neighborhoods, 3-bedroom vs. 4-bedroom, suburbs vs. closer to the city center.</p>

      <h2>Payment Breakdown</h2>
      <p>On a $350,000 home with 10% down at 6.75%:</p>
      <Box component="table">
        <thead><tr><th>Component</th><th>Monthly Cost</th></tr></thead>
        <tbody>
          <tr><td>Principal & Interest</td><td>$2,043</td></tr>
          <tr><td>Property Taxes</td><td>$292</td></tr>
          <tr><td>Insurance</td><td>$165</td></tr>
          <tr><td>PMI</td><td>$130</td></tr>
          <tr><td><strong>Total</strong></td><td><strong>$2,630</strong></td></tr>
        </tbody>
      </Box>
      <p>That's 35% of gross income — manageable if you have low other debt, but consider targeting $300K-$325K for more breathing room.</p>

      <h2>The Rate Buydown Opportunity</h2>
      <p>At $90K, you're in a strong position to consider buying down your interest rate with points. Here's why:</p>
      <ul>
        <li><strong>1 point (1% of loan amount):</strong> ~$3,150 on a $315K loan, typically reduces your rate by 0.25%</li>
        <li><strong>Monthly savings:</strong> ~$50-60/month</li>
        <li><strong>Break-even:</strong> About 4-5 years</li>
      </ul>
      <p>If you plan to stay in the home 5+ years, buying points is often a smart move at this price range.</p>

      <Callout>At $90K, you're likely better off with a conventional loan than FHA. Conventional PMI drops off at 20% equity, while FHA's MIP lasts the life of the loan (for loans with less than 10% down).</Callout>

      <h2>Common Mistakes at $90K</h2>
      <ol>
        <li><strong>Buying at the top of approval.</strong> Lenders may approve you for $400K+, but that doesn't mean you should spend it. Target 3x-3.5x your income.</li>
        <li><strong>Ignoring the full cost.</strong> A $350K home costs $2,600+/month when you include everything — not just the $2,043 P&I.</li>
        <li><strong>Skipping the rate comparison.</strong> At this loan size, a 0.25% rate difference saves $15,000+ over 30 years.</li>
        <li><strong>Forgetting maintenance reserves.</strong> Budget 1% of home value per year ($3,500) for repairs and upkeep.</li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>$90K gives you genuine buying power in most U.S. markets. The smartest move is to buy comfortably below your maximum — aim for a payment that's 25-28% of gross income, not 35%. The financial flexibility you preserve is worth more than the extra square footage.</p>
    </>
  );
}

function AffordHouse100K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $100,000 salary, you can likely afford a home in the <strong>$350,000 to $450,000</strong> range. At this income level, you have access to competitive loan products and can comfortably handle a substantial mortgage.</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$100,000" monthly="$8,333" maxHome28="$375,000" maxHome36="$450,000" downPayment5="$18,750" downPayment10="$37,500" downPayment20="$75,000" />

      <h2>The $100K Advantage</h2>
      <p>At $100K, your 28% housing budget is <strong>$2,333 per month</strong>. This opens up a wide range of homes in most markets. You're also more likely to qualify for the best interest rates, which can save tens of thousands over the life of your loan.</p>

      <h2>Should You Buy More House or Invest the Difference?</h2>
      <p>This is the key question at $100K. You could:</p>
      <ul>
        <li><strong>Buy a $375K home</strong> and invest the monthly savings. If you can afford $2,333/mo but your payment is $1,900, that's $433/mo into investments.</li>
        <li><strong>Buy a $425K home</strong> and build equity in a more valuable asset. Real estate appreciation on a $425K home is more impactful than on a $375K home.</li>
        <li><strong>Buy a $350K home</strong> and pay it off aggressively. Extra payments on a smaller mortgage can save you 10+ years and $100K+ in interest.</li>
      </ul>

      <Callout>There's no universally "right" answer. It depends on your local market, investment knowledge, risk tolerance, and life plans. Run the scenarios with our calculators.</Callout>

      <h2>Points and Rate Buydowns</h2>
      <p>At this price range, buying points starts to make real financial sense. On a $375K home:</p>
      <Box component="table">
        <thead><tr><th>Strategy</th><th>Upfront Cost</th><th>Monthly Savings</th><th>Break-Even</th></tr></thead>
        <tbody>
          <tr><td>Par rate (6.75%)</td><td>$0</td><td>—</td><td>—</td></tr>
          <tr><td>1 point (6.5%)</td><td>$3,375</td><td>$52/mo</td><td>65 months</td></tr>
          <tr><td>2 points (6.25%)</td><td>$6,750</td><td>$104/mo</td><td>65 months</td></tr>
        </tbody>
      </Box>
      <p>If you plan to stay 7+ years, buying points is usually worth it. If you might move or refinance sooner, keep your cash.</p>

      <h2>The Bottom Line</h2>
      <p>$100K gives you excellent buying power and flexibility. The biggest risk at this level isn't qualifying — it's overbuying. Stick to a payment that leaves room for savings, investments, and life.</p>
    </>
  );
}

function AffordHouse120K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $120,000 salary, you can likely afford a home in the <strong>$425,000 to $525,000</strong> range. You're well-positioned for conventional loans with favorable terms.</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$120,000" monthly="$10,000" maxHome28="$450,000" maxHome36="$525,000" downPayment5="$22,500" downPayment10="$45,000" downPayment20="$90,000" />

      <h2>The DTI Sweet Spot</h2>
      <p>At $120K, your 28% housing budget is <strong>$2,800 per month</strong>. Most lenders will approve you for significantly more than this — potentially up to 43-45% DTI for qualified borrowers. But approval and affordability are different things.</p>
      <p>A good rule of thumb: if your total housing cost (PITI + HOA + PMI) is under 25% of gross income, you'll barely feel it. At 28-32%, it's manageable. Above 35%, you'll feel the squeeze.</p>

      <h2>Jumbo Loan Territory</h2>
      <p>Depending on your location, homes above $472,030 (the 2024 conforming loan limit in most areas) may require a jumbo loan. Jumbo loans typically need:</p>
      <ul>
        <li><strong>Higher credit score:</strong> 700+ (often 720+)</li>
        <li><strong>Larger down payment:</strong> 10-20% minimum</li>
        <li><strong>More reserves:</strong> 6-12 months of payments in savings</li>
        <li><strong>Lower DTI:</strong> Usually under 43%</li>
      </ul>
      <p>In high-cost areas (parts of CA, NY, HI, etc.), conforming limits are higher — up to $1,089,300 — so you may not need a jumbo loan at all.</p>

      <Callout>At $120K, you're likely choosing between a comfortable home at $400K and a stretch home at $500K+. The comfortable choice almost always wins long-term.</Callout>

      <h2>The Bottom Line</h2>
      <p>$120K is a strong household income for homeownership. Focus on keeping your housing costs reasonable relative to your income, maintain healthy reserves, and don't let lifestyle inflation push you into an uncomfortable mortgage.</p>
    </>
  );
}

function AffordHouse125K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $125,000 salary, you can likely afford a home in the <strong>$425,000 to $550,000</strong> range. You're in a strong financial position — the challenge isn't qualifying, it's avoiding the temptation to overbuy.</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$125,000" monthly="$10,417" maxHome28="$450,000" maxHome36="$550,000" downPayment5="$22,500" downPayment10="$45,000" downPayment20="$90,000" />

      <h2>The Comfort Zone</h2>
      <p>At $125K gross, your monthly income is $10,417. The 28% rule gives you <strong>$2,917 per month</strong> for housing. That's enough to comfortably afford a home in the mid-$400s — and potentially higher if you have zero other debt.</p>
      <p>But here's the trap: lenders may approve you for $550K or more. Just because you can borrow that much doesn't mean you should. The difference between a $450K home and a $550K home is roughly $650/month in total housing costs — money that could go toward retirement, investments, or an emergency fund.</p>

      <h2>Payment Comparison</h2>
      <Box component="table">
        <thead><tr><th>Home Price</th><th>Down (10%)</th><th>Monthly Payment</th><th>% of Gross Income</th></tr></thead>
        <tbody>
          <tr><td>$400,000</td><td>$40,000</td><td>$2,870</td><td>27.6%</td></tr>
          <tr><td>$450,000</td><td>$45,000</td><td>$3,225</td><td>31.0%</td></tr>
          <tr><td>$500,000</td><td>$50,000</td><td>$3,580</td><td>34.4%</td></tr>
          <tr><td>$550,000</td><td>$55,000</td><td>$3,935</td><td>37.8%</td></tr>
        </tbody>
      </Box>

      <Callout>The sweet spot at $125K is a home priced at 3x-3.5x your income ($375K-$437K). This keeps your housing costs under 30% and leaves room for everything else.</Callout>

      <h2>Tax Considerations</h2>
      <p>At $125K, you're in the 22-24% federal tax bracket. Mortgage interest is deductible, but only if you itemize — and the standard deduction ($14,600 single / $29,200 married in 2024) is high enough that many buyers at this level don't benefit from itemizing.</p>
      <p>Don't buy a more expensive home just for the tax deduction. Run the numbers — the deduction rarely makes up for the higher payment.</p>

      <h2>Smart Strategies at $125K</h2>
      <ol>
        <li><strong>Target 15-20% down.</strong> At this income, saving $45K-$90K is achievable. Putting 20% down eliminates PMI entirely.</li>
        <li><strong>Consider a 15-year mortgage.</strong> Your income supports the higher payment, and you'll save $150K+ in interest over the life of the loan.</li>
        <li><strong>Don't neglect retirement.</strong> Max out your 401(k) match before stretching for a bigger house.</li>
        <li><strong>Build a 6-month emergency fund first.</strong> At $125K, that's $30K-$40K in liquid savings before you buy.</li>
        <li><strong>Shop for rates aggressively.</strong> On a $400K loan, a 0.25% rate difference saves $20,000+ over 30 years.</li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>At $125K, you have the luxury of choice. Use it wisely — buy a home that fits your life, not one that impresses your friends. The wealthiest homeowners are often the ones who bought well below their maximum and invested the difference.</p>
    </>
  );
}

function AffordHouse150K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $150,000 salary, you can likely afford a home in the <strong>$525,000 to $650,000</strong> range. At this income, the question shifts from "can I afford it?" to "should I spend that much?"</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$150,000" monthly="$12,500" maxHome28="$550,000" maxHome36="$650,000" downPayment5="$27,500" downPayment10="$55,000" downPayment20="$110,000" />

      <h2>The High-Income Trap</h2>
      <p>Higher income often comes with higher expectations — nicer neighborhoods, better schools, newer construction. These are valid priorities, but they can push you toward the top of your budget without you realizing it.</p>
      <p>At $150K, your 28% housing budget is <strong>$3,500 per month</strong>. That's a substantial payment. But in high-cost markets (Bay Area, NYC, Boston, Seattle), $550K might only get you a modest condo or a home with a long commute.</p>

      <h2>Tax Considerations</h2>
      <p>At $150K, you're in the 22-24% federal tax bracket. The mortgage interest deduction can be valuable, but only if you itemize. With the standard deduction at $14,600 (single) or $29,200 (married filing jointly), you need significant deductions to make itemizing worthwhile.</p>
      <p>On a $500K mortgage at 6.75%, you'd pay roughly $33,750 in interest the first year. Combined with state/local taxes and property taxes, this could push you past the standard deduction threshold.</p>

      <h2>ARM vs Fixed at This Price Range</h2>
      <p>At higher home prices, the rate difference between ARM and fixed-rate mortgages becomes more impactful:</p>
      <Box component="table">
        <thead><tr><th>Loan Type</th><th>Rate</th><th>Monthly P&I</th><th>5-Year Savings</th></tr></thead>
        <tbody>
          <tr><td>30-Year Fixed</td><td>6.75%</td><td>$3,244</td><td>—</td></tr>
          <tr><td>5/1 ARM</td><td>5.75%</td><td>$2,918</td><td>$19,560</td></tr>
          <tr><td>7/1 ARM</td><td>6.00%</td><td>$2,998</td><td>$14,760</td></tr>
        </tbody>
      </Box>
      <p>If you're confident you'll move or refinance within 5-7 years, an ARM could save you nearly $20K. But if rates rise and you stay, the fixed rate protects you.</p>

      <Callout>At $150K, the biggest financial mistake isn't buying a home — it's buying too much home and sacrificing retirement savings, emergency funds, and investment opportunities.</Callout>

      <h2>The Bottom Line</h2>
      <p>$150K gives you excellent buying power. Use it wisely. The wealthiest homeowners often buy below their means and invest the difference. Don't let your mortgage be the reason you can't build long-term wealth.</p>
    </>
  );
}

function AffordHouse175K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $175,000 salary, you can likely afford a home in the <strong>$600,000 to $750,000</strong> range. At this income, you have access to premium loan products and significant negotiating power — but the stakes of overbuying are higher too.</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$175,000" monthly="$14,583" maxHome28="$625,000" maxHome36="$750,000" downPayment5="$31,250" downPayment10="$62,500" downPayment20="$125,000" />

      <h2>Conforming vs. Jumbo Territory</h2>
      <p>In most U.S. counties, the conforming loan limit is $766,550 (2024). At $175K income, you're right at the edge. Homes priced above this threshold may require a jumbo loan, which typically means:</p>
      <ul>
        <li><strong>Higher credit score requirements</strong> (usually 700+)</li>
        <li><strong>Larger down payment</strong> (10-20% minimum)</li>
        <li><strong>More reserves required</strong> (6-12 months of payments in savings)</li>
        <li><strong>Slightly higher rates</strong> (though the gap has narrowed)</li>
      </ul>
      <p>If you can stay under the conforming limit, you'll get better terms. In high-cost areas (parts of CA, NY, MA, etc.), the limit is higher — up to $1,149,825.</p>

      <h2>Payment Scenarios</h2>
      <Box component="table">
        <thead><tr><th>Home Price</th><th>Down (15%)</th><th>Monthly Payment</th><th>% of Gross Income</th></tr></thead>
        <tbody>
          <tr><td>$550,000</td><td>$82,500</td><td>$3,730</td><td>25.6%</td></tr>
          <tr><td>$625,000</td><td>$93,750</td><td>$4,240</td><td>29.1%</td></tr>
          <tr><td>$700,000</td><td>$105,000</td><td>$4,750</td><td>32.6%</td></tr>
          <tr><td>$750,000</td><td>$112,500</td><td>$5,090</td><td>34.9%</td></tr>
        </tbody>
      </Box>

      <Callout>At $175K, the optimal home price is 3x-3.5x your income ($525K-$612K). This keeps your housing costs comfortable and preserves your ability to invest aggressively elsewhere.</Callout>

      <h2>The Wealth-Building Perspective</h2>
      <p>At $175K, you're in a position where your investment decisions matter as much as your housing decision. Consider:</p>
      <ul>
        <li><strong>Buying a $550K home instead of $700K</strong> saves ~$1,000/month — that's $12,000/year into investments</li>
        <li><strong>$12,000/year invested at 8% for 30 years</strong> = ~$1.4 million in additional wealth</li>
        <li><strong>The "extra" house</strong> might appreciate, but historically stocks outperform real estate</li>
      </ul>

      <h2>ARM vs. Fixed at This Level</h2>
      <p>At higher loan amounts, adjustable-rate mortgages (ARMs) become more attractive:</p>
      <ul>
        <li><strong>5/1 ARM:</strong> Typically 0.5-1% lower than 30-year fixed for the first 5 years</li>
        <li><strong>On a $530K loan:</strong> That's $250-500/month in savings for 5 years</li>
        <li><strong>Best for:</strong> Buyers who plan to move or refinance within 5-7 years</li>
      </ul>
      <p>If you're confident you'll stay 10+ years, a fixed rate provides certainty. If there's any chance you'll move in 5-7 years, an ARM is worth serious consideration.</p>

      <h2>The Bottom Line</h2>
      <p>$175K puts you in an enviable position. The smartest move is to resist lifestyle inflation, buy a home that's comfortable (not maximal), and deploy the savings into investments that compound over decades. Your future self will thank you.</p>
    </>
  );
}

function AffordHouse200K() {
  return (
    <>
      <h2>The Quick Answer</h2>
      <p>On a $200,000 salary, you can likely afford a home in the <strong>$700,000 to $875,000</strong> range — and potentially higher in high-cost markets. At this income, you're in the top 10% of U.S. earners and have access to premium loan products.</p>

      <h2>Your Numbers at a Glance</h2>
      <SalaryTable salary="$200,000" monthly="$16,667" maxHome28="$725,000" maxHome36="$875,000" downPayment5="$36,250" downPayment10="$72,500" downPayment20="$145,000" />

      <h2>Jumbo Loan Territory</h2>
      <p>At $200K income, you're likely shopping in jumbo loan territory (above $766,550 in most counties). Here's what that means:</p>
      <Box component="table">
        <thead><tr><th>Factor</th><th>Conforming Loan</th><th>Jumbo Loan</th></tr></thead>
        <tbody>
          <tr><td>Max Loan Amount</td><td>$766,550</td><td>$1M-$3M+</td></tr>
          <tr><td>Min Credit Score</td><td>620</td><td>700-720</td></tr>
          <tr><td>Min Down Payment</td><td>3-5%</td><td>10-20%</td></tr>
          <tr><td>Reserve Requirements</td><td>0-2 months</td><td>6-12 months</td></tr>
          <tr><td>Interest Rate</td><td>Market rate</td><td>+0.1-0.3%</td></tr>
        </tbody>
      </Box>

      <Callout>In high-cost areas (San Francisco, NYC, LA, etc.), conforming limits are higher — up to $1,149,825. Check your county's limit before assuming you need a jumbo loan.</Callout>

      <h2>The $200K Paradox</h2>
      <p>Here's what most $200K earners don't realize: the more you earn, the more important it is to buy <em>below</em> your maximum. Why?</p>
      <ul>
        <li><strong>Taxes take a bigger bite.</strong> At $200K, your effective federal + state tax rate is 30-35%. Your take-home is closer to $130K-$140K.</li>
        <li><strong>Lifestyle inflation is real.</strong> Higher income often means higher spending on cars, dining, travel, and childcare.</li>
        <li><strong>Opportunity cost is massive.</strong> Every $100K in extra home price is $100K not invested in the market.</li>
      </ul>
      <p>A $200K earner buying a $600K home and investing the difference will almost certainly build more wealth than one buying a $850K home.</p>

      <h2>Tax Strategy</h2>
      <p>At $200K, mortgage interest deduction becomes more relevant:</p>
      <ul>
        <li><strong>Interest on a $600K loan at 6.75%:</strong> ~$40,000/year in the early years</li>
        <li><strong>Plus property taxes:</strong> $7,000-$15,000/year depending on location</li>
        <li><strong>Combined:</strong> Likely exceeds the standard deduction, making itemizing worthwhile</li>
        <li><strong>Tax savings:</strong> Roughly $10,000-$15,000/year in the 24-32% bracket</li>
      </ul>
      <p>But remember: you're spending $47,000-$55,000 to save $10,000-$15,000 in taxes. The deduction reduces the cost of homeownership — it doesn't make it free.</p>

      <h2>Smart Strategies at $200K</h2>
      <ol>
        <li><strong>Put 20% down to avoid PMI.</strong> At this price range, PMI costs $200-400/month. Eliminating it saves $2,400-$4,800/year.</li>
        <li><strong>Consider a 15-year mortgage.</strong> Your income supports it, and you'll save $200K-$400K in interest.</li>
        <li><strong>Max out all tax-advantaged accounts first.</strong> 401(k), IRA, HSA — before stretching for a bigger house.</li>
        <li><strong>Keep 6-12 months of expenses liquid.</strong> At $200K lifestyle, that's $50K-$100K in accessible savings.</li>
        <li><strong>Don't forget the "hidden" costs.</strong> A $750K home costs $7,500-$15,000/year in maintenance alone.</li>
      </ol>

      <h2>The Bottom Line</h2>
      <p>At $200K, you can afford a very nice home. The question is whether that home should cost $600K or $850K. The financially optimal answer is almost always the lower number. Buy for comfort and quality of life, not for status — and invest the difference. That's how $200K earners become millionaires.</p>
    </>
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
          <tr><td>MI Removal</td><td>Stays for life of loan (if &lt;10% down)</td><td>Drops at 78-80% LTV</td></tr>
          <tr><td>Max DTI</td><td>Up to 57% (with compensating factors)</td><td>Up to 50%</td></tr>
          <tr><td>Loan Limits (2024)</td><td>$472,030 (most areas)</td><td>$472,030 (conforming)</td></tr>
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
  'afford-house-40k-salary': AffordHouse40K,
  'afford-house-50k-salary': AffordHouse50K,
  'afford-house-60k-salary': AffordHouse60K,
  'afford-house-65k-salary': AffordHouse65K,
  'afford-house-75k-salary': AffordHouse75K,
  'afford-house-80k-salary': AffordHouse80K,
  'afford-house-90k-salary': AffordHouse90K,
  'afford-house-100k-salary': AffordHouse100K,
  'afford-house-120k-salary': AffordHouse120K,
  'afford-house-125k-salary': AffordHouse125K,
  'afford-house-150k-salary': AffordHouse150K,
  'afford-house-175k-salary': AffordHouse175K,
  'afford-house-200k-salary': AffordHouse200K,
  'should-i-refinance': ShouldIRefinance,
  'rent-vs-buy-guide': RentVsBuyGuide,
  'fha-vs-conventional': FHAvsConventional,
  'what-are-closing-costs': WhatAreClosingCosts,
  'how-much-is-pmi': HowMuchIsPMI,
  'true-monthly-mortgage-payment': TrueMonthlyPayment,
};
