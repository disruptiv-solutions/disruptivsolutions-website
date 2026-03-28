import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter Issue | Ian McDonald',
  description: 'Past newsletter issue from Ian McDonald — practical AI insights and lessons from building.',
};

export default function NewsletterDateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
