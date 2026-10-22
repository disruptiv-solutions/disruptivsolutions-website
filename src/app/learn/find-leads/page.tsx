import type { Metadata } from 'next';
import LeadFinderLesson from '@/components/workshop-kits/find-leads/LeadFinderLesson';

const title = 'Find leads with AI | Ian McDonald AI';
const description = 'Use Gemini to research leads, create and format a Google Sheets tracker, and draft outreach. Follow the workshop with copyable prompts, examples, and help from Ian McDonald.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/learn/find-leads' },
  openGraph: {
    title,
    description,
    url: '/learn/find-leads',
    type: 'website',
    images: [{ url: '/workshop-kits/find-leads/lead-finder-walkthrough-v4.jpg', width: 1920, height: 1080, alt: 'Find leads with AI: a Gemini and Google Sheets workshop' }],
  },
};

export default function FindLeadsKitPage() {
  return <LeadFinderLesson />;
}
