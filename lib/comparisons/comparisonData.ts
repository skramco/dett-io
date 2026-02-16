export interface ComparisonRow {
  feature: string;
  optionA: string;
  optionB: string;
}

export interface ProCon {
  text: string;
}

export interface ComparisonData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  keywords: string[];
  optionAName: string;
  optionBName: string;
  overview: string;
  comparisonTable: ComparisonRow[];
  prosA: ProCon[];
  consA: ProCon[];
  prosB: ProCon[];
  consB: ProCon[];
  whenToChooseA: string;
  whenToChooseB: string;
  bottomLine: string;
  relatedCalculators: { name: string; slug: string; why: string }[];
  faq: { question: string; answer: string }[];
}

export const comparisons: ComparisonData[] = [
  {
    slug: 'fha-vs-conventional',
    title: 'FHA vs Conventional Loan',
    subtitle: 'Which mortgage is right for you?',
    description: 'Compare FHA and conventional mortgages side by side. See differences in down payment, mortgage insurance, credit requirements, and total cost to find the best loan for your situation.',
    keywords: ['FHA vs conventional', 'FHA loan vs conventional loan', 'FHA or conventional mortgage', 'FHA vs conventional comparison', 'which is better FHA or conventional'],
    optionAName: 'FHA Loan',
    optionBName: 'Conventional Loan',
    overview: 'FHA loans are government-backed mortgages designed for borrowers with lower credit scores or smaller down payments. Conventional loans are not government-insured and typically offer better terms for borrowers with strong credit. The right choice depends on your credit score, down payment savings, and how long you plan to keep the loan.',
    comparisonTable: [
      { feature: 'Minimum Down Payment', optionA: '3.5% (580+ credit)', optionB: '3% (some programs)' },
      { feature: 'Credit Score Minimum', optionA: '500 (10% down) or 580 (3.5% down)', optionB: '620 typical minimum' },
      { feature: 'Mortgage Insurance', optionA: 'Upfront MIP (1.75%) + annual MIP (0.55%)', optionB: 'PMI only if <20% down; drops at 80% LTV' },
      { feature: 'MI Duration', optionA: 'Life of loan (if <10% down)', optionB: 'Cancellable at 80% LTV' },
      { feature: 'Loan Limits (2024)', optionA: '$498,257 (standard); $1,149,825 (high-cost)', optionB: '$766,550 (standard); $1,149,825 (high-cost)' },
      { feature: 'Property Requirements', optionA: 'Strict FHA appraisal standards', optionB: 'Standard appraisal' },
      { feature: 'Seller Concessions', optionA: 'Up to 6% of purchase price', optionB: '3% (if <10% down), 6% (10-25%), 9% (25%+)' },
      { feature: 'Interest Rates', optionA: 'Typically 0.25-0.5% lower', optionB: 'Slightly higher; rate depends on credit score' },
      { feature: 'Assumable', optionA: 'Yes', optionB: 'No' },
    ],
    prosA: [
      { text: 'Lower credit score requirements — available with scores as low as 500' },
      { text: 'Lower down payment (3.5%) with moderate credit' },
      { text: 'More lenient DTI requirements (up to 50% in some cases)' },
      { text: 'Lower interest rates than conventional for lower-credit borrowers' },
      { text: 'Loan is assumable — a valuable feature if rates rise' },
    ],
    consA: [
      { text: 'Mortgage insurance for the life of the loan (if <10% down)' },
      { text: 'Upfront MIP adds 1.75% to your loan balance' },
      { text: 'Stricter property standards — may fail appraisal on older homes' },
      { text: 'Lower loan limits in most areas' },
    ],
    prosB: [
      { text: 'PMI is cancellable once you reach 80% LTV' },
      { text: 'No upfront mortgage insurance premium' },
      { text: 'Higher loan limits for expensive markets' },
      { text: 'Less strict property requirements' },
      { text: 'Better long-term cost for borrowers with 20%+ down' },
    ],
    consB: [
      { text: 'Higher credit score required (620+ minimum, 740+ for best rates)' },
      { text: 'Higher interest rates for borrowers with lower credit' },
      { text: 'Stricter DTI requirements (typically 43% max)' },
      { text: 'Not assumable' },
    ],
    whenToChooseA: 'Choose FHA if your credit score is below 680, you have limited savings for a down payment, or you have a higher debt-to-income ratio. FHA is also a good choice if you plan to sell or refinance within a few years before the lifetime MIP becomes a major cost factor.',
    whenToChooseB: 'Choose conventional if your credit score is 700+, you can put 10-20% down, or you plan to stay in the home long-term. The ability to cancel PMI makes conventional loans significantly cheaper over time for borrowers who start with less than 20% down.',
    bottomLine: 'For most borrowers with credit scores above 700 and at least 5% down, a conventional loan will cost less over time because PMI can be cancelled. FHA is the better path for borrowers with credit challenges or minimal savings. Run the numbers with both our FHA and mortgage cost calculators to see the actual dollar difference for your situation.',
    relatedCalculators: [
      { name: 'FHA Loan Calculator', slug: 'fha', why: 'Calculate your FHA payment with MIP included' },
      { name: 'PMI Calculator', slug: 'pmi', why: 'See conventional PMI costs and when it drops off' },
      { name: 'DTI Calculator', slug: 'dti', why: 'Check if you meet FHA or conventional DTI limits' },
    ],
    faq: [
      { question: 'Is FHA or conventional better for first-time buyers?', answer: 'It depends on your credit and savings. First-time buyers with credit scores above 700 and at least 5% down often save more with conventional. Those with lower credit or minimal savings benefit from FHA\'s more lenient requirements.' },
      { question: 'Can I switch from FHA to conventional later?', answer: 'Yes. Many borrowers start with FHA and refinance into a conventional loan once their credit improves or they reach 20% equity. This eliminates the lifetime MIP requirement.' },
      { question: 'Why is FHA mortgage insurance so expensive?', answer: 'FHA charges both an upfront premium (1.75% of the loan) and annual premiums (0.55% for most borrowers). Unlike conventional PMI, FHA MIP cannot be cancelled if you put less than 10% down, making it more expensive over the full loan term.' },
    ],
  },
  {
    slug: 'arm-vs-fixed',
    title: 'ARM vs Fixed-Rate Mortgage',
    subtitle: 'Adjustable or fixed — which saves more?',
    description: 'Compare adjustable-rate mortgages (ARMs) and fixed-rate loans. Understand rate caps, adjustment periods, and when each option makes financial sense based on your timeline.',
    keywords: ['ARM vs fixed rate', 'adjustable rate vs fixed rate mortgage', 'ARM or fixed rate', '5/1 ARM vs 30 year fixed', 'should I get an ARM or fixed rate'],
    optionAName: 'Adjustable-Rate (ARM)',
    optionBName: 'Fixed-Rate',
    overview: 'An adjustable-rate mortgage starts with a lower interest rate that adjusts after an initial fixed period (typically 5, 7, or 10 years). A fixed-rate mortgage locks your rate for the entire loan term. The choice comes down to how long you plan to stay in the home and your tolerance for payment uncertainty.',
    comparisonTable: [
      { feature: 'Initial Rate', optionA: 'Lower (typically 0.5-1.5% below fixed)', optionB: 'Higher but locked in' },
      { feature: 'Rate After Initial Period', optionA: 'Adjusts annually based on index + margin', optionB: 'Never changes' },
      { feature: 'Monthly Payment', optionA: 'Lower initially; may increase later', optionB: 'Same every month for 15 or 30 years' },
      { feature: 'Rate Caps', optionA: 'Initial cap (2%), annual cap (2%), lifetime cap (5%)', optionB: 'N/A — rate is fixed' },
      { feature: 'Worst-Case Rate', optionA: 'Initial rate + lifetime cap (e.g., 5.5% + 5% = 10.5%)', optionB: 'Same as your locked rate' },
      { feature: 'Best For', optionA: 'Staying 3-7 years, or expecting rates to drop', optionB: 'Staying 10+ years, or wanting certainty' },
      { feature: 'Risk Level', optionA: 'Higher — payment can increase significantly', optionB: 'None — payment is predictable' },
      { feature: 'Common Terms', optionA: '5/1, 5/6, 7/1, 7/6, 10/1 ARM', optionB: '15-year fixed, 30-year fixed' },
    ],
    prosA: [
      { text: 'Lower initial rate saves money in the first 5-10 years' },
      { text: 'If you sell before the adjustment period, you pay less total interest' },
      { text: 'If rates drop, your payment decreases automatically' },
      { text: 'Rate caps limit how much your payment can increase' },
    ],
    consA: [
      { text: 'Payment uncertainty after the fixed period ends' },
      { text: 'Worst-case scenario could increase your payment by 40-60%' },
      { text: 'Harder to budget long-term' },
      { text: 'If rates rise significantly, you may be forced to refinance' },
    ],
    prosB: [
      { text: 'Complete payment predictability for the life of the loan' },
      { text: 'No risk of payment increases' },
      { text: 'Easier to budget and plan long-term' },
      { text: 'Peace of mind — especially in rising rate environments' },
    ],
    consB: [
      { text: 'Higher initial rate means higher payments from day one' },
      { text: 'If rates drop, you must refinance to benefit (with closing costs)' },
      { text: 'You pay more interest in the early years compared to an ARM' },
    ],
    whenToChooseA: 'Choose an ARM if you plan to sell or refinance within 5-7 years, you\'re confident rates will stay flat or decline, or the initial savings are significant enough to offset the risk. Military families, corporate relocators, and people buying starter homes are common ARM candidates.',
    whenToChooseB: 'Choose a fixed rate if you plan to stay in the home for 10+ years, you want predictable payments, or you\'re buying your forever home. Fixed rates are also better when rates are historically low — you lock in the low rate permanently.',
    bottomLine: 'In most rate environments, a fixed-rate mortgage is the safer choice for long-term homeowners. ARMs make sense when you have a clear exit timeline (selling or refinancing) within the initial fixed period. Use our ARM vs Fixed calculator to model your specific scenario with actual rate caps.',
    relatedCalculators: [
      { name: 'ARM vs Fixed Rate Calculator', slug: 'arm-vs-fixed', why: 'Model rate adjustments and compare total costs' },
      { name: 'Decision Timeline Simulator', slug: 'timeline-simulator', why: 'Find the best option based on how long you\'ll stay' },
      { name: 'Rate Sensitivity Calculator', slug: 'interest-sensitivity', why: 'See how rate changes affect your payment' },
    ],
    faq: [
      { question: 'What does 5/1 ARM mean?', answer: 'A 5/1 ARM has a fixed rate for the first 5 years, then adjusts once per year after that. A 5/6 ARM adjusts every 6 months after the fixed period. The first number is the fixed period in years; the second is how often it adjusts.' },
      { question: 'How much can an ARM rate increase?', answer: 'Most ARMs have three caps: an initial adjustment cap (typically 2%), an annual adjustment cap (2%), and a lifetime cap (5%). So a 5.5% ARM could go as high as 10.5% over the life of the loan.' },
      { question: 'Can I refinance out of an ARM?', answer: 'Yes, and many ARM borrowers plan to refinance before the adjustment period. However, refinancing has closing costs (typically 2-3% of the loan), and there\'s no guarantee rates will be favorable when you need to refinance.' },
    ],
  },
  {
    slug: '15-vs-30-year',
    title: '15-Year vs 30-Year Mortgage',
    subtitle: 'Pay less interest or keep payments low?',
    description: 'Compare 15-year and 30-year mortgages. See how term length affects your monthly payment, total interest paid, and wealth building. Find the right balance for your budget.',
    keywords: ['15 year vs 30 year mortgage', '15 or 30 year mortgage', '15 year vs 30 year mortgage calculator', 'should I get a 15 or 30 year mortgage', '15 year mortgage rates'],
    optionAName: '15-Year Mortgage',
    optionBName: '30-Year Mortgage',
    overview: 'A 15-year mortgage has higher monthly payments but saves you tens of thousands in interest and builds equity twice as fast. A 30-year mortgage keeps payments affordable but costs significantly more over time. The right choice depends on your monthly budget, financial goals, and risk tolerance.',
    comparisonTable: [
      { feature: 'Monthly Payment (on $360K at 6.75%)', optionA: '~$3,181/mo', optionB: '~$2,335/mo' },
      { feature: 'Total Interest Paid', optionA: '~$212,500', optionB: '~$480,600' },
      { feature: 'Interest Savings', optionA: 'Save ~$268,000 vs 30-year', optionB: 'N/A — baseline' },
      { feature: 'Interest Rate', optionA: 'Typically 0.5-0.75% lower', optionB: 'Higher rate' },
      { feature: 'Equity Building', optionA: 'Much faster — own home in 15 years', optionB: 'Slower — most early payments go to interest' },
      { feature: 'Payment Flexibility', optionA: 'Less — higher required payment', optionB: 'More — lower required payment' },
      { feature: 'Qualification', optionA: 'Harder — higher DTI impact', optionB: 'Easier — lower monthly obligation' },
      { feature: 'Tax Deduction', optionA: 'Less interest to deduct', optionB: 'More interest deduction (if itemizing)' },
    ],
    prosA: [
      { text: 'Save $100K-$300K+ in total interest over the life of the loan' },
      { text: 'Lower interest rate (typically 0.5-0.75% less)' },
      { text: 'Build equity twice as fast' },
      { text: 'Own your home free and clear in 15 years' },
      { text: 'Forced savings discipline' },
    ],
    consA: [
      { text: 'Monthly payment is 30-50% higher' },
      { text: 'Less cash available for investing, emergencies, or lifestyle' },
      { text: 'Harder to qualify — higher DTI ratio' },
      { text: 'Less flexibility if income drops' },
    ],
    prosB: [
      { text: 'Lower monthly payment — more affordable' },
      { text: 'Extra cash can be invested elsewhere (potentially earning more than mortgage rate)' },
      { text: 'Easier to qualify for a larger loan' },
      { text: 'More financial flexibility for emergencies' },
      { text: 'Can always pay extra to mimic a 15-year schedule' },
    ],
    consB: [
      { text: 'Pay significantly more total interest' },
      { text: 'Higher interest rate' },
      { text: 'Slower equity building' },
      { text: 'Still making payments for 30 years' },
    ],
    whenToChooseA: 'Choose a 15-year mortgage if you can comfortably afford the higher payment (it should be no more than 25% of your gross income), you want to be mortgage-free sooner, and you\'re already contributing to retirement accounts. It\'s ideal for borrowers in their 40s-50s who want to enter retirement debt-free.',
    whenToChooseB: 'Choose a 30-year mortgage if you want lower required payments, plan to invest the difference, or need the flexibility. Many financial advisors suggest taking a 30-year and making extra payments when possible — you get the safety of low required payments with the option to accelerate.',
    bottomLine: 'The 30-year mortgage with disciplined extra payments offers the best of both worlds: low required payments for safety, with the ability to pay it off faster when cash flow allows. However, if you have the discipline and income, a 15-year mortgage guarantees the interest savings. Use our extra payment calculator to see how a 30-year with extra payments compares to a straight 15-year.',
    relatedCalculators: [
      { name: 'Extra Payment Calculator', slug: 'extra-payment', why: 'See how extra payments on a 30-year compare to a 15-year' },
      { name: 'Amortization Schedule', slug: 'amortization', why: 'Compare month-by-month breakdowns for both terms' },
      { name: 'Decision Timeline Simulator', slug: 'timeline-simulator', why: 'Find the best term based on your plans' },
    ],
    faq: [
      { question: 'How much do you save with a 15-year mortgage?', answer: 'On a $360,000 loan, a 15-year mortgage saves approximately $268,000 in total interest compared to a 30-year. The exact savings depend on your interest rate and loan amount.' },
      { question: 'Can I get a 20-year or 25-year mortgage instead?', answer: 'Yes, some lenders offer 20-year and 25-year terms as a middle ground. You can also take a 30-year mortgage and make extra payments to effectively create any payoff timeline you want.' },
      { question: 'Is it better to invest the difference or pay off the mortgage faster?', answer: 'If your mortgage rate is below your expected investment return (historically 7-10% for stocks), investing the difference may build more wealth. However, paying off your mortgage provides a guaranteed return equal to your interest rate and the psychological benefit of being debt-free.' },
    ],
  },
  {
    slug: 'rent-vs-buy',
    title: 'Renting vs Buying a Home',
    subtitle: 'The real math behind the biggest financial decision',
    description: 'Compare the true cost of renting vs buying a home. Includes rent inflation, home appreciation, tax benefits, maintenance costs, and opportunity cost analysis.',
    keywords: ['rent vs buy', 'renting vs buying a home', 'is it better to rent or buy', 'rent or buy calculator', 'should I rent or buy a house'],
    optionAName: 'Renting',
    optionBName: 'Buying',
    overview: 'The rent vs buy decision is more nuanced than most people think. Buying builds equity but comes with hidden costs like maintenance, property taxes, and opportunity cost on your down payment. Renting offers flexibility but means your housing cost increases with inflation. The break-even point depends on how long you stay, local market conditions, and what you\'d do with the money you save.',
    comparisonTable: [
      { feature: 'Monthly Cost', optionA: 'Rent (increases 3-5% annually)', optionB: 'Mortgage + taxes + insurance + maintenance' },
      { feature: 'Upfront Cost', optionA: 'Security deposit (1-2 months)', optionB: 'Down payment (3-20%) + closing costs (2-5%)' },
      { feature: 'Equity Building', optionA: 'None', optionB: 'Yes — builds with each payment and appreciation' },
      { feature: 'Maintenance', optionA: 'Landlord\'s responsibility', optionB: 'Your responsibility (budget 1-2% of home value/year)' },
      { feature: 'Tax Benefits', optionA: 'None', optionB: 'Mortgage interest + property tax deductions (if itemizing)' },
      { feature: 'Flexibility', optionA: 'High — move with minimal cost', optionB: 'Low — selling costs 6-10% of home value' },
      { feature: 'Appreciation', optionA: 'None', optionB: 'Historically 3-5% annually (varies by market)' },
      { feature: 'Risk', optionA: 'Rent increases, lease non-renewal', optionB: 'Market decline, maintenance surprises, rate risk' },
    ],
    prosA: [
      { text: 'No large upfront cost — down payment money can be invested' },
      { text: 'No maintenance or repair costs' },
      { text: 'Flexibility to relocate easily' },
      { text: 'No risk of home value declining' },
      { text: 'Predictable costs (during lease term)' },
    ],
    consA: [
      { text: 'No equity building — rent payments are gone forever' },
      { text: 'Rent increases over time (typically 3-5% per year)' },
      { text: 'No tax benefits' },
      { text: 'Subject to landlord decisions' },
      { text: 'No ability to customize or renovate' },
    ],
    prosB: [
      { text: 'Build equity with every payment' },
      { text: 'Home appreciation grows your net worth' },
      { text: 'Fixed mortgage payment (with fixed-rate loan)' },
      { text: 'Tax deductions for mortgage interest and property taxes' },
      { text: 'Freedom to renovate and customize' },
      { text: 'Forced savings through equity building' },
    ],
    consB: [
      { text: 'Large upfront cost (down payment + closing costs)' },
      { text: 'Maintenance and repair costs (1-2% of value annually)' },
      { text: 'Property taxes and insurance add to monthly cost' },
      { text: 'Less flexibility — selling costs 6-10%' },
      { text: 'Risk of market decline' },
    ],
    whenToChooseA: 'Rent if you plan to move within 3-5 years, you\'re in an expensive market where buying is significantly more costly, you don\'t have enough saved for a down payment, or you value flexibility over equity building. Renting also makes sense if you can invest the down payment savings at a higher return than home appreciation.',
    whenToChooseB: 'Buy if you plan to stay at least 5-7 years, you have a stable income and emergency fund, you can afford a 10-20% down payment, and local rent is comparable to or higher than a mortgage payment. Buying is especially advantageous in markets with strong appreciation and when mortgage rates are low.',
    bottomLine: 'The break-even point for buying vs renting is typically 5-7 years. If you\'ll stay longer than that, buying almost always wins financially. If you\'ll move sooner, renting is usually cheaper after accounting for closing costs, selling costs, and the opportunity cost of your down payment. Use our rent vs buy calculator to see the exact break-even for your situation.',
    relatedCalculators: [
      { name: 'Rent vs Buy Calculator', slug: 'rent-vs-buy', why: 'Run the full comparison with your actual numbers' },
      { name: 'Affordability Calculator', slug: 'affordability', why: 'See how much house you can afford' },
      { name: 'Closing Cost Estimator', slug: 'closing-costs', why: 'Estimate your upfront buying costs' },
    ],
    faq: [
      { question: 'How long do you need to own a home to break even?', answer: 'Typically 5-7 years, depending on your market, down payment, and closing costs. In expensive markets with slow appreciation, it can take longer. Use our rent vs buy calculator for your specific break-even timeline.' },
      { question: 'Is renting really throwing money away?', answer: 'No. Renting pays for housing — just like a mortgage pays for housing plus interest. The real comparison is between the total cost of renting (including investing the down payment savings) vs the total cost of buying (including maintenance, taxes, and opportunity cost).' },
      { question: 'What about the tax benefits of owning?', answer: 'Mortgage interest and property tax deductions only help if you itemize deductions (which requires exceeding the standard deduction of $29,200 for married couples in 2024). Many homeowners don\'t actually benefit from these deductions.' },
    ],
  },
  {
    slug: 'recast-vs-refinance',
    title: 'Mortgage Recast vs Refinance',
    subtitle: 'Two ways to lower your payment — very different costs',
    description: 'Compare mortgage recasting and refinancing. Understand the costs, requirements, and savings of each option when you have a lump sum to apply to your mortgage.',
    keywords: ['recast vs refinance', 'mortgage recast vs refinance', 'should I recast or refinance', 'mortgage recast', 'recast vs refinance comparison'],
    optionAName: 'Mortgage Recast',
    optionBName: 'Refinance',
    overview: 'Both recasting and refinancing lower your monthly payment, but they work very differently. A recast applies a lump sum to your principal and re-amortizes at your existing rate — it costs about $250 and takes a week. A refinance replaces your entire loan with a new one at a new rate — it costs $5,000-$15,000 and takes 30-45 days. The right choice depends on whether your current rate is already good.',
    comparisonTable: [
      { feature: 'Cost', optionA: '$150-$500 flat fee', optionB: '$5,000-$15,000 in closing costs' },
      { feature: 'Timeline', optionA: '1-2 weeks', optionB: '30-45 days' },
      { feature: 'Interest Rate', optionA: 'Stays the same', optionB: 'New rate (could be higher or lower)' },
      { feature: 'Loan Term', optionA: 'Stays the same', optionB: 'Resets (new 15 or 30-year term)' },
      { feature: 'Credit Check', optionA: 'No', optionB: 'Yes — full underwriting' },
      { feature: 'Appraisal', optionA: 'No', optionB: 'Usually required' },
      { feature: 'Minimum Lump Sum', optionA: 'Typically $5,000-$10,000', optionB: 'N/A' },
      { feature: 'Payment Reduction', optionA: 'Moderate (based on lump sum size)', optionB: 'Can be significant (if rate drops)' },
      { feature: 'Availability', optionA: 'Not all lenders offer it', optionB: 'Available from any lender' },
    ],
    prosA: [
      { text: 'Extremely low cost ($150-$500)' },
      { text: 'Fast process (1-2 weeks)' },
      { text: 'No credit check or appraisal needed' },
      { text: 'Keeps your existing (potentially low) interest rate' },
      { text: 'No change to loan term — you\'re still on track to pay off on time' },
    ],
    consA: [
      { text: 'Requires a significant lump sum ($5,000+)' },
      { text: 'Doesn\'t change your interest rate' },
      { text: 'Not all lenders offer recasting' },
      { text: 'Government-backed loans (FHA, VA, USDA) typically can\'t be recast' },
    ],
    prosB: [
      { text: 'Can significantly lower your interest rate' },
      { text: 'No lump sum required' },
      { text: 'Can change loan term (30 to 15, or vice versa)' },
      { text: 'Can switch loan type (ARM to fixed, etc.)' },
      { text: 'Available from any lender — shop for best rate' },
    ],
    consB: [
      { text: 'High closing costs ($5,000-$15,000)' },
      { text: 'Lengthy process (30-45 days)' },
      { text: 'Requires credit check, income verification, appraisal' },
      { text: 'Resets your loan term (may pay more total interest)' },
      { text: 'May not make sense if rates haven\'t dropped significantly' },
    ],
    whenToChooseA: 'Choose a recast if you have a lump sum (inheritance, bonus, sale proceeds), your current interest rate is already good (below market rates), and you want a quick, cheap way to lower your payment. Recasting is ideal for borrowers who locked in low rates during 2020-2021 and don\'t want to give them up.',
    whenToChooseB: 'Choose a refinance if your current rate is significantly above market rates (1%+ higher), you want to change your loan term, or you don\'t have a lump sum. Refinancing makes sense when the monthly savings will recoup closing costs within 2-3 years.',
    bottomLine: 'If you have a low interest rate and a lump sum, recasting is almost always the better choice — it\'s faster, cheaper, and preserves your rate. If your rate is high and you need to lower it, refinancing is the only option. Use our recast vs refinance calculator to compare the exact savings for your situation.',
    relatedCalculators: [
      { name: 'Recast vs Refinance Calculator', slug: 'recast-vs-refi', why: 'Compare both options with your actual numbers' },
      { name: 'Refinance Calculator', slug: 'refinance', why: 'See if refinancing is worth the closing costs' },
      { name: 'Extra Payment Calculator', slug: 'extra-payment', why: 'Compare recasting vs just making extra payments' },
    ],
    faq: [
      { question: 'What is a mortgage recast?', answer: 'A mortgage recast is when you make a large lump-sum payment toward your principal, and your lender re-amortizes the remaining balance over the remaining term at your existing interest rate. This lowers your monthly payment without changing your rate or term.' },
      { question: 'How much does a mortgage recast save?', answer: 'It depends on the lump sum size. A $50,000 recast on a $300,000 balance at 6.5% would lower your monthly payment by approximately $325/month. The fee is typically just $250.' },
      { question: 'Can I recast an FHA or VA loan?', answer: 'Generally no. FHA, VA, and USDA loans typically cannot be recast. Recasting is primarily available for conventional loans. Check with your loan servicer to confirm eligibility.' },
    ],
  },
  {
    slug: 'va-vs-fha-vs-conventional',
    title: 'VA vs FHA vs Conventional Loan',
    subtitle: 'Three loan types compared for eligible borrowers',
    description: 'Compare VA, FHA, and conventional mortgages. See how down payment, mortgage insurance, credit requirements, and total cost differ across all three loan types.',
    keywords: ['VA vs FHA vs conventional', 'VA loan vs FHA loan', 'VA vs conventional loan', 'which loan type is best', 'compare mortgage types'],
    optionAName: 'VA Loan',
    optionBName: 'FHA / Conventional',
    overview: 'VA loans are the best mortgage product available — if you qualify. With zero down payment, no mortgage insurance, and competitive rates, VA loans save eligible veterans and service members tens of thousands of dollars. FHA and conventional loans serve borrowers who don\'t have VA eligibility, each with their own tradeoffs.',
    comparisonTable: [
      { feature: 'Down Payment', optionA: '0% (zero down)', optionB: 'FHA: 3.5% | Conv: 3-20%' },
      { feature: 'Mortgage Insurance', optionA: 'None (VA funding fee instead)', optionB: 'FHA: MIP for life | Conv: PMI until 80% LTV' },
      { feature: 'Funding Fee / Upfront Cost', optionA: '1.25-3.3% (waived for disabled vets)', optionB: 'FHA: 1.75% upfront MIP | Conv: None' },
      { feature: 'Credit Score', optionA: 'No VA minimum (lenders typically want 620+)', optionB: 'FHA: 500-580 | Conv: 620+' },
      { feature: 'DTI Limit', optionA: 'No hard limit (41% guideline)', optionB: 'FHA: 43-50% | Conv: 43-45%' },
      { feature: 'Interest Rates', optionA: 'Lowest (0.25-0.5% below conventional)', optionB: 'FHA: Low | Conv: Moderate' },
      { feature: 'Loan Limits', optionA: 'No limit (with full entitlement)', optionB: 'FHA: $498K-$1.15M | Conv: $766K-$1.15M' },
      { feature: 'Eligibility', optionA: 'Veterans, active duty, some Guard/Reserve', optionB: 'Anyone who qualifies' },
      { feature: 'Assumable', optionA: 'Yes', optionB: 'FHA: Yes | Conv: No' },
    ],
    prosA: [
      { text: 'Zero down payment required' },
      { text: 'No monthly mortgage insurance — ever' },
      { text: 'Lowest interest rates of any loan type' },
      { text: 'No loan limits with full entitlement' },
      { text: 'More lenient DTI and credit requirements' },
      { text: 'Funding fee can be rolled into the loan' },
      { text: 'Loan is assumable (huge benefit in high-rate environments)' },
    ],
    consA: [
      { text: 'Only available to eligible veterans and service members' },
      { text: 'VA funding fee (1.25-3.3%) adds to loan cost' },
      { text: 'Property must meet VA minimum property requirements' },
      { text: 'Can only be used for primary residence' },
    ],
    prosB: [
      { text: 'Available to all borrowers (no military service required)' },
      { text: 'FHA: Very low credit score requirements (500+)' },
      { text: 'Conventional: PMI cancellable at 80% LTV' },
      { text: 'Can be used for investment properties (conventional)' },
      { text: 'Wider lender availability' },
    ],
    consB: [
      { text: 'Down payment required (3-20%)' },
      { text: 'Mortgage insurance costs (FHA: lifetime MIP; Conv: PMI)' },
      { text: 'Higher interest rates than VA' },
      { text: 'Stricter DTI limits' },
    ],
    whenToChooseA: 'If you have VA eligibility, use it. VA loans are almost always the best option for eligible borrowers. The only exceptions are if you\'re buying an investment property (VA is primary residence only) or if you\'ve already used your full VA entitlement.',
    whenToChooseB: 'Choose FHA if you don\'t have VA eligibility and your credit score is below 680. Choose conventional if your credit is 700+ and you can put at least 5% down. Conventional becomes the clear winner once you can put 20% down (no PMI).',
    bottomLine: 'VA loans are the gold standard of mortgage products. If you\'re eligible, there\'s rarely a reason to choose anything else for a primary residence. For non-VA borrowers, the FHA vs conventional decision comes down to credit score and down payment — see our FHA vs Conventional comparison for that breakdown.',
    relatedCalculators: [
      { name: 'VA Loan Calculator', slug: 'va', why: 'Calculate your VA payment with funding fee' },
      { name: 'FHA Loan Calculator', slug: 'fha', why: 'Calculate your FHA payment with MIP' },
      { name: 'PMI Calculator', slug: 'pmi', why: 'See conventional PMI costs' },
    ],
    faq: [
      { question: 'Is a VA loan always better than conventional?', answer: 'For primary residences, almost always yes. The zero down payment and no PMI make VA loans significantly cheaper. The only scenario where conventional might win is if you have 20%+ down and want to avoid the VA funding fee.' },
      { question: 'Can I use a VA loan more than once?', answer: 'Yes. VA loan entitlement is reusable. You can use it multiple times as long as you pay off or sell the previous VA-financed property. Some veterans can even have two VA loans simultaneously.' },
      { question: 'What is the VA funding fee?', answer: 'The VA funding fee is a one-time fee (1.25-3.3% of the loan) that funds the VA loan program. It\'s waived for veterans with service-connected disabilities. It can be rolled into the loan amount so you don\'t pay it upfront.' },
    ],
  },
  {
    slug: 'biweekly-vs-extra-payments',
    title: 'Biweekly Payments vs Extra Payments',
    subtitle: 'Two strategies to pay off your mortgage faster',
    description: 'Compare biweekly mortgage payments and monthly extra payments. See which strategy saves more interest, pays off your loan faster, and which to avoid.',
    keywords: ['biweekly vs extra payments', 'biweekly mortgage payments', 'extra mortgage payments', 'biweekly vs monthly extra payments', 'pay off mortgage faster'],
    optionAName: 'Biweekly Payments',
    optionBName: 'Monthly Extra Payments',
    overview: 'Both strategies accelerate your mortgage payoff, but they work differently. Biweekly payments split your monthly payment in half and pay every two weeks — resulting in 26 half-payments (13 full payments) per year instead of 12. Monthly extra payments add a fixed amount to each payment. The math is nearly identical, but the execution and costs can differ significantly.',
    comparisonTable: [
      { feature: 'How It Works', optionA: 'Pay half your payment every 2 weeks (26 payments/year)', optionB: 'Add extra amount to your regular monthly payment' },
      { feature: 'Extra Payments Per Year', optionA: 'Equivalent of 1 extra monthly payment', optionB: 'As much or as little as you choose' },
      { feature: 'Flexibility', optionA: 'Fixed schedule — hard to change', optionB: 'Fully flexible — change or stop anytime' },
      { feature: 'Cost', optionA: 'Third-party programs charge $300-$500 setup + fees', optionB: 'Free — just send extra with your payment' },
      { feature: 'Interest Savings (on $360K, 6.75%, 30yr)', optionA: '~$67,000 saved, pay off ~5 years early', optionB: '~$67,000+ saved (with equivalent extra amount)' },
      { feature: 'Setup Required', optionA: 'Enrollment with servicer or third-party', optionB: 'None — just pay more' },
      { feature: 'Risk', optionA: 'Third-party programs may hold payments', optionB: 'No risk — you control everything' },
    ],
    prosA: [
      { text: 'Automatic — set it and forget it' },
      { text: 'Aligns with biweekly paychecks for easier budgeting' },
      { text: 'Guaranteed extra payment each year' },
    ],
    consA: [
      { text: 'Third-party biweekly programs charge unnecessary fees ($300-$500+)' },
      { text: 'Some programs hold your payment and only pay monthly anyway' },
      { text: 'Less flexible — harder to adjust if finances change' },
      { text: 'Your lender may not apply payments correctly' },
    ],
    prosB: [
      { text: 'Completely free — no setup fees or program costs' },
      { text: 'Fully flexible — increase, decrease, or stop anytime' },
      { text: 'You control exactly where the extra goes (principal)' },
      { text: 'Can achieve the same or better results than biweekly' },
      { text: 'No risk of a third party mishandling your payments' },
    ],
    consB: [
      { text: 'Requires discipline — you have to remember to pay extra' },
      { text: 'Easy to skip when money is tight' },
      { text: 'Must specify "apply to principal" with your servicer' },
    ],
    whenToChooseA: 'Choose biweekly only if your lender offers a free biweekly program (no third-party fees) and you get paid biweekly. Never pay a third-party company for biweekly payment processing — it\'s a waste of money.',
    whenToChooseB: 'Monthly extra payments are almost always the better choice. You get the same interest savings with zero fees and complete flexibility. The DIY approach is to divide your monthly payment by 12 and add that amount as extra principal each month — this exactly replicates a biweekly schedule.',
    bottomLine: 'Skip the biweekly payment programs and their fees. Instead, divide your monthly mortgage payment by 12 and add that amount as extra principal each month. You\'ll get identical results for free. For example, if your payment is $2,335, add $195/month extra to principal. Use our biweekly calculator to see the exact savings.',
    relatedCalculators: [
      { name: 'Biweekly Payment Calculator', slug: 'biweekly', why: 'See biweekly savings and the free DIY alternative' },
      { name: 'Extra Payment Calculator', slug: 'extra-payment', why: 'Model any extra payment amount' },
      { name: 'Acceleration Planner', slug: 'acceleration', why: 'Compare all payoff acceleration strategies' },
    ],
    faq: [
      { question: 'Are biweekly mortgage payments worth it?', answer: 'The concept is worth it — making the equivalent of one extra payment per year saves significant interest. But paying a third-party company to do it is not worth it. You can achieve the same result for free by adding 1/12 of your payment as extra principal each month.' },
      { question: 'How much does one extra payment per year save?', answer: 'On a $360,000 loan at 6.75% for 30 years, one extra payment per year saves approximately $67,000 in interest and pays off the loan about 5 years early.' },
      { question: 'Should I pay extra on my mortgage or invest?', answer: 'If your mortgage rate is above 5-6%, paying extra is a guaranteed return at that rate. If your rate is below 4%, investing in index funds (historically 7-10% returns) may build more wealth. Use our extra payment calculator to compare both scenarios.' },
    ],
  },
];

export function getComparison(slug: string): ComparisonData | undefined {
  return comparisons.find(c => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return comparisons.map(c => c.slug);
}
