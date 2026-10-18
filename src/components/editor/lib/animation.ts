import { flushSync } from "react-dom";
import { prepareFonts } from "./image";
import { getContext } from "./layers";
import { prepareRenderer, settle, type CapturedFrame } from "./capture";
import { frameCountOf, nextFrame, timed, type ExportStats } from "./timing";

export const MAX_VIDEO_MS = 30_000;

export type VideoSize = { width: number; height: number };

export type MountedClip = { node: HTMLElement; isScene: boolean };

export type VideoClip = {
  durationMs: number;
  mount: () => Promise<MountedClip>;
};

export type EncodeOptions = {
  fps: number;
  pixelRatio: number;
  size: VideoSize | null;
  setTime: (time: number) => void;
  signal: AbortSignal;
  isWatermarked: boolean;
  onProgress: (progress: number, frame: HTMLCanvasElement | null) => void;
};

export type ClipFrame = CapturedFrame & { palette: HTMLCanvasElement | null };

export function throwIfAborted(signal: AbortSignal) {
  if (signal.aborted) throw signal.reason ?? new DOMException("Export canceled", "AbortError");
}

function drawTiledWatermark(canvas: HTMLCanvasElement, pixelRatio: number) {
  const context = getContext(canvas);
  const step = { x: 190 * pixelRatio, y: 96 * pixelRatio };
  const reach = Math.hypot(canvas.width, canvas.height);

  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(-Math.PI / 9);
  context.font = `600 ${13 * pixelRatio}px ui-sans-serif, system-ui, sans-serif`;
  context.textAlign = "center";
  context.lineWidth = 3 * pixelRatio;
  context.strokeStyle = "rgb(0 0 0 / 0.16)";
  context.fillStyle = "rgb(255 255 255 / 0.3)";

  for (let y = -reach / 2, row = 0; y < reach / 2; y += step.y, row += 1) {
    const shift = row % 2 === 0 ? 0 : step.x / 2;
    for (let x = -reach / 2 + shift; x < reach / 2; x += step.x) {
      context.strokeText("coolsnippets.fun", x, y);
      context.fillText("coolsnippets.fun", x, y);
    }
  }

  context.restore();
}

function assertWithinLimit(totalMs: number) {
  if (totalMs <= MAX_VIDEO_MS) return;
  const seconds = Math.ceil(totalMs / 1000);
  throw new Error(`Videos can be up to 30 seconds, but this one runs ${seconds}s. Try less code or fewer slides.`);
}

function fitPixelRatio(node: HTMLElement, size: VideoSize) {
  return Math.min(size.width / node.offsetWidth, size.height / node.offsetHeight);
}

function copyCanvas(source: HTMLCanvasElement) {
  const copy = document.createElement("canvas");
  copy.width = source.width;
  copy.height = source.height;
  getContext(copy).drawImage(source, 0, 0);
  return copy;
}

function createProgressReporter(onProgress: EncodeOptions["onProgress"]) {
  let hasPreview = false;
  return (progress: number, canvas: HTMLCanvasElement) => {
    onProgress(progress, hasPreview ? null : copyCanvas(canvas));
    hasPreview = true;
  };
}

async function showTime(setTime: (time: number) => void, timeMs: number, isScene: boolean) {
  flushSync(() => setTime(timeMs));
  if (isScene) await settle();
  else await nextFrame();
}

async function* captureClip(clip: MountedClip, durationMs: number, options: EncodeOptions, stats: ExportStats) {
  const { fps, size, signal, isWatermarked } = options;
  const pixelRatio = size ? fitPixelRatio(clip.node, size) : options.pixelRatio;
  const frameCount = frameCountOf(durationMs, fps);
  const frameTime = (index: number) => (index * durationMs) / frameCount;
  const scene = { ...clip, pixelRatio, setTime: options.setTime };
  const { renderer, palette } = await prepareRenderer(scene, frameTime(frameCount - 1));
  stats.modes.push(renderer.mode);
  if (palette && isWatermarked) drawTiledWatermark(palette, pixelRatio);

  for (let index = 0; index < frameCount; index += 1) {
    throwIfAborted(signal);
    const { result: frame, elapsedMs } = await timed(async () => {
      await showTime(options.setTime, frameTime(index), clip.isScene);
      return renderer.render();
    });
    const isRepeat = index > 0 && frame.isRepeat;
    if (isWatermarked && !isRepeat) drawTiledWatermark(frame.canvas, pixelRatio);
    stats.captureMs += elapsedMs;
    stats.frames += 1;
    if (isRepeat) stats.repeats += 1;
    yield { canvas: frame.canvas, isRepeat, palette };
  }
}

export async function* captureFrames(clips: VideoClip[], options: EncodeOptions, stats: ExportStats) {
  const totalMs = clips.reduce((sum, clip) => sum + clip.durationMs, 0);
  assertWithinLimit(totalMs);
  await prepareFonts();
  const reportProgress = createProgressReporter(options.onProgress);
  const totalFrames = clips.reduce((sum, clip) => sum + frameCountOf(clip.durationMs, options.fps), 0);
  let doneFrames = 0;

  for (const clip of clips) {
    throwIfAborted(options.signal);
    const mounted = await clip.mount();
    for await (const frame of captureClip(mounted, clip.durationMs, options, stats)) {
      doneFrames += 1;
      reportProgress(doneFrames / totalFrames, frame.canvas);
      yield frame;
    }
  }
}

export async function withFrozenScene<T>(setTime: (time: number | null) => void, task: () => Promise<T>) {
  setTime(0);
  await settle();
  try {
    return await task();
  } finally {
    setTime(null);
  }
}
