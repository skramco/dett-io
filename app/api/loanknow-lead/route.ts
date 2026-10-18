import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import LoanKnowLeadEmail from '@/emails/LoanKnowLeadEmail';
import type { Database, Json } from '@/lib/supabase/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildCalculatorUrl(calculatorPath: string | undefined, inputs: Record<string, unknown> | undefined): string {
  let url = `https://dett.io${calculatorPath || '/calculators'}`;
  if (inputs && typeof inputs === 'object') {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }
  return url;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      consent,
      consentText,
      calculatorSlug,
      calculatorName,
      ctaLabel,
      inputs,
      summary,
      details,
      insights,
      calculatorPath,
    } = body as {
      email?: string;
      consent?: boolean;
      consentText?: string;
      calculatorSlug?: string;
      calculatorName?: string;
      ctaLabel?: string;
      inputs?: Record<string, unknown>;
      summary?: string;
      details?: Record<string, number | string>;
      insights?: string[];
      calculatorPath?: string;
    };

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (consent !== true) {
      return NextResponse.json(
        { error: 'Consent is required to save your email' },
        { status: 400 }
      );
    }
    if (!calculatorSlug || typeof calculatorSlug !== 'string') {
      return NextResponse.json({ error: 'Missing calculator type' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (!(supabaseUrl && supabaseKey) && !resendKey) {
      return NextResponse.json({ error: 'Lead capture not configured' }, { status: 503 });
    }

    const results: Record<string, Json> = {};
    if (summary) results.summary = summary;
    if (details) results.details = details as Json;
    if (insights) results.insights = insights as Json;

    let stored = false;

    // Primary store: Supabase (insert-only table, RLS requires consent = true)
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient<Database>(supabaseUrl, supabaseKey);
      const { error } = await supabase.from('loanknow_leads').insert({
        email,
        consent: true,
        consent_text: consentText || null,
        calculator_slug: calculatorSlug,
        calculator_name: calculatorName || null,
        cta_label: ctaLabel || null,
        inputs: (inputs as Json) || {},
        results,
        source_path: calculatorPath || null,
      });
      if (error) {
        console.error('LoanKnow lead insert error:', error);
      } else {
        stored = true;
      }
    }

    // Fallback store: forward the lead by email so no signup is ever lost
    if (!stored && resendKey) {
      const resend = new Resend(resendKey);
      const forwardTo = process.env.LOANKNOW_LEADS_EMAIL || 'leads@dett.io';
      const { error } = await resend.emails.send({
        from: 'Dett <noreply@dett.io>',
        to: [forwardTo],
        subject: `LoanKnow lead: ${calculatorName || calculatorSlug}`,
        text: [
          `Email: ${email}`,
          `Consent: yes${consentText ? ` ("${consentText}")` : ''}`,
          `Calculator: ${calculatorName || calculatorSlug} (${calculatorSlug})`,
          `CTA: ${ctaLabel || 'n/a'}`,
          `Saved calculation: ${buildCalculatorUrl(calculatorPath, inputs)}`,
          '',
          `Inputs: ${JSON.stringify(inputs || {}, null, 2)}`,
          `Results: ${JSON.stringify(results, null, 2)}`,
        ].join('\n'),
      });
      if (error) {
        console.error('LoanKnow lead forward error:', error);
      } else {
        stored = true;
      }
    }

    if (!stored) {
      return NextResponse.json(
        { error: 'Could not save your request. Please try again.' },
        { status: 500 }
      );
    }

    // Best-effort confirmation email with the user's saved calculation link
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const emailHtml = await render(
          LoanKnowLeadEmail({
            calculatorName: calculatorName || 'calculator',
            summary,
            calculatorUrl: buildCalculatorUrl(calculatorPath, inputs),
          })
        );
        await resend.emails.send({
          from: 'Dett <noreply@dett.io>',
          to: [email],
          subject: 'Your numbers are saved — LoanKnow launch notification',
          html: emailHtml,
        });
      } catch (confirmError) {
        // Lead is already stored; a failed confirmation should not fail the request
        console.error('LoanKnow confirmation email error:', confirmError);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('LoanKnow lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
