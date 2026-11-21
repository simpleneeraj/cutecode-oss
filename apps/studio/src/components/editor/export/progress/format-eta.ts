export function formatEta(remainingMs: number | null, isFinishing: boolean) {
  if (isFinishing) return "Almost done";
  if (remainingMs === null) return "Estimating…";
  const seconds = Math.max(1, Math.ceil(remainingMs / 1000));
  if (seconds < 60) return `About ${seconds}s left`;
  return `About ${Math.ceil(seconds / 60)}m left`;
}
