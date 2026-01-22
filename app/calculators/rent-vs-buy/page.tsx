'use client';

import { useState } from 'react';
import Link from 'next/link';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculateRentVsBuy } from '@/lib/calculators';
import type { RentVsBuyInputs, CalculatorResult } from '@/lib/calculators/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RentVsBuyCalculator() {
  const [inputs, setInputs] = useState<RentVsBuyInputs>({
    homePrice: 400000,
    downPayment: 80000,
    interestRate: 6.5,
    loanTerm: 30,
    monthlyRent: 2000,
    rentInflation: 3,
    homeAppreciation: 3,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1200,
    maintenanceRate: 1,
    closingCosts: 12000,
    sellingCosts: 6,
    investmentReturn: 7,
    yearsToAnalyze: 10,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof RentVsBuyInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCalculate = () => {
    const calculatedResult = calculateRentVsBuy(inputs);
    setResult(calculatedResult);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is it better to rent or buy a house right now?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It depends on how long you'll stay, local price-to-rent ratios, and your opportunity cost. Generally, buying makes sense if you'll stay 5+ years and the monthly cost of owning (including all hidden costs) is within 1.5x your rent. Use this calculator to see your specific breakeven timeline."
        }
      },
      {
        "@type": "Question",
        "name": "How long do you need to own a home for buying to make sense?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Typically 5-7 years minimum. Transaction costs (closing costs when buying, 6% agent fees when selling) eat into any appreciation. The exact breakeven depends on your market's appreciation rate, your mortgage rate, and what rent would cost instead."
        }
      },
      {
        "@type": "Question",
        "name": "What hidden costs make buying more expensive than renting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Property taxes (1-2% of home value annually), homeowners insurance, maintenance (budget 1% of home value per year), HOA fees, and opportunity cost on your down payment. These often add $500-1,500/month beyond your mortgage payment."
        }
      },
      {
        "@type": "Question",
        "name": "Should I buy a house if I might move in 3 years?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Probably not. With typical 3% closing costs and 6% selling costs, you need roughly 9% appreciation just to break even. In a flat or declining market, you could lose money. Renting provides flexibility without the transaction cost risk."
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
      { "@type": "ListItem", "position": 3, "name": "Rent vs Buy Calculator", "item": "https://dett.io/calculators/rent-vs-buy" }
    ]
  };

  return (
    <CalculatorLayout
      title="Should I Rent or Buy? | Honest Calculator With All Costs"
      description="Compare renting vs buying with ALL hidden costs included: opportunity cost, maintenance, transaction fees, and appreciation. See exactly when buying beats renting for your situation."
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
        <span className="text-slate-900">Rent vs Buy Calculator</span>
      </nav>

      {/* Primary H1 - Matches Search Intent */}
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
        Should I Rent or Buy a House?
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-3xl">
        This isn't a simple "multiply rent by 200" calculator. We model rent inflation, home appreciation, opportunity cost on your down payment, maintenance, and transaction costs to show you the real crossover point.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Home Purchase</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Home Price</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Down Payment</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.downPayment}
                    onChange={(e) => handleInputChange('downPayment', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Closing Costs</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.closingCosts}
                    onChange={(e) => handleInputChange('closingCosts', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Renting</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Rent</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rent Inflation (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={inputs.rentInflation}
                  onChange={(e) => handleInputChange('rentInflation', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Investment Return (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={inputs.investmentReturn}
                  onChange={(e) => handleInputChange('investmentReturn', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Expected return if you invest the difference</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Assumptions</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Home Appreciation (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={inputs.homeAppreciation}
                  onChange={(e) => handleInputChange('homeAppreciation', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Years to Analyze</label>
                <input
                  type="number"
                  value={inputs.yearsToAnalyze}
                  onChange={(e) => handleInputChange('yearsToAnalyze', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Property Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.propertyTaxRate}
                  onChange={(e) => handleInputChange('propertyTaxRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Maintenance Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.maintenanceRate}
                  onChange={(e) => handleInputChange('maintenanceRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Annual maintenance as % of home value</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Calculate Rent vs Buy
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
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Net Worth Over Time</h3>
                
                {result.chartData && (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Net Worth ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => value ? `$${Number(value).toLocaleString()}` : ''} />
                        <Legend />
                        <Line type="monotone" dataKey="rentNetWorth" stroke="#ef4444" strokeWidth={2} name="Renting" />
                        <Line type="monotone" dataKey="buyNetWorth" stroke="#3b82f6" strokeWidth={2} name="Buying" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-blue-700 mb-1">Crossover Year</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {result.details.baseCrossover as string | number}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-sm text-green-700 mb-1">Buy Net Worth</p>
                    <p className="text-xl font-bold text-green-900">
                      ${((result.details.baseBuyNetWorth as number) / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <p className="text-sm text-red-700 mb-1">Rent Net Worth</p>
                    <p className="text-xl font-bold text-red-900">
                      ${((result.details.baseRentNetWorth as number) / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              </div>

              <EmailResultsForm 
                calculatorName="Rent vs Buy Truth Model"
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
                Enter your information and click "Calculate Rent vs Buy" to see your results.
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
          Most rent vs buy calculators oversimplify. They compare your rent to a mortgage payment and declare a winner. But that ignores <strong>opportunity cost</strong>—what your down payment could earn if invested—and the <strong>hidden costs of ownership</strong> that add 30-50% to your monthly housing expense.
        </p>
        <p className="text-slate-700 mb-8">
          This calculator models the full picture: rent inflation over time, home appreciation (or depreciation), maintenance costs, property taxes, insurance, transaction costs when you eventually sell, and what your down payment would grow to if invested instead. The result is a year-by-year net worth comparison showing exactly when—and if—buying pulls ahead.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          When Buying Makes Sense
        </h2>
        <ul className="space-y-3 text-slate-700 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>You'll stay 7+ years</strong> — Transaction costs (buying + selling) typically eat 8-10% of home value. You need time to recover that.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Price-to-rent ratio under 20</strong> — If a $400k home rents for $2,000/month (ratio = 16.7), buying is likely favorable. Above 25, renting usually wins.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>You want stability</strong> — Owning locks in your housing cost (mostly). Renters face unpredictable increases and potential displacement.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>Local appreciation is strong</strong> — In markets with 4%+ annual appreciation, buying builds wealth faster than renting and investing.</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          When Renting Makes More Sense
        </h2>
        <ul className="space-y-3 text-slate-700 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <span><strong>You might move in under 5 years</strong> — Job changes, relationship changes, or life uncertainty make renting's flexibility valuable.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <span><strong>Price-to-rent ratio exceeds 25</strong> — In expensive markets like SF or NYC, renting and investing the difference often wins mathematically.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <span><strong>You'd drain your emergency fund for a down payment</strong> — Buying with no cushion is risky. One major repair could force you to sell at a loss.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">→</span>
            <span><strong>Your career is location-flexible</strong> — Remote workers who might relocate for opportunity shouldn't anchor themselves to a property.</span>
          </li>
        </ul>

        {/* FAQ Section */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6 mb-12">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Is it better to rent or buy a house right now?</h3>
            <p className="text-slate-700">It depends on how long you'll stay, local price-to-rent ratios, and your opportunity cost. Generally, buying makes sense if you'll stay 5+ years and the monthly cost of owning (including all hidden costs) is within 1.5x your rent. Use this calculator to see your specific breakeven timeline.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">How long do you need to own a home for buying to make sense?</h3>
            <p className="text-slate-700">Typically 5-7 years minimum. Transaction costs (closing costs when buying, 6% agent fees when selling) eat into any appreciation. The exact breakeven depends on your market's appreciation rate, your mortgage rate, and what rent would cost instead.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">What hidden costs make buying more expensive than renting?</h3>
            <p className="text-slate-700">Property taxes (1-2% of home value annually), homeowners insurance, maintenance (budget 1% of home value per year), HOA fees, and opportunity cost on your down payment. These often add $500-1,500/month beyond your mortgage payment.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Should I buy a house if I might move in 3 years?</h3>
            <p className="text-slate-700">Probably not. With typical 3% closing costs and 6% selling costs, you need roughly 9% appreciation just to break even. In a flat or declining market, you could lose money. Renting provides flexibility without the transaction cost risk.</p>
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
            <p className="text-sm text-slate-600">Decided to buy? See what price range fits your income and debts.</p>
          </Link>
          <Link 
            href="/calculators/down-payment" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Down Payment Strategy</h3>
            <p className="text-sm text-slate-600">Compare 3%, 5%, 10%, and 20% down to find your optimal amount.</p>
          </Link>
          <Link 
            href="/calculators/mortgage-cost" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">True Monthly Cost Calculator</h3>
            <p className="text-sm text-slate-600">See your real monthly payment including taxes, insurance, and PMI.</p>
          </Link>
          <Link 
            href="/calculators/refinance" 
            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors"
          >
            <h3 className="font-semibold text-slate-900 mb-1">Refinance Calculator</h3>
            <p className="text-sm text-slate-600">Already own? See if refinancing to a lower rate makes sense.</p>
          </Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
