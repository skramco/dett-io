import { getCalculatorMetadata } from '@/lib/seo/calculatorSeo';
import { CalculatorStructuredData } from '@/components/seo/CalculatorStructuredData';

export const metadata = getCalculatorMetadata('points-buydown');

export default function PointsBuydownLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorStructuredData slug="points-buydown" />
      {children}
    </>
  );
}
