/**
 * Formula definitions for "Show Me the Math" transparency feature.
 * Each calculator has a set of formulas that explain how its key numbers are derived.
 */

export interface FormulaStep {
  label: string;
  formula: string;
  description: string;
  /** Optional: show the actual computed value */
  computedValue?: string;
}

export interface FormulaSet {
  title: string;
  steps: FormulaStep[];
}

type FormulaGenerator = (details: Record<string, number | string>) => FormulaSet[];

const fmt = (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtDec = (v: number, d = 2) => v.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

export const calculatorFormulas: Record<string, FormulaGenerator> = {
  affordability: (d) => [
    {
      title: 'Maximum Monthly Payment',
      steps: [
        { label: 'Monthly Gross Income', formula: 'Annual Income ÷ 12', description: 'Convert annual salary to monthly.', computedValue: `$${fmt(d.monthlyIncome as number)}` },
        { label: 'Max Housing Payment (28% rule)', formula: 'Monthly Income × 0.28', description: 'Lenders typically cap housing costs at 28% of gross income.', computedValue: `$${fmt((d.monthlyIncome as number) * 0.28)}` },
        { label: 'Max Total Debt Payment (36% rule)', formula: 'Monthly Income × 0.36 − Other Debts', description: 'Total debt payments (housing + other) should stay under 36%.', computedValue: `$${fmt((d.monthlyIncome as number) * 0.36 - (d.monthlyDebts as number || 0))}` },
      ],
    },
    {
      title: 'Home Price from Payment',
      steps: [
        { label: 'Monthly Rate', formula: 'Annual Rate ÷ 12 ÷ 100', description: 'Convert annual percentage to monthly decimal.' },
        { label: 'Number of Payments', formula: 'Loan Term × 12', description: 'Total months over the life of the loan.' },
        { label: 'Loan Amount', formula: 'Payment × [(1+r)ⁿ − 1] ÷ [r × (1+r)ⁿ]', description: 'Standard present value of annuity formula, solving for principal.' },
        { label: 'Max Home Price', formula: 'Loan Amount + Down Payment', description: 'Add your down payment to the loan amount.', computedValue: `$${fmt(d.maxHomePrice as number)}` },
      ],
    },
  ],

  'mortgage-cost': (d) => [
    {
      title: 'Monthly Principal & Interest',
      steps: [
        { label: 'Monthly Rate (r)', formula: 'Annual Rate ÷ 12 ÷ 100', description: 'Convert annual percentage rate to a monthly decimal.' },
        { label: 'Number of Payments (n)', formula: 'Loan Term × 12', description: 'Total number of monthly payments.' },
        { label: 'Monthly P&I', formula: 'P × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Standard amortization formula. P = loan amount.', computedValue: `$${fmt(d.monthlyPI as number)}` },
      ],
    },
    {
      title: 'Total Monthly Payment (PITI)',
      steps: [
        { label: 'Property Tax', formula: 'Annual Tax ÷ 12', description: 'Monthly share of annual property taxes.', computedValue: `$${fmt(d.monthlyPropertyTax as number)}` },
        { label: 'Home Insurance', formula: 'Annual Premium ÷ 12', description: 'Monthly share of homeowners insurance.', computedValue: `$${fmt(d.monthlyInsurance as number)}` },
        { label: 'PMI (if applicable)', formula: 'Loan × PMI Rate ÷ 12', description: 'Required when down payment < 20%. Rate varies by credit score.', computedValue: `$${fmt(d.monthlyPMI as number || 0)}` },
        { label: 'Total PITI', formula: 'P&I + Tax + Insurance + PMI + HOA', description: 'Your true monthly housing cost.', computedValue: `$${fmt(d.totalMonthlyPayment as number)}` },
      ],
    },
  ],

  'down-payment': (d) => [
    {
      title: 'Down Payment Impact',
      steps: [
        { label: 'Down Payment Amount', formula: 'Home Price × Down Payment %', description: 'Cash needed upfront.', computedValue: `$${fmt(d.downPaymentAmount as number)}` },
        { label: 'Loan Amount', formula: 'Home Price − Down Payment', description: 'Amount you need to borrow.', computedValue: `$${fmt(d.loanAmount as number)}` },
        { label: 'PMI Threshold', formula: 'Down Payment < 20%?', description: 'PMI is required when your down payment is less than 20% of the home price.' },
        { label: 'Monthly P&I', formula: 'Loan × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Lower loan amount = lower monthly payment.', computedValue: `$${fmt(d.monthlyPayment as number)}` },
      ],
    },
  ],

  'rent-vs-buy': (d) => [
    {
      title: 'Buy vs Rent Comparison',
      steps: [
        { label: 'Monthly Mortgage Cost', formula: 'P&I + Tax + Insurance + PMI + HOA', description: 'Total monthly cost of owning.' },
        { label: 'Monthly Rent', formula: 'Current Rent × (1 + Annual Increase)ʸ', description: 'Rent grows each year by the annual increase rate.' },
        { label: 'Home Equity Built', formula: 'Principal Paid + Appreciation', description: 'Equity = cumulative principal payments + home value growth.' },
        { label: 'Investment Alternative', formula: 'Down Payment × (1 + Return Rate)ʸ', description: 'What your down payment could earn if invested instead.' },
        { label: 'Break-Even Year', formula: 'Year where Buy Net Worth > Rent Net Worth', description: 'The year when buying becomes financially better than renting.', computedValue: d.breakEvenYear ? `Year ${d.breakEvenYear}` : 'N/A' },
      ],
    },
  ],

  refinance: (d) => [
    {
      title: 'Refinance Analysis',
      steps: [
        { label: 'New Monthly Payment', formula: 'New Loan × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Payment at the new rate and term.', computedValue: `$${fmt(d.newPayment as number)}` },
        { label: 'Monthly Savings', formula: 'Current Payment − New Payment', description: 'How much less you pay each month.', computedValue: `$${fmt(d.monthlySavings as number)}` },
        { label: 'Break-Even Months', formula: 'Closing Costs ÷ Monthly Savings', description: 'Months to recoup refinance costs through savings.', computedValue: `${fmt(d.breakEvenMonths as number)} months` },
        { label: 'Total Interest Saved', formula: 'Old Total Interest − New Total Interest', description: 'Lifetime interest savings from the lower rate.', computedValue: `$${fmt(d.interestSaved as number)}` },
      ],
    },
  ],

  'cash-out-refi': (d) => [
    {
      title: 'Cash-Out Refinance Cost',
      steps: [
        { label: 'New Loan Amount', formula: 'Current Balance + Cash Out + Closing Costs', description: 'Total amount of the new mortgage.', computedValue: `$${fmt(d.newLoanAmount as number)}` },
        { label: 'New Monthly Payment', formula: 'New Loan × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Monthly P&I on the larger loan.', computedValue: `$${fmt(d.newPayment as number)}` },
        { label: 'Effective Cash-Out Rate', formula: 'Additional Interest ÷ Cash Received × 100', description: 'The true cost of borrowing against your equity.' },
      ],
    },
  ],

  'recast-vs-refi': (d) => [
    {
      title: 'Recast vs Refinance',
      steps: [
        { label: 'Recast Payment', formula: '(Balance − Lump Sum) × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'New payment after applying lump sum at your existing rate and remaining term.' },
        { label: 'Refinance Payment', formula: 'Balance × r_new × (1+r_new)ⁿ ÷ [(1+r_new)ⁿ − 1]', description: 'New payment at the new rate and term (lump sum applied to balance).' },
        { label: 'Recast Fee', formula: 'Typically $150–$500', description: 'One-time fee charged by your servicer to recast.' },
        { label: 'Refinance Closing Costs', formula: '2–5% of loan amount', description: 'Appraisal, origination, title, and other fees.' },
      ],
    },
  ],

  'points-buydown': (d) => [
    {
      title: 'Points & Buydown Math',
      steps: [
        { label: 'Cost of 1 Point', formula: 'Loan Amount × 1%', description: 'Each point costs 1% of the loan and typically reduces the rate by 0.25%.' },
        { label: 'Monthly Savings from Points', formula: 'Payment at Par Rate − Payment at Bought-Down Rate', description: 'The monthly payment reduction from buying points.' },
        { label: 'Break-Even', formula: 'Points Cost ÷ Monthly Savings', description: 'Months to recoup the upfront cost of buying points.' },
      ],
    },
  ],

  'arm-vs-fixed': (d) => [
    {
      title: 'ARM vs Fixed Comparison',
      steps: [
        { label: 'Fixed Monthly Payment', formula: 'Loan × r_fixed × (1+r_fixed)ⁿ ÷ [(1+r_fixed)ⁿ − 1]', description: 'Payment stays the same for the entire loan term.', computedValue: `$${fmt(d.fixedPayment as number)}` },
        { label: 'ARM Initial Payment', formula: 'Loan × r_arm × (1+r_arm)ⁿ ÷ [(1+r_arm)ⁿ − 1]', description: 'Lower initial rate during the fixed period (e.g., 5 years).', computedValue: `$${fmt(d.armInitialPayment as number)}` },
        { label: 'ARM Adjusted Payment', formula: 'Remaining Balance × r_adj × (1+r_adj)ⁿ ÷ [(1+r_adj)ⁿ − 1]', description: 'Payment after the ARM adjusts — could go up significantly.' },
        { label: 'Initial Monthly Savings', formula: 'Fixed Payment − ARM Initial Payment', description: 'How much you save during the ARM fixed period.', computedValue: `$${fmt((d.fixedPayment as number) - (d.armInitialPayment as number))}` },
      ],
    },
  ],

  'timeline-simulator': (d) => [
    {
      title: 'Timeline Decision Math',
      steps: [
        { label: 'Total Cost at Year X', formula: 'Σ Monthly Payments + Closing Costs − Equity Built', description: 'Net cost of each option over your expected time in the home.' },
        { label: 'Remaining Balance', formula: 'Standard amortization balance at month M', description: 'How much you still owe when you sell or move.' },
        { label: 'Best Option', formula: 'Lowest Total Cost at your timeline', description: 'The option that costs the least over your expected holding period.' },
      ],
    },
  ],

  'extra-payment': (d) => [
    {
      title: 'Extra Payment Impact',
      steps: [
        { label: 'Standard Payoff', formula: 'Loan Term × 12 months', description: 'Original payoff timeline without extra payments.' },
        { label: 'With Extra Payments', formula: 'Iterative amortization with additional principal', description: 'Each extra dollar goes directly to principal, reducing the balance faster.' },
        { label: 'Interest Saved', formula: 'Standard Total Interest − Accelerated Total Interest', description: 'Less principal = less interest accrued each month.', computedValue: `$${fmt(d.interestSaved as number)}` },
        { label: 'Time Saved', formula: 'Standard Term − Accelerated Term', description: 'Months or years shaved off your mortgage.', computedValue: `${fmt(d.monthsSaved as number)} months` },
      ],
    },
  ],

  acceleration: (d) => [
    {
      title: 'Acceleration Math',
      steps: [
        { label: 'Extra Monthly Payment', formula: 'Your chosen additional amount', description: 'Applied directly to principal each month.' },
        { label: 'New Payoff Date', formula: 'Iterative: reduce balance by (scheduled principal + extra) each month', description: 'The loan pays off when balance reaches $0.' },
        { label: 'Interest Saved', formula: 'Original Total Interest − Accelerated Total Interest', description: 'Every dollar of extra principal saves you interest on the remaining balance.', computedValue: `$${fmt(d.interestSaved as number)}` },
        { label: 'Prepay vs Invest', formula: 'Interest Saved vs Extra × (1 + Investment Return)ⁿ', description: 'Compare guaranteed interest savings against potential investment returns.' },
      ],
    },
  ],

  biweekly: (d) => [
    {
      title: 'Biweekly Payment Math',
      steps: [
        { label: 'Monthly Payment', formula: 'Loan × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Standard monthly mortgage payment.', computedValue: `$${fmt(d.monthlyPayment as number)}` },
        { label: 'Biweekly Payment', formula: 'Monthly Payment ÷ 2', description: 'Half the monthly payment, paid every two weeks.', computedValue: `$${fmt(d.biweeklyPayment as number)}` },
        { label: 'Extra Payment Per Year', formula: '26 biweekly payments = 13 monthly equivalents', description: 'You make one extra full payment per year (26 half-payments vs 24).' },
        { label: 'Interest Saved', formula: 'Monthly Total Interest − Biweekly Total Interest', description: 'The extra annual payment accelerates payoff and reduces total interest.', computedValue: `$${fmt(d.interestSaved as number)}` },
      ],
    },
  ],

  'interest-sensitivity': (d) => [
    {
      title: 'Rate Sensitivity Math',
      steps: [
        { label: 'Payment at Each Rate', formula: 'Loan × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Recalculated at each rate point to show the impact.' },
        { label: 'Payment Change per 0.25%', formula: 'Payment(rate + 0.25%) − Payment(rate)', description: 'How much your payment changes for each quarter-point rate move.' },
        { label: 'Total Interest at Each Rate', formula: '(Monthly Payment × n) − Loan Amount', description: 'Higher rates mean dramatically more interest over the loan life.' },
      ],
    },
  ],

  amortization: (d) => [
    {
      title: 'Amortization Schedule Math',
      steps: [
        { label: 'Monthly Payment', formula: 'P × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Fixed payment amount for the life of the loan.', computedValue: `$${fmt(d.monthlyPayment as number)}` },
        { label: 'Interest Portion (Month M)', formula: 'Remaining Balance × Monthly Rate', description: 'Interest is calculated on the outstanding balance each month.' },
        { label: 'Principal Portion (Month M)', formula: 'Monthly Payment − Interest Portion', description: 'Whatever is left after interest goes to reducing your balance.' },
        { label: 'Remaining Balance', formula: 'Previous Balance − Principal Portion', description: 'Balance decreases each month as principal is paid down.' },
        { label: 'Total Interest', formula: '(Monthly Payment × n) − Loan Amount', description: 'Sum of all interest paid over the life of the loan.', computedValue: `$${fmt(d.totalInterest as number)}` },
      ],
    },
  ],

  dti: (d) => [
    {
      title: 'DTI Ratio Formulas',
      steps: [
        { label: 'Front-End DTI', formula: 'Housing Costs ÷ Gross Monthly Income × 100', description: 'Only housing expenses (PITI). Lenders want this under 28%.', computedValue: `${fmtDec(d.frontEndDTI as number, 1)}%` },
        { label: 'Back-End DTI', formula: '(Housing + All Debts) ÷ Gross Monthly Income × 100', description: 'All monthly obligations. Lenders want this under 36-43%.', computedValue: `${fmtDec(d.backEndDTI as number, 1)}%` },
        { label: 'Maximum Housing Payment', formula: 'Gross Income × Target DTI% − Existing Debts', description: 'How much housing payment you can qualify for at a given DTI limit.' },
      ],
    },
  ],

  'closing-costs': (d) => [
    {
      title: 'Closing Cost Breakdown',
      steps: [
        { label: 'Lender Fees', formula: 'Origination (0.5-1% of loan) + Underwriting + Processing', description: 'Fees charged by your lender to originate the loan.' },
        { label: 'Third-Party Fees', formula: 'Appraisal + Title Insurance + Title Search + Survey', description: 'Services required by the lender but provided by third parties.' },
        { label: 'Government Fees', formula: 'Recording Fee + Transfer Tax (varies by state)', description: 'Taxes and fees charged by local government.' },
        { label: 'Prepaids', formula: 'Prepaid Interest + Insurance Premium + Tax Escrow', description: 'Costs paid in advance at closing to set up your escrow account.' },
        { label: 'Total Closing Costs', formula: 'Lender + Third-Party + Government + Prepaids', description: 'Typically 2-5% of the home purchase price.', computedValue: `$${fmt(d.totalClosingCosts as number)}` },
      ],
    },
  ],

  pmi: (d) => [
    {
      title: 'PMI Calculation',
      steps: [
        { label: 'LTV Ratio', formula: 'Loan Amount ÷ Home Value × 100', description: 'Loan-to-Value ratio determines if PMI is required (> 80%).', computedValue: `${fmtDec(d.ltvPercent as number, 1)}%` },
        { label: 'Annual PMI Rate', formula: 'Based on LTV and credit score (0.2% - 1.5%)', description: 'Higher LTV and lower credit scores mean higher PMI rates.', computedValue: `${fmtDec(d.pmiRate as number, 2)}%` },
        { label: 'Monthly PMI', formula: 'Loan Amount × Annual PMI Rate ÷ 12', description: 'Added to your monthly payment until you reach 80% LTV.', computedValue: `$${fmt(d.monthlyPMI as number)}` },
        { label: 'PMI Removal', formula: 'When LTV reaches 80% (auto-cancels at 78%)', description: 'You can request removal at 80% LTV; it auto-cancels at 78%.', computedValue: d.pmiRemovalMonth ? `Month ${d.pmiRemovalMonth}` : 'N/A' },
      ],
    },
  ],

  fha: (d) => [
    {
      title: 'FHA Loan Math',
      steps: [
        { label: 'Minimum Down Payment', formula: 'Home Price × 3.5% (580+ credit) or 10% (500-579)', description: 'FHA requires less down than conventional loans.', computedValue: `$${fmt(d.downPayment as number)}` },
        { label: 'Upfront MIP', formula: 'Base Loan Amount × 1.75%', description: 'One-time mortgage insurance premium, financed into the loan.', computedValue: `$${fmt(d.upfrontMIP as number)}` },
        { label: 'Total Loan Amount', formula: 'Base Loan + Upfront MIP', description: 'Your actual loan balance including the financed MIP.', computedValue: `$${fmt(d.totalLoanAmount as number)}` },
        { label: 'Monthly MIP', formula: 'Base Loan × 0.55% ÷ 12', description: 'Annual MIP rate of 0.55% for most FHA loans (> 95% LTV, 30-year).', computedValue: `$${fmt(d.monthlyMIP as number)}` },
        { label: 'Total Monthly Payment', formula: 'P&I + Tax + Insurance + Monthly MIP', description: 'Full PITI payment including FHA mortgage insurance.', computedValue: `$${fmt(d.totalMonthlyPayment as number)}` },
      ],
    },
  ],

  va: (d) => [
    {
      title: 'VA Loan Math',
      steps: [
        { label: 'VA Funding Fee Rate', formula: 'Based on down payment %, service type, and first/subsequent use', description: '0% down = 2.15% (first use) or 3.3% (subsequent). 5%+ down = 1.5%. 10%+ = 1.25%.', computedValue: `${d.fundingFeeRate}%` },
        { label: 'Funding Fee Amount', formula: 'Base Loan Amount × Funding Fee Rate', description: 'One-time fee that funds the VA loan program. Can be financed.', computedValue: `$${fmt(d.fundingFee as number)}` },
        { label: 'Total Loan Amount', formula: 'Base Loan + Funding Fee', description: 'VA allows financing the funding fee into the loan.', computedValue: `$${fmt(d.totalLoanAmount as number)}` },
        { label: 'Monthly P&I', formula: 'Total Loan × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Standard amortization on the total loan amount.', computedValue: `$${fmt(d.monthlyPI as number)}` },
        { label: 'PMI', formula: '$0 — VA loans never require PMI', description: 'This is the biggest financial advantage of VA loans.' },
        { label: 'Total Monthly Payment', formula: 'P&I + Tax + Insurance (no PMI)', description: 'Your full monthly housing cost.', computedValue: `$${fmt(d.totalMonthlyPayment as number)}` },
      ],
    },
  ],
};
