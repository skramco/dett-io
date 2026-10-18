import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';
import { calculatorLastModified } from '@/lib/seo/lastModified';

export const metadata = getCalculatorMetadata('cash-out-refi');

export default function CashOutRefiLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd(
    'cash-out-refi',
    calculatorLastModified('cash-out-refi').toISOString().slice(0, 10)
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
