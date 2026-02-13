import { getCalculatorMetadata, getCalculatorJsonLd } from '@/lib/seo/calculatorSeo';

export const metadata = getCalculatorMetadata('arm-vs-fixed');

export default function ArmVsFixedLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getCalculatorJsonLd('arm-vs-fixed');
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
