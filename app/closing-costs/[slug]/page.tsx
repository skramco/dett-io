import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getLocation,
  getAllLocationSlugs,
  getRelatedLocations,
  locationLabel,
} from '@/lib/locations/locationData';
import { buildLocationPageData } from '@/lib/locations/locationMath';
import { LocationPageContent } from '@/components/mui/LocationPageContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLocationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};

  const data = buildLocationPageData(location);
  const label = data.label;
  const title = `Closing Costs in ${label} (${data.year}): What Buyers Pay | Dett.io`;
  const description = `Closing costs in ${label} run 2-5% of the purchase price — about $${data.closingCostsLow.toLocaleString()} to $${data.closingCostsHigh.toLocaleString()} on a median-priced $${data.medianHomePrice.toLocaleString()} home. See the itemized breakdown, ${location.propertyTaxRate}% property tax, and the 2026 conforming loan limit of $${location.conformingLoanLimit.toLocaleString()}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://dett.io/closing-costs/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://dett.io/closing-costs/${slug}`,
      siteName: 'Dett.io',
      type: 'article',
    },
  };
}

export default async function StateClosingCostsPage({ params }: PageProps) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();

  const data = buildLocationPageData(location);
  const otherLocations = getRelatedLocations(location).map((l) => ({
    slug: l.slug,
    label: locationLabel(l),
  }));

  return <LocationPageContent data={data} otherLocations={otherLocations} />;
}
