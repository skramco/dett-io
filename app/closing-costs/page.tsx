import type { Metadata } from 'next';
import { getStateLocations, getCountyLocations, type Location } from '@/lib/locations/locationData';
import { getLocationClosingCostData } from '@/lib/locations/locationClosingCosts';
import { LocationHubContent, type HubLocationSummary } from '@/components/mui/LocationHubContent';
import { JsonLd } from '@/components/JsonLd';

const BASE_URL = 'https://dett.io';

export const metadata: Metadata = {
  title: 'Closing Costs by State & County: Local Buyer Estimates | Dett.io',
  description:
    'How much are closing costs where you\u2019re buying? Compare estimated buyer closing costs, transfer taxes, and cash-to-close across states, counties, and major metros.',
  alternates: {
    canonical: `${BASE_URL}/closing-costs`,
  },
  openGraph: {
    title: 'Closing Costs by State & County | Dett.io',
    description:
      'Compare estimated buyer closing costs, transfer taxes, and cash-to-close across states, counties, and major metros.',
    url: `${BASE_URL}/closing-costs`,
    siteName: 'Dett.io',
    type: 'website',
  },
};

function toSummary(location: Location): HubLocationSummary {
  const data = getLocationClosingCostData(location);
  return {
    slug: location.slug,
    name: location.name,
    stateCode: location.stateCode,
    type: location.type,
    medianHomePrice: location.medianHomePrice,
    totalClosingCosts: data.totalClosingCosts,
    closingCostPercent: data.closingCostPercent,
  };
}

export default function ClosingCostsHubPage() {
  const states = getStateLocations().map(toSummary);
  const counties = getCountyLocations().map(toSummary);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Closing Costs by Location',
          description:
            'Estimated buyer closing costs, transfer taxes, and cash-to-close for states, counties, and major U.S. metros.',
          url: `${BASE_URL}/closing-costs`,
          hasPart: [...counties, ...states].map((loc) => ({
            '@type': 'Article',
            name: `Closing Costs in ${loc.name}`,
            url: `${BASE_URL}/closing-costs/${loc.slug}`,
          })),
        }}
      />
      <LocationHubContent states={states} counties={counties} />
    </>
  );
}
