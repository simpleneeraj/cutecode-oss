import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Image01Icon, Video01Icon } from "@hugeicons/core-free-icons";
import SegmentedControl from "../../controls/segmented-control";
import PublishSnippet from "../publish-snippet";
import { ExportTab, VideoFormat } from "./enums";
import type { VideoFormatOption } from "./types";
import ImageSection from "./image-section";
import VideoSection from "./video-section";

const TAB_OPTIONS = [
  { value: ExportTab.Image, label: "Image", icon: Image01Icon },
  { value: ExportTab.Video, label: "Video", icon: Video01Icon },
] as const;

const fadeTransition = { duration: 0.16, ease: [0.4, 0, 0.2, 1] } as const;

type ExportPanelProps = {
  onDownloadPng: () => void;
  onCopyPng: () => void;
  onDownloadSvg: () => void;
  onExportVideo: (format: VideoFormat, isReel: boolean) => void;
  videoFormats: readonly VideoFormatOption[];
  isVideoAvailable: boolean;
  isExporting: boolean;
};

export default function ExportPanel({
  onDownloadPng,
  onCopyPng,
  onDownloadSvg,
  onExportVideo,
  videoFormats,
  isVideoAvailable,
  isExporting,
}: ExportPanelProps) {
  const [selectedTab, setSelectedTab] = useState(ExportTab.Image);
  const activeTab = isVideoAvailable ? selectedTab : ExportTab.Image;

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-2">
        {isVideoAvailable && (
          <SegmentedControl
            label="Export type"
            options={TAB_OPTIONS}
            value={activeTab}
            onValueChange={setSelectedTab}
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={fadeTransition}
          >
            {activeTab === ExportTab.Image && (
              <ImageSection onDownloadPng={onDownloadPng} onCopyPng={onCopyPng} onDownloadSvg={onDownloadSvg} />
            )}
            {activeTab === ExportTab.Video && (
              <VideoSection formats={videoFormats} isExporting={isExporting} onExportVideo={onExportVideo} />
            )}
          </motion.div>
        </AnimatePresence>
        <PublishSnippet />
      </div>
    </MotionConfig>
  );
}
