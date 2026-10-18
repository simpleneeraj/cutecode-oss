import { useId } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Toggle, ToggleGroup } from "@/components/ui/toggle-group";

const pillSpring = { type: "spring", stiffness: 500, damping: 38 } as const;

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: IconSvgElement;
  title?: string;
};

type SegmentedControlProps<T extends string> = {
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
};

export default function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onValueChange,
}: SegmentedControlProps<T>) {
  const pillId = useId();

  const handleValueChange = (values: string[]) => {
    const next = options.find((option) => option.value === values[0]);
    if (next) onValueChange(next.value);
  };

  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={handleValueChange}
      className="isolate w-full rounded-lg bg-muted p-0.5"
    >
      {options.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          title={option.title}
          className="h-7 flex-1 gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted-foreground tabular-nums transition-colors before:rounded-md hover:bg-transparent hover:text-foreground data-pressed:bg-transparent data-pressed:text-foreground"
        >
          {option.value === value && (
            <motion.span
              layoutId={pillId}
              transition={pillSpring}
              className="absolute inset-0 -z-1 rounded-md bg-background shadow-sm dark:bg-input"
            />
          )}
          {option.icon && <HugeiconsIcon icon={option.icon} className="size-3.5" aria-hidden="true" />}
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
