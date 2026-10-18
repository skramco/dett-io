import { getCalculatorMetadata } from '@/lib/seo/calculatorSeo';
import { CalculatorStructuredData } from '@/components/seo/CalculatorStructuredData';

export const metadata = getCalculatorMetadata('recast-vs-refi');

export default function RecastVsRefiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorStructuredData slug="recast-vs-refi" />
      {children}
    </>
  );
}
