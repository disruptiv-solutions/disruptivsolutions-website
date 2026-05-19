import { attendeeReactionMeta } from "./attendee-reaction.meta";

export type {
  SpeakingVideoTranscript,
  SpeakingVideoTranscriptMeta,
  TranscriptLine,
} from "./types";

/** Add a .meta.ts + matching .txt file, then import the meta here. */
export const speakingTranscriptMeta = [attendeeReactionMeta];
