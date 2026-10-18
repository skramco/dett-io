import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { EMBED_CALCULATOR_SLUGS } from '@/lib/embed/catalog';
import { sanitizeReferringDomain } from '@/lib/embed/options';
import type { Database } from '@/lib/supabase/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { slug?: unknown; domain?: unknown };
    const slug = typeof body.slug === 'string' ? body.slug : '';
    const domain = sanitizeReferringDomain(typeof body.domain === 'string' ? body.domain : '');

    if (!EMBED_CALCULATOR_SLUGS.includes(slug) || !domain) {
      return NextResponse.json({ ok: true });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ ok: true });
    }

    const supabase = createClient<Database>(url, key);
    const { error } = await supabase.from('embed_loads').insert({
      calculator_slug: slug,
      referring_domain: domain,
    });

    if (error) {
      console.error('[embed-analytics]', error.message);
    }
  } catch {
    // Swallow — embed widgets should never fail because analytics failed
  }

  return NextResponse.json({ ok: true });
}
