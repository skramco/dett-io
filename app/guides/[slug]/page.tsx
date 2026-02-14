'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { GuideLayout } from '@/components/mui/GuideLayout';
import { getGuideBySlug } from '@/lib/guides/guideData';
import { guideContent } from '@/lib/guides/guideContent';

export default function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const Content = guideContent[slug];
  if (!Content) notFound();

  return (
    <GuideLayout guide={guide}>
      <Content />
    </GuideLayout>
  );
}
