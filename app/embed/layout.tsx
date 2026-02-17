import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dett.io Calculator Embed',
  robots: 'noindex, nofollow',
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
