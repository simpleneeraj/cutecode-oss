"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

import { cn } from "../lib/cn";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return <RadioGroupPrimitive className={cn("flex flex-col gap-3", className)} data-slot="radio-group" {...props} />;
}

function Radio({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      className={cn(
        "hit-area relative inline-flex size-5.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-card outline-none inset-ring-2 inset-ring-input transition-colors focus-visible:shadow-focus aria-invalid:inset-ring-destructive-foreground data-checked:bg-brand data-checked:inset-ring-0 data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className,
      )}
      data-slot="radio"
      {...props}
    >
      <RadioPrimitive.Indicator
        className="absolute inset-0 flex items-center justify-center rounded-full before:size-2 before:rounded-full before:bg-on-fill data-unchecked:hidden"
        data-slot="radio-indicator"
      />
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, Radio, Radio as RadioGroupItem, RadioGroupPrimitive, RadioPrimitive };
