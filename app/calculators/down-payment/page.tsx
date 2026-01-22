'use client';

import { useState } from 'react';
import Link from 'next/link';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculateDownPayment } from '@/lib/calculators';
import type { DownPaymentInputs, CalculatorResult } from '@/lib/calculators/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DownPaymentCalculator() {
  const [inputs, setInputs] = useState<DownPaymentInputs>({
    homePrice: 400000,
    downPaymentPercent: 10,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1200,
    pmiRate: 0.5,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof DownPaymentInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCalculate = () => {
    const calculatedResult = calculateDownPayment(inputs);
    setResult(calculatedResult);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much should I put down on a house?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It depends on your cash reserves, PMI costs, and opportunity cost. 20% avoids PMI but ties up significant capital. 10-15% balances PMI cost with keeping cash available. 3-5% gets you in sooner but costs more monthly. Use this calculator to compare the total cost of each option."
        }
      },
      {
        "@type": "Question",
        "name": "Is it better to put 20% down to avoid PMI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not always. PMI typically costs 0.3-1.5% of the loan annually and drops off at 20% equity. If PMI is $150/month and you'd need to save 2 more years to reach 20%, you might pay less total by buying now with 10% down. Calculate your specific break-even."
        }
      },
      {
        "@type": "Question",
        "name": "What is the minimum down payment for a house?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Conventional loans allow 3% down. FHA loans require 3.5%. VA and USDA loans offer 0% down for eligible borrowers. However, lower down payments mean higher monthly costs due to PMI and a larger loan balance."
        }
      },
      {
        "@type": "Question",
        "name": "Should I use all my savings for a down payment?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Keep 3-6 months of expenses as an emergency fund, plus reserves for moving costs, immediate repairs, and furniture. Draining your savings for a larger down payment leaves you vulnerable to unexpected expenses."
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
      { "@type": "ListItem", "position": 3, "name": "Down Payment Calculator", "item": "https://dett.io/calculators/down-payment" }
    ]
  };

  return (
    <CalculatorLayout
      title="How Much Should I Put Down on a House? | Down Payment Calculator"
      description="Compare 3%, 5%, 10%, 15%, and 20% down payments side-by-side. See PMI costs, cash requirements, and total cost to find your optimal down payment strategy."
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
        <span className="text-slate-900">Down Payment Calculator</span>
      </nav>

      {/* Primary H1 - Matches Search Intent */}
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
        How Much Should I Put Down on a House?
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-3xl">
        Compare down payment options from 3% to 20%. See exactly how PMI, monthly payments, and total costs change at each level to find your optimal strategy.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Home Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Home Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.homePrice}
                    onChange={(e) => handleInputChange('homePrice', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Loan Term (years)
                </label>
                <select
                  value={inputs.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Property Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.propertyTaxRate}
                  onChange={(e) => handleInputChange('propertyTaxRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Home Insurance (annual)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.homeInsuranceAnnual}
                    onChange={(e) => handleInputChange('homeInsuranceAnnual', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  PMI Rate (% annually)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.pmiRate}
                  onChange={(e) => handleInputChange('pmiRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Typically 0.3% - 1.5% for down payments under 20%</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Compare Down Payment Options
          </button>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Summary</h3>
                <p className="text-slate-700">{result.summary}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Down Payment Comparison</h3>
                
                {result.chartData && (
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="downPayment" />
                        <YAxis />
                        <Tooltip formatter={(value) => value ? `$${Number(value).toLocaleString()}` : ''} />
                        <Legend />
                        <Bar dataKey="cashToClose" fill="#3b82f6" name="Cash to Close" />
                        <Bar dataKey="monthlyPayment" fill="#8b5cf6" name="Monthly Payment" />
                        <Bar dataKey="pmiCost" fill="#ef4444" name="Total PMI Cost" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 mb-1">3% Down</p>
                    <p className="text-2xl font-bold text-blue-900">
                      ${(result.details.option3Down as number).toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      ${(result.details.option3Payment as number).toLocaleString()}/mo
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 mb-1">20% Down</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${(result.details.option20Down as number).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      ${(result.details.option20Payment as number).toLocaleString()}/mo
                    </p>
                  </div>
                </div>
              </div>

              <EmailResultsForm 
                calculatorName="Down Payment Strategy Optimizer"
                result={result}
              />

              {result.insights && result.insights.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Dett Insights</h3>
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
                Enter your information and click "Compare Down Payment Options" to see your results.
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
          The down payment decision isn't just "put down as much as you can." It's a trade-off between <strong>PMI costs, opportunity cost of tied-up capital, and monthly cash flow</strong>. This calculator compares all common down payment levels so you can see the actual dollar difference.
        </p>
        <p className="text-slate-700 mb-8">
          For each option, you'll see the cash required at closing, monthly payment (including PMI where applicable), total PMI paid over time, and when you'd reach 20% equity to drop PMI. Armed with these numbers, you can make a decision based on your actual financial situation—not rules of thumb.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          When to Put Down 20%
        </h2>
        <ul className="space-y-3 text-slate-700 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>You have the cash without draining reserves</strong> — 20% down plus 6 months emergency fund plus closing costs plus moving expenses.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>PMI rates are high for your situation</strong> — Lower credit scores mean higher PMI. If you'd pay 1%+ annually, 20% down saves significantly.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>You want the lowest possible monthly payment</strong> — 20% down means no PMI and a smaller loan, giving you maximum cash flow flexibility.</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          When to Put Down Less Than 20%
        </h2>
        <ul className="space-y-3 text-slate-700 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <span><strong>Home prices are rising faster than you can save</strong> — If prices rise 5% annually and you save 3%, you're falling behind. Buy now with less down.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <span><strong>You'd deplete your emergency fund</strong> — Never sacrifice financial security for a larger down payment. Unexpected repairs happen.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <span><strong>You can invest the difference at higher returns</strong> — If your mortgage is 6% and you expect 8% investment returns, keeping cash invested may win mathematically.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <span><strong>PMI is cheap for your credit score</strong> — With excellent credit, PMI might be 0.3% annually. That's often worth paying to keep cash available.</span>
          </li>
        </ul>

        {/* FAQ Section */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6 mb-12">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">How much should I put down on a house?</h3>
            <p className="text-slate-700">It depends on your cash reserves, PMI costs, and opportunity cost. 20% avoids PMI but ties up significant capital. 10-15% balances PMI cost with keeping cash available. 3-5% gets you in sooner but costs more monthly. Use this calculator to compare the total cost of each option.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Is it better to put 20% down to avoid PMI?</h3>
            <p className="text-slate-700">Not always. PMI typically costs 0.3-1.5% of the loan annually and drops off at 20% equity. If PMI is $150/month and you'd need to save 2 more years to reach 20%, you might pay less total by buying now with 10% down. Calculate your specific break-even.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">What is the minimum down payment for a house?</h3>
            <p className="text-slate-700">Conventional loans allow 3% down. FHA loans require 3.5%. VA and USDA loans offer 0% down for eligible borrowers. However, lower down payments mean higher monthly costs due to PMI and a larger loan balance.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Should I use all my savings for a down payment?</h3>
            <p className="text-slate-700">No. Keep 3-6 months of expenses as an emergency fund, plus reserves for moving costs, immediate repairs, and furniture. Draining your savings for a larger down payment leaves you vulnerable to unexpected expenses.</p>
          </div>
        </div>

        {/* Internal Links */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Related Decisions
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link 
            href="/calculators/affordability" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">How Much House Can I Afford?</h3>
            <p className="text-sm text-slate-600">See what price range fits your income before deciding on down payment.</p>
          </Link>
          <Link 
            href="/calculators/mortgage-cost" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">True Monthly Cost Calculator</h3>
            <p className="text-sm text-slate-600">See your full payment including taxes, insurance, HOA, and PMI.</p>
          </Link>
          <Link 
            href="/calculators/rent-vs-buy" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Rent vs Buy Calculator</h3>
            <p className="text-sm text-slate-600">Not sure if you should buy at all? Compare renting vs buying.</p>
          </Link>
          <Link 
            href="/calculators/points-buydown" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Points & Buydown Calculator</h3>
            <p className="text-sm text-slate-600">Should extra cash go to down payment or buying points?</p>
          </Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
