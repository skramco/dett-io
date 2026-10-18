/**
 * Frequently-asked questions for each calculator page.
 *
 * These are rendered visibly on the page (FAQ section) AND emitted as
 * FAQPage JSON-LD — Google requires FAQ rich-result content to be present
 * on the page, so keep the two in sync by always sourcing from here.
 */

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export const calculatorFaqs: Record<string, CalculatorFaq[]> = {
  'mortgage-cost': [
    {
      question: 'What does a monthly mortgage payment include?',
      answer:
        'A full monthly payment includes principal and interest (the loan itself), property taxes, homeowners insurance, PMI if your down payment is under 20%, and HOA dues if applicable. Together these are often called PITI. Lenders typically collect taxes and insurance through an escrow account.',
    },
    {
      question: 'Why is my real payment higher than the principal-and-interest quote?',
      answer:
        'Rate quotes usually show only principal and interest. Property taxes (often 1-2% of home value per year), homeowners insurance, PMI, and HOA fees can add 30-50% on top. This calculator shows the full payment so you can budget on the true number.',
    },
    {
      question: 'How much of my payment goes to interest?',
      answer:
        'Early in a 30-year loan, most of each payment is interest. For example, at 6.75% on a $360,000 loan, roughly 87% of your first payment is interest. The split shifts toward principal over time — the amortization chart on this page shows exactly how.',
    },
  ],
  affordability: [
    {
      question: 'How much house can I afford based on my salary?',
      answer:
        'A common guideline is the 28/36 rule: spend no more than 28% of gross monthly income on housing and no more than 36% on all debt payments combined. This calculator applies both limits — plus your down payment, rate, taxes, and insurance — to produce conservative, moderate, and aggressive price ranges.',
    },
    {
      question: 'What DTI do lenders allow for a mortgage?',
      answer:
        'Conventional loans generally allow back-end DTI up to 45% (sometimes 50% with strong compensating factors), FHA up to about 50% with compensating factors, and VA loans are evaluated more holistically around residual income. Lower DTI means better pricing and less payment stress.',
    },
    {
      question: 'Does the calculator include my existing debts?',
      answer:
        'Yes. Monthly debts like car loans, student loans, and credit card minimums are counted against your back-end DTI, which usually becomes the binding constraint. The results label which limit — housing ratio or total-debt ratio — is capping your budget.',
    },
  ],
  'down-payment': [
    {
      question: 'Do I really need 20% down to buy a house?',
      answer:
        'No. Conventional loans allow as little as 3% down, FHA 3.5%, and VA/USDA 0% for eligible borrowers. Putting less than 20% down on a conventional loan adds PMI, typically 0.3-1.5% of the loan amount per year, until you reach 20% equity.',
    },
    {
      question: 'Is it better to put more money down or keep cash?',
      answer:
        'More down means a smaller loan, lower payment, less interest, and possibly no PMI. But draining savings leaves no emergency buffer, and that cash might earn more invested. This calculator shows the payment and total-cost impact of each down payment level so you can weigh the trade-off.',
    },
    {
      question: 'How does my down payment affect PMI?',
      answer:
        'PMI applies on conventional loans with less than 20% down, and its rate drops as your down payment rises — 15% down costs much less in PMI than 5% down. PMI cancels automatically at 78% loan-to-value, or on request at 80%.',
    },
  ],
  'rent-vs-buy': [
    {
      question: 'Is it cheaper to rent or buy a home?',
      answer:
        'It depends on how long you stay, local price-to-rent ratios, your rate, and what your down payment could earn invested. Buying usually wins over longer horizons because equity builds and rent keeps inflating; renting often wins for stays under about 5 years once you count closing costs and selling fees.',
    },
    {
      question: 'What costs of owning do renters not pay?',
      answer:
        'Owners pay property taxes, homeowners insurance, maintenance (commonly estimated at 1% of home value per year), possible HOA dues, and roughly 6-8% in transaction costs when selling. This calculator includes all of these, not just the mortgage payment.',
    },
    {
      question: 'What is the break-even point in a rent vs buy analysis?',
      answer:
        'The break-even point is the year when the total cost of owning (net of equity built and appreciation) drops below the total cost of renting (including what your down payment could have earned invested). This calculator charts both paths year by year.',
    },
  ],
  refinance: [
    {
      question: 'When is refinancing my mortgage worth it?',
      answer:
        'A useful rule of thumb: refinancing is worth a close look when you can cut your rate by about 0.75-1 percentage point or more and you plan to stay past the break-even point — the month when accumulated payment savings exceed your closing costs.',
    },
    {
      question: 'How do I calculate my refinance break-even point?',
      answer:
        'Divide total closing costs by your monthly payment savings. For example, $6,000 in costs with $250/month savings breaks even at 24 months. If you might sell or refinance again before then, the refi likely loses money.',
    },
    {
      question: 'Does refinancing restart my 30-year clock?',
      answer:
        'Refinancing into a new 30-year term re-extends your payoff date, which can lower the payment but raise lifetime interest even at a lower rate. This calculator compares total cost over your remaining horizon — not just the monthly payment — so the verdict accounts for the reset.',
    },
  ],
  'cash-out-refi': [
    {
      question: 'How much equity can I pull out with a cash-out refinance?',
      answer:
        'Most lenders cap a conventional cash-out refi at 80% loan-to-value. If your home is worth $500,000 and you owe $280,000, you could borrow up to $400,000 and receive roughly $120,000 minus closing costs.',
    },
    {
      question: 'Is a cash-out refinance cheaper than a HELOC or personal loan?',
      answer:
        'The cash-out rate is usually lower than a HELOC or personal loan rate, but you pay it on your entire new balance — not just the cash you take — and you restart your term. This calculator shows the true all-in cost so you can compare fairly.',
    },
    {
      question: 'What are the risks of a cash-out refinance?',
      answer:
        'You convert unsecured spending power into debt secured by your home, reduce your equity cushion, pay closing costs of roughly 2-5% of the loan, and may raise the rate on your entire balance if your existing rate was low.',
    },
  ],
  'recast-vs-refi': [
    {
      question: 'What is a mortgage recast?',
      answer:
        'A recast applies a lump sum to your principal, then re-amortizes your existing loan over its remaining term at the same rate. Your monthly payment drops, your rate and payoff date stay the same, and the fee is typically only $150-$500 — far less than refinance closing costs.',
    },
    {
      question: 'Should I recast or refinance my mortgage?',
      answer:
        'Recast when you like your current rate and mainly want a lower payment. Refinance when market rates are meaningfully below your rate. Simply prepaying principal (no recast) keeps the same payment but shortens the loan — often the biggest interest saver. This calculator compares all three.',
    },
    {
      question: 'Does recasting reduce my interest rate?',
      answer:
        'No. A recast keeps your original rate and payoff date — it only lowers the monthly payment by spreading a smaller balance over the same remaining term. If your rate is above market, refinancing may save more despite higher upfront costs.',
    },
  ],
  'points-buydown': [
    {
      question: 'What are mortgage discount points?',
      answer:
        'One discount point costs 1% of your loan amount and typically lowers your rate by about 0.25 percentage points, though the exact trade varies by lender and market. Points are prepaid interest: cash today for a lower payment for the life of the loan.',
    },
    {
      question: 'When is buying points worth it?',
      answer:
        'Points pay off when you keep the loan past the break-even point — the point cost divided by the monthly savings. If you might sell or refinance before then, points lose money. The longer you hold, the more points save.',
    },
    {
      question: 'What is a lender credit?',
      answer:
        'A lender credit is the reverse of points: you accept a higher rate in exchange for cash toward closing costs. It helps when you are short on cash at closing or plan to sell or refinance soon, before the higher rate costs more than the credit was worth.',
    },
  ],
  'arm-vs-fixed': [
    {
      question: 'What is the difference between an ARM and a fixed-rate mortgage?',
      answer:
        'A fixed-rate mortgage keeps one rate for the whole term. An ARM (for example a 5/6 SOFR or 7/6) starts with a lower fixed rate for an initial period, then adjusts periodically based on a market index, subject to caps on each adjustment and over the life of the loan. Most ARMs written today are SOFR-indexed 5/6s that adjust every 6 months after the fixed period; older 5/1 products adjust annually.',
    },
    {
      question: 'When does an ARM make sense?',
      answer:
        'An ARM can win if you are confident you will sell or refinance before the fixed period ends, because you pocket the initial-rate savings without facing adjustments. If you may stay longer, model the worst-case capped rate — this calculator shows that scenario explicitly.',
    },
    {
      question: 'How high can my ARM rate go?',
      answer:
        'ARM caps are usually quoted like 2/1/5: a maximum 2-point increase at the first adjustment, 1 point per later adjustment, and 5 points above the initial rate over the life of the loan. A 5.75% ARM with a 5-point lifetime cap could reach 10.75%. This calculator derives the worst-case rate from the caps you enter, not from an unstated assumption.',
    },
  ],
  'timeline-simulator': [
    {
      question: 'How does my moving timeline affect which mortgage is best?',
      answer:
        'The shorter your stay, the more upfront costs and initial rates dominate; the longer your stay, the more lifetime interest matters. Short horizons favor ARMs and fewer points; long horizons favor fixed rates and sometimes 15-year terms. This simulator compares options over your expected hold.',
    },
    {
      question: 'Should I get a 15-year or 30-year mortgage?',
      answer:
        'A 15-year loan typically prices about 0.5 points below a 30-year and saves enormous interest, but the required payment is much higher. A popular middle path is a 30-year loan paid on a 15-year schedule — flexibility with most of the savings.',
    },
    {
      question: 'What if I am not sure when I will move?',
      answer:
        'Model your most likely scenario plus a conservative one. If outcomes diverge sharply, favor the flexible option (30-year fixed) — the cost of being wrong with an ARM past its fixed period is usually larger than the cost of a slightly higher fixed rate.',
    },
  ],
  'extra-payment': [
    {
      question: 'How much do extra mortgage payments actually save?',
      answer:
        'Every extra dollar goes straight to principal, eliminating all future interest on it. For example, $200/month extra on a $360,000 loan at 6.75% saves roughly $90,000+ in interest and pays the loan off years early. Exact figures depend on your balance, rate, and when you start.',
    },
    {
      question: 'Is it better to pay extra monthly or make one annual lump sum?',
      answer:
        'Dollar for dollar, earlier is better — monthly extras start reducing principal immediately, so they slightly beat an equivalent year-end lump sum. The difference is small; consistency matters far more than timing.',
    },
    {
      question: 'Should I pay extra on my mortgage or invest instead?',
      answer:
        'Prepaying earns a guaranteed return equal to your mortgage rate. If your rate is high relative to expected investment returns — or you value certainty — prepay. If your rate is low, investing may earn more. Max out any employer 401(k) match and pay off high-interest debt first either way.',
    },
  ],
  acceleration: [
    {
      question: 'What is the fastest way to pay off a mortgage?',
      answer:
        'The biggest levers, in order of typical impact: refinancing to a shorter term (lower rate plus forced discipline), fixed extra monthly payments, annual lump sums, and biweekly payments (equivalent to one extra monthly payment per year). This planner compares them side by side on your numbers.',
    },
    {
      question: 'Do mortgage acceleration programs charge fees?',
      answer:
        'Many third-party biweekly or "equity accelerator" programs charge setup and per-payment fees for something you can do free: just send extra principal yourself. Always check that extra payments are applied to principal, not held for the next payment.',
    },
    {
      question: 'Are there prepayment penalties?',
      answer:
        'Most conforming U.S. mortgages originated after 2014 have no prepayment penalty, but a small share of loans do within the first 3 years. Check your loan estimate or note, or ask your servicer before starting an aggressive payoff plan.',
    },
  ],
  biweekly: [
    {
      question: 'How do biweekly mortgage payments save money?',
      answer:
        'Paying half your monthly payment every two weeks produces 26 half-payments — 13 full payments — per year. That extra annual payment goes to principal, typically cutting 4-6 years and tens of thousands in interest from a 30-year loan.',
    },
    {
      question: 'Is a biweekly payment plan worth the fees?',
      answer:
        'Usually not. Lender or third-party biweekly programs often charge enrollment and transaction fees for a result you can replicate free by adding 1/12 of your payment as extra principal each month. This calculator compares the biweekly program against the DIY approach.',
    },
    {
      question: 'Does my servicer apply biweekly payments immediately?',
      answer:
        'Often no — many programs hold the first half-payment until the second arrives, then post one monthly payment, which forfeits some of the timing benefit. The savings mostly come from the 13th payment, not the timing, but it is worth confirming how your servicer posts funds.',
    },
    {
      question: 'Will my servicer accept true biweekly or partial payments?',
      answer:
        'Not always. Some servicers reject half-payments or will not post extra funds until a full monthly amount is in hand, so a "true" 26-payment schedule is not available. If that is your servicer, add 1/12 of the payment as extra principal each month instead — that DIY method is accepted on almost every loan.',
    },
  ],
  'interest-sensitivity': [
    {
      question: 'How much does a 1% rate change affect my mortgage payment?',
      answer:
        'Roughly 10% of the payment on a 30-year loan. On a $360,000 loan, moving from 6.75% to 7.75% raises principal and interest by about $245/month — around $88,000 over 30 years. This calculator charts your exact payment across a range of rates.',
    },
    {
      question: 'Should I lock my mortgage rate?',
      answer:
        'A rate lock protects you from increases between quote and closing, typically free for 30-45 days. If a rate rise would break your budget or approval, lock. Floating only pays off if rates fall during your escrow — a bet, not a plan. Enter your closing date on this page for a lock-versus-float recommendation.',
    },
    {
      question: 'At what rate drop should I consider refinancing?',
      answer:
        'A common trigger is about 0.75-1 point below your current rate, but the real test is break-even: closing costs divided by monthly savings, compared with how long you will keep the loan. Use the refinance calculator for the full analysis.',
    },
  ],
  amortization: [
    {
      question: 'What is an amortization schedule?',
      answer:
        'An amortization schedule lists every payment over the life of your loan, splitting each into interest and principal and showing the remaining balance. Early payments are mostly interest; the mix flips toward principal as the balance shrinks.',
    },
    {
      question: 'Why do I pay so much interest at the start of my mortgage?',
      answer:
        'Interest is charged on the outstanding balance, which is largest at the start. At 6.75% on $360,000, your first payment includes about $2,025 of interest. As principal is retired, the interest portion falls and the principal portion grows.',
    },
    {
      question: 'When will I reach 20% equity and drop PMI?',
      answer:
        'Follow the balance column to where it hits 80% of your original home value — that is when you can request PMI cancellation (it ends automatically at 78%). With a small down payment and no prepayments, this often takes 5-10 years on a 30-year loan.',
    },
    {
      question: 'Can I download my amortization schedule?',
      answer:
        'Yes. Toggle between yearly and monthly views, then use Download CSV to export the table you are looking at. The file opens in Excel, Google Sheets, or any spreadsheet app and includes payment, principal, interest, and remaining balance for each row.',
    },
  ],
  dti: [
    {
      question: 'What is a debt-to-income (DTI) ratio?',
      answer:
        'DTI is your monthly debt payments divided by gross monthly income. Front-end DTI counts only housing costs; back-end DTI adds all other debts — car loans, student loans, credit card minimums. Lenders use both to size the mortgage you qualify for.',
    },
    {
      question: 'What DTI do I need to qualify for a mortgage?',
      answer:
        'Common guidelines: conventional loans allow back-end DTI up to 45% (up to 50% with strong compensating factors via automated underwriting), FHA up to about 50% with compensating factors, and VA focuses on residual income rather than a hard cap. Below 36% is comfortably safe almost everywhere.',
    },
    {
      question: 'How can I lower my DTI quickly?',
      answer:
        'Pay off small monthly obligations first — eliminating a $300/month car payment frees roughly $45,000-$50,000 of mortgage capacity, far more than the payoff amount suggests. Avoid new credit lines before applying, and document all income sources.',
    },
  ],
  'closing-costs': [
    {
      question: 'How much are closing costs on a house?',
      answer:
        'Typically 2-5% of the loan amount. On a $400,000 purchase that is roughly $8,000-$20,000, covering lender fees, title insurance, appraisal, government recording and transfer taxes, plus prepaid property taxes, insurance, and interest.',
    },
    {
      question: 'Which closing costs are negotiable?',
      answer:
        'Lender origination fees, title insurance (shop it — prices vary widely by provider in most states), and some third-party services are negotiable or shoppable. Government taxes and recording fees are fixed. You can also ask the seller for credits toward your costs.',
    },
    {
      question: 'Can I roll closing costs into my mortgage?',
      answer:
        'On a refinance, usually yes — costs are added to the new balance, and you pay interest on them. On a purchase, generally no; instead you can take a lender credit (higher rate, lower cash due) or negotiate seller concessions.',
    },
  ],
  pmi: [
    {
      question: 'How much does PMI cost per month?',
      answer:
        'Typically 0.3-1.5% of the original loan amount per year, driven mainly by your down payment and credit score. On a $360,000 loan that is roughly $90-$450 per month. Higher credit scores and larger down payments earn much lower PMI rates.',
    },
    {
      question: 'When does PMI go away?',
      answer:
        'By law (the Homeowners Protection Act), PMI cancels automatically when your balance reaches 78% of the original home value, and you can request cancellation at 80% — earlier if appreciation or prepayments get you there and the servicer accepts a new valuation.',
    },
    {
      question: 'How can I avoid PMI without 20% down?',
      answer:
        'Options include lender-paid PMI (traded for a higher rate), piggyback 80/10/10 loans, VA loans (no PMI, funding fee instead), and some credit-union portfolio programs. Sometimes just paying PMI and cancelling it early is the cheapest path — compare total costs.',
    },
  ],
  fha: [
    {
      question: 'What are the FHA loan requirements?',
      answer:
        'Minimum 3.5% down with a credit score of 580+ (10% down for 500-579), DTI generally up to about 50% with compensating factors, the home must be your primary residence, and the loan must be within FHA limits for your county.',
    },
    {
      question: 'How much is FHA mortgage insurance (MIP)?',
      answer:
        'FHA charges an upfront MIP of 1.75% of the loan amount (usually financed into the loan) plus annual MIP of roughly 0.15-0.75% — commonly 0.55% — paid monthly. With less than 10% down, monthly MIP lasts for the life of the loan.',
    },
    {
      question: 'Is FHA or conventional better?',
      answer:
        'FHA usually wins with credit scores under about 680 or very tight budgets, because its rates and insurance are less credit-sensitive. Conventional usually wins with good credit because PMI is cheaper and cancellable, while FHA MIP typically is not. Compare both on your numbers.',
    },
  ],
  va: [
    {
      question: 'Do VA loans require a down payment or PMI?',
      answer:
        'No — eligible veterans, service members, and some surviving spouses can finance 100% of the purchase with no monthly mortgage insurance. Instead, VA charges a one-time funding fee, which is typically financed into the loan and waived entirely for borrowers with service-connected disability ratings.',
    },
    {
      question: 'How much is the VA funding fee?',
      answer:
        'For first use with 0% down, 2.15% of the loan amount; subsequent use is 3.3%. Putting 5%+ down drops the fee to 1.5%, and 10%+ down to 1.25%. Borrowers receiving VA disability compensation are exempt.',
    },
    {
      question: 'Are VA loan rates better than conventional?',
      answer:
        'VA rates typically run about 0.25-0.5 points below comparable conventional rates because the VA guaranty reduces lender risk. Combined with $0 down and no monthly mortgage insurance, the total monthly cost is usually the lowest of any loan type for eligible borrowers.',
    },
  ],
};
