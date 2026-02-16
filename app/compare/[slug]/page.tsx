import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getComparison, getAllComparisonSlugs, comparisons } from '@/lib/comparisons/comparisonData';
import ComparisonLayout from '@/components/mui/ComparisonLayout';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getComparison(slug);
  if (!data) return {};

  return {
    title: `${data.title} | Dett.io`,
    description: data.description,
    keywords: data.keywords,
    alternates: {
      canonical: `https://dett.io/compare/${slug}`,
    },
    openGraph: {
      title: `${data.title} | Dett.io`,
      description: data.description,
      url: `https://dett.io/compare/${slug}`,
      siteName: 'Dett.io',
      type: 'article',
    },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getComparison(slug);

  if (!data) {
    notFound();
  }

  return <ComparisonLayout data={data} />;
}
