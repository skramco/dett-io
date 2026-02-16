import type { Metadata } from 'next';
import { guides } from '@/lib/guides/guideData';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find(g => g.slug === slug);
  if (!guide) return { title: 'Guide Not Found | Dett.io' };

  return {
    title: `${guide.title} | Dett.io`,
    description: guide.description,
    alternates: {
      canonical: `https://dett.io/guides/${slug}`,
    },
    openGraph: {
      title: `${guide.title} | Dett.io`,
      description: guide.description,
      url: `https://dett.io/guides/${slug}`,
      siteName: 'Dett.io',
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  return guides.map(g => ({ slug: g.slug }));
}

export default function GuideSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
