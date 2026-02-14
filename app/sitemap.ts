import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides/guideData';

const BASE_URL = 'https://dett.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorSlugs = [
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

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/calculators`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/learn`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const calculatorPages: MetadataRoute.Sitemap = calculatorSlugs.map((slug) => ({
    url: `${BASE_URL}/calculators/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...calculatorPages, ...guidePages];
}
