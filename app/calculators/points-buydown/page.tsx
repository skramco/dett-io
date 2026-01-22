'use client';

import { useState } from 'react';
import Link from 'next/link';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculatePointsBuydown } from '@/lib/calculators';
import type { PointsBuydownInputs, CalculatorResult } from '@/lib/calculators/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PointsBuydownCalculator() {
  const [inputs, setInputs] = useState<PointsBuydownInputs>({
    loanAmount: 400000,
    parRate: 6.5,
    loanTerm: 30,
    pointsCost: 8000,
    pointsRate: 6.25,
    lenderCredit: 4000,
    lenderCreditRate: 6.75,
    buydownType: 'none',
    buydownCost: 6000,
    yearsToHold: 7,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof PointsBuydownInputs, value: string | number) => {
    if (field === 'buydownType') {
      setInputs(prev => ({ ...prev, [field]: value as 'none' | '2-1' | '1-0' }));
    } else {
      const numValue = typeof value === 'string' ? (parseFloat(value) || 0) : value;
      setInputs(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const handleCalculate = () => {
    const calculatedResult = calculatePointsBuydown(inputs);
    setResult(calculatedResult);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Should I buy mortgage points to lower my rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It depends on how long you'll keep the loan. Each point costs 1% of your loan amount and typically lowers your rate by 0.25%. Calculate your break-even by dividing the points cost by monthly savings. If you'll stay past that point, buying points makes sense."
        }
      },
      {
        "@type": "Question",
        "name": "What is a 2-1 buydown and is it worth it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A 2-1 buydown temporarily reduces your rate by 2% in year 1 and 1% in year 2, then returns to the full rate. It's worth it if you expect income to rise, plan to refinance soon, or the seller is paying for it. Otherwise, permanent points often provide better long-term value."
        }
      },
      {
        "@type": "Question",
        "name": "Should I take lender credits or pay points?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Take lender credits if you'll move or refinance within 3-5 years—the higher rate won't cost you much. Pay points if you'll keep the loan 7+ years and want the lowest possible long-term cost. This calculator shows the exact crossover point."
        }
      },
      {
        "@type": "Question",
        "name": "How do seller credits for buydowns work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sellers can contribute toward closing costs, including buydown fees. A seller-paid 2-1 buydown gives you lower payments for 2 years at no cost to you. It's often better than a price reduction because it improves your cash flow immediately."
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
      { "@type": "ListItem", "position": 3, "name": "Points & Buydown Calculator", "item": "https://dett.io/calculators/points-buydown" }
    ]
  };

  return (
    <CalculatorLayout
      title="Should I Buy Mortgage Points? | Points vs Buydown Calculator"
      description="Compare buying points, taking lender credits, or using a 2-1 buydown. See exactly which option costs less based on how long you'll keep your mortgage."
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
        <span className="text-slate-900">Points & Buydown Calculator</span>
      </nav>

      {/* Primary H1 - Matches Search Intent */}
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
        Should I Buy Points, Take Credits, or Use a Buydown?
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-3xl">
        Compare all your rate options side-by-side. Enter the quotes you've received and see which strategy costs less over your expected timeline.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Loan Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loan Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Par Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.parRate}
                  onChange={(e) => handleInputChange('parRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Rate with no points or credits</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Years to Hold</label>
                <input
                  type="number"
                  value={inputs.yearsToHold}
                  onChange={(e) => handleInputChange('yearsToHold', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">How long before you move or refinance?</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Buy Points Option</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Points Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.pointsCost}
                    onChange={(e) => handleInputChange('pointsCost', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rate with Points (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.pointsRate}
                  onChange={(e) => handleInputChange('pointsRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Lender Credit Option</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lender Credit</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.lenderCredit}
                    onChange={(e) => handleInputChange('lenderCredit', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rate with Credit (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.lenderCreditRate}
                  onChange={(e) => handleInputChange('lenderCreditRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Buydown Option (Optional)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Buydown Type</label>
                <select
                  value={inputs.buydownType}
                  onChange={(e) => handleInputChange('buydownType', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">None</option>
                  <option value="2-1">2-1 Buydown</option>
                  <option value="1-0">1-0 Buydown</option>
                </select>
              </div>

              {inputs.buydownType !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Buydown Cost</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                    <input
                      type="number"
                      value={inputs.buydownCost}
                      onChange={(e) => handleInputChange('buydownCost', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Compare Options
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
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Comparison</h3>
                
                {result.chartData && (
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="option" />
                        <YAxis />
                        <Tooltip formatter={(value) => value ? `$${Number(value).toLocaleString()}` : ''} />
                        <Legend />
                        <Bar dataKey="monthlyPayment" fill="#3b82f6" name="Monthly Payment" />
                        <Bar dataKey="totalCost" fill="#8b5cf6" name="Total Cost" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 mb-1">Best Option</p>
                    <p className="text-xl font-bold text-blue-900">
                      {result.details.bestOption as string}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 mb-1">Total Cost</p>
                    <p className="text-xl font-bold text-green-900">
                      ${(result.details.bestTotalCost as number).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <EmailResultsForm 
                calculatorName="Points & Buydown Optimizer"
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
                Enter your information and click "Compare Options" to see your results.
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
          When you get a mortgage quote, you're usually offered multiple rate options: the par rate (no points, no credits), a lower rate if you pay points, or a higher rate with lender credits toward closing costs. Some lenders also offer temporary buydowns. <strong>This calculator compares all options based on your specific timeline.</strong>
        </p>
        <p className="text-slate-700 mb-8">
          The "best" choice depends entirely on how long you'll keep the loan. Pay points and refinance in 2 years? You lose money. Take credits and stay 15 years? You overpay. This tool shows the crossover points so you can make an informed decision.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          When to Buy Points
        </h2>
        <ul className="space-y-3 text-slate-700 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>You'll keep the loan 7+ years</strong> — Points typically break even in 4-6 years. Beyond that, you're saving money every month.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>You have extra cash at closing</strong> — Points require upfront payment. Don't drain your emergency fund to buy them.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>You want the lowest possible payment</strong> — If monthly cash flow matters more than total cost, points reduce your payment permanently.</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          When to Take Lender Credits
        </h2>
        <ul className="space-y-3 text-slate-700 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <span><strong>You might move or refinance in under 5 years</strong> — The higher rate costs you less than points would have.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <span><strong>You're short on closing costs</strong> — Credits reduce your cash needed at closing, which can be the difference between buying and not buying.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <span><strong>Rates are likely to drop</strong> — If you expect to refinance when rates fall, don't pay for a rate you won't keep.</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          When Buydowns Make Sense
        </h2>
        <ul className="space-y-3 text-slate-700 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold">★</span>
            <span><strong>The seller is paying</strong> — A seller-paid 2-1 buydown costs you nothing and lowers your payments for 2 years. Always take this if offered.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold">★</span>
            <span><strong>Your income will rise</strong> — If you're starting a new job or expecting raises, a buydown bridges the gap until you can afford the full payment.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold">★</span>
            <span><strong>You plan to refinance soon</strong> — If rates drop and you refinance in year 2, you got lower payments without paying for a permanent rate reduction.</span>
          </li>
        </ul>

        {/* FAQ Section */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6 mb-12">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Should I buy mortgage points to lower my rate?</h3>
            <p className="text-slate-700">It depends on how long you'll keep the loan. Each point costs 1% of your loan amount and typically lowers your rate by 0.25%. Calculate your break-even by dividing the points cost by monthly savings. If you'll stay past that point, buying points makes sense.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">What is a 2-1 buydown and is it worth it?</h3>
            <p className="text-slate-700">A 2-1 buydown temporarily reduces your rate by 2% in year 1 and 1% in year 2, then returns to the full rate. It's worth it if you expect income to rise, plan to refinance soon, or the seller is paying for it. Otherwise, permanent points often provide better long-term value.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Should I take lender credits or pay points?</h3>
            <p className="text-slate-700">Take lender credits if you'll move or refinance within 3-5 years—the higher rate won't cost you much. Pay points if you'll keep the loan 7+ years and want the lowest possible long-term cost. This calculator shows the exact crossover point.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">How do seller credits for buydowns work?</h3>
            <p className="text-slate-700">Sellers can contribute toward closing costs, including buydown fees. A seller-paid 2-1 buydown gives you lower payments for 2 years at no cost to you. It's often better than a price reduction because it improves your cash flow immediately.</p>
          </div>
        </div>

        {/* Internal Links */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Related Decisions
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link 
            href="/calculators/refinance" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Refinance Calculator</h3>
            <p className="text-sm text-slate-600">Planning to refinance later? See when it makes sense.</p>
          </Link>
          <Link 
            href="/calculators/arm-vs-fixed" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">ARM vs Fixed Calculator</h3>
            <p className="text-sm text-slate-600">Considering an ARM instead of paying points? Compare the options.</p>
          </Link>
          <Link 
            href="/calculators/down-payment" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Down Payment Strategy</h3>
            <p className="text-sm text-slate-600">Should you use cash for down payment or points? Optimize your strategy.</p>
          </Link>
          <Link 
            href="/calculators/mortgage-cost" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">True Monthly Cost Calculator</h3>
            <p className="text-sm text-slate-600">See your full monthly payment including taxes, insurance, and PMI.</p>
          </Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
