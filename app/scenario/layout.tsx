import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Scenario | Dett.io',
  description:
    'Enter income, debts, home price, and rate once. Every Dett calculator pre-fills from your scenario. Saved on this device — no account required.',
  alternates: {
    canonical: 'https://dett.io/scenario',
  },
};

export default function ScenarioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
