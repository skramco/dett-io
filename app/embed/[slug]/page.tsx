import { notFound } from 'next/navigation';
import { EmbedCalculatorWrapper } from '@/components/mui/EmbedCalculatorWrapper';

const CALCULATOR_SLUGS = [
  'mortgage-cost',
  'affordability',
  'down-payment',
  'rent-vs-buy',
  'refinance',
  'cash-out-refi',
  'recast-vs-refi',
  'points-buydown',
  'arm-vs-fixed',
  'timeline-simulator',
  'extra-payment',
  'acceleration',
  'biweekly',
  'interest-sensitivity',
  'amortization',
  'dti',
  'closing-costs',
  'pmi',
  'fha',
  'va',
];

export function generateStaticParams() {
  return CALCULATOR_SLUGS.map((slug) => ({ slug }));
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!CALCULATOR_SLUGS.includes(slug)) notFound();

  return <EmbedCalculatorWrapper slug={slug} />;
}
