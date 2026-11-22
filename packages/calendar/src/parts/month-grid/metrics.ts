export const monthMetrics = {
  dateHeight: 32,
  lineHeight: 26,
  bottomInset: 6,
  estimatedRowHeight: 120,
  dotLimit: 3,
};

export type FittedChips = {
  keys: string[];
  hiddenCount: number;
};

export function lineCapacity(rowHeight: number): number {
  const room = rowHeight - monthMetrics.dateHeight - monthMetrics.bottomInset;
  return Math.max(0, Math.floor(room / monthMetrics.lineHeight));
}

export function fitChips(keys: string[], hiddenCount: number, chipLines: number): FittedChips {
  const isFull = keys.length > 0 && keys.length >= chipLines;
  const needsMoreLine = hiddenCount > 0 && isFull;
  if (!needsMoreLine) {
    return { keys, hiddenCount };
  }
  return { keys: keys.slice(0, -1), hiddenCount: hiddenCount + 1 };
}
