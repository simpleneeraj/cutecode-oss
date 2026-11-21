const isDevelopment = process.env.NODE_ENV !== "production";

export type ExportStats = {
  frames: number;
  repeats: number;
  captureMs: number;
  encodeMs: number;
  modes: string[];
};

export function createExportStats(): ExportStats {
  return { frames: 0, repeats: 0, captureMs: 0, encodeMs: 0, modes: [] };
}

export const frameCountOf = (durationMs: number, fps: number) => Math.max(1, Math.round((durationMs / 1000) * fps));

const FRAME_FALLBACK_MS = 100;

export function nextFrame() {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, FRAME_FALLBACK_MS);
    requestAnimationFrame(() => {
      clearTimeout(timer);
      resolve();
    });
  });
}

export function withTimeout<T>(promise: Promise<T>, ms: number, message: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export async function timed<T>(task: () => Promise<T>) {
  const startedAt = performance.now();
  const result = await task();
  return { result, elapsedMs: performance.now() - startedAt };
}

export function reportExportStats(label: string, stats: ExportStats, totalMs: number) {
  if (!isDevelopment || stats.frames === 0) return;
  const perFrame = (ms: number) => (ms / stats.frames).toFixed(1);
  console.info(
    `[export] ${label}: ${stats.frames} frames (${stats.repeats} reused) in ${totalMs.toFixed(0)}ms,`,
    `capture ${perFrame(stats.captureMs)}ms/frame, encode ${perFrame(stats.encodeMs)}ms/frame,`,
    `modes ${stats.modes.join(", ")}`,
  );
}

export function logDev(...messages: unknown[]) {
  if (isDevelopment) console.info("[export]", ...messages);
}
