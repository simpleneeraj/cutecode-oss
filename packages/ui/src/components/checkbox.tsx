"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "@solar-icons/react/linear/check";
import { MinusIcon } from "@solar-icons/react/linear/minus";

import { cn } from "../lib/cn";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "hit-area relative inline-flex size-4.5 shrink-0 cursor-pointer items-center justify-center rounded-sm bg-card outline-none inset-ring inset-ring-input transition-colors focus-visible:shadow-focus aria-invalid:inset-ring-destructive/36 focus-visible:aria-invalid:inset-ring-destructive/64 data-checked:bg-brand data-checked:inset-ring-0 data-indeterminate:bg-brand data-indeterminate:inset-ring-0 data-disabled:cursor-not-allowed data-disabled:opacity-64 sm:size-4",
        className,
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="absolute inset-0 flex items-center justify-center rounded-inherit text-on-fill data-unchecked:hidden"
        data-slot="checkbox-indicator"
        render={(props, state) => (
          <span {...props}>
            {state.indeterminate ? (
              <MinusIcon aria-hidden="true" className="size-3.5 sm:size-3" strokeWidth={3} />
            ) : (
              <CheckIcon aria-hidden="true" className="size-3.5 sm:size-3" strokeWidth={3} />
            )}
          </span>
        )}
      />
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, CheckboxPrimitive };
