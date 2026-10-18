import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';
import { calculatorLastModified } from '@/lib/seo/lastModified';

export const metadata = getCalculatorMetadata('dti');

export default function DTILayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd(
    'dti',
    calculatorLastModified('dti').toISOString().slice(0, 10)
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
