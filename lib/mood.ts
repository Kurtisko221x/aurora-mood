import { z } from "zod";

/** Lo-fi Girl live streams — long-running IDs, embeddable without an API key. */
export const TRACKS = {
  study: { id: "jfKfPfyJRdk", title: "lofi hip hop radio — beats to relax/study to" },
  synthwave: { id: "4xDzrJKXOOY", title: "synthwave radio — beats to chill/game to" },
  sleep: { id: "rUxyKA_-grg", title: "lofi hip hop radio — beats to sleep/chill to" },
  jazz: { id: "HuFYqnbVbzY", title: "jazz lofi radio — beats to chill/study to" },
} as const;

export type TrackKey = keyof typeof TRACKS;

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const MoodSchema = z.object({
  name: z.string().describe("A poetic 2-4 word name for this mood, e.g. 'Midnight Debug Glow'"),
  description: z.string().describe("One short, warm sentence reflecting the user's vibe back to them"),
  emoji: z.string().describe("A single emoji that captures the mood"),
  background: hex.describe("Very dark base color for the sky"),
  colors: z.array(hex).min(3).max(5).describe("3-5 vivid aurora colors that express the emotion"),
  energy: z.number().min(0).max(1).describe("0 = calm and slow, 1 = intense and fast"),
  track: z.enum(["study", "synthwave", "sleep", "jazz"]).describe("Which lo-fi stream fits best"),
});

export type Mood = z.infer<typeof MoodSchema>;

export const DEFAULT_MOOD: Mood = {
  name: "Quiet Neon Drift",
  description: "Tell me how you feel and I'll paint the sky for you.",
  emoji: "🌌",
  background: "#05040f",
  colors: ["#7f00ff", "#e100ff", "#00d4ff", "#3a0ca3"],
  energy: 0.35,
  track: "study",
};
