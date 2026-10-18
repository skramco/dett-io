import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dett.io',
  description: 'Privacy Policy for Dett.io — how we collect, use, and protect your information. Operated by Knowe LLC.',
  authors: [{ name: 'Knowe LLC', url: 'https://knowe.one' }],
  publisher: 'Knowe LLC',
  alternates: {
    canonical: 'https://dett.io/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Dett.io',
    description: 'Privacy Policy for Dett.io — how we collect, use, and protect your information. Operated by Knowe LLC.',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
