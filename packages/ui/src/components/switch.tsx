"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "../lib/cn";

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "hit-area relative inline-flex h-5.5 w-9.5 shrink-0 cursor-pointer items-center rounded-full bg-muted p-px outline-none transition-colors duration-color ease-out focus-visible:shadow-focus data-checked:bg-brand data-disabled:cursor-not-allowed data-disabled:opacity-64 sm:h-4.5 sm:w-7.5 motion-reduce:transition-none",
        className,
      )}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block size-5 origin-left rounded-full bg-on-fill shadow-thumb transition-transform duration-snappy ease-snappy in-[[role=switch]:active]:not-data-disabled:scale-x-110 data-checked:origin-right data-checked:translate-x-4 motion-reduce:transition-none sm:size-4 sm:data-checked:translate-x-3"
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch, SwitchPrimitive };
