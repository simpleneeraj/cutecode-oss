import { useAtomValue } from "jotai";
import { MAX_VIDEO_MS } from "@/components/editor/lib/animation";
import { videoDurationMsAtom } from "@/store/editor/editor";
import { formatSeconds } from "./format-duration";

export default function DurationFooter() {
  const durationMs = useAtomValue(videoDurationMsAtom);
  const isOverCap = durationMs > MAX_VIDEO_MS;

  return (
    <div className="flex flex-col gap-0.5 border-t pt-2 text-xs text-muted-foreground">
      <span className="tabular-nums">{`≈ ${formatSeconds(durationMs)} video`}</span>
      {isOverCap && <span>{`Over the ${MAX_VIDEO_MS / 1000}s export limit. Try a faster speed or less code.`}</span>}
    </div>
  );
}
