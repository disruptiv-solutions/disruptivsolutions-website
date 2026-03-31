import type { LaunchboxWeeklyPublic } from '@/lib/launchbox-weekly-types';

/**
 * Strip internal / GitHub / technical fields before serving LaunchBox updates publicly.
 */
export const sanitizeLaunchboxWeeklyForPublic = (raw: unknown): LaunchboxWeeklyPublic | null => {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, unknown>;
  const highlightsRaw = Array.isArray(d.highlights) ? d.highlights : [];

  const highlights = highlightsRaw.map((h) => {
    const x = h as Record<string, unknown>;
    const whatItMeansForYou =
      typeof x.whatItMeansForYou === 'string' ? x.whatItMeansForYou.trim() : '';
    return {
      headline: typeof x.headline === 'string' ? x.headline : '',
      blurb: typeof x.blurb === 'string' ? x.blurb : '',
      ...(whatItMeansForYou ? { whatItMeansForYou } : {}),
    };
  });

  return {
    title: typeof d.title === 'string' ? d.title : '',
    weekLabel: typeof d.weekLabel === 'string' ? d.weekLabel : '',
    intro: typeof d.intro === 'string' ? d.intro : '',
    date: typeof d.date === 'string' ? d.date : '',
    displayDate: typeof d.displayDate === 'string' ? d.displayDate : '',
    highlights,
  };
};
