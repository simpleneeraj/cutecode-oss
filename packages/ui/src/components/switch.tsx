"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "../lib/cn";

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "hit-area relative inline-flex h-7.75 w-12.75 shrink-0 cursor-pointer items-center rounded-control bg-muted p-0.5 outline-none transition-colors duration-color ease-out focus-visible:shadow-focus data-checked:bg-brand data-disabled:cursor-not-allowed data-disabled:opacity-40 motion-reduce:transition-none",
        className,
      )}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block size-6.75 origin-left rounded-full bg-on-fill shadow-thumb transition-transform duration-snappy ease-snappy in-[[role=switch]:active]:not-data-disabled:scale-x-110 data-checked:origin-right data-checked:translate-x-5 motion-reduce:transition-none"
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, SwitchPrimitive };
