import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';

export const metadata = getCalculatorMetadata('extra-payment');

export default function ExtraPaymentLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd('extra-payment');
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
