import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily AI Brief | Ian McDonald',
  description: 'Today\'s top AI news, tools, and takes — curated by Ian McDonald.',
};

export default function DailyBriefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
