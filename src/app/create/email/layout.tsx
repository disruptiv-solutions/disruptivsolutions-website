import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create email | Admin',
  description: 'Compose a new email',
};

export default function CreateEmailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
