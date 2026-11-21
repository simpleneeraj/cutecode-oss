import type { Size } from "./types";

export function formatSize({ width, height }: Size, scale: number) {
  return `${Math.round(width * scale)} × ${Math.round(height * scale)}`;
}
