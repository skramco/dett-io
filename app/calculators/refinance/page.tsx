'use client';

import { useState } from 'react';
import Link from 'next/link';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculateRefinance } from '@/lib/calculators';
import type { RefinanceInputs, CalculatorResult } from '@/lib/calculators/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RefinanceCalculator() {
  const [inputs, setInputs] = useState<RefinanceInputs>({
    currentBalance: 300000,
    currentRate: 7.0,
    currentMonthlyPayment: 2200,
    yearsRemaining: 25,
    newRate: 6.0,
    newTerm: 30,
    closingCosts: 5000,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof RefinanceInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCalculate = () => {
    const calculatedResult = calculateRefinance(inputs);
    setResult(calculatedResult);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I know if refinancing my mortgage is worth it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Refinancing is worth it when your total savings exceed closing costs before you sell or refinance again. Calculate your break-even point by dividing closing costs by monthly savings. If you'll stay past that point, refinancing likely makes sense."
        }
      },
      {
        "@type": "Question",
        "name": "What is a good break-even point for refinancing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A break-even point under 24 months is generally considered good. Under 18 months is excellent. If your break-even exceeds 36 months, carefully consider whether you'll stay in the home long enough to benefit."
        }
      },
      {
        "@type": "Question",
        "name": "Should I refinance if I'm planning to move in 3 years?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Only if your break-even point is well under 3 years. Calculate your exact break-even, then add a buffer for uncertainty. If break-even is 30+ months and you might move in 36 months, the risk may not be worth it."
        }
      },
      {
        "@type": "Question",
        "name": "Is it worth refinancing for 0.5% lower rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It depends on your loan balance and closing costs. On a $400,000 loan, 0.5% saves roughly $115/month. With $6,000 in closing costs, you'd break even in about 52 months. Use this calculator to see your exact numbers."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://dett.io" },
      { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://dett.io/calculators" },
      { "@type": "ListItem", "position": 3, "name": "Refinance Calculator", "item": "https://dett.io/calculators/refinance" }
    ]
  };

  return (
    <CalculatorLayout
      title="Is Refinancing Your Mortgage Worth It? | Free Calculator"
      description="Calculate your refinance break-even point instantly. See exactly how long until closing costs pay off, total savings over time, and whether refinancing makes sense for your situation."
    >
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/calculators" className="hover:text-slate-700">Calculators</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-900">Refinance Calculator</span>
      </nav>

      {/* Primary H1 - Matches Search Intent */}
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
        Is Refinancing Your Mortgage Worth It?
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-3xl">
        Enter your current loan details and the new rate you've been quoted. This calculator shows your exact break-even point and total savings—no guessing required.
      </p>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Current Loan</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.currentBalance}
                    onChange={(e) => handleInputChange('currentBalance', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Interest Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.currentRate}
                    onChange={(e) => handleInputChange('currentRate', e.target.value)}
                    className="w-full pr-8 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Current Monthly Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.currentMonthlyPayment}
                    onChange={(e) => handleInputChange('currentMonthlyPayment', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Years Remaining
                </label>
                <input
                  type="number"
                  value={inputs.yearsRemaining}
                  onChange={(e) => handleInputChange('yearsRemaining', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">New Loan</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New Interest Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.newRate}
                    onChange={(e) => handleInputChange('newRate', e.target.value)}
                    className="w-full pr-8 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New Loan Term
                </label>
                <select
                  value={inputs.newTerm}
                  onChange={(e) => handleInputChange('newTerm', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="10">10 years</option>
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Closing Costs
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.closingCosts}
                    onChange={(e) => handleInputChange('closingCosts', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Typically 2-5% of loan amount</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-slate-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Compare Loans
          </button>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                <h2 className="text-sm font-medium text-slate-300 mb-2">Break-Even Analysis</h2>
                <p className="text-4xl font-bold mb-2">
                  {(result.details.breakEvenMonths as number) === Infinity 
                    ? 'Never' 
                    : `${result.details.breakEvenMonths} months`}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {result.summary}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Payment Comparison</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <div>
                      <p className="text-sm text-slate-600">Current Payment</p>
                      <p className="text-2xl font-bold text-slate-900">
                        ${result.details.currentMonthlyPayment.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">New Payment</p>
                      <p className="text-2xl font-bold text-slate-900">
                        ${result.details.newMonthlyPayment.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">Monthly Savings</p>
                    <p className={`text-3xl font-bold ${(result.details.monthlySavings as number) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(result.details.monthlySavings as number) > 0 ? '+' : ''}${Math.abs(result.details.monthlySavings as number).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Total Cost Comparison</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Current Loan Total</span>
                    <span className="font-semibold text-slate-900">
                      ${result.details.currentTotalPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-600">New Loan Total</span>
                    <span className="font-semibold text-slate-900">
                      ${result.details.newTotalPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Closing Costs</span>
                    <span className="font-semibold text-slate-900">
                      ${result.details.closingCosts.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-slate-900">Total Savings</span>
                    <span className={`text-xl font-bold ${(result.details.totalSavings as number) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(result.details.totalSavings as number) > 0 ? '+' : ''}${Math.abs(result.details.totalSavings as number).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {result.chartData && result.chartData.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Loan Balance Over Time</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="year" 
                          label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                          formatter={(value: number | undefined) => value ? `$${value.toLocaleString()}` : '$0'}
                          labelFormatter={(label) => `Year ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="currentLoan" 
                          stroke="#64748b" 
                          strokeWidth={2}
                          name="Current Loan"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="newLoan" 
                          stroke="#0f172a" 
                          strokeWidth={2}
                          name="New Loan"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <EmailResultsForm 
                calculatorName="Refinance Break-Even Calculator"
                result={result}
              />

              {result.insights && result.insights.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Insights</h3>
                  <ul className="space-y-2">
                    {result.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="bg-slate-50 rounded-xl p-12 text-center border border-slate-200">
              <p className="text-slate-600">
                Enter your current and new loan details, then click "Compare Loans" to see if refinancing makes sense.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-16 max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          What This Calculator Answers
        </h2>
        <p className="text-slate-700 mb-4">
          The refinance decision comes down to one question: <strong>Will you stay in your home long enough to recover closing costs?</strong> This calculator gives you the exact answer by computing your break-even point—the number of months until your monthly savings exceed what you paid to refinance.
        </p>
        <p className="text-slate-700 mb-8">
          Unlike generic calculators that only show monthly payment changes, this tool factors in your remaining loan term, total interest paid over time, and the true cost of resetting your amortization schedule. You'll see whether refinancing actually saves money or just feels like it does.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          When Refinancing Makes Sense
        </h2>
        <ul className="space-y-3 text-slate-700 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Rate drop of 0.75% or more</strong> — Generally produces a break-even under 2 years on most loan sizes.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>You'll stay 3+ years past break-even</strong> — The longer you stay, the more you save. Refinancing right before selling is almost always a loss.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>You're early in your loan</strong> — Refinancing in years 1-10 captures more interest savings than refinancing in year 20.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>You can get closing costs under 2%</strong> — Shop aggressively. Every dollar in closing costs extends your break-even.</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Common Refinancing Mistakes
        </h2>
        <ul className="space-y-3 text-slate-700 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-red-600 font-bold">✗</span>
            <span><strong>Ignoring the term reset</strong> — Refinancing a 25-year-old loan into a new 30-year adds 5 years of payments. Compare total cost, not just monthly payment.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-600 font-bold">✗</span>
            <span><strong>Rolling closing costs into the loan</strong> — This hides the true cost and means you're paying interest on your closing costs for 30 years.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-600 font-bold">✗</span>
            <span><strong>Refinancing too often</strong> — Each refi resets your amortization. Serial refinancers often pay more total interest than people who never refinance.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-600 font-bold">✗</span>
            <span><strong>Chasing small rate drops</strong> — A 0.25% rate drop rarely justifies $5,000+ in closing costs unless you have a very large loan balance.</span>
          </li>
        </ul>

        {/* FAQ Section */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6 mb-12">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">How do I know if refinancing my mortgage is worth it?</h3>
            <p className="text-slate-700">Refinancing is worth it when your total savings exceed closing costs before you sell or refinance again. Calculate your break-even point by dividing closing costs by monthly savings. If you'll stay past that point, refinancing likely makes sense.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">What is a good break-even point for refinancing?</h3>
            <p className="text-slate-700">A break-even point under 24 months is generally considered good. Under 18 months is excellent. If your break-even exceeds 36 months, carefully consider whether you'll stay in the home long enough to benefit.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Should I refinance if I'm planning to move in 3 years?</h3>
            <p className="text-slate-700">Only if your break-even point is well under 3 years. Calculate your exact break-even, then add a buffer for uncertainty. If break-even is 30+ months and you might move in 36 months, the risk may not be worth it.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Is it worth refinancing for 0.5% lower rate?</h3>
            <p className="text-slate-700">It depends on your loan balance and closing costs. On a $400,000 loan, 0.5% saves roughly $115/month. With $6,000 in closing costs, you'd break even in about 52 months. Use this calculator to see your exact numbers.</p>
          </div>
        </div>

        {/* Internal Links */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Related Decisions
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link 
            href="/calculators/extra-payment" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Extra Payments vs Investing</h3>
            <p className="text-sm text-slate-600">Should you pay down your mortgage faster or invest the difference?</p>
          </Link>
          <Link 
            href="/calculators/rent-vs-buy" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Rent vs Buy Calculator</h3>
            <p className="text-sm text-slate-600">Considering selling? See if renting makes more sense for your next move.</p>
          </Link>
          <Link 
            href="/calculators/cash-out-refi" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Cash-Out Refinance Analyzer</h3>
            <p className="text-sm text-slate-600">Need cash? See the true cost of pulling equity from your home.</p>
          </Link>
          <Link 
            href="/calculators/points-buydown" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Points & Buydown Optimizer</h3>
            <p className="text-sm text-slate-600">Should you pay points on your new loan? Find the optimal strategy.</p>
          </Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
