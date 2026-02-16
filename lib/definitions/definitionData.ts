export interface Definition {
  slug: string;
  term: string;
  shortDefinition: string;
  fullExplanation: string;
  keyFacts: string[];
  example?: string;
  relatedTerms: string[];
  relatedCalculators: { name: string; slug: string }[];
  faq: { question: string; answer: string }[];
}

export const definitions: Definition[] = [
  {
    slug: 'pmi',
    term: 'Private Mortgage Insurance (PMI)',
    shortDefinition: 'PMI is insurance that protects your mortgage lender if you default on your loan. It is required when your down payment is less than 20% of the home\'s purchase price.',
    fullExplanation: 'Private Mortgage Insurance (PMI) is a monthly premium added to your mortgage payment when you put less than 20% down on a conventional loan. PMI protects the lender — not you — against losses if you stop making payments. The cost typically ranges from 0.3% to 1.5% of the original loan amount per year, depending on your credit score, down payment size, and loan type. On a $360,000 loan, PMI might cost $75 to $450 per month. PMI is automatically cancelled once your loan balance reaches 78% of the original home value, or you can request cancellation at 80% loan-to-value (LTV). FHA loans have a similar concept called Mortgage Insurance Premium (MIP), but FHA MIP lasts for the life of the loan if you put less than 10% down.',
    keyFacts: [
      'Required on conventional loans with less than 20% down payment',
      'Costs 0.3% to 1.5% of the loan amount per year',
      'Automatically cancelled at 78% LTV; can request cancellation at 80% LTV',
      'FHA mortgage insurance (MIP) is different — it lasts for the life of the loan',
      'PMI protects the lender, not the borrower',
      'Higher credit scores result in lower PMI rates',
    ],
    example: 'On a $400,000 home with 10% down ($40,000), your loan is $360,000. At a PMI rate of 0.5%, you\'d pay $1,800/year or $150/month in PMI. Once your balance drops to $320,000 (80% of $400,000), you can request PMI cancellation.',
    relatedTerms: ['LTV', 'MIP', 'down-payment', 'conventional-loan'],
    relatedCalculators: [
      { name: 'PMI Calculator', slug: 'pmi' },
      { name: 'Down Payment Strategy', slug: 'down-payment' },
      { name: 'FHA Loan Calculator', slug: 'fha' },
    ],
    faq: [
      { question: 'How do I get rid of PMI?', answer: 'PMI is automatically removed when your loan balance reaches 78% of the original home value. You can also request removal at 80% LTV by contacting your servicer. Other strategies include making extra payments to reach 80% faster, getting a new appraisal if your home has appreciated, or refinancing.' },
      { question: 'Is PMI tax deductible?', answer: 'The PMI tax deduction has been extended and expired multiple times. Check current IRS guidelines for the latest status. When available, it allows you to deduct PMI premiums as mortgage interest if your adjusted gross income is below certain thresholds.' },
      { question: 'How much is PMI per month?', answer: 'PMI typically costs $50 to $450 per month depending on your loan amount, down payment, and credit score. On a $300,000 loan with 10% down and a 720 credit score, expect to pay around $100-$150/month.' },
    ],
  },
  {
    slug: 'dti',
    term: 'Debt-to-Income Ratio (DTI)',
    shortDefinition: 'DTI is the percentage of your gross monthly income that goes toward paying debts. Lenders use DTI to determine how much mortgage you can afford.',
    fullExplanation: 'Debt-to-income ratio (DTI) is one of the most important numbers in mortgage qualification. It measures how much of your monthly income goes toward debt payments. There are two types: front-end DTI (housing costs only) and back-end DTI (all debts including housing). Most conventional lenders want your back-end DTI below 43%, though some allow up to 50% with strong compensating factors. FHA loans allow up to 43-50% DTI, and VA loans have no hard DTI limit (though 41% is a guideline). Your DTI is calculated by dividing your total monthly debt payments by your gross monthly income. For example, if you earn $6,000/month and have $2,400 in total monthly debts (including your proposed mortgage payment), your DTI is 40%.',
    keyFacts: [
      'Front-end DTI: housing costs ÷ gross monthly income (ideal: under 28%)',
      'Back-end DTI: all debts ÷ gross monthly income (ideal: under 36%)',
      'Conventional loans typically require back-end DTI under 43%',
      'FHA allows up to 43-50% DTI',
      'VA loans have no hard DTI limit (41% guideline)',
      'Lower DTI = better loan terms and easier approval',
    ],
    example: 'You earn $7,000/month gross. Your debts: proposed mortgage $1,800, car payment $400, student loans $300, credit card minimums $100. Total debts = $2,600. Your DTI = $2,600 ÷ $7,000 = 37.1%. This is within conventional loan limits.',
    relatedTerms: ['front-end-dti', 'back-end-dti', 'mortgage-qualification'],
    relatedCalculators: [
      { name: 'DTI Calculator', slug: 'dti' },
      { name: 'Affordability Calculator', slug: 'affordability' },
      { name: 'FHA Loan Calculator', slug: 'fha' },
    ],
    faq: [
      { question: 'What is a good DTI ratio for a mortgage?', answer: 'A DTI of 36% or lower is considered good. Most conventional lenders accept up to 43%. FHA loans may allow up to 50% with compensating factors like high credit scores or significant cash reserves.' },
      { question: 'Does DTI include rent?', answer: 'No. DTI includes your proposed mortgage payment (or current mortgage if you own), not rent. When applying for a mortgage, lenders replace your rent with the projected mortgage payment in the DTI calculation.' },
      { question: 'How can I lower my DTI?', answer: 'Pay off debts (especially high-payment debts like car loans), increase your income, choose a less expensive home, or make a larger down payment to reduce your mortgage payment.' },
    ],
  },
  {
    slug: 'amortization',
    term: 'Amortization',
    shortDefinition: 'Amortization is the process of paying off a mortgage through regular monthly payments that cover both principal and interest over a set period, typically 15 or 30 years.',
    fullExplanation: 'Amortization is how your mortgage gets paid off over time. Each monthly payment is split between principal (reducing what you owe) and interest (the cost of borrowing). In the early years of a mortgage, most of your payment goes toward interest. Over time, the split reverses — more goes to principal and less to interest. This is because interest is calculated on the remaining balance, which shrinks with each payment. An amortization schedule shows this breakdown for every payment over the life of the loan. Understanding amortization explains why extra payments early in the loan save dramatically more interest than extra payments later.',
    keyFacts: [
      'Early payments are mostly interest; later payments are mostly principal',
      'On a 30-year mortgage, you pay more interest than principal for roughly the first 20 years',
      'Extra payments go directly to principal, accelerating the amortization',
      'A 15-year mortgage amortizes faster, saving tens of thousands in interest',
      'Interest is calculated on the remaining balance each month',
      'The amortization formula: M = P[r(1+r)^n] / [(1+r)^n – 1]',
    ],
    example: 'On a $360,000 loan at 6.75% for 30 years, your first payment of $2,335 breaks down as: $2,025 interest + $310 principal. By year 15, the same $2,335 payment splits: $1,340 interest + $995 principal. By year 28: $200 interest + $2,135 principal.',
    relatedTerms: ['principal', 'interest', 'mortgage-term'],
    relatedCalculators: [
      { name: 'Amortization Schedule', slug: 'amortization' },
      { name: 'Extra Payment Calculator', slug: 'extra-payment' },
      { name: 'Biweekly Payment Calculator', slug: 'biweekly' },
    ],
    faq: [
      { question: 'Why does so much of my payment go to interest?', answer: 'Interest is calculated as a percentage of your remaining balance. Early in the loan, your balance is highest, so interest charges are highest. As you pay down the balance, less interest accrues and more of your payment goes to principal.' },
      { question: 'How do extra payments affect amortization?', answer: 'Extra payments go directly to principal, which reduces the balance that interest is calculated on. This creates a compounding effect — each extra payment saves interest not just on itself, but on all future payments. An extra $200/month on a $360K loan at 6.75% saves about $95,000 in interest and pays off the loan 7 years early.' },
    ],
  },
  {
    slug: 'closing-costs',
    term: 'Closing Costs',
    shortDefinition: 'Closing costs are fees and expenses paid when finalizing a mortgage, typically 2% to 5% of the home\'s purchase price. They include lender fees, title insurance, appraisal, and prepaid items.',
    fullExplanation: 'Closing costs are the fees you pay to complete a real estate transaction. They typically range from 2% to 5% of the purchase price and are paid at the closing table (or rolled into the loan in some cases). Closing costs include lender origination fees (0.5-1% of the loan), appraisal ($400-$700), title insurance ($1,000-$3,000), attorney fees, recording fees, prepaid property taxes, prepaid homeowners insurance, and prepaid interest. Some costs are negotiable — you can shop for title insurance, and sellers can contribute toward your closing costs (up to 3-6% depending on loan type). On a $400,000 home, expect $8,000 to $20,000 in closing costs.',
    keyFacts: [
      'Typically 2% to 5% of the purchase price',
      'Include lender fees, title insurance, appraisal, prepaid taxes and insurance',
      'Some fees are negotiable or shoppable',
      'Sellers can contribute 3-6% toward buyer closing costs',
      'Can sometimes be rolled into the loan (increases your balance)',
      'Refinance closing costs are typically 2-3% of the loan amount',
    ],
    example: 'On a $350,000 home purchase: origination fee $1,750, appraisal $550, title insurance $2,100, attorney fees $800, recording fees $250, prepaid taxes $2,900, prepaid insurance $1,400, prepaid interest $650, misc fees $600. Total: approximately $11,000 (3.1% of purchase price).',
    relatedTerms: ['origination-fee', 'title-insurance', 'prepaid-items'],
    relatedCalculators: [
      { name: 'Closing Cost Estimator', slug: 'closing-costs' },
      { name: 'Down Payment Strategy', slug: 'down-payment' },
      { name: 'Refinance Calculator', slug: 'refinance' },
    ],
    faq: [
      { question: 'Who pays closing costs, buyer or seller?', answer: 'Both pay closing costs, but they\'re different. Buyers pay lender fees, title insurance, appraisal, and prepaid items. Sellers pay real estate agent commissions (5-6%) and transfer taxes. Buyers can negotiate for the seller to contribute toward buyer closing costs.' },
      { question: 'Can closing costs be rolled into the mortgage?', answer: 'Sometimes. FHA and VA loans allow the funding fee/guarantee fee to be rolled in. Some lenders offer "no-closing-cost" mortgages where fees are added to the loan balance or offset by a higher interest rate. This reduces upfront costs but increases long-term cost.' },
    ],
  },
  {
    slug: 'apr',
    term: 'Annual Percentage Rate (APR)',
    shortDefinition: 'APR is the total yearly cost of a mortgage expressed as a percentage, including the interest rate plus lender fees and other charges. APR is always higher than the interest rate.',
    fullExplanation: 'The Annual Percentage Rate (APR) represents the true cost of borrowing by combining the interest rate with most lender fees into a single percentage. By law (Truth in Lending Act), lenders must disclose the APR alongside the interest rate so borrowers can compare loan offers on equal footing. APR includes the interest rate, origination fees, discount points, mortgage broker fees, and certain closing costs. It does not include title insurance, appraisal fees, or prepaid items. A loan with a 6.5% interest rate might have a 6.8% APR after fees are factored in. The bigger the gap between rate and APR, the higher the fees. APR is most useful for comparing loans you plan to keep for the full term. For shorter hold periods, focus on total costs instead.',
    keyFacts: [
      'APR = interest rate + lender fees, expressed as a yearly percentage',
      'Always higher than the stated interest rate',
      'Required by law to be disclosed on all mortgage offers',
      'Useful for comparing loans from different lenders',
      'Does not include all closing costs (excludes title, appraisal, prepaid items)',
      'Most accurate for comparing loans you\'ll keep for the full term',
    ],
    example: 'Lender A offers 6.5% rate with $3,000 in fees (APR: 6.65%). Lender B offers 6.375% rate with $6,000 in fees (APR: 6.62%). Despite the lower rate, Lender B\'s higher fees make the APR similar. If you plan to keep the loan 30 years, Lender B saves slightly more. If you\'ll refinance in 5 years, Lender A is better because you\'ll pay less in upfront fees.',
    relatedTerms: ['interest-rate', 'origination-fee', 'discount-points'],
    relatedCalculators: [
      { name: 'True Monthly Mortgage Cost', slug: 'mortgage-cost' },
      { name: 'Points & Buydown', slug: 'points-buydown' },
      { name: 'Refinance Calculator', slug: 'refinance' },
    ],
    faq: [
      { question: 'Why is APR higher than my interest rate?', answer: 'APR includes lender fees (origination, points, broker fees) spread over the loan term. These additional costs make the effective annual cost higher than the base interest rate alone.' },
      { question: 'Should I choose the loan with the lowest APR?', answer: 'Not always. APR assumes you keep the loan for the full term. If you plan to sell or refinance within 5-7 years, a loan with a slightly higher APR but lower upfront fees may cost less overall.' },
    ],
  },
  {
    slug: 'ltv',
    term: 'Loan-to-Value Ratio (LTV)',
    shortDefinition: 'LTV is the ratio of your mortgage amount to the appraised value of the property, expressed as a percentage. An LTV above 80% typically requires PMI.',
    fullExplanation: 'Loan-to-value ratio (LTV) is calculated by dividing your loan amount by the property\'s appraised value. It\'s one of the most important metrics lenders use to assess risk. A lower LTV means more equity and less risk for the lender. If you buy a $400,000 home with $80,000 down (20%), your LTV is 80%. If you put $20,000 down (5%), your LTV is 95%. LTV above 80% typically requires private mortgage insurance (PMI) on conventional loans. LTV also affects your interest rate — lower LTV generally means better rates. Combined LTV (CLTV) includes all loans against the property, including second mortgages and HELOCs.',
    keyFacts: [
      'LTV = loan amount ÷ appraised property value × 100',
      'LTV above 80% requires PMI on conventional loans',
      'Lower LTV = better interest rates and loan terms',
      'LTV decreases as you pay down principal and as home value appreciates',
      'PMI can be cancelled at 80% LTV (by request) or 78% LTV (automatic)',
      'Maximum LTV varies by loan type: Conventional 97%, FHA 96.5%, VA 100%',
    ],
    example: 'Home value: $400,000. Loan amount: $360,000. LTV = $360,000 ÷ $400,000 = 90%. You\'d need PMI. After paying down to $320,000 (or if the home appreciates to $450,000 making LTV = 71%), you can remove PMI.',
    relatedTerms: ['pmi', 'equity', 'down-payment'],
    relatedCalculators: [
      { name: 'PMI Calculator', slug: 'pmi' },
      { name: 'Down Payment Strategy', slug: 'down-payment' },
      { name: 'Affordability Calculator', slug: 'affordability' },
    ],
    faq: [
      { question: 'What is a good LTV ratio?', answer: '80% or lower is ideal because it avoids PMI and qualifies for the best interest rates. However, many successful homebuyers start with higher LTVs (90-97%) and build equity over time through payments and appreciation.' },
      { question: 'How do I lower my LTV?', answer: 'Make a larger down payment, make extra mortgage payments to reduce your balance, or wait for your home to appreciate. You can also get a new appraisal if you believe your home has increased in value significantly.' },
    ],
  },
  {
    slug: 'escrow',
    term: 'Escrow',
    shortDefinition: 'Escrow is an account managed by your mortgage servicer that collects and pays your property taxes and homeowners insurance on your behalf as part of your monthly mortgage payment.',
    fullExplanation: 'Escrow serves two purposes in real estate. During a home purchase, an escrow account held by a neutral third party holds the buyer\'s earnest money deposit until closing. After closing, your mortgage servicer maintains an escrow account to pay property taxes and homeowners insurance. Each month, a portion of your mortgage payment goes into escrow. When tax and insurance bills come due, the servicer pays them from this account. Lenders require escrow because unpaid taxes create liens that could supersede the mortgage, and lapsed insurance leaves the property unprotected. Your escrow payment is recalculated annually — if taxes or insurance increase, your monthly payment goes up. Escrow accounts must maintain a minimum balance (typically two months of payments) as a cushion.',
    keyFacts: [
      'Collects property taxes and homeowners insurance monthly',
      'Paid as part of your total monthly mortgage payment (the T and I in PITI)',
      'Recalculated annually — payment can increase if taxes/insurance rise',
      'Required by most lenders, especially with LTV above 80%',
      'Servicer must provide an annual escrow analysis statement',
      'Escrow shortages can be paid as a lump sum or spread over 12 months',
    ],
    example: 'Your property taxes are $6,000/year and homeowners insurance is $1,800/year. Total annual escrow: $7,800. Monthly escrow payment: $650. This is added to your principal and interest payment. If taxes increase to $6,600, your escrow payment rises to $700/month.',
    relatedTerms: ['piti', 'property-taxes', 'homeowners-insurance'],
    relatedCalculators: [
      { name: 'True Monthly Mortgage Cost', slug: 'mortgage-cost' },
      { name: 'Closing Cost Estimator', slug: 'closing-costs' },
    ],
    faq: [
      { question: 'Can I opt out of escrow?', answer: 'Some lenders allow escrow waivers if your LTV is below 80%, but they may charge a fee (typically 0.25% of the loan amount). You\'d then be responsible for paying taxes and insurance directly. Most borrowers keep escrow for convenience.' },
      { question: 'Why did my mortgage payment increase?', answer: 'The most common reason is an escrow adjustment. When property taxes or insurance premiums increase, your servicer raises the escrow portion of your payment to cover the higher costs. You\'ll receive an annual escrow analysis explaining any changes.' },
    ],
  },
  {
    slug: 'refinance',
    term: 'Mortgage Refinance',
    shortDefinition: 'Refinancing replaces your current mortgage with a new loan, typically to get a lower interest rate, change the loan term, or access home equity through a cash-out refinance.',
    fullExplanation: 'Mortgage refinancing means paying off your existing mortgage with a new one. The most common reasons are to lower your interest rate (rate-and-term refinance), shorten your loan term (e.g., 30-year to 15-year), or pull cash from your equity (cash-out refinance). Refinancing involves closing costs of 2-3% of the loan amount, so it only makes sense if the savings exceed the costs. The break-even point is when your monthly savings have recouped the closing costs. A common rule of thumb: refinancing is worth it if you can reduce your rate by at least 0.75-1% and plan to stay in the home long enough to break even (typically 2-4 years). Rate-and-term refinances have lower rates and fees than cash-out refinances.',
    keyFacts: [
      'Closing costs typically 2-3% of the new loan amount',
      'Break-even point: when monthly savings exceed total closing costs',
      'Rate-and-term: same balance, new rate/term',
      'Cash-out: new loan is larger, you receive the difference in cash',
      'Requires credit check, income verification, and usually an appraisal',
      'Resets your amortization schedule (more interest in early years again)',
    ],
    example: 'Current loan: $300,000 at 7.5%, payment $2,098. Refinance to 6.25%, closing costs $7,500. New payment: $1,847. Monthly savings: $251. Break-even: $7,500 ÷ $251 = 30 months. If you stay 5+ years, refinancing saves $7,560 after costs.',
    relatedTerms: ['closing-costs', 'cash-out-refinance', 'rate-lock'],
    relatedCalculators: [
      { name: 'Refinance Calculator', slug: 'refinance' },
      { name: 'Cash-Out Refinance', slug: 'cash-out-refi' },
      { name: 'Recast vs Refinance', slug: 'recast-vs-refi' },
    ],
    faq: [
      { question: 'When should I refinance my mortgage?', answer: 'Refinance when you can lower your rate by at least 0.75-1%, you plan to stay in the home long enough to break even on closing costs (typically 2-4 years), and your credit score and home value support favorable terms.' },
      { question: 'Does refinancing hurt your credit score?', answer: 'Temporarily, yes. The hard credit inquiry and new account lower your score by 5-10 points. However, if refinancing lowers your monthly payment and improves your debt ratios, your score typically recovers and may improve within a few months.' },
    ],
  },
  {
    slug: 'mortgage-points',
    term: 'Mortgage Points (Discount Points)',
    shortDefinition: 'Mortgage points are upfront fees paid to the lender at closing to reduce your interest rate. One point costs 1% of the loan amount and typically lowers the rate by 0.25%.',
    fullExplanation: 'Mortgage discount points are a form of prepaid interest. You pay a lump sum at closing in exchange for a lower interest rate for the life of the loan. One point equals 1% of the loan amount. On a $360,000 loan, one point costs $3,600. Each point typically reduces your rate by 0.25%, though this varies by lender and market conditions. The decision to buy points depends on your break-even timeline — how long it takes for the monthly savings to exceed the upfront cost. If one point saves you $55/month, the break-even is $3,600 ÷ $55 = 65 months (about 5.4 years). Points are generally tax-deductible in the year of purchase for a home buy, or amortized over the loan term for a refinance. Negative points (lender credits) work in reverse — you accept a higher rate in exchange for the lender covering some closing costs.',
    keyFacts: [
      'One point = 1% of the loan amount',
      'Typically reduces rate by 0.25% per point',
      'Break-even is usually 4-7 years',
      'Tax-deductible for home purchases (in the year paid)',
      'Lender credits (negative points) = higher rate, lower closing costs',
      'Best for borrowers who plan to keep the loan long-term',
    ],
    example: 'Loan: $360,000. Rate without points: 6.75%. One point ($3,600) lowers rate to 6.5%. Monthly savings: $58. Break-even: $3,600 ÷ $58 = 62 months (5.2 years). If you keep the loan 30 years, you save $17,280 after the cost of the point.',
    relatedTerms: ['apr', 'interest-rate', 'closing-costs'],
    relatedCalculators: [
      { name: 'Points & Buydown', slug: 'points-buydown' },
      { name: 'Rate Sensitivity Calculator', slug: 'interest-sensitivity' },
      { name: 'Refinance Calculator', slug: 'refinance' },
    ],
    faq: [
      { question: 'Are mortgage points worth it?', answer: 'Points are worth it if you plan to keep the loan past the break-even point (typically 4-7 years). If you might sell or refinance sooner, skip the points or consider lender credits instead.' },
      { question: 'How many points can I buy?', answer: 'Most lenders allow up to 3-4 points, though buying more than 2 points usually has diminishing returns. Each additional point reduces the rate by a smaller amount.' },
    ],
  },
  {
    slug: 'fha-loan',
    term: 'FHA Loan',
    shortDefinition: 'An FHA loan is a mortgage insured by the Federal Housing Administration that allows down payments as low as 3.5% with credit scores of 580 or higher. FHA loans are popular with first-time homebuyers.',
    fullExplanation: 'FHA loans are government-backed mortgages designed to make homeownership accessible to borrowers with lower credit scores and smaller down payments. The Federal Housing Administration doesn\'t lend money directly — it insures the loan, which reduces risk for lenders and allows them to offer more favorable terms. FHA loans require a minimum 3.5% down payment with a credit score of 580+, or 10% down with scores of 500-579. They charge both an upfront mortgage insurance premium (UFMIP) of 1.75% of the loan amount and an annual MIP of 0.55% for most borrowers. The biggest drawback: if you put less than 10% down, MIP lasts for the life of the loan and cannot be cancelled (unlike conventional PMI). FHA loan limits vary by county, with the standard limit at $498,257 and high-cost areas up to $1,149,825 in 2024.',
    keyFacts: [
      'Minimum down payment: 3.5% (with 580+ credit score)',
      'Credit score minimum: 500 (with 10% down) or 580 (with 3.5% down)',
      'Upfront MIP: 1.75% of loan amount (can be rolled into loan)',
      'Annual MIP: 0.55% for most borrowers',
      'MIP lasts for life of loan if down payment is less than 10%',
      'Loan limits: $498,257 standard, up to $1,149,825 in high-cost areas (2024)',
      'Property must meet FHA minimum property standards',
    ],
    example: 'Home price: $250,000. FHA down payment at 3.5%: $8,750. Loan amount: $241,250. Upfront MIP (1.75%): $4,222 (rolled into loan). New loan balance: $245,472. Annual MIP: $1,327/year or $111/month added to your payment.',
    relatedTerms: ['mip', 'conventional-loan', 'va-loan'],
    relatedCalculators: [
      { name: 'FHA Loan Calculator', slug: 'fha' },
      { name: 'DTI Calculator', slug: 'dti' },
      { name: 'PMI Calculator', slug: 'pmi' },
    ],
    faq: [
      { question: 'Is FHA only for first-time buyers?', answer: 'No. FHA loans are available to anyone who qualifies, including repeat buyers. However, FHA loans can only be used for primary residences — not investment properties or vacation homes.' },
      { question: 'Can I refinance out of an FHA loan?', answer: 'Yes. Many borrowers start with FHA and refinance into a conventional loan once they have 20% equity or their credit score improves. This eliminates the lifetime MIP requirement and can save hundreds per month.' },
    ],
  },
  {
    slug: 'va-loan',
    term: 'VA Loan',
    shortDefinition: 'A VA loan is a mortgage guaranteed by the Department of Veterans Affairs, available to eligible veterans and active-duty service members. VA loans require zero down payment and have no monthly mortgage insurance.',
    fullExplanation: 'VA loans are widely considered the best mortgage product available — for those who qualify. Backed by the Department of Veterans Affairs, these loans offer zero down payment, no monthly mortgage insurance, competitive interest rates (typically 0.25-0.5% below conventional), and no loan limits for borrowers with full entitlement. Instead of monthly MI, VA loans charge a one-time funding fee (1.25-3.3% of the loan amount) that can be rolled into the loan. The funding fee is waived entirely for veterans with service-connected disabilities. VA loans are available to veterans, active-duty service members, National Guard and Reserve members (with qualifying service), and surviving spouses of veterans who died in service or from a service-connected disability. VA loans can only be used for primary residences.',
    keyFacts: [
      'Zero down payment required',
      'No monthly mortgage insurance',
      'Interest rates typically 0.25-0.5% below conventional',
      'No loan limits with full entitlement',
      'VA funding fee: 1.25-3.3% (waived for disabled veterans)',
      'Loan is assumable — a major benefit in high-rate environments',
      'Can be used multiple times (entitlement is reusable)',
    ],
    example: 'Home price: $400,000. VA loan: $0 down. Funding fee (first use, 0% down): 2.15% = $8,600 (rolled into loan). Loan balance: $408,600. No PMI. At 6.25% rate, monthly payment: $2,517 (vs. conventional with PMI: ~$2,750).',
    relatedTerms: ['va-funding-fee', 'fha-loan', 'conventional-loan'],
    relatedCalculators: [
      { name: 'VA Loan Calculator', slug: 'va' },
      { name: 'FHA Loan Calculator', slug: 'fha' },
      { name: 'Affordability Calculator', slug: 'affordability' },
    ],
    faq: [
      { question: 'Who qualifies for a VA loan?', answer: 'Veterans with 90+ days of wartime service or 181+ days of peacetime service, active-duty members with 90+ days of service, National Guard/Reserve with 6+ years of service (or 90 days of active duty), and surviving spouses of veterans who died in service or from service-connected causes.' },
      { question: 'Can I use a VA loan more than once?', answer: 'Yes. VA entitlement is reusable. You can use it again after selling a previous VA-financed home and restoring your entitlement. Some veterans can even have two VA loans simultaneously with remaining entitlement.' },
    ],
  },
  {
    slug: 'mortgage-recast',
    term: 'Mortgage Recast',
    shortDefinition: 'A mortgage recast is when you make a large lump-sum payment toward your principal and your lender re-amortizes the remaining balance over the remaining term at your existing interest rate, lowering your monthly payment.',
    fullExplanation: 'A mortgage recast (also called re-amortization) is a little-known alternative to refinancing. After making a large principal payment (typically $5,000-$10,000 minimum), your lender recalculates your monthly payment based on the new, lower balance — keeping your existing interest rate and remaining term. The fee is usually just $150-$500. Recasting is ideal for borrowers who have a lump sum (inheritance, bonus, home sale proceeds) and already have a good interest rate. Unlike refinancing, there\'s no credit check, no appraisal, no income verification, and no closing costs. The process takes 1-2 weeks. The main limitations: not all lenders offer recasting, and government-backed loans (FHA, VA, USDA) generally cannot be recast.',
    keyFacts: [
      'Fee: $150-$500 (vs. $5,000-$15,000 for refinancing)',
      'No credit check, appraisal, or income verification required',
      'Keeps your existing interest rate and remaining term',
      'Requires a lump-sum principal payment (typically $5,000+ minimum)',
      'Process takes 1-2 weeks (vs. 30-45 days for refinancing)',
      'Not available on FHA, VA, or USDA loans',
      'Not all conventional lenders offer recasting',
    ],
    example: 'Current balance: $300,000 at 3.5%, 25 years remaining. Payment: $1,501/month. You make a $50,000 lump-sum payment and recast. New balance: $250,000. New payment: $1,251/month. You save $250/month for a $250 fee.',
    relatedTerms: ['refinance', 'amortization', 'principal'],
    relatedCalculators: [
      { name: 'Recast vs Refinance', slug: 'recast-vs-refi' },
      { name: 'Extra Payment Calculator', slug: 'extra-payment' },
      { name: 'Amortization Schedule', slug: 'amortization' },
    ],
    faq: [
      { question: 'Is recasting better than refinancing?', answer: 'If you already have a low interest rate and have a lump sum, recasting is almost always better. It\'s faster, cheaper, and preserves your rate. Refinancing only wins if you need a lower rate or want to change your loan term.' },
      { question: 'How much do I need to recast?', answer: 'Most lenders require a minimum lump-sum payment of $5,000 to $10,000. The larger the payment, the more your monthly payment decreases. There\'s no maximum.' },
    ],
  },
  {
    slug: 'conventional-loan',
    term: 'Conventional Loan',
    shortDefinition: 'A conventional loan is a mortgage that is not insured or guaranteed by the federal government. Conventional loans typically require a minimum 620 credit score and offer PMI cancellation at 80% LTV.',
    fullExplanation: 'Conventional loans are the most common type of mortgage, making up about 80% of all home loans. They\'re not backed by any government agency (unlike FHA, VA, or USDA loans) and are instead backed by private lenders and sold to Fannie Mae or Freddie Mac. Conventional loans come in two categories: conforming (within Fannie/Freddie loan limits) and non-conforming (jumbo loans above those limits). The key advantage over FHA is that PMI can be cancelled once you reach 80% LTV, while FHA MIP lasts for the life of the loan. Conventional loans require a minimum 620 credit score, though the best rates go to borrowers with 740+. Down payments start at 3% for some programs (Fannie Mae HomeReady, Freddie Mac Home Possible) but 5-20% is more common.',
    keyFacts: [
      'Not government-backed — insured by private companies',
      'Minimum credit score: 620 (740+ for best rates)',
      'Down payment: 3% minimum (some programs), 5-20% typical',
      'PMI required below 80% LTV, cancellable at 80%',
      'Conforming loan limit: $766,550 (2024); higher in high-cost areas',
      'Can be used for primary, secondary, and investment properties',
      'No upfront mortgage insurance premium (unlike FHA)',
    ],
    example: 'Home: $400,000. 10% down ($40,000). Loan: $360,000. PMI at 0.5%: $150/month. At 80% LTV ($320,000 balance), PMI is cancelled — saving $150/month for the remaining loan term.',
    relatedTerms: ['fha-loan', 'pmi', 'conforming-loan'],
    relatedCalculators: [
      { name: 'PMI Calculator', slug: 'pmi' },
      { name: 'Affordability Calculator', slug: 'affordability' },
      { name: 'Down Payment Strategy', slug: 'down-payment' },
    ],
    faq: [
      { question: 'Is conventional better than FHA?', answer: 'For borrowers with 700+ credit and at least 5% down, conventional is usually better long-term because PMI can be cancelled. FHA is better for borrowers with lower credit scores or minimal savings. See our FHA vs Conventional comparison for a detailed breakdown.' },
      { question: 'What is the difference between conforming and non-conforming?', answer: 'Conforming loans meet Fannie Mae/Freddie Mac guidelines and fall within loan limits ($766,550 in most areas for 2024). Non-conforming (jumbo) loans exceed these limits and typically require higher credit scores, larger down payments, and have higher rates.' },
    ],
  },
  {
    slug: 'equity',
    term: 'Home Equity',
    shortDefinition: 'Home equity is the difference between your home\'s current market value and the amount you owe on your mortgage. Equity increases as you pay down your loan and as your home appreciates in value.',
    fullExplanation: 'Home equity represents your ownership stake in your property. If your home is worth $500,000 and you owe $300,000, you have $200,000 in equity (40%). Equity builds in two ways: through mortgage payments that reduce your principal balance, and through home appreciation that increases your property value. You can access your equity through a cash-out refinance, home equity loan (second mortgage), or home equity line of credit (HELOC). Equity is also realized when you sell the home. Building equity is one of the primary financial advantages of homeownership over renting. However, equity is not liquid — you can\'t spend it without borrowing against it or selling the property.',
    keyFacts: [
      'Equity = home value − mortgage balance',
      'Builds through principal payments and home appreciation',
      'Can be accessed via cash-out refinance, HELOC, or home equity loan',
      'Realized as cash when you sell the home',
      'Average US home appreciation: 3-5% per year historically',
      'Equity is not liquid — requires borrowing or selling to access',
    ],
    example: 'You buy a $400,000 home with $80,000 down. Initial equity: $80,000 (20%). After 5 years, you\'ve paid $30,000 in principal and the home appreciated to $460,000. Equity: $460,000 − $290,000 = $170,000 (37%). You\'ve more than doubled your equity.',
    relatedTerms: ['ltv', 'cash-out-refinance', 'heloc'],
    relatedCalculators: [
      { name: 'Cash-Out Refinance', slug: 'cash-out-refi' },
      { name: 'Extra Payment Calculator', slug: 'extra-payment' },
      { name: 'Rent vs Buy Analysis', slug: 'rent-vs-buy' },
    ],
    faq: [
      { question: 'How fast does home equity build?', answer: 'It depends on your loan term, payment amount, and home appreciation. On a 30-year mortgage, equity builds slowly at first (most payments go to interest) and accelerates over time. A 15-year mortgage builds equity roughly twice as fast. Home appreciation can significantly accelerate equity growth.' },
      { question: 'Can I lose home equity?', answer: 'Yes. If your home\'s market value declines (as happened in 2008-2011), your equity decreases. If the value drops below what you owe, you have negative equity (being "underwater"). This makes it difficult to sell or refinance.' },
    ],
  },
  {
    slug: 'piti',
    term: 'PITI (Principal, Interest, Taxes, Insurance)',
    shortDefinition: 'PITI stands for Principal, Interest, Taxes, and Insurance — the four components that make up your total monthly mortgage payment. PITI is what lenders use to calculate your housing expense ratio.',
    fullExplanation: 'PITI represents your complete monthly housing cost. Principal is the portion that reduces your loan balance. Interest is the cost of borrowing. Taxes are your property taxes (collected monthly via escrow). Insurance includes homeowners insurance and, if applicable, mortgage insurance (PMI or MIP). Many borrowers are surprised that their actual monthly payment is significantly higher than the principal and interest alone. On a $360,000 loan at 6.75%, the P&I payment is $2,335, but after adding taxes ($500/month), insurance ($150/month), and PMI ($150/month), the true PITI is $3,135. Some payments also include HOA fees, making the total even higher. Lenders use PITI to calculate your front-end DTI ratio (PITI ÷ gross monthly income).',
    keyFacts: [
      'P = Principal (reduces your loan balance)',
      'I = Interest (cost of borrowing)',
      'T = Taxes (property taxes, collected via escrow)',
      'I = Insurance (homeowners + mortgage insurance if applicable)',
      'PITI is used to calculate front-end DTI ratio',
      'May also include HOA fees (sometimes called PITIA)',
      'Taxes and insurance can increase annually, raising your total payment',
    ],
    example: 'Loan: $360,000 at 6.75% for 30 years. Principal & Interest: $2,335. Property taxes: $500/month. Homeowners insurance: $150/month. PMI: $150/month. Total PITI: $3,135/month. The P&I alone is only 74% of your actual payment.',
    relatedTerms: ['escrow', 'dti', 'pmi'],
    relatedCalculators: [
      { name: 'True Monthly Mortgage Cost', slug: 'mortgage-cost' },
      { name: 'Affordability Calculator', slug: 'affordability' },
      { name: 'DTI Calculator', slug: 'dti' },
    ],
    faq: [
      { question: 'Why is my mortgage payment higher than the P&I amount?', answer: 'Your total payment includes property taxes and insurance collected through escrow, and possibly PMI and HOA fees. These can add $500-$1,000+ to your monthly payment beyond the principal and interest.' },
      { question: 'Can PITI change over time?', answer: 'Yes. While principal and interest stay fixed (on a fixed-rate mortgage), property taxes and insurance premiums change annually. If they increase, your escrow payment — and therefore your total PITI — increases too.' },
    ],
  },
];

export function getDefinition(slug: string): Definition | undefined {
  return definitions.find(d => d.slug === slug);
}

export function getAllDefinitionSlugs(): string[] {
  return definitions.map(d => d.slug);
}
