import { GIFEncoder, applyPalette, quantize } from "gifenc";
import { BufferTarget, EncodedPacket, EncodedVideoPacketSource, Mp4OutputFormat, Output } from "mediabunny";
import { captureFrames, type ClipFrame, type EncodeOptions, type VideoClip, type VideoSize } from "./animation";
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
  if (typeof VideoEncoder === "undefined") return null;
  const config = await findAvcConfig(size ?? DEFAULT_PROBE_SIZE, DEFAULT_PROBE_FPS);
  return config ? VideoEncoderChoice.WebCodecs : null;
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

type AvcEncoder = {
  encode: (canvas: HTMLCanvasElement, sample: PendingSample) => Promise<void>;
  finish: () => Promise<void>;
  close: () => void;
};

const ENCODER_TIMEOUT_MS = 30_000;
const ENCODER_STALLED = "The video encoder stopped responding";
const AVC_CODECS = ["avc1.640034", "avc1.640033", "avc1.640028"];
const DEFAULT_PROBE_SIZE = { width: 1920, height: 1080 };
const DEFAULT_PROBE_FPS = 30;
const BITS_PER_PIXEL = 0.5;
const ENCODE_QUEUE_LIMIT = 4;
const QUEUE_POLL_MS = 10;
const QUEUE_STALL_MS = 1000;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function findAvcConfig({ width, height }: VideoSize, fps: number) {
  for (const codec of AVC_CODECS) {
    const config: VideoEncoderConfig = {
      codec,
      width,
      height,
      framerate: fps,
      bitrate: Math.round(width * height * fps * BITS_PER_PIXEL),
      latencyMode: "realtime",
      avc: { format: "avc" },
    };
    const { supported } = await VideoEncoder.isConfigSupported(config);
    if (supported) return config;
  }
  return null;
}

function createAvcEncoder(source: EncodedVideoPacketSource, config: VideoEncoderConfig, fps: number): AvcEncoder {
  let failure: Error | null = null;
  let muxing = Promise.resolve();
  let encodedCount = 0;
  const encoder = new VideoEncoder({
    output: (chunk, meta) => {
      muxing = muxing.then(() => source.add(EncodedPacket.fromEncodedChunk(chunk), meta));
    },
    error: (error) => {
      failure = error;
    },
  });
  encoder.configure(config);

  const throwIfFailed = () => {
    if (failure) throw new Error(`The video encoder failed: ${failure.message}`);
  };

  const drainQueue = async () => {
    const startedAt = performance.now();
    while (encoder.encodeQueueSize >= ENCODE_QUEUE_LIMIT) {
      throwIfFailed();
      if (performance.now() - startedAt > QUEUE_STALL_MS) {
        await withTimeout(encoder.flush(), ENCODER_TIMEOUT_MS, ENCODER_STALLED);
        return;
      }
      await wait(QUEUE_POLL_MS);
    }
  };

  const encode = async (canvas: HTMLCanvasElement, sample: PendingSample) => {
    throwIfFailed();
    const frame = new VideoFrame(canvas, {
      timestamp: Math.round((sample.index * 1e6) / fps),
      duration: Math.round((sample.frames * 1e6) / fps),
    });
    encoder.encode(frame, { keyFrame: encodedCount % fps === 0 });
    frame.close();
    encodedCount += 1;
    await drainQueue();
  };

  const finish = async () => {
    await withTimeout(encoder.flush(), ENCODER_TIMEOUT_MS, ENCODER_STALLED);
    await muxing;
    throwIfFailed();
  };

  const close = () => {
    if (encoder.state !== "closed") encoder.close();
  };

  return { encode, finish, close };
}

async function startTrack(output: Output, size: VideoSize, fps: number) {
  const config = await findAvcConfig(size, fps);
  if (!config) throw new Error(`This browser can't encode a ${size.width}×${size.height} MP4`);
  const source = new EncodedVideoPacketSource("avc");
  output.addVideoTrack(source, { frameRate: fps });
  await output.start();
  return createAvcEncoder(source, config, fps);
}

async function encodeWebCodecs(clips: VideoClip[], options: EncodeOptions) {
  const format = new Mp4OutputFormat();
  const output = new Output({ format, target: new BufferTarget() });
  const canvas = document.createElement("canvas");
  const context = getContext(canvas);
  const stats = createExportStats();
  const startedAt = performance.now();
  const { fps } = options;
  let encoder: AvcEncoder | null = null;
  let pending: PendingSample | null = null;
  let index = 0;
  const addPending = async () => {
    if (pending && encoder) await encoder.encode(canvas, pending);
    pending = null;
  };

  try {
    for await (const frame of captureFrames(clips, options, stats)) {
      const encodeStartedAt = performance.now();
      if (!encoder) Object.assign(canvas, outputSize(frame.canvas, options.size));
      encoder ??= await startTrack(output, canvas, fps);
      if (!frame.isRepeat || (pending && pending.frames >= fps)) await addPending();
      if (!pending && !frame.isRepeat) drawContained(context, frame.canvas);
      pending ??= { index, frames: 0 };
      pending.frames += 1;
      index += 1;
      stats.encodeMs += performance.now() - encodeStartedAt;
    }
    await addPending();
    await encoder?.finish();
  } catch (error) {
    encoder?.close();
    if (output.state === "started") output.cancel().catch(() => undefined);
    throw error;
  }

  encoder?.close();
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
