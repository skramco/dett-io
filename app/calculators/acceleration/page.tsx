'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculateAcceleration } from '@/lib/calculators';
import type { AccelerationInputs, CalculatorResult } from '@/lib/calculators/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AccelerationCalculator() {
  const [inputs, setInputs] = useState<AccelerationInputs>({
    loanAmount: 400000,
    interestRate: 6.5,
    loanTerm: 30,
    extraMonthly: 200,
    extraAnnual: 1000,
    lumpSumAmount: 0,
    lumpSumYear: 5,
    investmentReturn: 7,
    recastOption: false,
    recastFee: 250,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof AccelerationInputs, value: string | boolean) => {
    if (field === 'recastOption') {
      setInputs(prev => ({ ...prev, [field]: value as boolean }));
    } else {
      const numValue = typeof value === 'string' ? (parseFloat(value) || 0) : value;
      setInputs(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const handleCalculate = () => {
    const calculatedResult = calculateAcceleration(inputs);
    setResult(calculatedResult);
  };

  return (
    <CalculatorLayout
      title="Mortgage Acceleration Planner"
      description="Compare prepayment, recast, refinance later, and investing strategies. See fastest payoff vs highest net worth to optimize your extra cash flow."
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
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Extra Payments</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Extra Monthly Payment</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.extraMonthly}
                    onChange={(e) => handleInputChange('extraMonthly', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Extra Annual Payment</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.extraAnnual}
                    onChange={(e) => handleInputChange('extraAnnual', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Bonus, tax refund, etc.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lump Sum Amount</label>
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lump Sum Year</label>
                <input
                  type="number"
                  value={inputs.lumpSumYear}
                  onChange={(e) => handleInputChange('lumpSumYear', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Comparison Options</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Investment Return (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={inputs.investmentReturn}
                  onChange={(e) => handleInputChange('investmentReturn', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">Expected return if you invest instead</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={inputs.recastOption}
                  onChange={(e) => handleInputChange('recastOption', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-slate-700">
                  Consider recast option (lower payment after lump sum)
                </label>
              </div>

              {inputs.recastOption && (
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
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Calculate Acceleration Strategy
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
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="strategy" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalInterest" fill="#ef4444" name="Total Interest" />
                        <Bar dataKey="years" fill="#3b82f6" name="Years to Payoff" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 mb-1">Interest Saved</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${(result.details.interestSaved as number).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 mb-1">Years Saved</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {(result.details.yearsSaved as number).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              <EmailResultsForm 
                calculatorName="Mortgage Acceleration Planner"
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
                Enter your information and click "Calculate Acceleration Strategy" to see your results.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
