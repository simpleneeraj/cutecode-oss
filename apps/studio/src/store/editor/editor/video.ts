import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SCENE_LOOP_MS } from "@/components/presets/scene/loop";
import {
  createRecordedTimeline,
  createReplayTimeline,
  TypingSpeed,
  type TypingEvent,
  type TypingTimeline,
} from "@/lib/typing-timeline";
import { currentSlideIdAtom } from "./selection";
import { codeAtom } from "./ui";
import { StoreKey } from "./keys";

export type { TypingEvent };

export enum CanvasSize {
  Auto = "auto",
  Square = "square",
  Portrait = "portrait",
  Landscape = "landscape",
}

export enum TypingMode {
  Off = "off",
  Replay = "replay",
  Recorded = "recorded",
}

export type FixedCanvasSize = Exclude<CanvasSize, CanvasSize.Auto>;

export type CanvasDimensions = { width: number; height: number; exportWidth: number; exportHeight: number };

export const CANVAS_DIMENSIONS: Record<FixedCanvasSize, CanvasDimensions> = {
  [CanvasSize.Square]: { width: 540, height: 540, exportWidth: 1080, exportHeight: 1080 },
  [CanvasSize.Portrait]: { width: 360, height: 640, exportWidth: 1080, exportHeight: 1920 },
  [CanvasSize.Landscape]: { width: 960, height: 540, exportWidth: 1920, exportHeight: 1080 },
};

export const canvasSizeAtom = atomWithStorage<CanvasSize>(StoreKey.CANVAS_SIZE, CanvasSize.Auto);

export const typingModeAtom = atom<TypingMode>(TypingMode.Off);
export const typingSpeedAtom = atom<TypingSpeed>(TypingSpeed.Normal);
export const typingHoldMsAtom = atom(2000);
export const typingRecordingsAtom = atom<Record<string, TypingEvent[]>>({});
export const typingIsPausedAtom = atom(false);
export const typingReplayCountAtom = atom(0);

const currentRecordingAtom = atom((get) => {
  const slideId = get(currentSlideIdAtom);
  if (!slideId) return [];
  return get(typingRecordingsAtom)[slideId] ?? [];
});

export const typingTimelineAtom = atom<TypingTimeline | null>((get) => {
  const mode = get(typingModeAtom);
  const holdMs = get(typingHoldMsAtom);
  if (mode === TypingMode.Replay) return createReplayTimeline(get(codeAtom), get(typingSpeedAtom), holdMs);
  if (mode !== TypingMode.Recorded) return null;
  const events = get(currentRecordingAtom);
  if (events.length === 0) return null;
  return createRecordedTimeline(events, holdMs);
});

export const VIDEO_LENGTH_OPTIONS = [3000, 6000, 10000, 15000];

export const videoLengthMsAtom = atomWithStorage<number>(StoreKey.VIDEO_LENGTH, SCENE_LOOP_MS);

export const videoDurationMsAtom = atom((get) =>
  Math.max(get(typingTimelineAtom)?.durationMs ?? 0, get(videoLengthMsAtom)),
);

export const sceneTimeScaleAtom = atom((get) => {
  const duration = get(videoDurationMsAtom);
  const loops = Math.max(1, Math.round(duration / SCENE_LOOP_MS));
  return (loops * SCENE_LOOP_MS) / duration;
});
