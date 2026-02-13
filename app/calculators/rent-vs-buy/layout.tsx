import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';

export const metadata = getCalculatorMetadata('rent-vs-buy');

export default function RentVsBuyLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd('rent-vs-buy');
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
