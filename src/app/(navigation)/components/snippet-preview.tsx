import { cn } from "@/utils/cn";

const CODE_LINES = [
  "w-11/20 bg-foreground/20",
  "w-4/5 bg-foreground/12",
  "w-2/5 bg-foreground/10",
  "w-7/10 bg-foreground/14",
  "w-1/3 bg-foreground/8",
];

/**
 * Shared monochrome "mini editor" preview used by the snippets and profile grid
 * cards. Purely decorative — a calm window-chrome mock that reads consistently in
 * light and dark. `language` shows in the faux title bar when provided.
 */
export function SnippetPreview({ language, className }: { language?: string | null; className?: string }) {
  return (
    <div className={cn("relative h-36 w-full overflow-hidden bg-muted/40", className)} aria-hidden="true">
      <div className="absolute inset-x-4 top-4 bottom-0 flex flex-col rounded-t-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-1.5 border-b border-border/60 px-3 py-2">
          <span className="size-2 rounded-full bg-foreground/20" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/10" />
          <span className="flex-1" />
          {language && (
            <span className="font-mono text-[10px] lowercase tracking-tight text-muted-foreground">{language}</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 px-3 py-3">
          {CODE_LINES.map((line) => (
            <div key={line} className={cn("h-1.5 rounded-full", line)} />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-card/40 to-transparent" />
    </div>
  );
}
