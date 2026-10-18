import { useAtomValue, useSetAtom } from "jotai";
import { CanvasSize, CANVAS_DIMENSIONS, canvasSizeAtom, videoDurationMsAtom } from "@/store/editor/editor";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import { cn } from "@/utils/cn";
import { MAX_VIDEO_MS } from "@/components/editor/lib/animation";
import { VideoFormat } from "./enums";
import type { Size, VideoFormatOption } from "./types";
import useFrameSize from "./use-frame-size";
import { formatSize } from "./format-size";
import { formatSeconds } from "./format-seconds";
import useTypingOverflowMs from "./use-typing-overflow-ms";

type VideoSummaryProps = {
  format: VideoFormatOption;
  isHd: boolean;
  clipCount: number;
  isOverLimit: boolean;
};

function getFixedSize(format: VideoFormatOption, canvasSize: CanvasSize): Size | null {
  if (format.value !== VideoFormat.Video || canvasSize === CanvasSize.Auto) return null;
  const { exportWidth, exportHeight } = CANVAS_DIMENSIONS[canvasSize];
  return { width: exportWidth, height: exportHeight };
}

export default function VideoSummary({ format, isHd, clipCount, isOverLimit }: VideoSummaryProps) {
  const canvasSize = useAtomValue(canvasSizeAtom);
  const durationMs = useAtomValue(videoDurationMsAtom);
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);
  const frameSize = useFrameSize();
  const fixedSize = getFixedSize(format, canvasSize);
  const resolution = fixedSize ? formatSize(fixedSize, 1) : formatSize(frameSize, isHd ? format.pixelRatio : 1);
  const isTypingLonger = useTypingOverflowMs() !== null;

  return (
    <p
      className="flex items-center gap-2 whitespace-nowrap px-1 text-muted-foreground text-xs tabular-nums"
      aria-live="polite"
    >
      <span className="min-w-0 truncate">
        {resolution}
        <span aria-hidden="true"> · </span>
        {`${format.fps} fps`}
        <span aria-hidden="true"> · </span>
        <span
          className={cn(isTypingLonger && "text-foreground", isOverLimit && "text-destructive")}
          title={isTypingLonger ? "Extended to fit typing" : undefined}
        >
          {formatSeconds(durationMs * clipCount)}
          {isOverLimit && ` of ${MAX_VIDEO_MS / 1000}s max`}
        </span>
      </span>
      {!isHd && (
        <button
          type="button"
          className="ml-auto shrink-0 whitespace-nowrap text-foreground underline-offset-4 hover:underline"
          onClick={() => setPlansOpen(true)}
        >
          HD with Premium
        </button>
      )}
    </p>
  );
}
