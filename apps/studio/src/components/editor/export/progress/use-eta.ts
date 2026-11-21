import { useEffect, useRef, useState } from "react";
import { blendEstimate, estimateRemainingMs, type ProgressSample } from "./eta";

const TICK_MS = 500;
const WARMUP_MS = 1000;

export default function useEta(progress: number, isActive: boolean) {
  const firstRef = useRef<ProgressSample | null>(null);
  const latestRef = useRef<ProgressSample | null>(null);
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    if (!isActive || progress <= 0) return;
    const sample = { timeMs: performance.now(), progress };
    firstRef.current ??= sample;
    latestRef.current = sample;
  }, [progress, isActive]);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      const first = firstRef.current;
      const latest = latestRef.current;
      if (!first || !latest || latest.timeMs - first.timeMs < WARMUP_MS) return;
      const estimateMs = estimateRemainingMs(first, latest, performance.now());
      if (estimateMs !== null) setRemainingMs((previousMs) => blendEstimate(previousMs, estimateMs, TICK_MS));
    }, TICK_MS);
    return () => {
      clearInterval(interval);
      firstRef.current = null;
      latestRef.current = null;
      setRemainingMs(null);
    };
  }, [isActive]);

  return remainingMs;
}
