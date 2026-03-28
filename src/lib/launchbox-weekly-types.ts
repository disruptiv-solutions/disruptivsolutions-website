export type LaunchboxWeeklyHighlight = {
  headline: string;
  blurb: string;
  commitUrl?: string;
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
