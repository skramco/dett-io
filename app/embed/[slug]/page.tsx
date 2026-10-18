import { notFound } from 'next/navigation';
import { EmbedCalculatorWrapper } from '@/components/mui/EmbedCalculatorWrapper';
import { EMBED_CALCULATOR_SLUGS } from '@/lib/embed/catalog';

export function generateStaticParams() {
  return EMBED_CALCULATOR_SLUGS.map((slug) => ({ slug }));
}

export default async function EmbedWidgetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!EMBED_CALCULATOR_SLUGS.includes(slug)) notFound();

  return <EmbedCalculatorWrapper slug={slug} />;
}
