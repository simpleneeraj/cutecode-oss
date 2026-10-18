export type ProgressSample = { timeMs: number; progress: number };

const SMOOTHING = 0.3;

export function estimateRemainingMs(first: ProgressSample, latest: ProgressSample, nowMs: number) {
  const doneProgress = latest.progress - first.progress;
  if (doneProgress <= 0) return null;
  const msPerProgress = (latest.timeMs - first.timeMs) / doneProgress;
  return Math.max(0, (1 - latest.progress) * msPerProgress - (nowMs - latest.timeMs));
}

export function blendEstimate(previousMs: number | null, estimateMs: number, elapsedMs: number) {
  if (previousMs === null) return estimateMs;
  const projectedMs = Math.max(0, previousMs - elapsedMs);
  return projectedMs + (estimateMs - projectedMs) * SMOOTHING;
}
