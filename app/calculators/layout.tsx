import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Mortgage Calculators | Dett.io',
  description: 'Free mortgage calculators — affordability, monthly payments, refinance, DTI, PMI, closing costs, and more. No signup required.',
  alternates: {
    canonical: 'https://dett.io/calculators',
  },
};

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
