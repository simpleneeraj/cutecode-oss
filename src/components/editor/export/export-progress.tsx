import { MotionConfig } from "motion/react";
import { Dialog, DialogPopup } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import UpgradeNote from "./panel/upgrade-note";
import ExportMeta from "./progress/export-meta";
import ExportPreview from "./progress/export-preview";
import ProgressStatus from "./progress/progress-status";
import useHeldValue from "./progress/use-held-value";
import useOutputSize from "./progress/use-output-size";

type ExportProgressProps = {
  label: string | null;
  slideLabel: string | null;
  progress: number;
  frame: HTMLCanvasElement | null;
  hasWatermark: boolean;
  onCancel: () => void;
};

export default function ExportProgress({ label, slideLabel, progress, frame, hasWatermark, onCancel }: ExportProgressProps) {
  const isOpen = label !== null;
  const heldLabel = useHeldValue(label, isOpen) ?? "";
  const heldSlideLabel = useHeldValue(slideLabel, isOpen);
  const heldFrame = useHeldValue(frame, isOpen);
  const heldProgress = useHeldValue(progress, isOpen);
  const { aspectRatio, resolution } = useOutputSize(heldFrame);
  const isFinishing = heldProgress >= 1;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isFinishing) onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} disablePointerDismissal>
      <DialogPopup showCloseButton={false} className="sm:max-w-105" backdropClassName="bg-background backdrop-blur-none">
        <MotionConfig reducedMotion="user">
          <div className="flex flex-col gap-4 p-4">
            <ExportPreview frame={heldFrame} aspectRatio={aspectRatio} />
            <ProgressStatus label={heldLabel} slideLabel={heldSlideLabel} progress={heldProgress} isOpen={isOpen} />
            {hasWatermark && <UpgradeNote />}
            <div className="flex items-center justify-between gap-3">
              <ExportMeta label={heldLabel} resolution={resolution} isReel={heldLabel.endsWith("reel")} />
              <Button variant="outline" size="sm" disabled={isFinishing} onClick={onCancel}>
                Cancel
                <Kbd>Esc</Kbd>
              </Button>
            </div>
          </div>
        </MotionConfig>
      </DialogPopup>
    </Dialog>
  );
}
