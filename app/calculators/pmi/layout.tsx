import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';

export const metadata = getCalculatorMetadata('pmi');

export default function PMILayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd('pmi');
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
