import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';
import { calculatorLastModified } from '@/lib/seo/lastModified';

export const metadata = getCalculatorMetadata('recast-vs-refi');

export default function RecastVsRefiLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd(
    'recast-vs-refi',
    calculatorLastModified('recast-vs-refi').toISOString().slice(0, 10)
  );
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
