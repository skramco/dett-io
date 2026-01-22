'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculateRecastVsRefi } from '@/lib/calculators';
import type { RecastVsRefinanceInputs, CalculatorResult } from '@/lib/calculators/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RecastVsRefiCalculator() {
  const [inputs, setInputs] = useState<RecastVsRefinanceInputs>({
    currentBalance: 300000,
    currentRate: 6.5,
    yearsRemaining: 25,
    lumpSumAmount: 50000,
    recastFee: 250,
    newRate: 6.0,
    newTerm: 30,
    closingCosts: 8000,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof RecastVsRefinanceInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCalculate = () => {
    const calculatedResult = calculateRecastVsRefi(inputs);
    setResult(calculatedResult);
  };

  return (
    <CalculatorLayout
      title="Recast vs Refinance vs Prepay"
      description="Compare lump-sum recast, refinance, and simple prepayment. See which saves the most interest and gives best flexibility when you have extra cash."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Current Mortgage</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Balance</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.currentBalance}
                    onChange={(e) => handleInputChange('currentBalance', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.currentRate}
                  onChange={(e) => handleInputChange('currentRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Years Remaining</label>
                <input
                  type="number"
                  value={inputs.yearsRemaining}
                  onChange={(e) => handleInputChange('yearsRemaining', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lump Sum Available</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.lumpSumAmount}
                    onChange={(e) => handleInputChange('lumpSumAmount', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Recast Option</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Recast Fee</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.recastFee}
                    onChange={(e) => handleInputChange('recastFee', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Typically $250-$500</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Refinance Option</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.newRate}
                  onChange={(e) => handleInputChange('newRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Term (years)</label>
                <select
                  value={inputs.newTerm}
                  onChange={(e) => handleInputChange('newTerm', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="30">30 years</option>
                </select>
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
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Strategy Comparison</h3>
                
                {result.chartData && (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="option" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="payment" fill="#3b82f6" name="Monthly Payment" />
                        <Bar dataKey="totalInterest" fill="#ef4444" name="Total Interest" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-blue-700 mb-1">Recast</p>
                    <p className="text-xl font-bold text-blue-900">
                      ${(result.details.recastPayment as number).toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">/month</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <p className="text-sm text-purple-700 mb-1">Refinance</p>
                    <p className="text-xl font-bold text-purple-900">
                      ${(result.details.refiPayment as number).toLocaleString()}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">/month</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-sm text-green-700 mb-1">Prepay Only</p>
                    <p className="text-xl font-bold text-green-900">
                      {(result.details.prepayMonthsSaved as number) / 12} yrs
                    </p>
                    <p className="text-xs text-green-600 mt-1">saved</p>
                  </div>
                </div>
              </div>

              <EmailResultsForm 
                calculatorName="Recast vs Refinance vs Prepay"
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
