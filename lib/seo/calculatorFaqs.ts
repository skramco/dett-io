/**
 * Frequently asked questions for each calculator.
 *
 * These power both the visible FAQ section on every calculator page and the
 * FAQPage structured data (JSON-LD). Google requires FAQ rich-result content
 * to be visible on the page, so keep the two in sync by editing only here.
 *
 * Keep answers evergreen — avoid hardcoding current interest rates or
 * year-specific loan limits that go stale.
 */

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export const calculatorFaqs: Record<string, CalculatorFaq[]> = {
  'mortgage-cost': [
    {
      question: 'What does a true monthly mortgage payment include?',
      answer:
        'A true monthly payment includes principal, interest, property taxes, and homeowners insurance (PITI), plus PMI if your down payment is under 20% and any HOA fees. Most basic calculators only show principal and interest, which understates your real monthly cost — often by several hundred dollars.',
    },
    {
      question: 'How is a monthly mortgage payment calculated?',
      answer:
        'The principal-and-interest portion uses the standard amortization formula: M = P × [r(1+r)^n] / [(1+r)^n − 1], where P is the loan amount, r is the monthly interest rate, and n is the number of monthly payments. Taxes, insurance, PMI, and HOA fees are then added on top to get your total payment.',
    },
    {
      question: 'Why is so much of my early mortgage payment interest?',
      answer:
        'Interest is charged on your outstanding balance, which is highest at the start of the loan. In year one of a typical 30-year mortgage, most of each principal-and-interest payment goes to interest. The split gradually shifts toward principal as the balance falls.',
    },
  ],
  affordability: [
    {
      question: 'How much house can I afford based on my income?',
      answer:
        'Most lenders use debt-to-income (DTI) ratios: housing costs should stay under roughly 28% of gross monthly income, and total debts under about 36–43%. Your affordable price also depends on your down payment, interest rate, existing debts, property taxes, and insurance — which is exactly what this calculator models.',
    },
    {
      question: 'What is the 28/36 rule for home affordability?',
      answer:
        'The 28/36 rule says your monthly housing payment should not exceed 28% of your gross monthly income, and your total monthly debt payments (housing plus car loans, student loans, credit cards) should not exceed 36%. Some loan programs allow higher ratios, but 28/36 is a conservative benchmark.',
    },
    {
      question: 'Does the affordability estimate equal what a lender will approve?',
      answer:
        'No. This calculator estimates a comfortable price range from standard DTI guidelines, but actual approval depends on your credit history, loan program, property appraisal, and the lender\u2019s own underwriting standards. Many buyers are approved for more than they can comfortably afford, so a conservative budget is usually wise.',
    },
  ],
  'down-payment': [
    {
      question: 'How much should I put down on a house?',
      answer:
        'There is no single right answer. 20% down avoids PMI and lowers your payment, but many buyers do well with 5–10% down, paying PMI temporarily while keeping cash for reserves and repairs. This calculator compares the monthly payment, PMI cost, and total interest for each down payment level.',
    },
    {
      question: 'Do I need 20% down to buy a house?',
      answer:
        'No. Conventional loans allow as little as 3% down, FHA loans require 3.5%, and VA and USDA loans can be 0% down for eligible borrowers. Below 20% down on a conventional loan you pay private mortgage insurance (PMI), which is removable once you reach about 20% equity.',
    },
    {
      question: 'Is it better to put more money down or keep cash in savings?',
      answer:
        'A larger down payment lowers your monthly payment and total interest, but draining savings is risky — most experts recommend keeping an emergency fund of three to six months of expenses plus money for closing costs and repairs. Compare scenarios side by side to see what each extra dollar of down payment actually buys you.',
    },
  ],
  'rent-vs-buy': [
    {
      question: 'Is it cheaper to rent or buy a home?',
      answer:
        'It depends on how long you stay, local price-to-rent ratios, interest rates, and what your down payment could earn if invested instead. Buying usually wins over longer horizons because equity builds and rent keeps rising; renting often wins for shorter stays because buying and selling costs are high.',
    },
    {
      question: 'How long do I need to stay in a home for buying to beat renting?',
      answer:
        'A common breakeven is three to seven years. You need enough time for appreciation and principal paydown to overcome closing costs (typically 2–5% to buy and 6–10% to sell). This calculator computes your specific breakeven year from your rent, home price, and assumptions.',
    },
    {
      question: 'What costs of homeownership do renters not pay?',
      answer:
        'Owners pay property taxes, homeowners insurance, maintenance (often estimated at about 1% of home value per year), HOA fees, and transaction costs when selling. A fair rent-vs-buy comparison includes all of these, not just the mortgage payment versus rent.',
    },
  ],
  refinance: [
    {
      question: 'When is refinancing a mortgage worth it?',
      answer:
        'Refinancing generally makes sense when the monthly savings repay the closing costs before you plan to move or refinance again — the breakeven point. A rate reduction of 0.5–1 percentage point or more is a common trigger, but the real test is total cost over the time you expect to keep the loan.',
    },
    {
      question: 'How do I calculate my refinance breakeven point?',
      answer:
        'Divide total refinancing costs by your true monthly savings. For example, $6,000 in closing costs ÷ $200 of monthly savings = 30 months to break even. If you plan to stay longer than the breakeven, refinancing can pay off; if not, it likely costs you money.',
    },
    {
      question: 'Does refinancing restart my mortgage?',
      answer:
        'Usually yes — a new 30-year loan resets the amortization clock, which can increase total interest even when the rate drops. Compare total remaining cost on your current loan versus the new loan, or consider matching the new term to your remaining years to avoid extending the payoff date.',
    },
  ],
  'cash-out-refi': [
    {
      question: 'How does a cash-out refinance work?',
      answer:
        'A cash-out refinance replaces your current mortgage with a larger one and pays you the difference in cash at closing. Lenders typically require you to keep at least 20% equity in the home, so the maximum cash is roughly 80% of the home\u2019s value minus your current balance.',
    },
    {
      question: 'How much equity can I take out of my home?',
      answer:
        'Most conventional cash-out refinances cap the new loan at 80% of appraised value (loan-to-value). If your home is worth $500,000, the new loan can usually be up to $400,000; subtract your existing balance and closing costs to see your available cash.',
    },
    {
      question: 'Is a cash-out refinance better than a HELOC or personal loan?',
      answer:
        'It depends on your current rate. If your existing mortgage rate is lower than today\u2019s rates, a cash-out refi reprices your entire balance at the new higher rate — a HELOC or home equity loan that leaves the first mortgage untouched is often cheaper. If today\u2019s rates are at or below your current rate, a cash-out refi can be competitive.',
    },
  ],
  'recast-vs-refi': [
    {
      question: 'What is a mortgage recast?',
      answer:
        'A recast applies a lump-sum payment to your principal and re-amortizes the remaining balance over your existing term at your existing rate, lowering the monthly payment. It typically costs a small fee (often $150–$500), requires no credit check or appraisal, and keeps your current interest rate.',
    },
    {
      question: 'Should I recast or refinance my mortgage?',
      answer:
        'Recast if you like your current rate and mainly want a lower payment after a lump sum — it is cheap and simple. Refinance if today\u2019s rates are meaningfully below your current rate, since a recast never changes the rate. This calculator compares both against simply prepaying principal.',
    },
    {
      question: 'Does a mortgage recast shorten the loan term?',
      answer:
        'No. A recast keeps your original payoff date and lowers the monthly payment. If your goal is paying off the loan sooner, applying the lump sum as a regular prepayment (keeping your payment the same) saves more interest and shortens the term.',
    },
  ],
  'points-buydown': [
    {
      question: 'What are mortgage discount points?',
      answer:
        'One discount point costs 1% of the loan amount and typically lowers your rate by about 0.25 percentage points, though the exact tradeoff varies by lender and market. Points are prepaid interest: you pay more at closing in exchange for a lower rate and payment for the life of the loan.',
    },
    {
      question: 'When is buying points worth it?',
      answer:
        'Points pay off when you keep the loan past the breakeven point — the upfront cost divided by the monthly savings. If you might sell or refinance within a few years, points often lose money. They also compete with better uses of cash, like a larger down payment that could remove PMI.',
    },
    {
      question: 'What is the difference between discount points and a temporary buydown?',
      answer:
        'Discount points permanently lower the rate for the full term. A temporary buydown (like a 2-1 buydown) reduces the rate only for the first year or two, after which the payment returns to the full note rate. Temporary buydowns are often seller- or builder-funded concessions.',
    },
  ],
  'arm-vs-fixed': [
    {
      question: 'What is the difference between an ARM and a fixed-rate mortgage?',
      answer:
        'A fixed-rate mortgage keeps the same rate for the entire term. An adjustable-rate mortgage (ARM) starts with a lower fixed rate for an initial period (such as 5 or 7 years), then adjusts periodically based on a market index plus a margin, subject to rate caps.',
    },
    {
      question: 'What do ARM rate caps like 2/1/5 mean?',
      answer:
        'The three numbers limit how much the rate can rise: at the first adjustment (e.g. 2 percentage points), at each later adjustment (e.g. 1 point), and over the life of the loan (e.g. 5 points above the start rate). Caps define your worst-case payment, which this calculator models explicitly.',
    },
    {
      question: 'When does an ARM make sense over a fixed rate?',
      answer:
        'An ARM can win if you are confident you will sell or refinance before the fixed period ends, since you pocket the initial-rate savings without facing adjustments. If you may stay longer, compare the fixed rate against the ARM\u2019s worst-case schedule — not just its teaser rate.',
    },
  ],
  'timeline-simulator': [
    {
      question: 'How does my moving timeline affect which mortgage is best?',
      answer:
        'The shorter your expected stay, the more upfront costs (points, closing costs) and long-term rate protection (30-year fixed) lose value, and the more ARMs or lower-cost structures win. Over a long stay, a low fixed rate and faster payoff usually dominate. This simulator compares structures over your specific horizon.',
    },
    {
      question: 'Is a 15-year or 30-year mortgage better?',
      answer:
        'A 15-year loan carries a lower rate and dramatically less total interest, but a much higher required payment. A 30-year loan maximizes flexibility — and you can prepay it on a 15-year schedule voluntarily. The right choice depends on cash-flow security and how long you will hold the loan.',
    },
    {
      question: 'What costs matter most if I plan to move within a few years?',
      answer:
        'Upfront costs dominate short horizons: closing costs, discount points, and the slow early equity build of a 30-year amortization. Over a 3–7 year stay, total cost of ownership (payments plus costs minus equity at sale) is a better comparison metric than monthly payment alone.',
    },
  ],
  'extra-payment': [
    {
      question: 'How much does paying extra on my mortgage save?',
      answer:
        'Every extra dollar goes straight to principal, which removes all the future interest that balance would have accrued. On a typical 30-year loan, even $100–$200 extra per month can cut years off the term and save tens of thousands in interest, depending on your rate and balance.',
    },
    {
      question: 'Is it better to pay extra monthly or make one annual lump sum?',
      answer:
        'Earlier is better: monthly extra payments reduce the balance sooner than an equal annual lump sum, so they save slightly more interest. The difference is usually modest — consistency matters far more than timing.',
    },
    {
      question: 'Should I pay extra on my mortgage or invest the money?',
      answer:
        'Prepaying earns a guaranteed, tax-free return equal to your mortgage rate; investing may earn more but with risk. Many people prioritize high-interest debt and retirement-account matches first, then split between prepayment and investing based on their rate and risk tolerance.',
    },
  ],
  acceleration: [
    {
      question: 'What is the fastest way to pay off a mortgage?',
      answer:
        'The biggest levers are extra principal payments (monthly or lump sum), biweekly payment schedules, and refinancing to a shorter term. Which wins depends on your rate, remaining term, and discipline — this planner compares the strategies side by side on your actual loan.',
    },
    {
      question: 'Do biweekly payments really pay off a mortgage faster?',
      answer:
        'Yes, modestly. Paying half your monthly payment every two weeks produces 26 half-payments — the equivalent of 13 full monthly payments per year. That one extra annual payment typically shaves several years off a 30-year loan.',
    },
    {
      question: 'Are there penalties for paying off a mortgage early?',
      answer:
        'Most U.S. conforming loans made after 2014 have no prepayment penalty, but check your note or ask your servicer. Also confirm extra payments are applied to principal, not held as prepaid future payments.',
    },
  ],
  biweekly: [
    {
      question: 'How do biweekly mortgage payments save money?',
      answer:
        'You pay half your monthly payment every two weeks. Because there are 52 weeks in a year, you make 26 half-payments — 13 full payments instead of 12. The extra payment goes to principal, shortening the loan and cutting total interest.',
    },
    {
      question: 'Should I pay for a lender biweekly payment program?',
      answer:
        'Usually no. Many programs charge enrollment or per-transaction fees for something you can do yourself free: divide your monthly payment by 12 and add that amount to principal each month, which achieves nearly identical savings.',
    },
    {
      question: 'Do biweekly payments lower my interest rate?',
      answer:
        'No. Your rate and required payment stay the same. The savings come purely from reducing principal faster, so less interest accrues over the remaining life of the loan.',
    },
  ],
  'interest-sensitivity': [
    {
      question: 'How much does a 1% rate change affect my mortgage payment?',
      answer:
        'As a rule of thumb, each 1 percentage point change in rate moves the payment by roughly 9–12% on a 30-year loan. On a $400,000 loan, that is typically around $250–$300 per month — and tens of thousands of dollars of interest over the loan\u2019s life.',
    },
    {
      question: 'Should I lock my mortgage rate or float?',
      answer:
        'Locking removes the risk of rates rising before closing; floating gambles on a decline. Because the downside of a rate spike usually outweighs the upside of a small drop, most borrowers lock once they are within their closing window — especially when this calculator shows high payment sensitivity.',
    },
    {
      question: 'What rate drop would justify refinancing later?',
      answer:
        'A common guideline is 0.5–1 percentage point below your current rate, but the real test is breakeven: whether the monthly savings repay closing costs before you would move or refinance again. Use the rate ladder here to find your personal trigger point.',
    },
  ],
  amortization: [
    {
      question: 'What is an amortization schedule?',
      answer:
        'An amortization schedule is a payment-by-payment table showing how much of each payment goes to interest versus principal, and the remaining balance after each payment. Early payments are mostly interest; the mix shifts toward principal over time.',
    },
    {
      question: 'How is each payment split between principal and interest?',
      answer:
        'Each month, interest equals your remaining balance times the monthly rate (annual rate ÷ 12). The rest of your fixed payment reduces principal. As the balance falls, the interest portion shrinks and the principal portion grows — the schedule makes this visible month by month.',
    },
    {
      question: 'When will my loan be half paid off?',
      answer:
        'Much later than the halfway point in time. On a typical 30-year fixed loan, the balance does not fall to half the original amount until roughly year 19–20, because early payments are interest-heavy. Your schedule shows the exact crossover for your rate and term.',
    },
  ],
  dti: [
    {
      question: 'What is a debt-to-income (DTI) ratio?',
      answer:
        'DTI compares your monthly debt payments to gross monthly income. The front-end ratio counts only housing costs; the back-end ratio adds all other debts like car loans, student loans, and credit card minimums. Lenders use both to judge how much mortgage you can handle.',
    },
    {
      question: 'What DTI do I need to qualify for a mortgage?',
      answer:
        'Conventional loans generally want back-end DTI under 43–45% (sometimes up to 50% with strong compensating factors). FHA can allow higher with strong credit, and VA focuses on residual income alongside a 41% guideline. Lower is always stronger — under 36% is considered comfortable.',
    },
    {
      question: 'How can I lower my DTI before applying?',
      answer:
        'Pay off or pay down monthly obligations (especially small loans with large payments), avoid new credit, and increase documentable income. Because DTI uses minimum monthly payments, eliminating a $300/month car payment can raise your mortgage budget by tens of thousands of dollars.',
    },
  ],
  'closing-costs': [
    {
      question: 'How much are closing costs on a house?',
      answer:
        'Typically 2–5% of the purchase price, covering lender fees, title insurance and escrow, government recording and transfer taxes, and prepaid items like property taxes, homeowners insurance, and per-diem interest. On a $400,000 home that is roughly $8,000–$20,000 on top of your down payment.',
    },
    {
      question: 'What is the difference between closing costs and prepaids?',
      answer:
        'Closing costs are one-time fees for services (origination, appraisal, title). Prepaids are expenses you would owe anyway, collected early: upfront homeowners insurance, property tax escrow deposits, and interest from closing day to month-end. Both must be paid at closing, so budget for the combined total.',
    },
    {
      question: 'Can closing costs be negotiated or rolled into the loan?',
      answer:
        'Often, yes. You can shop title and lender fees, request seller concessions, or take a slightly higher rate in exchange for lender credits. On refinances, costs can usually be financed into the loan balance; on purchases, rolling them in is generally only possible via the rate, not the balance.',
    },
  ],
  pmi: [
    {
      question: 'What is PMI and when do I have to pay it?',
      answer:
        'Private mortgage insurance protects the lender when a conventional loan exceeds 80% of the home\u2019s value — i.e., when you put down less than 20%. It typically costs about 0.3–1.5% of the loan amount per year, charged monthly, with the rate driven mostly by your credit score and down payment.',
    },
    {
      question: 'When does PMI go away?',
      answer:
        'You can request cancellation once the balance reaches 80% of the original value, and servicers must auto-terminate at 78% (if current on payments). Appreciation can get you there faster: with a new appraisal, many lenders allow removal at 75–80% of current value after a seasoning period.',
    },
    {
      question: 'Is it bad to pay PMI?',
      answer:
        'Not necessarily. PMI is temporary and often costs less than waiting years to save 20% while prices and rents rise. The math matters: compare the total PMI you will pay before cancellation against the cost of waiting or the return on keeping cash invested.',
    },
  ],
  fha: [
    {
      question: 'How much is FHA mortgage insurance (MIP)?',
      answer:
        'FHA loans charge an upfront premium of 1.75% of the loan amount (usually financed into the loan) plus an annual premium — commonly 0.55% for a 30-year loan with minimal down — paid monthly. Unlike conventional PMI, FHA MIP usually lasts the life of the loan when you put less than 10% down.',
    },
    {
      question: 'What credit score and down payment does an FHA loan require?',
      answer:
        'FHA allows 3.5% down with a credit score of 580 or higher, or 10% down with scores from 500–579. Lenders may apply their own stricter overlays, but FHA remains one of the most accessible paths for buyers with thinner credit or smaller savings.',
    },
    {
      question: 'Should I choose FHA or conventional?',
      answer:
        'FHA often wins for lower credit scores because its insurance pricing is not credit-based. Conventional usually wins for stronger credit because PMI is cheaper and cancellable at 20% equity, while FHA MIP typically persists until you refinance. Compare the all-in monthly and lifetime costs for your profile.',
    },
  ],
  va: [
    {
      question: 'Do VA loans really require no down payment and no PMI?',
      answer:
        'Yes. Eligible veterans, service members, and some surviving spouses can finance 100% of the purchase price with no monthly mortgage insurance. Instead, VA charges a one-time funding fee (unless you are exempt due to a service-connected disability), which can be financed into the loan.',
    },
    {
      question: 'How much is the VA funding fee?',
      answer:
        'For first-time use with no down payment, the funding fee is 2.15% of the loan amount; subsequent uses are 3.3%. Putting 5% or 10% down lowers the fee, and veterans receiving disability compensation are typically exempt entirely.',
    },
    {
      question: 'Is a VA loan better than FHA or conventional?',
      answer:
        'For eligible borrowers, usually yes: zero down, no monthly mortgage insurance, competitive rates, and limits on certain fees. The main tradeoff is the funding fee. Compare the total monthly and lifetime cost — the absence of PMI/MIP typically makes VA the cheapest option by a wide margin.',
    },
  ],
};

export function getCalculatorFaqs(slug: string): CalculatorFaq[] {
  return calculatorFaqs[slug] ?? [];
}
