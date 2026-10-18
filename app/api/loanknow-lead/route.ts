import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import type { Database, Json } from '@/lib/supabase/types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer the service role key (server-only); fall back to the anon key,
  // which works because loanknow_leads has an insert-only RLS policy.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, { auth: { persistSession: false } });
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
      inputs,
      summary,
      details,
      sourcePath,
      ctaLabel,
    } = body;

    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (consent !== true) {
      return NextResponse.json(
        { error: 'Consent is required to save your numbers and contact you.' },
        { status: 400 }
      );
    }

    if (!calculatorSlug || typeof calculatorSlug !== 'string') {
      return NextResponse.json({ error: 'Missing calculator context.' }, { status: 400 });
    }

    const lead = {
      email: String(email).trim().toLowerCase(),
      consent: true,
      consent_text: typeof consentText === 'string' ? consentText.slice(0, 1000) : null,
      calculator_slug: calculatorSlug.slice(0, 100),
      calculator_name: typeof calculatorName === 'string' ? calculatorName.slice(0, 200) : null,
      inputs: (inputs && typeof inputs === 'object' ? inputs : {}) as Json,
      results: {
        summary: typeof summary === 'string' ? summary : '',
        details: details && typeof details === 'object' ? details : {},
      } as Json,
      source_path: typeof sourcePath === 'string' ? sourcePath.slice(0, 500) : null,
      cta_label: typeof ctaLabel === 'string' ? ctaLabel.slice(0, 200) : null,
    };

    const supabase = getSupabase();
    const resendKey = process.env.RESEND_API_KEY;

    if (!supabase && !resendKey) {
      return NextResponse.json({ error: 'Lead capture is not configured.' }, { status: 503 });
    }

    let persisted = false;

    if (supabase) {
      const { error } = await supabase.from('loanknow_leads').insert(lead);
      if (error) {
        console.error('Supabase lead insert error:', error);
      } else {
        persisted = true;
      }
    }

    // Internal notification (and fallback persistence channel if Supabase
    // is unavailable) — a copy of the lead goes to the leads inbox.
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const notifyTo = process.env.LOANKNOW_LEADS_EMAIL || 'leads@dett.io';
        const { error: sendError } = await resend.emails.send({
          from: 'Dett <noreply@dett.io>',
          to: [notifyTo],
          subject: `New LoanKnow lead: ${lead.email} (${lead.calculator_slug})`,
          text: [
            `Email: ${lead.email}`,
            `Calculator: ${lead.calculator_name || lead.calculator_slug} (${lead.calculator_slug})`,
            `Source: ${lead.source_path || 'unknown'}`,
            `CTA: ${lead.cta_label || 'n/a'}`,
            `Consent: yes — "${lead.consent_text || ''}"`,
            '',
            `Summary: ${typeof summary === 'string' ? summary : ''}`,
            '',
            `Inputs: ${JSON.stringify(inputs || {}, null, 2)}`,
            '',
            `Details: ${JSON.stringify(details || {}, null, 2)}`,
          ].join('\n'),
        });
        if (sendError) {
          console.error('Lead notification email error:', sendError);
        } else {
          persisted = true;
        }
      } catch (notifyError) {
        console.error('Lead notification email error:', notifyError);
      }
    }

    if (!persisted) {
      return NextResponse.json(
        { error: 'We couldn\u2019t save your request right now. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('LoanKnow lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
