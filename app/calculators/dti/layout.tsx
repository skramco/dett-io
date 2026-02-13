import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';

export const metadata = getCalculatorMetadata('dti');

export default function DTILayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd('dti');
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
