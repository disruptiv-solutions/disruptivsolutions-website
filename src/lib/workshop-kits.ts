export type WorkshopKit = {
  slug: string;
  title: string;
  eyebrow: string;
  audience: string;
  description: string;
  eventContext: string;
  status: 'live' | 'draft';
};

export const WORKSHOP_KITS: WorkshopKit[] = [
  {
    slug: 'supplier-readiness-builder',
    title: 'AI Supplier Readiness Builder',
    eyebrow: 'HMSDC MBE Leadership Academy',
    audience: 'Small business owners, suppliers, and growth-stage operators',
    description:
      'A guided kit for organizing business knowledge, scoring AI readiness, and generating prompts that draft your Capstone deliverables.',
    eventContext:
      'Created by Ian McDonald | Practical AI Workshops, a Disruptiv Solutions LLC brand, for HMSDC MBE Leadership Academy participants.',
    status: 'live',
  },
];

export function getWorkshopKit(slug: string): WorkshopKit | undefined {
  return WORKSHOP_KITS.find((kit) => kit.slug === slug);
}
