import type { Metadata } from 'next';
import LeadFinderLesson from '@/components/workshop-kits/find-leads/LeadFinderLesson';

const title = 'Find leads with AI | Ian McDonald AI';
const description = 'Use Google Gemini to find opportunities, research who to contact, and build a lead tracker in Google Sheets. A real demo and eight steps with copyable prompts.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/learn/find-leads' },
  openGraph: {
    title,
    description,
    url: '/learn/find-leads',
    type: 'website',
    images: [{ url: '/workshop-kits/find-leads/lead-finder-walkthrough-v3.jpg', width: 1920, height: 1080, alt: 'Find leads with AI: a Gemini and Google Sheets workshop' }],
  },
};

export default function FindLeadsKitPage() {
  return <LeadFinderLesson />;
}
