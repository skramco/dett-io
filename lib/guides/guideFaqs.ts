export interface GuideFaq {
  question: string;
  answer: string;
}

export const guideFaqs: Record<string, GuideFaq[]> = {
  'afford-house-40k-salary': [
    { question: 'Can I buy a house making $40,000 a year?', answer: 'Yes. On a $40K salary, you can typically afford a home in the $120,000 to $170,000 range, depending on your debts, down payment, and location. FHA and USDA loans make this especially accessible.' },
    { question: 'How much house can I afford on $40K?', answer: 'Following the 28% DTI rule, your maximum housing payment is about $933/month, which supports a home price of roughly $140,000-$170,000 with current interest rates.' },
    { question: 'What is the best loan for a $40K salary?', answer: 'FHA loans (3.5% down, 580+ credit score) and USDA loans (0% down in eligible areas) are the best options at this income level due to low down payment requirements and flexible qualification.' },
  ],
  'afford-house-50k-salary': [
    { question: 'Can I afford a house on a $50,000 salary?', answer: 'Yes. On $50K, you can typically afford a home in the $150,000 to $200,000 range. Your maximum housing payment at 28% DTI is about $1,167/month.' },
    { question: 'How much mortgage can I get on a $50K salary?', answer: 'With minimal existing debt, you can qualify for a mortgage of approximately $150,000-$190,000, depending on your credit score, down payment, and interest rate.' },
    { question: 'What down payment do I need on a $50K salary?', answer: 'With FHA, as little as 3.5% ($5,250-$7,000). Conventional loans require 3-5% ($4,500-$10,000). VA and USDA loans offer 0% down for eligible buyers.' },
  ],
  'afford-house-60k-salary': [
    { question: 'How much house can I afford making $60K a year?', answer: 'On a $60,000 salary, you can typically afford a home in the $200,000 to $250,000 range, with a maximum housing payment of about $1,400/month at 28% DTI.' },
    { question: 'How much is a mortgage payment on a $60K salary?', answer: 'On a $215,000 home with 10% down at 6.75%, expect a total monthly payment of $1,550-$1,700 including taxes, insurance, and PMI.' },
    { question: 'How does debt affect home buying on $60K?', answer: 'Significantly. A $300/month student loan payment reduces your buying power by $45,000-$50,000. Paying down debt before buying is one of the most powerful strategies.' },
  ],
  'afford-house-65k-salary': [
    { question: 'Can I buy a house on a $65,000 salary?', answer: 'Yes. At $65K, you can afford a home in the $215,000 to $270,000 range. Your 28% DTI housing budget is about $1,517/month.' },
    { question: 'Should I get FHA or conventional on $65K?', answer: 'At $65K, conventional loans often beat FHA because conventional PMI drops off at 20% equity, while FHA mortgage insurance lasts the life of the loan for most borrowers.' },
    { question: 'How much down payment on $65K salary?', answer: 'Conventional 97 loans allow 3% down ($6,450-$8,100). A 10% down payment ($21,500-$27,000) significantly reduces your PMI rate and monthly payment.' },
  ],
  'afford-house-75k-salary': [
    { question: 'How much house can I afford on $75K?', answer: 'On a $75,000 salary, you can typically afford a home in the $250,000 to $325,000 range. This is often considered the sweet spot for first-time home buyers.' },
    { question: 'What is the monthly mortgage payment on a $75K salary?', answer: 'On a $275,000 home with 10% down at 6.75%, expect a total monthly payment of approximately $1,900-$2,100 including all costs.' },
    { question: 'Is $75K enough to buy a house?', answer: 'Yes, $75K is a strong income for home buying. Your monthly gross of $6,250 provides a 28% housing budget of $1,750/month — enough for homes in the mid-$200s to low-$300s in most markets.' },
  ],
  'afford-house-80k-salary': [
    { question: 'How much house can I afford on $80K a year?', answer: 'On an $80,000 salary, you can typically afford a home in the $275,000 to $350,000 range, with a maximum housing payment of about $1,867/month at 28% DTI.' },
    { question: 'What are closing costs on an $80K salary?', answer: 'Closing costs are based on home price, not salary. On a $300K home, expect $6,000-$15,000 in closing costs (2-5% of purchase price) on top of your down payment.' },
    { question: 'Do I need PMI on an $80K salary?', answer: 'Only if you put less than 20% down. On a $300K home, 20% down is $60,000. If that is too much, PMI typically costs $100-$200/month and drops off once you reach 20% equity.' },
  ],
  'afford-house-90k-salary': [
    { question: 'How much house can I afford making $90K?', answer: 'On a $90,000 salary, you can afford a home in the $325,000 to $400,000 range. The 28% rule gives you $2,100/month for housing costs.' },
    { question: 'Should I buy points on a $90K salary?', answer: 'If you plan to stay 5+ years, buying points can make sense. One point on a $315K loan costs about $3,150 and saves $50-60/month, breaking even in 4-5 years.' },
    { question: 'What is the best down payment at $90K income?', answer: '10-15% is the sweet spot. It reduces PMI costs significantly without requiring the full 20% ($65,000) that many buyers at this level find difficult to save.' },
  ],
  'afford-house-100k-salary': [
    { question: 'How much house can I afford on $100K salary?', answer: 'On a $100,000 salary, you can typically afford a home in the $350,000 to $450,000 range, with a maximum housing payment of about $2,333/month at 28% DTI.' },
    { question: 'What mortgage can I get on $100K income?', answer: 'With good credit and minimal debt, you can qualify for a mortgage of $330,000-$420,000. The exact amount depends on your DTI ratio, credit score, and down payment.' },
    { question: 'Is $100K a good salary to buy a house?', answer: 'Yes, $100K provides strong buying power. You have access to competitive conventional loan terms and can comfortably afford homes in the mid-$300s to low-$400s in most U.S. markets.' },
  ],
  'afford-house-120k-salary': [
    { question: 'How much house can I afford on $120K?', answer: 'On a $120,000 salary, you can afford a home in the $400,000 to $525,000 range. Your 28% DTI housing budget is about $2,800/month.' },
    { question: 'Do I need a jumbo loan at $120K income?', answer: 'Not necessarily. The conforming loan limit is $766,550 in most areas and higher in expensive markets. Most homes in the $400K-$525K range use standard conforming loans.' },
    { question: 'How much should I put down on $120K salary?', answer: '15-20% is ideal at this income level. On a $450K home, that is $67,500-$90,000. Putting 20% down eliminates PMI entirely, saving $150-$250/month.' },
  ],
  'afford-house-125k-salary': [
    { question: 'How much house can I afford on $125K?', answer: 'On a $125,000 salary, you can afford a home in the $425,000 to $550,000 range. The 28% rule gives you $2,917/month for housing.' },
    { question: 'Should I get a 15-year or 30-year mortgage at $125K?', answer: 'At $125K, your income can support a 15-year mortgage, which saves $150,000+ in interest. However, a 30-year gives more flexibility. Consider your other financial goals.' },
    { question: 'What is the ideal home price at $125K income?', answer: 'Financial advisors recommend 3x-3.5x your income, or $375,000-$437,500. This keeps housing costs under 30% and leaves room for retirement savings and investments.' },
  ],
  'afford-house-150k-salary': [
    { question: 'How much house can I afford on $150K salary?', answer: 'On a $150,000 salary, you can afford a home in the $525,000 to $650,000 range, with a maximum housing payment of about $3,500/month at 28% DTI.' },
    { question: 'Is it worth buying a more expensive home for the tax deduction?', answer: 'Almost never. You spend $1 in mortgage interest to save $0.22-$0.32 in taxes. The deduction reduces the cost of homeownership but does not make it profitable.' },
    { question: 'Should I consider an ARM at $150K income?', answer: 'If you plan to move or refinance within 5-7 years, a 5/1 ARM can save $200-400/month compared to a 30-year fixed. If staying long-term, fixed rate provides certainty.' },
  ],
  'afford-house-175k-salary': [
    { question: 'How much house can I afford on $175K?', answer: 'On a $175,000 salary, you can afford a home in the $600,000 to $750,000 range. Your 28% DTI housing budget is about $4,083/month.' },
    { question: 'Do I need a jumbo loan at $175K income?', answer: 'Possibly. In most counties, the conforming limit is $766,550. In high-cost areas it is up to $1,149,825. If your loan stays under the limit, you get better terms with a conforming loan.' },
    { question: 'What is the smartest home price at $175K income?', answer: 'Financial experts recommend 3x-3.5x income, or $525,000-$612,500. This preserves your ability to invest aggressively and build wealth beyond your home equity.' },
  ],
  'afford-house-200k-salary': [
    { question: 'How much house can I afford on $200K salary?', answer: 'On a $200,000 salary, you can afford a home in the $700,000 to $875,000 range. However, after taxes your take-home is closer to $130K-$140K, so budget accordingly.' },
    { question: 'What is a jumbo loan and do I need one at $200K?', answer: 'A jumbo loan exceeds the conforming limit ($766,550 in most areas). At $200K income, you likely need one for homes above this threshold. Jumbo loans require higher credit scores (700+) and larger down payments (10-20%).' },
    { question: 'Should I buy a $600K or $850K home on $200K?', answer: 'The financially optimal choice is usually the lower price. Buying at $600K and investing the $250K difference can generate $1.4 million+ in additional wealth over 30 years at historical market returns.' },
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
