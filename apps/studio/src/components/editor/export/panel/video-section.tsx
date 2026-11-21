import { useState } from "react";
import { useAtomValue } from "jotai";
import { HugeiconsIcon } from "@hugeicons/react";
import { Video01Icon } from "@hugeicons/core-free-icons";
import { slidesAtom, videoDurationMsAtom } from "@/store/editor/editor";
import { MAX_VIDEO_MS } from "@/components/editor/lib/animation";
import { usePremiumAccess } from "@/hooks/use-premium-access";
import { AccessLevel } from "@/typings/enums";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { VideoFormat } from "./enums";
import type { VideoFormatOption } from "./types";
import FileNameField from "./file-name-field";
import FormatControl from "./format-control";
import DurationControl from "./duration-control";
import ReelToggle from "./reel-toggle";
import VideoSummary from "./video-summary";

type VideoSectionProps = {
  formats: readonly VideoFormatOption[];
  isExporting: boolean;
  onExportVideo: (format: VideoFormat, isReel: boolean) => void;
};

export default function VideoSection({ formats, isExporting, onExportVideo }: VideoSectionProps) {
  const [selectedValue, setSelectedValue] = useState(VideoFormat.Video);
  const [isReelSelected, setIsReelSelected] = useState(false);
  const slideCount = useAtomValue(slidesAtom).length;
  const { checkAccess } = usePremiumAccess();
  const isHd = checkAccess("hdVideo") === AccessLevel.ALLOWED;
  const format = formats.find((option) => option.value === selectedValue) ?? formats[0];
  const hasManySlides = slideCount > 1;
  const isReel = hasManySlides && isReelSelected;
  const durationMs = useAtomValue(videoDurationMsAtom);
  const isOverLimit = durationMs * (isReel ? slideCount : 1) > MAX_VIDEO_MS;

  if (!format) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <FormatControl formats={formats} value={format.value} onValueChange={setSelectedValue} />
        <DurationControl />
      </div>
      {hasManySlides && <ReelToggle isReel={isReel} onReelChange={setIsReelSelected} />}
      <FileNameField />
      <div className="flex flex-col gap-2">
        <Button disabled={isExporting || isOverLimit} onClick={() => onExportVideo(format.value, isReel)}>
          {isExporting ? <Spinner /> : <HugeiconsIcon icon={Video01Icon} aria-hidden="true" />}
          {isExporting ? "Exporting…" : `Export ${format.label}`}
        </Button>
        <VideoSummary format={format} isHd={isHd} clipCount={isReel ? slideCount : 1} isOverLimit={isOverLimit} />
      </div>
    </div>
  );
}
