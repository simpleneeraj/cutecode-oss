import { useAtomValue } from "jotai";
import { MAX_VIDEO_MS } from "@/components/editor/lib/animation";
import { videoDurationMsAtom } from "@/store/editor/editor";
import { formatSeconds } from "./format-duration";
import { panelText } from "../dock-styles";

export default function DurationFooter() {
  const durationMs = useAtomValue(videoDurationMsAtom);
  const isOverCap = durationMs > MAX_VIDEO_MS;

  return (
    <div className={panelText({ className: "flex flex-col gap-0.5 border-t border-border pt-2" })}>
      <span className="tabular-nums">{`≈ ${formatSeconds(durationMs)} video`}</span>
      {isOverCap && <span>{`Longer than the ${MAX_VIDEO_MS / 1000}s export limit. Pick a faster speed or trim the code.`}</span>}
    </div>
  );
}
