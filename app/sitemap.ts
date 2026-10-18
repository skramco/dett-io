import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides/guideData';
import { comparisons } from '@/lib/comparisons/comparisonData';
import { definitions } from '@/lib/definitions/definitionData';
import { calculatorSeoConfigs } from '@/lib/seo/calculatorSeo';
import { lastModified, calculatorLastModified } from '@/lib/seo/lastModified';

const BASE_URL = 'https://dett.io';

// lastModified dates are derived at build time from the git history of each
// route's source files (see lib/seo/lastModified.ts), so lastmod only changes
// when the underlying page content actually changes.

const GUIDE_CONTENT_PATHS = ['app/guides', 'lib/guides'];
const COMPARE_CONTENT_PATHS = ['app/compare', 'lib/comparisons', 'components/mui/ComparisonLayout.tsx'];
const LEARN_CONTENT_PATHS = ['app/learn', 'lib/definitions', 'components/mui/DefinitionPageContent.tsx'];

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorSlugs = Object.keys(calculatorSeoConfigs);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: lastModified(['app/page.tsx', 'app/layout.tsx']),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/calculators`,
      lastModified: lastModified(['app/calculators/page.tsx', 'app/calculators/layout.tsx']),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: lastModified(GUIDE_CONTENT_PATHS),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/learn`,
      lastModified: lastModified(LEARN_CONTENT_PATHS),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: lastModified(['app/privacy']),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: lastModified(['app/terms']),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const calculatorPages: MetadataRoute.Sitemap = calculatorSlugs.map((slug) => ({
    url: `${BASE_URL}/calculators/${slug}`,
    lastModified: calculatorLastModified(slug),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const guidesLastModified = lastModified(GUIDE_CONTENT_PATHS);
  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: guidesLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const compareLastModified = lastModified(COMPARE_CONTENT_PATHS);
  const comparePages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/compare`,
      lastModified: compareLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...comparisons.map((comp) => ({
      url: `${BASE_URL}/compare/${comp.slug}`,
      lastModified: compareLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const learnLastModified = lastModified(LEARN_CONTENT_PATHS);
  const definitionPages: MetadataRoute.Sitemap = definitions.map((def) => ({
    url: `${BASE_URL}/learn/${def.slug}`,
    lastModified: learnLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...calculatorPages, ...guidePages, ...comparePages, ...definitionPages];
}
