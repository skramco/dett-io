import { getCalculatorMetadata } from '@/lib/seo/calculatorSeo';
import { CalculatorStructuredData } from '@/components/seo/CalculatorStructuredData';

export const metadata = getCalculatorMetadata('rent-vs-buy');

export default function RentVsBuyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorStructuredData slug="rent-vs-buy" />
      {children}
    </>
  );
}
