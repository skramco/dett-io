'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculateArmVsFixed } from '@/lib/calculators';
import type { ArmVsFixedInputs, CalculatorResult } from '@/lib/calculators/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ArmVsFixedCalculator() {
  const [inputs, setInputs] = useState<ArmVsFixedInputs>({
    loanAmount: 400000,
    fixedRate: 6.5,
    armInitialRate: 5.75,
    armFixedPeriod: 7,
    armAdjustmentCap: 2,
    armLifetimeCap: 5,
    armMargin: 2.5,
    loanTerm: 30,
    expectedIndexRate: 4,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof ArmVsFixedInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCalculate = () => {
    const calculatedResult = calculateArmVsFixed(inputs);
    setResult(calculatedResult);
  };

  return (
    <CalculatorLayout
      title="ARM vs Fixed Reality Check"
      description="Model rate caps, adjustment timelines, and worst-case scenarios. See probability-weighted cost comparison with payment volatility warnings."
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Fixed Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.fixedRate}
                  onChange={(e) => handleInputChange('fixedRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">ARM Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ARM Initial Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.armInitialRate}
                  onChange={(e) => handleInputChange('armInitialRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fixed Period (years)</label>
                <select
                  value={inputs.armFixedPeriod}
                  onChange={(e) => handleInputChange('armFixedPeriod', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="3">3 years</option>
                  <option value="5">5 years</option>
                  <option value="7">7 years</option>
                  <option value="10">10 years</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Rate is fixed for this period</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adjustment Cap (%)</label>
                <input
                  type="number"
                  step="0.25"
                  value={inputs.armAdjustmentCap}
                  onChange={(e) => handleInputChange('armAdjustmentCap', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Max rate increase per adjustment</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lifetime Cap (%)</label>
                <input
                  type="number"
                  step="0.25"
                  value={inputs.armLifetimeCap}
                  onChange={(e) => handleInputChange('armLifetimeCap', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Max rate increase over life of loan</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ARM Margin (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.armMargin}
                  onChange={(e) => handleInputChange('armMargin', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Index Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.expectedIndexRate}
                  onChange={(e) => handleInputChange('expectedIndexRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Your best guess for future rates</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Compare ARM vs Fixed
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
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Comparison Over Time</h3>
                
                {result.chartData && (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Monthly Payment ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="fixedPayment" stroke="#3b82f6" strokeWidth={2} name="Fixed Rate" />
                        <Line type="monotone" dataKey="armPayment" stroke="#ef4444" strokeWidth={2} name="ARM" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <p className="text-sm text-blue-700 mb-1">Fixed Payment</p>
                    <p className="text-xl font-bold text-blue-900">
                      ${(result.details.fixedPayment as number).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-sm text-green-700 mb-1">ARM Start</p>
                    <p className="text-xl font-bold text-green-900">
                      ${(result.details.armPayment as number).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <p className="text-sm text-red-700 mb-1">Worst Case</p>
                    <p className="text-xl font-bold text-red-900">
                      ${(result.details.worstCasePayment as number).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <EmailResultsForm 
                calculatorName="ARM vs Fixed Reality Check"
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
                Enter your information and click "Compare ARM vs Fixed" to see your results.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
