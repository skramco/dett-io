import { getCalculatorMetadata } from '@/lib/seo/calculatorSeo';
import { CalculatorStructuredData } from '@/components/seo/CalculatorStructuredData';

export const metadata = getCalculatorMetadata('mortgage-cost');

export default function MortgageCostLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorStructuredData slug="mortgage-cost" />
      {children}
    </>
  );
}
