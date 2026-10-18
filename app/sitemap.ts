import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides/guideData';
import { comparisons } from '@/lib/comparisons/comparisonData';
import { definitions } from '@/lib/definitions/definitionData';
import {
  calculatorLastUpdated,
  staticPageLastUpdated,
  guidesLastUpdated,
  comparisonsLastUpdated,
  definitionsLastUpdated,
} from '@/lib/seo/contentDates';

const BASE_URL = 'https://dett.io';

// lastmod must reflect real content changes (tracked in lib/seo/contentDates.ts),
// not the build timestamp — search engines discount sitemaps whose lastmod
// changes on every deploy.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(staticPageLastUpdated['/']),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/calculators`,
      lastModified: new Date(staticPageLastUpdated['/calculators']),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: new Date(staticPageLastUpdated['/guides']),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/learn`,
      lastModified: new Date(staticPageLastUpdated['/learn']),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/methodology`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(staticPageLastUpdated['/privacy']),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(staticPageLastUpdated['/terms']),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/embed`,
      lastModified: new Date(staticPageLastUpdated['/embed']),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const calculatorPages: MetadataRoute.Sitemap = Object.entries(calculatorLastUpdated).map(
    ([slug, lastUpdated]) => ({
      url: `${BASE_URL}/calculators/${slug}`,
      lastModified: new Date(lastUpdated),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  );

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guidesLastUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const comparePages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(staticPageLastUpdated['/compare']),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...comparisons.map((comp) => ({
      url: `${BASE_URL}/compare/${comp.slug}`,
      lastModified: new Date(comparisonsLastUpdated),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const definitionPages: MetadataRoute.Sitemap = definitions.map((def) => ({
    url: `${BASE_URL}/learn/${def.slug}`,
    lastModified: new Date(definitionsLastUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...calculatorPages, ...guidePages, ...comparePages, ...definitionPages];
}
