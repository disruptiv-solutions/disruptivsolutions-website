import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter Archive | Ian McDonald',
  description: 'Past issues of Ian\'s newsletter — practical AI insights, what he\'s building, and lessons from the trenches.',
};

export default function NewsletterDirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
