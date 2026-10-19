import type { Metadata } from 'next';
import NewsletterSignup from '@/components/NewsletterSignup';

export const metadata: Metadata = { title: 'Notes from the workbench | Ian McDonald', description: 'Weekly builds, practical AI lessons, and notes from Ian McDonald’s workbench.' };

export default function NewsletterPage() {
  return <NewsletterSignup />;
}

