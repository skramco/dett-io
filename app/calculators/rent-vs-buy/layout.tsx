import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';
import { calculatorLastModified } from '@/lib/seo/lastModified';

export const metadata = getCalculatorMetadata('rent-vs-buy');

export default function RentVsBuyLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd(
    'rent-vs-buy',
    calculatorLastModified('rent-vs-buy').toISOString().slice(0, 10)
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
