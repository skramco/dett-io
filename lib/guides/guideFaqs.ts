export interface GuideFaq {
  question: string;
  answer: string;
}

export const guideFaqs: Record<string, GuideFaq[]> = {
  'how-much-house-can-i-afford-by-salary': [
    {
      question: 'How much house can I afford on my salary?',
      answer:
        'Use the salary-band table on this page: each row is computed with Dett\'s affordability calculator (PMI, taxes, and insurance included), not hand-typed ranges. Change income, debts, down payment, or rate in the linked calculator for your situation. Figures are estimates for education only — not a loan offer.',
    },
    {
      question: 'Why does each row use the same debt and down-payment assumptions?',
      answer:
        'So the bands are comparable. Other monthly debts scale at 0.4% of annual income ($400/month at $100,000), and down payment scales at 40% of annual gross income — the same ratios as the worked $100,000 example. Your real debts and savings may differ; use the pre-filled calculator link on your row to adjust.',
    },
    {
      question: 'Is the 7.11% rate my mortgage rate?',
      answer:
        'No. The table uses the Freddie Mac Primary Mortgage Market Survey 30-year fixed average of 7.11% for the week of November 12, 2026, as an illustrative example only — not a quote or offer. Dett\'s calculators still default to 6.75% when opened without URL parameters.',
    },
    {
      question: 'What is the difference between conservative and mid-range prices?',
      answer:
        'Conservative follows the 28/36 guideline (housing capped at 28% of gross income with total debts under 36%). Mid-range uses a 36% total-debt cap for housing plus other debts. Neither is a promise of what a lender will offer; they are planning anchors from Dett\'s methodology.',
    },
    {
      question: 'Where did the old salary pages go?',
      answer:
        'Thirteen templated salary URLs — including the former /guides/afford-house-100k-salary page — now redirect permanently to this hub. The detailed $100,000 worked example, live calculator, and step-by-step math are in the $100,000 salary section on this page (#100k).',
    },
    {
      question: 'How much house can I afford on a $100,000 salary?',
      answer:
        "It depends on your other monthly debts, down payment, local taxes and insurance, and the interest rate a lender actually offers you. In Dett's worked example — $100,000 income, $400 a month in other debts, a $40,000 down payment, and an illustrative 7.11% 30-year rate — the mid-range estimate is about $340,500 with a full monthly housing cost of about $2,600. A more conservative estimate is about $307,236 with a $2,333 payment. These are estimates, not a loan offer or a decision on a loan.",
    },
    {
      question: 'Do car payments or student loans change how much house I can afford?',
      answer:
        'Yes. Lenders look at back-end DTI: housing costs plus other monthly debt payments, divided by gross monthly income. In this example, $400 a month in other debts caps the mid-range housing payment at $2,600 instead of $3,000, which lowers the mid-range home price from about $390,396 to about $340,500. Rent and utilities usually are not counted as debts in that ratio, but they still have to be paid from your budget.',
    },
    {
      question: 'Is the 28/36 rule a legal limit?',
      answer:
        'No. The 28/36 guideline is a long-used underwriting rule of thumb, not a law. The Consumer Financial Protection Bureau explains that debt-to-income is one way lenders measure ability to repay, and that different loan products and lenders use different DTI limits. A payment that fits a guideline may still be tight once taxes, utilities, maintenance, and savings are included.',
    },
    {
      question: 'Should I buy at the top of the range a lender might consider?',
      answer:
        'Not automatically. In this example, the top-of-guideline price is about $405,655 with a full housing payment of about $3,183 — 38% of gross income for housing alone. HUD has long treated housing costs above 30% of income as a cost burden. If that payment would not leave room in your take-home pay for savings and repairs, it does not fit this budget. The conservative or mid-range estimate is the more cautious place to start.',
    },
    {
      question: 'Does this estimate include property taxes, insurance, and PMI?',
      answer:
        'Yes. The full monthly housing cost includes principal and interest, property taxes, homeowners insurance, HOA dues if you enter them, and PMI when the down payment is under 20%. It does not include utilities, maintenance, furnishings, or income taxes. Actual taxes and insurance vary by property and location.',
    },
  ],
  'should-i-refinance': [
    { question: 'When should I refinance my mortgage?', answer: 'Refinance when the monthly savings exceed the costs divided by your remaining time in the home. A common rule of thumb: if you can reduce your rate by 0.75-1% or more and plan to stay 3+ years, it is likely worth it.' },
    { question: 'How much does it cost to refinance?', answer: 'Refinancing typically costs 2-5% of the loan amount, or $4,000-$10,000 on a $200,000 loan. This includes appraisal, title insurance, origination fees, and other closing costs.' },
    { question: 'What is the break-even point for refinancing?', answer: 'Divide your total refinancing costs by your monthly savings. For example, $6,000 in costs with $300/month savings = 20 months to break even. If you will stay longer than that, refinancing makes sense.' },
  ],
  'rent-vs-buy-guide': [
    { question: 'Is it better to rent or buy a house?', answer: 'It depends on how long you will stay, local market conditions, and your financial situation. Generally, buying makes sense if you plan to stay 5+ years, have a stable income, and can afford the full costs of ownership.' },
    { question: 'How long do you need to own a home for buying to make sense?', answer: 'Typically 5-7 years minimum. This allows you to recoup closing costs and build enough equity to come out ahead versus renting and investing the difference.' },
    { question: 'Is renting throwing money away?', answer: 'No. Renting provides flexibility, zero maintenance costs, and no risk of home value decline. The key comparison is renting + investing the savings versus buying and building equity.' },
  ],
  'fha-vs-conventional': [
    { question: 'Is FHA or conventional better?', answer: 'It depends on your credit score and down payment. FHA is better for credit scores below 680 or down payments under 5%. Conventional is better for credit scores above 700 because PMI is cheaper and drops off at 20% equity.' },
    { question: 'What credit score do I need for FHA vs conventional?', answer: 'FHA requires a minimum 580 credit score for 3.5% down (500 for 10% down). Conventional loans typically require 620+ but offer the best rates at 740+.' },
    { question: 'Does FHA mortgage insurance go away?', answer: 'For loans with less than 10% down, FHA mortgage insurance (MIP) lasts the entire life of the loan. For 10%+ down, it drops off after 11 years. Conventional PMI drops off at 20% equity.' },
  ],
  'va-funding-fee-and-waiver': [
    {
      question: 'How is the VA funding fee calculated?',
      answer:
        'VA sets the fee as a percentage of the loan amount (home price minus down payment on purchases). For purchases, rates depend on down payment tiers (under 5%, 5–9.99%, and 10%+) and whether it is your first or a subsequent use of your VA loan benefit. Cash-out refinances use flat first-use or subsequent-use rates. IRRRLs use a flat 0.5%. Dett\'s VA calculator uses the same rate table published on VA.gov effective April 7, 2023.',
    },
    {
      question: 'Who is exempt from the VA funding fee?',
      answer:
        'VA.gov lists exemptions including veterans receiving VA compensation for a service-connected disability, those eligible for that compensation but receiving retirement or active-duty pay instead, eligible surviving spouses receiving Dependency and Indemnity Compensation (DIC), borrowers with certain pre-discharge proposed ratings before closing, and active-duty service members who provide Purple Heart evidence by closing. Exemption is documented at closing — not assumed automatically.',
    },
    {
      question: 'Can I finance the VA funding fee into my loan?',
      answer:
        'Yes. VA allows you to add the funding fee to the loan balance and pay it over time, or pay it in cash at closing. On purchase loans, only the funding fee may be financed into the loan amount; other closing costs are generally paid separately unless covered by seller credits or lender pricing. Financing the fee raises the total loan and monthly principal and interest slightly.',
    },
    {
      question: 'Does a larger down payment lower the VA funding fee?',
      answer:
        'On purchase loans, yes — putting at least 5% down moves the fee from 2.15% to 1.5% on first use, and from 3.3% to 1.5% on subsequent use. At 10% down or more, the purchase fee is 1.25% for both first and subsequent use. Cash-out refinances do not get a down-payment discount; IRRRLs stay at 0.5% regardless of equity.',
    },
  ],
  'pay-extra-mortgage-or-invest': [
    {
      question: 'Is paying extra on my mortgage better than investing?',
      answer:
        'Prepaying earns a guaranteed return equal to your mortgage interest rate (before taxes). Investing may earn more over long periods but is not guaranteed. Dett\'s payoff calculator compares both paths using the same total monthly cash outflow over the original loan term — use your own after-tax return assumption.',
    },
    {
      question: 'Should I invest or pay off my mortgage when rates are below 7%?',
      answer:
        'There is no universal rule. If your mortgage rate is lower than your realistic after-tax investment return, investing has the mathematical edge in the calculator — but only if you actually invest the money. If you would spend the extra, prepaying builds equity instead.',
    },
    {
      question: 'Does the payoff calculator include taxes on investment gains?',
      answer:
        'No. Investment returns in the tool are gross assumptions. Mortgage interest deductibility also depends on your tax situation. Treat the comparison as directional and talk to a tax professional for your filing status.',
    },
    {
      question: 'Should I prepay before maxing out my 401(k)?',
      answer:
        'Many planners prioritize an employer match first because it is an immediate return. After high-interest debt and emergency savings, the prepay-vs-invest choice depends on your rate, risk tolerance, and retirement timeline — not a one-size rule.',
    },
    {
      question: 'Are lump-sum prepayments handled differently than monthly extras?',
      answer:
        'Yes. Lump sums apply once in the year you choose in the calculator. Recasting (lowering the payment after a lump sum) is a separate servicer option the tool can illustrate when enabled; it is not automatic on every loan.',
    },
  ],
  'cash-out-refinance-pay-credit-card-debt': [
    {
      question: 'Can I use a cash-out refinance to pay credit cards?',
      answer:
        'Cash-out refinances replace your mortgage with a larger loan and give you the difference in cash, which some borrowers use to pay unsecured debt. You must qualify based on income, credit, equity, and property — the CFPB explains the product, but availability is not guaranteed.',
    },
    {
      question: 'Why is my mortgage payment higher after paying off cards?',
      answer:
        'You may reset your rate and term, finance closing costs, and add principal equal to the cash-out amount. Even with a lower APR than credit cards, spreading repayment over 30 years can raise the total mortgage payment.',
    },
    {
      question: 'Is credit card debt secured after a cash-out refinance?',
      answer:
        'The credit card debt is paid off, but you owe more on your home. Missed mortgage payments risk foreclosure — a risk credit card debt alone does not carry in the same way.',
    },
    {
      question: 'What closing costs should I expect on a cash-out refi?',
      answer:
        'Costs vary by lender and state but often include appraisal, title, origination, and prepaid items. Enter your estimate in Dett\'s cash-out calculator; Regulation Z requires lenders to disclose fees on the Loan Estimate and Closing Disclosure.',
    },
    {
      question: 'What if I run my credit cards up again after consolidating?',
      answer:
        'You would owe the higher mortgage plus new card balances — a common outcome when spending habits do not change. A consolidation only helps if total debt and payments fit your budget going forward.',
    },
    {
      question: 'What are alternatives to cash-out refi for card debt?',
      answer:
        'Balance transfers, fixed-rate personal loans, avalanche/snowball payoff plans, and nonprofit credit counseling keep debt unsecured. Compare monthly payments and total interest under each path.',
    },
  ],
  'car-student-loans-house-affordability': [
    {
      question: 'Do car payments count in mortgage DTI?',
      answer:
        'Yes. Installment auto loans and leases typically count at the contractual monthly payment. Lenders use the figure on your credit report unless you document a different arrangement.',
    },
    {
      question: 'How do student loans affect how much house I can afford?',
      answer:
        'Student loan payments count in back-end DTI. Income-driven plans may use a documented payment or a lender-specific rule when the credit report shows $0. Higher student payments leave less room for housing under common 36%–43% planning caps.',
    },
    {
      question: 'Will paying off my car before buying a house help?',
      answer:
        'Eliminating a monthly payment lowers back-end DTI and can raise affordability estimates, but paying cash for the car uses down-payment savings. Model both in the affordability and DTI calculators.',
    },
    {
      question: 'Are credit card minimums or balances used in DTI?',
      answer:
        'Most lenders use minimum payments. High balances may trigger additional rules depending on program. Paying down revolving debt can help if it lowers the counted minimum.',
    },
    {
      question: 'What DTI do lenders use for mortgages?',
      answer:
        'Guidelines vary by program and compensating factors. Many conventional conversations cite 36% housing-only and roughly 43%–50% total debt ratios as planning anchors — not promises of a particular loan.',
    },
  ],
  'debt-avalanche-vs-snowball': [
    {
      question: 'What is the debt avalanche method?',
      answer:
        'Pay minimums on all debts, then put all extra money toward the highest APR balance until it is gone, then move to the next highest APR. It minimizes interest paid if you stay consistent.',
    },
    {
      question: 'What is the debt snowball method?',
      answer:
        'Pay minimums on all debts, then attack the smallest balance first for quick wins, then roll payments to the next smallest. You may pay slightly more interest than avalanche but build momentum.',
    },
    {
      question: 'Which method saves more money?',
      answer:
        'Avalanche saves more interest when you follow it strictly because it targets expensive APRs first. The gap narrows if snowball keeps you paying extra while avalanche would fail.',
    },
    {
      question: 'Can I use Dett to model avalanche with multiple cards?',
      answer:
        'The payoff calculator models one loan at a time. Run each debt separately or use the high-rate example as a template, then apply the same extra payment to whichever account your strategy targets this month.',
    },
    {
      question: 'Should I pay credit cards or my mortgage first?',
      answer:
        'Usually high-APR unsecured debt before low-rate mortgage prepayment, unless you need mortgage payoff for other goals. Always keep required payments current on every account.',
    },
  ],
  'balance-transfer-vs-personal-loan': [
    {
      question: 'When is a 0% balance transfer worth it?',
      answer:
        'When the transfer fee is small relative to interest you would pay, you can pay off before the promo ends, and you will not miss payments that trigger penalty APRs. Read the post-promo rate on your agreement.',
    },
    {
      question: 'How is a personal loan different from a balance transfer?',
      answer:
        'A personal loan is fixed-term installment debt with a disclosed payment. A balance transfer moves debt to another card, often with a temporary promo rate, and may leave old cards open.',
    },
    {
      question: 'Do balance transfer fees matter?',
      answer:
        'Yes. A typical 3%–5% fee on the amount moved adds to your cost upfront. Include it when comparing to personal loan origination fees and interest.',
    },
    {
      question: 'Will consolidating cards help my mortgage DTI?',
      answer:
        'It can if the new fixed payment is lower than the combined minimums lenders count today — but extending term can keep you in debt longer. Model before-and-after payments in the DTI calculator.',
    },
    {
      question: 'What happens if I do not pay off a 0% balance in time?',
      answer:
        'Remaining balances usually accrue interest at the go-to APR on the card agreement, which can erase promo savings. Budget enough monthly payment to clear the promo balance early.',
    },
    {
      question: 'Should I close credit cards after consolidating?',
      answer:
        'Closing cards can hurt utilization and average age of accounts, but keeping them open risks new charges. Choose based on behavior, not only credit score impact.',
    },
  ],
  'what-are-closing-costs': [
    { question: 'How much are closing costs on a house?', answer: 'Closing costs typically range from 2-5% of the purchase price. On a $300,000 home, expect $6,000-$15,000 in total closing costs including lender fees, title insurance, appraisal, and prepaid items.' },
    { question: 'Who pays closing costs, buyer or seller?', answer: 'Both. Buyers typically pay 2-5% and sellers pay 6-10% (mostly real estate commissions). In buyer-friendly markets, sellers may agree to cover some of the buyer closing costs.' },
    { question: 'Can I negotiate closing costs?', answer: 'Yes. Origination fees, application fees, and some third-party fees are negotiable. You can also ask for seller credits, choose a no-closing-cost loan option, or shop multiple lenders for better fees.' },
  ],
  'how-much-is-pmi': [
    { question: 'How much does PMI cost per month?', answer: 'PMI typically costs 0.3% to 1.5% of your loan amount per year, paid monthly. On a $300,000 loan, that is $75-$375/month depending on your credit score and down payment.' },
    { question: 'How do I get rid of PMI?', answer: 'PMI automatically drops off when your loan balance reaches 78% of the original home value. You can request removal at 80%. You can also refinance, get a new appraisal showing increased value, or make extra payments to reach 20% equity faster.' },
    { question: 'Can I avoid PMI with less than 20% down?', answer: 'Yes. Options include piggyback loans (80/10/10), lender-paid PMI (higher rate, no separate PMI), VA loans (no PMI regardless of down payment), and some credit union programs.' },
  ],
  'true-monthly-mortgage-payment': [
    { question: 'What is included in a monthly mortgage payment?', answer: 'A full mortgage payment includes principal, interest, property taxes, homeowners insurance (PITI), plus potentially PMI, HOA fees, and supplemental costs. The true cost is typically 40-60% higher than principal and interest alone.' },
    { question: 'How much are property taxes on a house?', answer: 'Property taxes vary widely by location, typically 0.5% to 2.5% of home value per year. On a $350,000 home, expect $1,750-$8,750/year or $146-$729/month.' },
    { question: 'What costs does a mortgage payment not cover?', answer: 'Mortgage payments do not cover maintenance (1-2% of home value/year), utilities, lawn care, pest control, or home warranty. Budget an additional $300-$800/month for these ongoing costs.' },
  ],
};
