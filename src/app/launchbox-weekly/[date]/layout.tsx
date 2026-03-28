import type { Metadata } from 'next';

type Props = { children: React.ReactNode };

export const metadata: Metadata = {
  title: 'LaunchBox platform updates | Ian McDonald',
  description: 'Weekly digest of what shipped in LaunchBox — in plain language.',
};

export default function LaunchboxWeeklyDateLayout({ children }: Props) {
  return children;
}
