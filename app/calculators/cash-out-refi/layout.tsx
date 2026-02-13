import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';

export const metadata = getCalculatorMetadata('cash-out-refi');

export default function CashOutRefiLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd('cash-out-refi');
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
