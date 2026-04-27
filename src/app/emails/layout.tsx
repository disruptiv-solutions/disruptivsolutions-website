import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emails | Admin',
  description: 'Email management',
};

export default function EmailsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
