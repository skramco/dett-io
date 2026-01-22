'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculateInterestSensitivity } from '@/lib/calculators';
import type { InterestSensitivityInputs, CalculatorResult } from '@/lib/calculators/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function InterestSensitivityCalculator() {
  const [inputs, setInputs] = useState<InterestSensitivityInputs>({
    loanAmount: 400000,
    baseRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1200,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof InterestSensitivityInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCalculate = () => {
    const calculatedResult = calculateInterestSensitivity(inputs);
    setResult(calculatedResult);
  };

  return (
    <CalculatorLayout
      title="Interest Rate Sensitivity Simulator"
      description="See how ±0.25%, ±0.5%, ±1% rate changes affect your payment and total cost. Essential for lock decisions, point purchases, and timing your mortgage."
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Base Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.baseRate}
                  onChange={(e) => handleInputChange('baseRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Your current or quoted rate</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loan Term (years)</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Home Insurance (annual)</label>
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
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What This Answers</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Should I lock my rate now or wait?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Is it worth paying points to buy down the rate?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>How much does 0.25% really matter?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>What's my risk if rates move?</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Analyze Rate Sensitivity
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
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Rate Impact Analysis</h3>
                
                {result.chartData && (
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rate" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="monthlyPayment" stroke="#3b82f6" strokeWidth={2} name="Monthly Payment" />
                        <Line yAxisId="right" type="monotone" dataKey="totalInterest" stroke="#ef4444" strokeWidth={2} name="Total Interest" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-yellow-50 rounded-lg text-center">
                    <p className="text-sm text-yellow-700 mb-1">±0.25%</p>
                    <p className="text-xl font-bold text-yellow-900">
                      ${(result.details.quarterPctImpact as number).toLocaleString()}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">/month</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <p className="text-sm text-orange-700 mb-1">±0.5%</p>
                    <p className="text-xl font-bold text-orange-900">
                      ${(result.details.halfPctImpact as number).toLocaleString()}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">/month</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <p className="text-sm text-red-700 mb-1">±1.0%</p>
                    <p className="text-xl font-bold text-red-900">
                      ${(result.details.fullPctImpact as number).toLocaleString()}
                    </p>
                    <p className="text-xs text-red-600 mt-1">/month</p>
                  </div>
                </div>
              </div>

              <EmailResultsForm 
                calculatorName="Interest Rate Sensitivity Simulator"
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
                Enter your information and click "Analyze Rate Sensitivity" to see your results.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
