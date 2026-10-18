import { useAtomValue } from "jotai";
import { videoDurationMsAtom } from "@/store/editor/editor";
import { formatSeconds } from "../panel/format-seconds";

type ExportMetaProps = {
  label: string;
  resolution: string | null;
  isReel: boolean;
};

export default function ExportMeta({ label, resolution, isReel }: ExportMetaProps) {
  const durationMs = useAtomValue(videoDurationMsAtom);
  const [format] = label.split(" ");
  const duration = isReel ? "Reel" : formatSeconds(durationMs);
  const items = [format, resolution, duration].filter(Boolean);

  return <p className="truncate text-muted-foreground text-xs">{items.join(" · ")}</p>;
}
