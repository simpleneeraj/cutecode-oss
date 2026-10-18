import { GIFEncoder, applyPalette, quantize } from "gifenc";
import {
  BufferTarget,
  CanvasSource,
  Mp4OutputFormat,
  Output,
  QUALITY_HIGH,
  canEncodeVideo,
} from "mediabunny";
import { captureFrames, type ClipFrame, type EncodeOptions, type VideoClip, type VideoSize } from "./animation";
import { isSafari } from "./image";
import { getContext } from "./layers";
import { encodeRecording } from "./recorder";
import { createExportStats, reportExportStats, withTimeout, type ExportStats } from "./timing";

export enum VideoEncoderChoice {
  WebCodecs = "webcodecs",
  Recorder = "recorder",
}

type GifPalette = ReturnType<typeof quantize>;

type PendingGifFrame = { index: Uint8Array; palette: GifPalette; width: number; height: number; delay: number };

const MP4_MIME_TYPE = "video/mp4";

const readPixels = (canvas: HTMLCanvasElement) => getContext(canvas).getImageData(0, 0, canvas.width, canvas.height).data;

async function pickWebCodecs(size: VideoSize | null) {
  if (isSafari || typeof VideoEncoder === "undefined") return null;
  return (await canEncodeVideo("avc", size ?? undefined)) ? VideoEncoderChoice.WebCodecs : null;
}

function pickRecorder() {
  const canCapture = typeof HTMLCanvasElement !== "undefined" && "captureStream" in HTMLCanvasElement.prototype;
  if (!canCapture || typeof MediaRecorder === "undefined") return null;
  return MediaRecorder.isTypeSupported(MP4_MIME_TYPE) ? VideoEncoderChoice.Recorder : null;
}

export async function pickVideoEncoder(size: VideoSize | null) {
  return (await pickWebCodecs(size)) ?? pickRecorder();
}

function createPaletteCache() {
  let source: HTMLCanvasElement | null = null;
  let palette: GifPalette = [];
  return (frame: ClipFrame, data: Uint8ClampedArray) => {
    if (!frame.palette) return quantize(data, 256);
    if (frame.palette !== source) palette = quantize(readPixels(frame.palette), 256);
    source = frame.palette;
    return palette;
  };
}

function writeGifFrame(gif: ReturnType<typeof GIFEncoder>, frame: PendingGifFrame) {
  gif.writeFrame(frame.index, frame.width, frame.height, { palette: frame.palette, delay: frame.delay });
}

async function finishExport<T>(label: string, stats: ExportStats, startedAt: number, result: T) {
  reportExportStats(label, stats, performance.now() - startedAt);
  return result;
}

export async function encodeGif(clips: VideoClip[], options: EncodeOptions) {
  const startedAt = performance.now();
  const stats = createExportStats();
  const gif = GIFEncoder();
  const delay = 1000 / options.fps;
  const paletteFor = createPaletteCache();
  let pending: PendingGifFrame | null = null;

  for await (const frame of captureFrames(clips, options, stats)) {
    const encodeStartedAt = performance.now();
    if (frame.isRepeat && pending) {
      pending.delay += delay;
    } else {
      if (pending) writeGifFrame(gif, pending);
      const { width, height } = frame.canvas;
      const data = readPixels(frame.canvas);
      const palette = paletteFor(frame, data);
      pending = { index: applyPalette(data, palette), palette, width, height, delay };
    }
    stats.encodeMs += performance.now() - encodeStartedAt;
  }

  if (pending) writeGifFrame(gif, pending);
  gif.finish();
  return finishExport("GIF", stats, startedAt, new Blob([gif.bytes()], { type: "image/gif" }));
}

const toEven = (size: number) => size + (size % 2);

function drawContained(context: CanvasRenderingContext2D, frame: HTMLCanvasElement) {
  const { width, height } = context.canvas;
  const scale = Math.min(width / frame.width, height / frame.height);
  const drawWidth = frame.width * scale;
  const drawHeight = frame.height * scale;
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);
  context.drawImage(frame, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function outputSize(frame: HTMLCanvasElement, size: VideoSize | null) {
  return size ?? { width: toEven(frame.width), height: toEven(frame.height) };
}

async function* drawnFrames(clips: VideoClip[], options: EncodeOptions, stats: ExportStats, canvas: HTMLCanvasElement) {
  const context = getContext(canvas);
  for await (const frame of captureFrames(clips, options, stats)) {
    const isFirst = canvas.width === 0;
    if (isFirst) Object.assign(canvas, outputSize(frame.canvas, options.size));
    if (isFirst || !frame.isRepeat) drawContained(context, frame.canvas);
    yield isFirst;
  }
}

type PendingSample = { index: number; frames: number };

const ENCODER_TIMEOUT_MS = 30_000;
const ENCODER_STALLED = "The video encoder stopped responding";

async function startTrack(output: Output, canvas: HTMLCanvasElement, fps: number) {
  const source = new CanvasSource(canvas, { codec: "avc", quality: QUALITY_HIGH });
  output.addVideoTrack(source, { frameRate: fps });
  await output.start();
  return source;
}

async function encodeWebCodecs(clips: VideoClip[], options: EncodeOptions) {
  const format = new Mp4OutputFormat();
  const output = new Output({ format, target: new BufferTarget() });
  const canvas = document.createElement("canvas");
  const context = getContext(canvas);
  const stats = createExportStats();
  const startedAt = performance.now();
  const { fps } = options;
  let source: CanvasSource | null = null;
  let pending: PendingSample | null = null;
  let index = 0;
  const addPending = async () => {
    if (pending && source) await withTimeout(source.add(pending.index / fps, pending.frames / fps), ENCODER_TIMEOUT_MS, ENCODER_STALLED);
    pending = null;
  };

  try {
    for await (const frame of captureFrames(clips, options, stats)) {
      const encodeStartedAt = performance.now();
      if (!source) Object.assign(canvas, outputSize(frame.canvas, options.size));
      source ??= await startTrack(output, canvas, fps);
      if (!frame.isRepeat || (pending && pending.frames >= fps)) await addPending();
      if (!pending && !frame.isRepeat) drawContained(context, frame.canvas);
      pending ??= { index, frames: 0 };
      pending.frames += 1;
      index += 1;
      stats.encodeMs += performance.now() - encodeStartedAt;
    }
    await addPending();
  } catch (error) {
    if (output.state === "started") output.cancel().catch(() => undefined);
    throw error;
  }

  await withTimeout(output.finalize(), ENCODER_TIMEOUT_MS, ENCODER_STALLED);
  if (!output.target.buffer) throw new Error("Video encoding produced no data");
  return finishExport("MP4", stats, startedAt, new Blob([output.target.buffer], { type: format.mimeType }));
}

export async function encodeVideo(clips: VideoClip[], options: EncodeOptions, choice: VideoEncoderChoice) {
  if (choice === VideoEncoderChoice.WebCodecs) return encodeWebCodecs(clips, options);
  const canvas = Object.assign(document.createElement("canvas"), { width: 0, height: 0 });
  const stats = createExportStats();
  const startedAt = performance.now();
  const blob = await encodeRecording(drawnFrames(clips, options, stats, canvas), canvas, options, MP4_MIME_TYPE);
  return finishExport("MP4", stats, startedAt, blob);
}
