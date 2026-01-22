'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculateMortgageCost } from '@/lib/calculators';
import type { MortgageCostInputs, CalculatorResult } from '@/lib/calculators/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0f172a', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];

export default function MortgageCostCalculator() {
  const [inputs, setInputs] = useState<MortgageCostInputs>({
    homePrice: 400000,
    downPayment: 80000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTax: 4800,
    homeInsurance: 1200,
    hoaFees: 0,
    pmi: 0,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof MortgageCostInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCalculate = () => {
    const calculatedResult = calculateMortgageCost(inputs);
    setResult(calculatedResult);
  };

  const downPaymentPercent = inputs.homePrice > 0 ? (inputs.downPayment / inputs.homePrice) * 100 : 0;
  const needsPMI = downPaymentPercent < 20;

  return (
    <CalculatorLayout
      title="True Monthly Mortgage Cost"
      description="See your real monthly payment including PITI (Principal, Interest, Taxes, Insurance), HOA fees, and PMI. Most calculators only show principal and interest."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Loan Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Home Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.homePrice}
                    onChange={(e) => handleInputChange('homePrice', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Down Payment ({downPaymentPercent.toFixed(1)}%)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.downPayment}
                    onChange={(e) => handleInputChange('downPayment', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
                {needsPMI && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ Less than 20% down - PMI required
                  </p>
                )}
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
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Additional Costs</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Annual Property Tax
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.propertyTax}
                    onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Typically 1-2% of home value per year</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Annual Home Insurance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.homeInsurance}
                    onChange={(e) => handleInputChange('homeInsurance', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Monthly HOA Fees
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.hoaFees}
                    onChange={(e) => handleInputChange('hoaFees', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>

              {needsPMI && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Annual PMI
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={inputs.pmi}
                      onChange={(e) => handleInputChange('pmi', e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Usually 0.5-1% of loan amount per year</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-slate-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Calculate True Cost
          </button>
        </div>

        <div className="space-y-6">
          {result ? (
            <>
              <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
                <h2 className="text-sm font-medium text-slate-300 mb-2">Your True Monthly Payment</h2>
                <p className="text-4xl font-bold mb-4">
                  ${result.details.totalMonthlyPayment.toLocaleString()}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {result.summary}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Monthly Payment Breakdown</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Principal & Interest</span>
                    <span className="font-semibold text-slate-900">
                      ${result.details.principalAndInterest.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Property Tax</span>
                    <span className="font-semibold text-slate-900">
                      ${result.details.monthlyPropertyTax.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-600">Home Insurance</span>
                    <span className="font-semibold text-slate-900">
                      ${result.details.monthlyInsurance.toLocaleString()}
                    </span>
                  </div>
                  {(result.details.monthlyHOA as number) > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-slate-600">HOA Fees</span>
                      <span className="font-semibold text-slate-900">
                        ${result.details.monthlyHOA.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {(result.details.monthlyPMI as number) > 0 && (
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <span className="text-slate-600">PMI</span>
                      <span className="font-semibold text-slate-900">
                        ${result.details.monthlyPMI.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {result.chartData && result.chartData.length > 0 && (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={result.chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={(entry: any) => `${((entry.percent || 0) * 100).toFixed(0)}%`}
                        >
                          {result.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number | undefined) => value ? `$${value.toFixed(2)}` : '$0'} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Numbers</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Loan Amount</p>
                    <p className="text-xl font-semibold text-slate-900">
                      ${result.details.loanAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Down Payment</p>
                    <p className="text-xl font-semibold text-slate-900">
                      {result.details.downPaymentPercent}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Interest</p>
                    <p className="text-xl font-semibold text-slate-900">
                      ${result.details.totalInterest.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Paid</p>
                    <p className="text-xl font-semibold text-slate-900">
                      ${result.details.totalPaid.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <EmailResultsForm 
                calculatorName="True Monthly Mortgage Cost"
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
                Enter your information and click "Calculate True Cost" to see your results.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
