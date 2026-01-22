'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import type { CalculatorResult } from '@/lib/calculators/types';

interface EmailResultsFormProps {
  calculatorName: string;
  result: CalculatorResult;
}

export default function EmailResultsForm({ calculatorName, result }: EmailResultsFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          calculatorName,
          summary: result.summary,
          details: result.details,
          insights: result.insights,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setStatus('success');
      setEmail('');
      
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send email');
      
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-semibold text-slate-900">Email These Results</h3>
      </div>
      
      <p className="text-sm text-slate-600 mb-4">
        Get a copy of your calculation results sent to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={status === 'sending' || status === 'success'}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        {status === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">
              Results sent! Check your inbox.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">
              {errorMessage}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'sending' || status === 'success'}
          className="w-full bg-slate-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'sending' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : status === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              Sent!
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Email Results
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-slate-500 mt-3">
        We'll never spam you or share your email. This is just for sending your results.
      </p>
    </div>
  );
}
