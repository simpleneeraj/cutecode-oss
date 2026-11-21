import { cn } from "@cutecode/ui/lib/cn";
import { Spinner } from "@cutecode/ui/components/spinner";
import PreviewFrame from "./preview-frame";

const WIDE_RATIO = 1.3;

type ExportPreviewProps = {
  frame: HTMLCanvasElement | null;
  aspectRatio: number;
};

export default function ExportPreview({ frame, aspectRatio }: ExportPreviewProps) {
  return (
    <div className="flex h-70 items-center justify-center rounded-xl bg-muted p-4">
      <div
        className={cn(
          "relative max-h-full max-w-full overflow-hidden rounded-lg bg-background after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-foreground/10 after:ring-inset",
          aspectRatio > WIDE_RATIO ? "w-full" : "h-full",
        )}
        style={{ aspectRatio }}
      >
        {frame && <PreviewFrame frame={frame} />}
        {!frame && (
          <div className="flex size-full items-center justify-center">
            <Spinner className="size-5 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
