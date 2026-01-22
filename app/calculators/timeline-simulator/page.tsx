'use client';

import { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import EmailResultsForm from '@/components/EmailResultsForm';
import { calculateTimelineSimulator } from '@/lib/calculators';
import type { TimelineSimulatorInputs, CalculatorResult } from '@/lib/calculators/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TimelineSimulatorCalculator() {
  const [inputs, setInputs] = useState<TimelineSimulatorInputs>({
    loanAmount: 400000,
    interestRate: 6.5,
    expectedMoveYear: 7,
    refiLikelihood: 50,
    armInitialRate: 5.75,
    armFixedPeriod: 7,
    pointsCost: 8000,
    pointsRate: 6.25,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const handleInputChange = (field: keyof TimelineSimulatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [field]: numValue }));
  };

  const handleCalculate = () => {
    const calculatedResult = calculateTimelineSimulator(inputs);
    setResult(calculatedResult);
  };

  return (
    <CalculatorLayout
      title="Mortgage Decision Timeline Simulator"
      description="Find the best mortgage structure based on when you plan to move or refinance. Accounts for refi likelihood and compares 30-year fixed, ARM, points, and 15-year options."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Your Timeline</h2>
            
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Move Year</label>
                <input
                  type="number"
                  value={inputs.expectedMoveYear}
                  onChange={(e) => handleInputChange('expectedMoveYear', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">When do you plan to sell or move?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Refinance Likelihood (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputs.refiLikelihood}
                  onChange={(e) => handleInputChange('refiLikelihood', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">How likely are you to refinance before moving?</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">30-Year Fixed Options</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Par Rate (%)</label>
                <input
                  type="number"
                  step="0.125"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

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
            <h2 className="text-xl font-semibold text-slate-900 mb-4">ARM Option</h2>
            
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
                <label className="block text-sm font-medium text-slate-700 mb-1">ARM Fixed Period (years)</label>
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
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Find Best Option
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
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Total Cost Comparison</h3>
                
                {result.chartData && (
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="option" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="monthlyPayment" fill="#3b82f6" name="Monthly Payment" />
                        <Bar dataKey="totalPaid" fill="#8b5cf6" name="Total Paid" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                  <p className="text-sm font-semibold text-green-900 mb-2">Best for Your Timeline</p>
                  <p className="text-2xl font-bold text-green-900 mb-1">
                    {result.details.bestOption as string}
                  </p>
                  <p className="text-sm text-green-700">
                    ${(result.details.bestPayment as number).toLocaleString()}/month • Total: ${(result.details.bestTotalCost as number).toLocaleString()}
                  </p>
                </div>
              </div>

              <EmailResultsForm 
                calculatorName="Mortgage Decision Timeline Simulator"
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
                Enter your information and click "Find Best Option" to see your results.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}
