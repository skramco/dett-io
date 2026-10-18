import { getCalculatorMetadata } from '@/lib/seo/calculatorSeo';
import { CalculatorStructuredData } from '@/components/seo/CalculatorStructuredData';

export const metadata = getCalculatorMetadata('arm-vs-fixed');

export default function ArmVsFixedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorStructuredData slug="arm-vs-fixed" />
      {children}
    </>
  );
}
