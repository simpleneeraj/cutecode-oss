import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatEta } from "./format-eta";
import ProgressBar from "./progress-bar";
import StageLabel from "./stage-label";
import useEta from "./use-eta";

type ProgressStatusProps = {
  label: string;
  slideLabel: string | null;
  progress: number;
  isOpen: boolean;
};

function getStageText(slideLabel: string | null, isFinishing: boolean) {
  if (isFinishing) return "Encoding";
  if (slideLabel) return `Rendering frames · ${slideLabel}`;
  return "Rendering frames";
}

export default function ProgressStatus({ label, slideLabel, progress, isOpen }: ProgressStatusProps) {
  const isFinishing = progress >= 1;
  const remainingMs = useEta(progress, isOpen);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <DialogTitle className="font-medium text-sm">Exporting {label}</DialogTitle>
        <span className="font-medium text-sm tabular-nums">{Math.round(progress * 100)}%</span>
      </div>
      <ProgressBar progress={progress} />
      <div className="flex items-center justify-between gap-3 text-muted-foreground text-xs">
        <DialogDescription render={<div />} className="min-w-0 text-xs">
          <StageLabel text={getStageText(slideLabel, isFinishing)} />
        </DialogDescription>
        <span className="shrink-0 tabular-nums">{formatEta(remainingMs, isFinishing)}</span>
      </div>
    </div>
  );
}
