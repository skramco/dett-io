import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isEmbedCalculatorSlug } from '@/lib/embed/catalog';
import { referringDomainFrom } from '@/lib/embed/referrer';

export const runtime = 'nodejs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { slug?: unknown; referrer?: unknown }
      | null;

    const slug = typeof body?.slug === 'string' ? body.slug : '';
    if (!isEmbedCalculatorSlug(slug)) {
      return NextResponse.json({ error: 'Unknown calculator' }, { status: 400, headers: CORS_HEADERS });
    }

    const domain = referringDomainFrom(typeof body?.referrer === 'string' ? body.referrer : null);
    if (!domain || domain === 'dett.io' || domain === 'www.dett.io' || domain === 'localhost') {
      return NextResponse.json({ ok: true, stored: false }, { status: 200, headers: CORS_HEADERS });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ ok: true, stored: false }, { status: 200, headers: CORS_HEADERS });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.from('embed_hits').insert({
      calculator_slug: slug,
      referrer_domain: domain,
    });

    if (error) {
      console.error('embed-hit insert failed:', error.message);
      return NextResponse.json({ ok: true, stored: false }, { status: 200, headers: CORS_HEADERS });
    }

    return NextResponse.json({ ok: true, stored: true }, { status: 200, headers: CORS_HEADERS });
  } catch (error) {
    console.error('embed-hit error:', error);
    return NextResponse.json({ ok: true, stored: false }, { status: 200, headers: CORS_HEADERS });
  }
}
