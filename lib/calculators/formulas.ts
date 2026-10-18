/**
 * Formula definitions for "Show Me the Math" transparency feature.
 * Each calculator has a set of formulas that explain how its key numbers are derived.
 */

import { formatCurrency, formatNumber } from '../format';

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

// Local aliases over the shared site-wide formatters.
const fmt = (v: number) => formatNumber(v);
const fmtDec = (v: number, d = 2) => formatNumber(v, d);
/** Currency with an explicit minus sign for negative values, e.g. −$217. */
const fmtSigned = (v: number) => formatCurrency(v);

export const calculatorFormulas: Record<string, FormulaGenerator> = {
  affordability: (d) => [
    {
      title: 'Maximum Monthly Payment',
      steps: [
        { label: 'Monthly Gross Income', formula: 'Annual Income ÷ 12', description: 'Convert annual salary to monthly.', computedValue: `${formatCurrency(d.monthlyIncome as number)}` },
        { label: 'Front-End Cap (28% rule)', formula: 'Monthly Income × 0.28', description: 'Lenders typically cap housing costs at 28% of gross income.', computedValue: `${formatCurrency((d.monthlyIncome as number) * 0.28)}` },
        { label: 'Back-End Cap (36% rule)', formula: 'Monthly Income × 0.36 − Other Debts', description: 'Total debt payments (housing + other) should stay under 36%.', computedValue: `${formatCurrency((d.monthlyIncome as number) * 0.36 - (d.monthlyDebts as number || 0))}` },
        { label: 'Binding Constraint', formula: 'min(Front-End Cap, Back-End Cap)', description: 'The lower cap is the one that actually limits your housing budget. The recommended price uses the 36% back-end cap, which includes your other debts.', computedValue: d.moderateBinding ? `${d.moderateBinding} DTI` : undefined },
      ],
    },
    {
      title: 'Home Price from Payment',
      steps: [
        { label: 'Monthly Rate', formula: 'Annual Rate ÷ 12 ÷ 100', description: 'Convert annual percentage to monthly decimal.' },
        { label: 'Number of Payments', formula: 'Loan Term × 12', description: 'Total months over the life of the loan.' },
        { label: 'PMI (if LTV > 80%)', formula: 'Loan Amount × PMI Rate ÷ 12', description: 'When your down payment is under 20%, monthly PMI is included in the payment before solving for price. The rate (≈0.2%–1.5%) comes from a shared LTV × credit score grid.', computedValue: d.moderatePMIRate ? `${formatCurrency((d.moderatePMI as number) || 0)} (${fmtDec(d.moderatePMIRate as number, 2)}%/yr)` : `${formatCurrency((d.moderatePMI as number) || 0)}` },
        { label: 'Loan Amount', formula: '(Payment − Tax − Insurance − PMI − HOA) × [(1+r)ⁿ − 1] ÷ [r × (1+r)ⁿ]', description: 'Standard present value of annuity formula, solving for principal from the budget left after escrow items and PMI.' },
        { label: 'Max Home Price', formula: 'Loan Amount + Down Payment', description: 'Add your down payment to the loan amount.', computedValue: `${formatCurrency(d.maxHomePrice as number)}` },
      ],
    },
  ],

  'mortgage-cost': (d) => [
    {
      title: 'Monthly Principal & Interest',
      steps: [
        { label: 'Monthly Rate (r)', formula: 'Annual Rate ÷ 12 ÷ 100', description: 'Convert annual percentage rate to a monthly decimal.' },
        { label: 'Number of Payments (n)', formula: 'Loan Term × 12', description: 'Total number of monthly payments.' },
        { label: 'Monthly P&I', formula: 'P × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Standard amortization formula. P = loan amount.', computedValue: `${formatCurrency(d.principalAndInterest as number)}` },
      ],
    },
    {
      title: 'Total Monthly Payment (PITI)',
      steps: [
        { label: 'Property Tax', formula: 'Annual Tax ÷ 12', description: 'Monthly share of annual property taxes.', computedValue: `${formatCurrency(d.monthlyPropertyTax as number)}` },
        { label: 'Home Insurance', formula: 'Annual Premium ÷ 12', description: 'Monthly share of homeowners insurance.', computedValue: `${formatCurrency(d.monthlyInsurance as number)}` },
        { label: 'PMI (if applicable)', formula: 'Loan × PMI Rate ÷ 12', description: 'Required when down payment < 20%. The rate comes from a shared LTV × credit score grid (≈0.2%–1.5%).', computedValue: d.pmiRate ? `${formatCurrency(d.monthlyPMI as number || 0)} (${fmtDec(d.pmiRate as number, 2)}%/yr)` : `${formatCurrency(d.monthlyPMI as number || 0)}` },
        { label: 'Total PITI', formula: 'P&I + Tax + Insurance + PMI + HOA', description: 'Your true monthly housing cost.', computedValue: `${formatCurrency(d.totalMonthlyPayment as number)}` },
      ],
    },
  ],

  'down-payment': (d) => [
    {
      title: 'Down Payment Impact',
      steps: [
        { label: 'Down Payment Amount', formula: 'Home Price × Down Payment %', description: 'Cash needed upfront.', computedValue: `${formatCurrency(d.downPaymentAmount as number)}` },
        { label: 'Loan Amount', formula: 'Home Price − Down Payment', description: 'Amount you need to borrow.', computedValue: `${formatCurrency(d.loanAmount as number)}` },
        { label: 'PMI Threshold', formula: 'Down Payment < 20%?', description: 'PMI is required when your down payment is less than 20% of the home price.' },
        { label: 'Annual PMI Rate', formula: 'Grid lookup by LTV band and credit score', description: 'Same conventional PMI rate table as the PMI calculator — higher LTV and lower credit scores mean higher rates, so PMI is cheaper at 15% down than at 3%.', computedValue: d.option3PmiRate ? `${fmtDec(d.option3PmiRate as number, 2)}% at 3% down vs ${fmtDec(d.option15PmiRate as number, 2)}% at 15% down` : undefined },
        { label: 'PMI Duration', formula: 'Months until balance ≤ 78% of home value', description: 'PMI drops automatically once amortization brings the loan balance to 78% LTV.', computedValue: d.option3PmiMonths ? `${fmt(d.option3PmiMonths as number)} months (${fmtDec((d.option3PmiMonths as number) / 12, 1)} years) at 3% down` : undefined },
        { label: 'Monthly P&I', formula: 'Loan × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Lower loan amount = lower monthly payment.', computedValue: `${formatCurrency(d.monthlyPayment as number)}` },
        { label: 'Cash to Close', formula: 'Down Payment + Estimated Closing Costs', description: 'Closing costs use the same line-item engine (lender, third-party, government fees, and prepaids) as the Closing Costs calculator, with California as the default state.', computedValue: d.option20CashToClose ? `${formatCurrency(d.option20CashToClose as number)} at 20% down` : undefined },
      ],
    },
  ],

  'rent-vs-buy': (d) => [
    {
      title: 'Buy vs Rent Comparison',
      steps: [
        { label: 'Monthly Ownership Cost', formula: 'P&I + Property Tax + Insurance + PMI + Maintenance', description: 'Full monthly cost of owning (year 1). PMI applies when the down payment is under 20% and drops once the balance reaches 78% of the purchase price. Tax and maintenance grow with home value.', computedValue: `${formatCurrency(d.monthlyBuyTotal as number)}` },
        { label: 'Monthly Rent', formula: 'Current Rent × (1 + Annual Increase)ʸ', description: 'Rent grows each year by the annual increase rate.' },
        { label: 'Invest the Difference', formula: 'max(0, Ownership Cost − Rent) invested monthly', description: 'Whichever side pays less each month invests the difference at your expected return. This applies symmetrically to both sides.' },
        { label: 'Rent Net Worth', formula: '(Down Payment + Closing Costs) × (1 + Return)ᵗ + Invested Savings', description: 'The renter keeps the cash to close invested — the opportunity cost of buying.', computedValue: `${formatCurrency(d.cashToClose as number)} cash to close` },
        { label: 'Buy Net Worth', formula: 'Home Value − Loan Balance − Selling Costs + Invested Savings', description: 'Equity net of selling costs (agent commissions + fees, typically 6–8% of the sale price).', computedValue: `${formatCurrency(d.sellingCostAtHorizon as number)} selling costs at horizon` },
        { label: 'Break-Even Year', formula: 'Year where Buy Net Worth > Rent Net Worth', description: 'The year when buying becomes financially better than renting.', computedValue: d.breakEvenYear ? `Year ${d.breakEvenYear}` : 'Never within horizon' },
      ],
    },
  ],

  refinance: (d) => [
    {
      title: 'Refinance Analysis',
      steps: [
        { label: 'Current Scheduled P&I', formula: 'Balance × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Payment implied by your current balance, rate, and years remaining. If your entered payment differs materially, this computed value is used.', computedValue: `${formatCurrency(d.impliedCurrentPayment as number)}` },
        { label: 'New Loan Amount', formula: 'Current Balance + Closing Costs', description: 'Closing costs are financed — rolled into the new loan balance rather than paid upfront.', computedValue: `${formatCurrency(d.newLoanAmount as number)}` },
        { label: 'New Monthly Payment', formula: 'New Loan × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Payment at the new rate and term.', computedValue: `${formatCurrency(d.newMonthlyPayment as number)}` },
        { label: 'Monthly Savings', formula: 'Current Payment − New Payment', description: 'How much less you pay each month. Negative means the refinance raises your payment.', computedValue: fmtSigned(d.monthlySavings as number) },
        { label: 'Break-Even Months', formula: 'Closing Costs ÷ Monthly Savings', description: 'Months of payment savings needed to recoup the financed closing costs. This method ignores the term reset and slower equity build.', computedValue: (d.monthlySavings as number) > 0 ? `${fmt(d.breakEvenMonths as number)} months` : 'N/A — no monthly savings' },
        { label: 'Total Interest Saved', formula: 'Old Total Interest − New Total Interest', description: 'Lifetime interest savings from the lower rate. Negative means you pay more interest overall.', computedValue: fmtSigned(d.interestSavings as number) },
      ],
    },
  ],

  'cash-out-refi': (d) => [
    {
      title: 'Cash-Out Refinance Cost',
      steps: [
        { label: 'New Loan Amount', formula: 'Current Balance + Cash Out + Closing Costs', description: 'Total amount of the new mortgage.', computedValue: `${formatCurrency(d.newLoanAmount as number)}` },
        { label: 'New Monthly Payment', formula: 'New Loan × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Monthly P&I on the larger loan.', computedValue: `${formatCurrency(d.newPayment as number)}` },
        { label: 'Extra Interest for Cash', formula: 'Refi Total Interest − Current Remaining Interest', description: 'Undiscounted extra interest paid over the new term to take the cash via refinance vs keeping the current mortgage. This is a dollar cost, not a rate or APR.', computedValue: `${formatCurrency(d.totalInterestIncrease as number)}` },
        { label: 'Implied Annual Cost (IRR)', formula: 'IRR of: +cash today, then extra monthly payments vs keeping the current loan', description: 'Educational internal rate of return on the incremental cash flows — not an APR, TILA disclosure, or loan offer. Omitted when flows change sign (e.g. a shorter new term).', computedValue: (d.impliedCashCostIrr as number) > 0 ? `${fmtDec(d.impliedCashCostIrr as number)}%` : 'Not meaningful for this scenario' },
        { label: 'Blended Keep + HELOC Note Rate', formula: '(Current Balance × Current Rate + Cash Out × HELOC Rate) ÷ (Current Balance + Cash Out)', description: 'Weighted-average note rate of keeping the current mortgage and borrowing the cash separately, compared with the refi note rate on the full new balance. This is a note-rate blend, not an APR.', computedValue: `${fmtDec(d.blendedKeepRate as number)}% vs ${fmtDec(d.newRate as number)}%` },
      ],
    },
  ],

  'recast-vs-refi': (d) => [
    {
      title: 'Recast vs Refinance',
      steps: [
        { label: 'Common Horizon', formula: 'Current loan remaining term', description: 'Every option is measured over the same number of years so a longer refinance term is counted via its remaining balance, not ignored.', computedValue: `${fmt(d.horizonYears as number)} years` },
        { label: 'Recast Payment', formula: '(Balance − Lump Sum) × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'New payment after applying lump sum at your existing rate and remaining term.', computedValue: `${formatCurrency(d.recastPayment as number)}` },
        { label: 'Refinance Payment', formula: '(Balance − Lump Sum) × r_new × (1+r_new)ⁿ ÷ [(1+r_new)ⁿ − 1]', description: 'New payment at the new rate and term after the lump sum is applied to the balance.', computedValue: `${formatCurrency(d.refiPayment as number)}` },
        { label: 'Recast Fee', formula: 'Typically $150–$500', description: 'One-time fee charged by your servicer to recast.', computedValue: `${formatCurrency(d.recastFee as number)}` },
        { label: 'Refinance Closing Costs', formula: '2–5% of loan amount', description: 'Appraisal, origination, title, and other fees.', computedValue: `${formatCurrency(d.refiCosts as number)}` },
        { label: 'Still Owed at Horizon', formula: 'Amortization balance after horizon months', description: 'A refinance that outlives the horizon still owes this balance; recast and prepay typically reach $0.', computedValue: `${formatCurrency(d.recastRemainingBalance as number)} recast / ${formatCurrency(d.refiRemainingBalance as number)} refi / ${formatCurrency(d.prepayRemainingBalance as number)} prepay` },
        { label: 'Freed Cash Flow (invested)', formula: 'Σ (Current Payment − Option Payment) compounded monthly at the savings rate', description: 'Credit for cash a lower payment frees up. After an early payoff, the full payment is invested until the horizon.', computedValue: `${formatCurrency(d.recastCashFlowValue as number)} recast / ${formatCurrency(d.refiCashFlowValue as number)} refi / ${formatCurrency(d.prepayCashFlowValue as number)} prepay` },
        { label: 'Net Cost at Horizon', formula: 'Upfront costs + payments made + remaining balance − investment earnings', description: 'The ranking metric. Lower is better; the recommendation always uses this number.', computedValue: `${formatCurrency(d.recastNetCost as number)} recast / ${formatCurrency(d.refiNetCost as number)} refi / ${formatCurrency(d.prepayNetCost as number)} prepay` },
        { label: 'Best Option', formula: 'Lowest net cost over the common horizon', description: 'The option whose net cost is smallest after counting remaining balance and invested cash-flow savings.', computedValue: String(d.bestOption) },
      ],
    },
  ],

  'points-buydown': (d) => [
    {
      title: 'Points & Buydown Math',
      steps: [
        { label: 'Cost of 1 Point', formula: 'Loan Amount × 1%', description: 'Each point costs 1% of the loan and typically reduces the rate by 0.25%.' },
        { label: 'Monthly Savings from Points', formula: 'Payment at Par Rate − Payment at Bought-Down Rate', description: 'The monthly payment reduction from buying points.', computedValue: d.pointsMonthlySavings !== undefined ? `${formatCurrency(d.pointsMonthlySavings as number)}` : undefined },
        { label: 'Remaining Balance at Payoff', formula: 'Standard amortization balance at the end of your hold', description: 'A lower rate pays down principal faster, so the bought-down loan leaves a smaller balance when you sell or refinance.', computedValue: d.parEndingBalance !== undefined ? `${formatCurrency(d.parEndingBalance as number)} (par) vs ${formatCurrency(d.pointsEndingBalance as number)} (points)` : undefined },
        { label: 'Net Cost Over Hold', formula: 'Upfront Cost + Σ Payments + Remaining Balance − Loan Amount', description: 'The true cost of each option: everything paid out plus the payoff still owed, net of the amount borrowed. Equivalent to upfront cost plus interest accrued.' },
        { label: 'Temporary Buydown Subsidy', formula: 'Σ (Par Payment − Reduced Payment) over buydown months', description: '3-2-1, 2-1, and 1-0 buydowns lower the payment for the first years; the difference is prepaid into escrow. The note rate and amortization stay at par.', computedValue: (d.buydownCost as number) > 0 ? `${formatCurrency(d.buydownCost as number)}` : undefined },
      ],
    },
  ],

  'arm-vs-fixed': (d) => [
    {
      title: 'ARM vs Fixed Comparison',
      steps: [
        { label: 'Fixed Monthly Payment', formula: 'Loan × r_fixed × (1+r_fixed)ⁿ ÷ [(1+r_fixed)ⁿ − 1]', description: 'Payment stays the same for the entire loan term.', computedValue: `${formatCurrency(d.fixedPayment as number)}` },
        { label: 'ARM Initial Payment', formula: 'Loan × r_arm × (1+r_arm)ⁿ ÷ [(1+r_arm)ⁿ − 1]', description: `Lower initial rate during the fixed period of the ${d.productName ?? 'ARM'}.`, computedValue: `${formatCurrency(d.armInitialPayment as number)}` },
        { label: 'Fully Indexed Rate', formula: 'Expected Index Rate + Margin', description: 'After the fixed period, the ARM rate moves toward index + margin at each adjustment, limited by the caps below.', computedValue: `${fmtDec(d.fullyIndexedRate as number, 2)}%` },
        { label: 'ARM Adjusted Payment', formula: 'Remaining Balance × r_adj × (1+r_adj)ᵐ ÷ [(1+r_adj)ᵐ − 1]', description: 'Re-amortized over the remaining months (m) at each adjustment.' },
        { label: 'Initial Monthly Savings', formula: 'Fixed Payment − ARM Initial Payment', description: 'How much you save during the ARM fixed period.', computedValue: `${formatCurrency((d.fixedPayment as number) - (d.armInitialPayment as number))}` },
      ],
    },
    {
      title: `Worst-Case Rate from Caps (${d.capStructure ?? 'initial/periodic/lifetime'})`,
      steps: [
        { label: 'First Adjustment', formula: 'Initial Rate + Initial Cap', description: 'The worst case assumes the index rises enough that the first adjustment hits the initial cap.' },
        { label: 'Later Adjustments', formula: 'Previous Rate + Periodic Cap (each adjustment)', description: 'Each subsequent adjustment adds the periodic cap until the lifetime cap is reached.' },
        { label: 'Worst-Case Rate', formula: 'Initial Rate + Lifetime Cap', description: 'The lifetime cap limits the total increase above the initial rate.', computedValue: `${fmtDec(d.worstCaseRate as number, 2)}%${d.worstCaseYear ? ` (reached by year ${d.worstCaseYear})` : ''}` },
        { label: 'Worst-Case Payment', formula: 'Remaining Balance re-amortized at the Worst-Case Rate', description: 'The highest payment along the cap-driven path, based on the balance remaining when the rate peaks.', computedValue: `${formatCurrency(d.worstCasePayment as number)}` },
      ],
    },
  ],

  'timeline-simulator': (d) => [
    {
      title: 'Timeline Decision Math',
      steps: [
        { label: 'Net Cost at Year X', formula: 'Σ Monthly Payments + Closing Costs − Equity Built', description: 'Net cost of each option over your expected time in the home.', computedValue: `${formatCurrency(d.bestNetCost as number)} (best option)` },
        { label: 'ARM Rate After Reset', formula: 'Fully-indexed rate (Index + Margin), limited by the adjustment cap and lifetime cap', description: 'After the fixed period, the ARM adjusts annually using the same cap model as ARM vs Fixed, and the payment is recast on the remaining balance.', computedValue: d.armAdjusts ? `${fmtDec(d.armAdjustedRate as number)}% → ${formatCurrency(d.armAdjustedPayment as number)}/mo` : 'No reset before you move' },
        { label: 'Remaining Balance', formula: 'Standard amortization balance at month M', description: 'How much you still owe when you sell or move.', computedValue: `${formatCurrency(d.bestBalance as number)} (best option)` },
        { label: 'Best Option', formula: 'Lowest Net Cost at your timeline', description: 'The option that costs the least over your expected holding period.', computedValue: `${d.bestOption}` },
      ],
    },
  ],

  'extra-payment': (d) => [
    {
      title: 'Extra Payment Impact',
      steps: [
        { label: 'Standard Payoff', formula: 'Loan Term × 12 months', description: 'Original payoff timeline without extra payments.' },
        { label: 'With Extra Payments', formula: 'Iterative amortization with additional principal', description: 'Each extra dollar goes directly to principal, reducing the balance faster.' },
        { label: 'Interest Saved', formula: 'Standard Total Interest − Accelerated Total Interest', description: 'Less principal = less interest accrued each month.', computedValue: `${formatCurrency(d.interestSaved as number)}` },
        { label: 'Time Saved', formula: 'Standard Term − Accelerated Term', description: 'Months or years shaved off your mortgage.', computedValue: `${fmt(d.monthsSaved as number)} months` },
        { label: 'Effective Return', formula: 'Mortgage interest rate', description: 'Every extra dollar prepaid earns a guaranteed return equal to the loan rate — not interest saved ÷ extra paid.', computedValue: `${fmtDec(d.effectiveReturnRate as number, 2)}%` },
        { label: 'Prepay vs Invest', formula: 'Net worth of both paths at the original term', description: 'Identical monthly cash outflow. After early payoff, the prepay path invests the freed-up payment until the original term ends.', computedValue: `${formatCurrency(d.prepayPortfolio as number)} vs ${formatCurrency(d.investmentValue as number)}` },
      ],
    },
  ],

  acceleration: (d) => [
    {
      title: 'Acceleration Math',
      steps: [
        { label: 'Extra Monthly Payment', formula: 'Your chosen additional amount', description: 'Applied directly to principal each month.' },
        { label: 'New Payoff Date', formula: 'Iterative: reduce balance by (scheduled principal + extra) each month', description: 'The loan pays off when balance reaches $0.' },
        { label: 'Interest Saved', formula: 'Original Total Interest − Accelerated Total Interest', description: 'Every dollar of extra principal saves you interest on the remaining balance.', computedValue: `${formatCurrency(d.interestSaved as number)}` },
        { label: 'Effective Return', formula: 'Mortgage interest rate', description: 'The guaranteed return on prepaid principal is the loan rate, not interest saved ÷ extra paid.', computedValue: `${fmtDec(d.effectiveReturnRate as number, 2)}%` },
        { label: 'Prepay vs Invest', formula: 'Net worth of both paths at the original term', description: 'Identical monthly cash outflow. After early payoff, the prepay path invests the freed-up payment until the original term ends.', computedValue: `${formatCurrency(d.prepayPortfolio as number)} vs ${formatCurrency(d.investPortfolio as number)}` },
      ],
    },
  ],

  biweekly: (d) => [
    {
      title: 'Biweekly Payment Math',
      steps: [
        { label: 'Monthly Payment', formula: 'Loan × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Standard monthly mortgage payment.', computedValue: `${formatCurrency(d.monthlyPayment as number)}` },
        { label: 'Biweekly Payment', formula: 'Monthly Payment ÷ 2', description: 'Half the monthly payment, paid every two weeks.', computedValue: `${formatCurrency(d.biweeklyPayment as number)}` },
        { label: 'Extra Payment Per Year', formula: '26 biweekly payments = 13 monthly equivalents', description: 'You make one extra full payment per year (26 half-payments vs 24).' },
        { label: 'Interest Saved', formula: 'Monthly Total Interest − Biweekly Total Interest', description: 'The extra annual payment accelerates payoff and reduces total interest.', computedValue: `${formatCurrency(d.interestSaved as number)}` },
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
        { label: 'Monthly Payment', formula: 'P × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Fixed payment amount for the life of the loan.', computedValue: `${formatCurrency(d.monthlyPayment as number)}` },
        { label: 'Interest Portion (Month M)', formula: 'Remaining Balance × Monthly Rate', description: 'Interest is calculated on the outstanding balance each month.' },
        { label: 'Principal Portion (Month M)', formula: 'Monthly Payment − Interest Portion', description: 'Whatever is left after interest goes to reducing your balance.' },
        { label: 'Remaining Balance', formula: 'Previous Balance − Principal Portion', description: 'Balance decreases each month as principal is paid down.' },
        { label: 'Total Interest', formula: '(Monthly Payment × n) − Loan Amount', description: 'Sum of all interest paid over the life of the loan.', computedValue: `${formatCurrency(d.totalInterest as number)}` },
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
        { label: 'Total Closing Costs', formula: 'Lender + Third-Party + Government + Prepaids', description: 'Typically 2-5% of the home purchase price.', computedValue: `${formatCurrency(d.totalClosingCosts as number)}` },
      ],
    },
  ],

  pmi: (d) => {
    const noPMI = (d.noPMI as number) === 1;
    const removalMonth = (d.monthsUntilRemoval as number) || 0;
    const removalYears = (d.yearsUntilRemoval as number) || 0;
    return [
      {
        title: 'PMI Calculation',
        steps: [
          {
            label: 'Starting LTV Ratio',
            formula: 'Loan Amount ÷ Home Price × 100',
            description: 'Your Loan-to-Value ratio at closing. Conventional loans require PMI when LTV is above 80% (down payment under 20%).',
            computedValue: `${fmtDec(d.ltv as number, 1)}%`,
          },
          ...(noPMI
            ? [
                {
                  label: 'PMI Required?',
                  formula: 'LTV ≤ 80% → no PMI',
                  description: 'With 20% or more down, your starting LTV is at or below 80%, so no PMI is required.',
                  computedValue: 'Not required',
                },
              ]
            : [
                {
                  label: 'Annual PMI Rate',
                  formula: 'Based on LTV and credit score (0.2% – 1.5%)',
                  description: 'Higher LTV and lower credit scores mean higher PMI rates.',
                  computedValue: `${fmtDec(d.pmiRate as number, 2)}%`,
                },
                {
                  label: 'Monthly PMI',
                  formula: 'Original Loan Amount × Annual PMI Rate ÷ 12',
                  description: 'PMI is calculated on your original loan amount — not your current balance — so the premium stays flat until it is removed.',
                  computedValue: `${formatCurrency(d.monthlyPMI as number)}`,
                },
                {
                  label: 'Request Cancellation at 80% LTV',
                  formula: 'Balance ≤ Home Price × 0.80',
                  description: 'You can ask your servicer to cancel PMI once your balance reaches 80% of the original home value (requires good payment history).',
                  computedValue: `${formatCurrency(d.requestRemovalBalance as number)} balance`,
                },
                {
                  label: 'Automatic Removal at 78% LTV',
                  formula: 'Balance ≤ Home Price × 0.78',
                  description: 'If you never request cancellation, your lender must terminate PMI automatically when the balance reaches 78% of the original home value.',
                  computedValue: removalMonth > 0 ? `Month ${removalMonth} (~${fmtDec(removalYears, 1)} yrs)` : 'N/A',
                },
              ]),
        ],
      },
    ];
  },

  fha: (d) => [
    {
      title: 'FHA Loan Math',
      steps: [
        { label: 'Minimum Down Payment', formula: 'Home Price × 3.5% (580+ credit) or 10% (500-579)', description: 'FHA requires less down than conventional loans.', computedValue: `${formatCurrency(d.downPayment as number)}` },
        { label: 'Upfront MIP', formula: 'Base Loan Amount × 1.75%', description: 'One-time mortgage insurance premium, financed into the loan.', computedValue: `${formatCurrency(d.upfrontMIP as number)}` },
        { label: 'Total Loan Amount', formula: 'Base Loan + Upfront MIP', description: 'Your actual loan balance including the financed MIP.', computedValue: `${formatCurrency(d.totalLoanAmount as number)}` },
        { label: 'Monthly MIP', formula: 'Base Loan × 0.55% ÷ 12', description: 'Annual MIP rate of 0.55% for most FHA loans (> 95% LTV, 30-year).', computedValue: `${formatCurrency(d.monthlyMIP as number)}` },
        { label: 'Total Monthly Payment', formula: 'P&I + Tax + Insurance + Monthly MIP', description: 'Full PITI payment including FHA mortgage insurance.', computedValue: `${formatCurrency(d.totalMonthlyPayment as number)}` },
      ],
    },
  ],

  va: (d) => [
    {
      title: 'VA Loan Math',
      steps: [
        { label: 'VA Funding Fee Rate', formula: 'Based on loan purpose, down payment %, and first/subsequent use', description: 'Purchase: 0% down = 2.15% (first) or 3.3% (subsequent); 5%+ = 1.5%; 10%+ = 1.25%. Cash-out: 2.15%/3.3% with no equity reduction. IRRRL: 0.5% flat. Reserve/Guard same as active duty. Exempt: disability or eligible surviving spouse.', computedValue: `${d.fundingFeeRate}%` },
        { label: 'Funding Fee Amount', formula: 'Base Loan Amount × Funding Fee Rate', description: 'One-time fee that funds the VA loan program. Can be financed.', computedValue: `${formatCurrency(d.fundingFee as number)}` },
        { label: 'Total Loan Amount', formula: 'Base Loan + Funding Fee', description: 'VA allows financing the funding fee into the loan.', computedValue: `${formatCurrency(d.totalLoanAmount as number)}` },
        { label: 'Monthly P&I', formula: 'Total Loan × r × (1+r)ⁿ ÷ [(1+r)ⁿ − 1]', description: 'Standard amortization on the total loan amount.', computedValue: `${formatCurrency(d.monthlyPI as number)}` },
        { label: 'PMI', formula: '$0 — VA loans never require PMI', description: 'This is the biggest financial advantage of VA loans.' },
        { label: 'Total Monthly Payment', formula: 'P&I + Tax + Insurance (no PMI)', description: 'Your full monthly housing cost.', computedValue: `${formatCurrency(d.totalMonthlyPayment as number)}` },
      ],
    },
  ],
};
