'use client';

import { useState } from 'react';
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

  return (
    <CalculatorLayout
      title="Points & Buydown Optimizer"
      description="Compare par rate, buying points, lender credits, and temporary buydowns. See which option saves the most based on how long you plan to keep the loan."
    >
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
    </CalculatorLayout>
  );
}
