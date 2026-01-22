'use client';

import { useState } from 'react';
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

  return (
    <CalculatorLayout
      title="Rent vs Buy Truth Model"
      description="Full comparison including rent inflation, home appreciation, opportunity cost, and transaction costs. See net worth crossover year in best, base, and worst case scenarios."
    >
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
    </CalculatorLayout>
  );
}
