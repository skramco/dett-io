'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculateExtraPayment } from '@/lib/calculators';
import type { ExtraPaymentInputs, CalculatorResult } from '@/lib/calculators/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ExtraPaymentCalculator() {
  const [inputs, setInputs] = useState<ExtraPaymentInputs>({
    loanAmount: 300000,
    interestRate: 6.5,
    loanTerm: 30,
    extraMonthlyPayment: 200,
    extraAnnualPayment: 0,
    investmentReturn: 7,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof ExtraPaymentInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCalculate = () => {
    const calculatedResult = calculateExtraPayment(inputs);
    setResult(calculatedResult);
  };

  return (
    <CalculatorLayout
      title="Extra Payment Impact Calculator"
      description="See how extra payments save interest and shorten your loan. Compare paying down debt vs investing the money to make the smartest choice."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Loan Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Loan Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Interest Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    className="w-full pr-8 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Loan Term
                </label>
                <select
                  value={inputs.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Extra Monthly Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.extraMonthlyPayment}
                    onChange={(e) => handleInputChange('extraMonthlyPayment', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Additional amount paid each month</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Extra Annual Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.extraAnnualPayment}
                    onChange={(e) => handleInputChange('extraAnnualPayment', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">One-time payment each year (e.g., bonus)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Investment Comparison</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Expected Investment Return
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={inputs.investmentReturn}
                  onChange={(e) => handleInputChange('investmentReturn', e.target.value)}
                  className="w-full pr-8 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Historical stock market average is ~7-10%</p>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-slate-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Calculate Impact
          </button>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                <h2 className="text-sm font-medium text-slate-300 mb-2">Interest Saved</h2>
                <p className="text-4xl font-bold mb-2">
                  ${result.details.interestSaved.toLocaleString()}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {result.summary}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Time Savings</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">Regular Payoff</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {result.details.monthsRegular} months
                    </p>
                    <p className="text-sm text-slate-600">
                      ({Math.floor((result.details.monthsRegular as number) / 12)} years)
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600 mb-1">With Extra Payments</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {result.details.monthsWithExtra} months
                    </p>
                    <p className="text-sm text-slate-600">
                      ({Math.floor((result.details.monthsWithExtra as number) / 12)} years)
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 mb-1">Time Saved</p>
                  <p className="text-3xl font-bold text-green-900">
                    {(result.details.yearsSaved as number).toFixed(1)} years
                  </p>
                  <p className="text-sm text-green-700">
                    ({result.details.monthsSaved} months earlier)
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Pay Down Debt vs Invest</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Interest Saved (Debt)</span>
                    <span className="font-semibold text-slate-900">
                      ${result.details.interestSaved.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Investment Value</span>
                    <span className="font-semibold text-slate-900">
                      ${result.details.investmentValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Investment Return Rate</span>
                    <span className="font-semibold text-slate-900">
                      {result.details.investmentReturn}%
                    </span>
                  </div>
                </div>

                {(result.details.investmentValue as number) > (result.details.interestSaved as number) ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-amber-900 mb-1">Investment Wins</p>
                    <p className="text-sm text-amber-800">
                      Investing would earn ${((result.details.investmentValue as number) - (result.details.interestSaved as number)).toLocaleString()} more than paying down debt.
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-900 mb-1">Debt Paydown Wins</p>
                    <p className="text-sm text-green-800">
                      Paying down debt saves ${((result.details.interestSaved as number) - (result.details.investmentValue as number)).toLocaleString()} more than investing.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Interest Comparison</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Regular Interest Paid</span>
                    <span className="font-semibold text-slate-900">
                      ${result.details.totalInterestRegular.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-600">With Extra Payments</span>
                    <span className="font-semibold text-slate-900">
                      ${result.details.totalInterestWithExtra.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-slate-900">Total Saved</span>
                    <span className="text-xl font-bold text-green-600">
                      ${result.details.interestSaved.toLocaleString()}
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
                          dataKey="regularLoan" 
                          stroke="#64748b" 
                          strokeWidth={2}
                          name="Regular Payments"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="withExtraPayments" 
                          stroke="#0f172a" 
                          strokeWidth={2}
                          name="With Extra Payments"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <EmailResultsForm 
                calculatorName="Extra Payment Impact Calculator"
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
                Enter your loan details and extra payment amounts, then click "Calculate Impact" to see how much you'll save.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
