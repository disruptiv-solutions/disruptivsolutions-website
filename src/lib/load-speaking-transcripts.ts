import fs from "fs";
import path from "path";
import { speakingTranscriptMeta } from "@/content/speaking/transcripts";
import type { SpeakingVideoTranscript, TranscriptLine } from "@/content/speaking/transcripts";

const TRANSCRIPTS_DIR = path.join(
  process.cwd(),
  "src/content/speaking/transcripts"
);

const parseTranscriptTxt = (raw: string): TranscriptLine[] => {
  const lines: TranscriptLine[] = [];

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^(\d{1,2}:\d{2})\s+(.+)$/);
    if (match) {
      lines.push({ at: match[1], text: match[2] });
      continue;
    }

    lines.push({ text: trimmed });
  }

  return lines;
};

export const loadSpeakingTranscripts = (): SpeakingVideoTranscript[] =>
  speakingTranscriptMeta.map((meta) => {
    const filePath = path.join(TRANSCRIPTS_DIR, meta.transcriptFile);
    const raw = fs.readFileSync(filePath, "utf8");
    const lines = parseTranscriptTxt(raw);

    return {
      id: meta.id,
      filename: meta.transcriptFile,
      kicker: meta.kicker,
      title: meta.title,
      summary: meta.summary,
      videoSrc: meta.videoSrc,
      videoLabel: meta.videoLabel,
      attendee: meta.attendee,
      event: meta.event,
      lines,
    };
  });
