"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "@solar-icons/react/linear/check";
import { MinusIcon } from "@solar-icons/react/linear/minus";

import { cn } from "../lib/cn";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "hit-area relative inline-flex size-5.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-card outline-none inset-ring-2 inset-ring-input transition-colors focus-visible:shadow-focus aria-invalid:inset-ring-destructive-foreground data-checked:bg-brand data-checked:inset-ring-0 data-indeterminate:bg-brand data-indeterminate:inset-ring-0 data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className,
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="absolute inset-0 flex items-center justify-center rounded-full text-on-fill data-unchecked:hidden"
        data-slot="checkbox-indicator"
        render={(props, state) => (
          <span {...props}>
            {state.indeterminate ? (
              <MinusIcon className="size-3.5" strokeWidth={3} />
            ) : (
              <CheckIcon className="size-3.5" strokeWidth={3} />
            )}
          </span>
        )}
      />
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, CheckboxPrimitive };
