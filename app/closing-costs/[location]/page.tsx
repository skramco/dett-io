import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locations, getLocationBySlug, getRelatedLocations } from '@/lib/locations/locationData';
import { getLocationClosingCostData } from '@/lib/locations/locationClosingCosts';
import { LocationPageContent } from '@/components/mui/LocationPageContent';
import { FAQJsonLd, JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://dett.io';

export function generateStaticParams() {
  return locations.map((l) => ({ location: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}): Promise<Metadata> {
  const { location: slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return { title: 'Location Not Found | Dett.io' };

  const data = getLocationClosingCostData(location);
  const inPlace = location.type === 'state' ? location.name : location.fullName;
  const title = `Closing Costs in ${location.name} (${location.stateCode}): ${new Date().getFullYear()} Buyer Estimates | Dett.io`;
  const description = `Buyer closing costs in ${inPlace} run about $${data.totalClosingCosts.toLocaleString()} (${data.closingCostPercent.toFixed(
    1
  )}%) on a median-priced home. See the full line-item breakdown, transfer tax, property tax prepaids, and cash needed to close.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/closing-costs/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/closing-costs/${slug}`,
      siteName: 'Dett.io',
      type: 'article',
    },
  };
}

export default async function LocationClosingCostsPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location: slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const data = getLocationClosingCostData(location);
  const related = getRelatedLocations(location);

  return (
    <>
      <FAQJsonLd questions={data.faqs} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `Closing Costs in ${location.fullName}`,
          description: `Estimated buyer closing costs in ${location.fullName}: about $${data.totalClosingCosts.toLocaleString()} (${data.closingCostPercent.toFixed(
            1
          )}% of a median-priced home), with a full line-item breakdown.`,
          url: `${BASE_URL}/closing-costs/${slug}`,
          dateModified: location.lastUpdated,
          author: { '@type': 'Organization', name: 'Dett.io', url: BASE_URL },
          publisher: { '@type': 'Organization', name: 'Skramco Holdings LLC', url: BASE_URL },
          mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/closing-costs/${slug}` },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Closing Costs by Location',
              item: `${BASE_URL}/closing-costs`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: location.fullName,
              item: `${BASE_URL}/closing-costs/${slug}`,
            },
          ],
        }}
      />
      <LocationPageContent location={location} data={data} related={related} />
    </>
  );
}
