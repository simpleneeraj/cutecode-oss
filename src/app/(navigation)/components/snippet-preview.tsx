import { cn } from "@/utils/cn";

const CODE_LINES = [
  "w-11/20 bg-foreground/20",
  "w-4/5 bg-foreground/12",
  "w-2/5 bg-foreground/10",
  "w-7/10 bg-foreground/14",
  "w-1/3 bg-foreground/8",
];

export function SnippetPreview({ language }: { language?: string | null }) {
  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-xl border bg-card transition-colors in-[[data-slot=snippet-card]:hover]:border-ring/40"
      aria-hidden="true"
    >
      <div className="absolute inset-x-6 top-6 bottom-0 flex flex-col gap-3 rounded-t-lg border border-b-0 bg-background px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-foreground/16" />
          <span className="size-2 rounded-full bg-foreground/12" />
          <span className="size-2 rounded-full bg-foreground/8" />
          <span className="flex-1" />
          {language && <span className="font-mono text-xs lowercase text-muted-foreground">{language}</span>}
        </div>
        <div className="flex flex-col gap-2">
          {CODE_LINES.map((line) => (
            <div key={line} className={cn("h-1.5 rounded-full", line)} />
          ))}
        </div>
      </div>
    </div>
  );
}
