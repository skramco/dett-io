import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';

export const metadata = getCalculatorMetadata('recast-vs-refi');

export default function RecastVsRefiLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd('recast-vs-refi');
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
