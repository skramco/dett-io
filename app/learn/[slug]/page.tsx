import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { definitions, getDefinition } from '@/lib/definitions/definitionData';
import { DefinitionPageContent } from '@/components/mui/DefinitionPageContent';

export function generateStaticParams() {
  return definitions.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const def = getDefinition(slug);
  if (!def) return {};

  return {
    title: `${def.term} — What It Means & Why It Matters | Dett.io`,
    description: def.shortDefinition,
    alternates: {
      canonical: `https://dett.io/learn/${slug}`,
    },
    openGraph: {
      title: `${def.term} — Mortgage Term Explained`,
      description: def.shortDefinition,
      url: `https://dett.io/learn/${slug}`,
      siteName: 'Dett.io',
      type: 'article',
    },
  };
}

export default async function DefinitionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const def = getDefinition(slug);
  if (!def) notFound();

  return <DefinitionPageContent definition={def} />;
}
