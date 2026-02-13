import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';

export const metadata = getCalculatorMetadata('timeline-simulator');

export default function TimelineSimulatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd('timeline-simulator');
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
