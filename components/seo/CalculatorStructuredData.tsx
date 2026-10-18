import { getCalculatorStructuredData } from '@/lib/seo/calculatorSeo';

/**
 * Server component: emits all JSON-LD for a calculator page —
 * WebApplication/SoftwareApplication, FAQPage, and BreadcrumbList.
 * Rendered once per page from the calculator's route layout.
 */
export function CalculatorStructuredData({ slug }: { slug: string }) {
  const schemas = getCalculatorStructuredData(slug);
  if (schemas.length === 0) return null;

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
