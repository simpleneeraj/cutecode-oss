import { useAtomValue } from "jotai";
import { CANVAS_DIMENSIONS, CanvasSize, canvasSizeAtom } from "@/store/editor/editor";

const FALLBACK_RATIO = 16 / 9;

function getFrameSize(frame: HTMLCanvasElement | null, canvasSize: CanvasSize) {
  if (frame) return { width: frame.width, height: frame.height };
  if (canvasSize === CanvasSize.Auto) return null;
  const { exportWidth, exportHeight } = CANVAS_DIMENSIONS[canvasSize];
  return { width: exportWidth, height: exportHeight };
}

export default function useOutputSize(frame: HTMLCanvasElement | null) {
  const canvasSize = useAtomValue(canvasSizeAtom);
  const size = getFrameSize(frame, canvasSize);
  if (!size) return { aspectRatio: FALLBACK_RATIO, resolution: null };
  return { aspectRatio: size.width / size.height, resolution: `${size.width}×${size.height}` };
}
