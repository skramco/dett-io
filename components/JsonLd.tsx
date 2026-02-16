export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization schema — used on homepage
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Dett.io',
        legalName: 'Skramco Holdings LLC',
        url: 'https://dett.io',
        logo: 'https://dett.io/logo.png',
        description:
          'Free mortgage calculators and educational guides. No ads, no lead capture, no signup required.',
        sameAs: [],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'legal@dett.io',
          contactType: 'customer service',
        },
      }}
    />
  );
}

// WebSite schema — used on homepage for sitelinks search box
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Dett.io',
        url: 'https://dett.io',
        description:
          'Free mortgage calculators and decision tools. Make smarter mortgage decisions with crystal-clear math.',
        publisher: {
          '@type': 'Organization',
          name: 'Skramco Holdings LLC',
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', 'h2', '[data-speakable]'],
        },
      }}
    />
  );
}

// WebApplication schema — used on each calculator page
export function CalculatorJsonLd({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name,
        description,
        url: `https://dett.io/calculators/${slug}`,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        provider: {
          '@type': 'Organization',
          name: 'Dett.io',
          url: 'https://dett.io',
        },
      }}
    />
  );
}

// Article schema — used on each guide page
export function ArticleJsonLd({
  title,
  description,
  slug,
  datePublished,
  readTime,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  readTime: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url: `https://dett.io/guides/${slug}`,
        datePublished,
        dateModified: datePublished,
        author: {
          '@type': 'Organization',
          name: 'Dett.io',
          url: 'https://dett.io',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Skramco Holdings LLC',
          url: 'https://dett.io',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://dett.io/guides/${slug}`,
        },
        wordCount: parseInt(readTime) * 250,
      }}
    />
  );
}

// DefinitionPage schema — for glossary/definition pages (AI citation optimized)
export function DefinitionJsonLd({
  term,
  definition,
  slug,
}: {
  term: string;
  definition: string;
  slug: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: term,
        description: definition,
        url: `https://dett.io/learn/${slug}`,
        inDefinedTermSet: {
          '@type': 'DefinedTermSet',
          name: 'Dett.io Mortgage Glossary',
          url: 'https://dett.io/learn',
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '[data-speakable]'],
        },
      }}
    />
  );
}

// FAQPage schema — for guides with Q&A style content
export function FAQJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      }}
    />
  );
}
