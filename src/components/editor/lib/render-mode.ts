import type { VideoSize } from "./animation";

export const RENDER_SIZE: VideoSize = { width: 3840, height: 2160 };
export const RENDER_LENGTH_MS = 10_000;

export function isRenderMode() {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("render") === "4k";
}
