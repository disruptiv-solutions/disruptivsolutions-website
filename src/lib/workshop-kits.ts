export type WorkshopKit = {
  slug: string;
  title: string;
  eyebrow: string;
  audience: string;
  description: string;
  eventContext: string;
  status: 'live' | 'draft' | 'unlisted';
};

export const WORKSHOP_KITS: WorkshopKit[] = [
  {
    slug: 'find-leads',
    title: 'Find leads with AI',
    eyebrow: 'Google Gemini + Google Sheets',
    audience: 'Small business owners looking for clients, referral partners, sponsors, or speaking gigs',
    description:
      'Follow a real Gemini demo, use eight practical steps and copyable prompts, and build a lead tracker that helps you follow up.',
    eventContext:
      'Created by Ian McDonald AI for the opportunity-finding workshop.',
    status: 'live',
  },
  {
    slug: 'supplier-readiness-builder',
    title: 'AI Supplier Readiness Builder',
    eyebrow: 'HMSDC MBE Leadership Academy',
    audience: 'Small business owners, suppliers, and growth-stage operators',
    description:
      'A guided kit for organizing business knowledge, scoring AI readiness, and generating prompts that draft your Capstone deliverables.',
    eventContext:
      'Created by Ian McDonald | Practical AI Workshops, a Disruptiv Solutions LLC brand, for HMSDC MBE Leadership Academy participants.',
    status: 'unlisted',
  },
];

export function getWorkshopKit(slug: string): WorkshopKit | undefined {
  return WORKSHOP_KITS.find((kit) => kit.slug === slug);
}
