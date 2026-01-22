'use client';

import { useState } from 'react';
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

  return (
    <CalculatorLayout
      title="Refinance Break-Even Calculator"
      description="Compare your current loan vs refinancing. See when you break even on closing costs, total savings over time, and whether refinancing makes sense."
    >
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
    </CalculatorLayout>
  );
}
