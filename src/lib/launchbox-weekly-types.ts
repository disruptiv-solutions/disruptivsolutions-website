/** Parsed from AI; commitUrl is ignored for storage and public API. */
export type LaunchboxWeeklyHighlight = {
  headline: string;
  blurb: string;
  commitUrl?: string;
};

/** Safe fields for /launchbox-weekly pages and public GET API. */
export type LaunchboxWeeklyHighlightPublic = {
  headline: string;
  blurb: string;
};

export type LaunchboxWeeklyPublic = {
  title: string;
  weekLabel: string;
  intro: string;
  date: string;
  displayDate: string;
  highlights: LaunchboxWeeklyHighlightPublic[];
};

export type LaunchboxWeeklyGenerated = {
  title: string;
  weekLabel: string;
  intro: string;
  highlights: LaunchboxWeeklyHighlight[];
  forBuilders?: string;
};

export type LaunchboxWeeklyDoc = LaunchboxWeeklyGenerated & {
  date: string;
  displayDate: string;
  compareUrl?: string;
  commitCount: number;
  repoFullName: string;
  generatedAt: string;
  windowSince: string;
};
