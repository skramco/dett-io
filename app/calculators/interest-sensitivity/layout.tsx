import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';

export const metadata = getCalculatorMetadata('interest-sensitivity');

export default function InterestSensitivityLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd('interest-sensitivity');
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
