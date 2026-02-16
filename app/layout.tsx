import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeRegistry } from "@/components/ThemeRegistry";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/GoogleTagManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dett - Free Mortgage Calculators & Decision Tools",
    template: "%s",
  },
  description: "Make smarter mortgage decisions with crystal-clear calculators. No hidden fees. No email required. Just honest math to help you decide.",
  keywords: [
    'mortgage calculator',
    'mortgage payment calculator',
    'home affordability calculator',
    'refinance calculator',
    'free mortgage calculator',
    'how much house can I afford',
  ],
  metadataBase: new URL('https://dett.io'),
  alternates: {
    canonical: 'https://dett.io',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Dett',
    title: 'Dett - Free Mortgage Calculators & Decision Tools',
    description: 'Make smarter mortgage decisions with crystal-clear calculators. No hidden fees. No email required. Just honest math to help you decide.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dett - Free Mortgage Calculators & Decision Tools',
    description: 'Make smarter mortgage decisions with crystal-clear calculators. No hidden fees. No email required.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GoogleTagManagerNoScript />
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
