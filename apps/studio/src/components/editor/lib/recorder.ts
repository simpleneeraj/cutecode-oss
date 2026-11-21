import type { EncodeOptions } from "./animation";

type Recording = {
  recorder: MediaRecorder;
  track: MediaStreamTrack;
  chunks: Blob[];
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function startRecording(canvas: HTMLCanvasElement, fps: number, mimeType: string): Recording {
  const stream = canvas.captureStream(fps);
  const [track] = stream.getVideoTracks();
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];
  recorder.addEventListener("dataavailable", (event) => chunks.push(event.data));
  recorder.start();
  recorder.pause();
  return { recorder, track, chunks };
}

async function recordFrame({ recorder, track }: Recording, frameMs: number) {
  recorder.resume();
  const canRequestFrame = typeof CanvasCaptureMediaStreamTrack !== "undefined";
  if (canRequestFrame && track instanceof CanvasCaptureMediaStreamTrack) track.requestFrame();
  await wait(frameMs);
  recorder.pause();
}

function stopRecording({ recorder, track, chunks }: Recording, mimeType: string) {
  const stopped = new Promise<Blob>((resolve) => {
    recorder.addEventListener("stop", () => resolve(new Blob(chunks, { type: mimeType })), { once: true });
  });
  recorder.stop();
  track.stop();
  return stopped;
}

export async function encodeRecording(
  frames: AsyncGenerator<boolean>,
  canvas: HTMLCanvasElement,
  options: EncodeOptions,
  mimeType: string,
) {
  const frameMs = 1000 / options.fps;
  let recording: Recording | null = null;

  try {
    for await (const isFirst of frames) {
      if (isFirst) recording = startRecording(canvas, options.fps, mimeType);
      if (recording) await recordFrame(recording, frameMs);
    }
  } catch (error) {
    if (recording) await stopRecording(recording, mimeType);
    throw error;
  }

  if (!recording) throw new Error("Video recording produced no frames");
  return stopRecording(recording, mimeType);
}
