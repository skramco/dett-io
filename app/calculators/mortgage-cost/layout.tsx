import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';

export const metadata = getCalculatorMetadata('mortgage-cost');

export default function MortgageCostLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd('mortgage-cost');
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
