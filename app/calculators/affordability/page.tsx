'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculateAffordability } from '@/lib/calculators';
import type { AffordabilityInputs, CalculatorResult } from '@/lib/calculators/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AffordabilityCalculator() {
  const [inputs, setInputs] = useState<AffordabilityInputs>({
    annualIncome: 100000,
    monthlyDebts: 500,
    downPayment: 60000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsuranceAnnual: 1200,
    hoaFees: 0,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof AffordabilityInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCalculate = () => {
    const calculatedResult = calculateAffordability(inputs);
    setResult(calculatedResult);
  };

  return (
    <CalculatorLayout
      title="How Much House Can I Afford?"
      description="Calculate your maximum home price based on income, debts, and down payment. See conservative, moderate, and aggressive affordability ranges with DTI analysis."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Income & Debts</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Annual Gross Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.annualIncome}
                    onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Monthly Debt Payments
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.monthlyDebts}
                    onChange={(e) => handleInputChange('monthlyDebts', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Car loans, credit cards, student loans, etc.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Down Payment Available
                </label>
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
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Loan Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Loan Term (years)
                </label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Property Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.propertyTaxRate}
                  onChange={(e) => handleInputChange('propertyTaxRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Home Insurance (annual)
                </label>
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  HOA Fees (monthly)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                  <input
                    type="number"
                    value={inputs.hoaFees}
                    onChange={(e) => handleInputChange('hoaFees', e.target.value)}
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
            Calculate Affordability
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
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Affordability Ranges</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-green-900">Conservative (28% DTI)</span>
                      <span className="text-2xl font-bold text-green-900">
                        ${(result.details.conservativePrice as number).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-green-700">
                      Payment: ${(result.details.conservativePayment as number).toLocaleString()}/month
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-blue-900">Moderate (36% DTI)</span>
                      <span className="text-2xl font-bold text-blue-900">
                        ${(result.details.moderatePrice as number).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-blue-700">
                      Payment: ${(result.details.moderatePayment as number).toLocaleString()}/month
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-orange-900">Aggressive (43% DTI)</span>
                      <span className="text-2xl font-bold text-orange-900">
                        ${(result.details.aggressivePrice as number).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-orange-700">
                      Payment: ${(result.details.aggressivePayment as number).toLocaleString()}/month
                    </div>
                  </div>
                </div>

                {result.chartData && (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="level" />
                        <YAxis />
                        <Tooltip formatter={(value) => value ? `$${Number(value).toLocaleString()}` : ''} />
                        <Legend />
                        <Bar dataKey="price" fill="#3b82f6" name="Max Home Price" />
                        <Bar dataKey="payment" fill="#8b5cf6" name="Monthly Payment" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <EmailResultsForm 
                calculatorName="How Much House Can I Afford?"
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
                Enter your information and click "Calculate Affordability" to see your results.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
