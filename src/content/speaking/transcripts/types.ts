export type TranscriptLine = {
  text: string;
  /** Optional timestamp like 0:11 */
  at?: string;
};

export type SpeakingVideoTranscript = {
  id: string;
  /** File name shown in the folder list */
  filename: string;
  kicker: string;
  title: string;
  summary: string;
  videoSrc: string;
  videoLabel: string;
  attendee?: string;
  event?: string;
  lines: TranscriptLine[];
};

export type SpeakingVideoTranscriptMeta = {
  id: string;
  /** Plain-text transcript in this folder (e.g. attendee-reaction.txt) */
  transcriptFile: string;
  kicker: string;
  title: string;
  summary: string;
  videoSrc: string;
  videoLabel: string;
  attendee?: string;
  event?: string;
};
