import type { Metadata, Viewport } from 'next';

type Props = { children: React.ReactNode };

export const metadata: Metadata = {
  title: 'LaunchBox platform updates | LaunchBox',
  description: 'Weekly digest of what shipped in LaunchBox — in plain language.',
};

export const viewport: Viewport = {
  themeColor: '#F7F2EC',
};

export default function LaunchboxWeeklyDateLayout({ children }: Props) {
  return children;
}
