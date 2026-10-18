import type { Metadata } from 'next';
import { EmbedBuilder } from '@/components/embed/EmbedBuilder';

export const metadata: Metadata = {
  title: 'Embed Free Mortgage Calculators | Dett.io',
  description:
    'Embed Dett.io mortgage calculators on your website for free. No signup, no API key. Built for realtors, mortgage brokers, lenders, banks, credit unions, and financial bloggers.',
  alternates: {
    canonical: 'https://dett.io/embed',
  },
  openGraph: {
    title: 'Embed Free Mortgage Calculators | Dett.io',
    description:
      'Drop a live mortgage calculator on your site. Free, forever. No signup, no API key, always up to date.',
    url: 'https://dett.io/embed',
  },
};

export default async function EmbedPage({
  searchParams,
}: {
  searchParams: Promise<{ calc?: string }>;
}) {
  const { calc } = await searchParams;
  return <EmbedBuilder initialSlug={calc} />;
}
