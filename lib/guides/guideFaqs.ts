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
