import { GIFEncoder, applyPalette, quantize } from "gifenc";
import {
  BufferTarget,
  CanvasSource,
  Mp4OutputFormat,
  Output,
  QUALITY_HIGH,
  WebMOutputFormat,
  canEncodeVideo,
  getFirstEncodableVideoCodec,
  type VideoCodec,
} from "mediabunny";
import { captureFrames, type ClipFrame, type EncodeOptions, type VideoClip, type VideoSize } from "./animation";
import { getContext } from "./layers";
import { encodeRecording } from "./recorder";
import { createExportStats, reportExportStats, type ExportStats } from "./timing";

export enum VideoContainer {
  Mp4 = "mp4",
  Webm = "webm",
}

export type VideoEncoderChoice =
  | { kind: "webcodecs"; codec: VideoCodec; container: VideoContainer }
  | { kind: "recorder"; mimeType: string; container: VideoContainer };

type GifPalette = ReturnType<typeof quantize>;

type PendingGifFrame = { index: Uint8Array; palette: GifPalette; width: number; height: number; delay: number };

const RECORDER_TYPES = [
  { mimeType: "video/mp4", container: VideoContainer.Mp4 },
  { mimeType: "video/webm", container: VideoContainer.Webm },
];

const readPixels = (canvas: HTMLCanvasElement) => getContext(canvas).getImageData(0, 0, canvas.width, canvas.height).data;

async function pickWebCodecs(size: VideoSize | null): Promise<VideoEncoderChoice | null> {
  if (typeof VideoEncoder === "undefined") return null;
  const options = size ?? undefined;
  if (await canEncodeVideo("avc", options)) return { kind: "webcodecs", codec: "avc", container: VideoContainer.Mp4 };
  const codec = await getFirstEncodableVideoCodec(["vp9", "vp8"], options);
  return codec ? { kind: "webcodecs", codec, container: VideoContainer.Webm } : null;
}

function pickRecorder(): VideoEncoderChoice | null {
  const canCapture = typeof HTMLCanvasElement !== "undefined" && "captureStream" in HTMLCanvasElement.prototype;
  if (!canCapture || typeof MediaRecorder === "undefined") return null;
  const type = RECORDER_TYPES.find(({ mimeType }) => MediaRecorder.isTypeSupported(mimeType));
  return type ? { kind: "recorder", ...type } : null;
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

async function startTrack(output: Output, canvas: HTMLCanvasElement, codec: VideoCodec, fps: number) {
  const source = new CanvasSource(canvas, { codec, quality: QUALITY_HIGH });
  output.addVideoTrack(source, { frameRate: fps });
  await output.start();
  return source;
}

async function encodeWebCodecs(clips: VideoClip[], options: EncodeOptions, codec: VideoCodec, container: VideoContainer) {
  const format = container === VideoContainer.Mp4 ? new Mp4OutputFormat() : new WebMOutputFormat();
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
    if (pending) await source?.add(pending.index / fps, pending.frames / fps);
    pending = null;
  };

  try {
    for await (const frame of captureFrames(clips, options, stats)) {
      const encodeStartedAt = performance.now();
      if (!source) Object.assign(canvas, outputSize(frame.canvas, options.size));
      source ??= await startTrack(output, canvas, codec, fps);
      if (!frame.isRepeat || (pending && pending.frames >= fps)) await addPending();
      if (!pending && !frame.isRepeat) drawContained(context, frame.canvas);
      pending ??= { index, frames: 0 };
      pending.frames += 1;
      index += 1;
      stats.encodeMs += performance.now() - encodeStartedAt;
    }
    await addPending();
  } catch (error) {
    if (output.state === "started") await output.cancel();
    throw error;
  }

  await output.finalize();
  if (!output.target.buffer) throw new Error("Video encoding produced no data");
  return finishExport(container, stats, startedAt, new Blob([output.target.buffer], { type: format.mimeType }));
}

export async function encodeVideo(clips: VideoClip[], options: EncodeOptions, choice: VideoEncoderChoice) {
  if (choice.kind === "webcodecs") return encodeWebCodecs(clips, options, choice.codec, choice.container);
  const canvas = Object.assign(document.createElement("canvas"), { width: 0, height: 0 });
  const stats = createExportStats();
  const startedAt = performance.now();
  const blob = await encodeRecording(drawnFrames(clips, options, stats, canvas), canvas, options, choice.mimeType);
  return finishExport(choice.container, stats, startedAt, blob);
}
