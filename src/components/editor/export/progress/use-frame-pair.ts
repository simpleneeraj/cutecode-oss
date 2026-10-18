import { useState } from "react";

type FramePair = {
  id: number;
  current: HTMLCanvasElement | null;
  previous: HTMLCanvasElement | null;
};

export default function useFramePair(frame: HTMLCanvasElement | null) {
  const [pair, setPair] = useState<FramePair>({ id: 0, current: frame, previous: null });
  if (frame !== pair.current) setPair({ id: pair.id + 1, current: frame, previous: pair.current });
  return pair;
}
