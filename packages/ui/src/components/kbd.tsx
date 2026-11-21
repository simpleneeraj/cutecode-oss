import type * as React from "react";

import { cn } from "../lib/cn";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5.5 min-w-5.5 select-none items-center justify-center gap-1 rounded-field bg-muted px-1.5 font-medium font-sans text-caption1 text-muted-foreground [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      data-slot="kbd"
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"kbd">) {
  return <kbd className={cn("inline-flex items-center gap-1", className)} data-slot="kbd-group" {...props} />;
}

export function Shortcut({ children, keys }: { children: React.ReactNode; keys: string[] }) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-density-footnote text-muted-foreground">{children}</div>
      <div className="flex items-end gap-1">
        {keys.map((key) => (
          <Kbd key={key}>{key}</Kbd>
        ))}
      </div>
    </div>
  );
}

export { Kbd, KbdGroup };
