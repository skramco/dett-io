import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';
import { calculatorLastModified } from '@/lib/seo/lastModified';

export const metadata = getCalculatorMetadata('extra-payment');

export default function ExtraPaymentLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd(
    'extra-payment',
    calculatorLastModified('extra-payment').toISOString().slice(0, 10)
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
