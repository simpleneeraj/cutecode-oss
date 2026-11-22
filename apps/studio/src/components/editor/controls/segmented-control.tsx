import type { Icon } from "@solar-icons/react/lib/types";
import { Toggle, ToggleGroup } from "@cutecode/ui/components/toggle-group";
import { segmentedControl } from "./dock-styles";

const styles = segmentedControl();

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: Icon;
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
  const handleValueChange = (values: string[]) => {
    const next = options.find((option) => option.value === values[0]);
    if (next) onValueChange(next.value);
  };

  return (
    <ToggleGroup aria-label={label} size="sm" value={[value]} onValueChange={handleValueChange} className={styles.group()}>
      {options.map((option) => (
        <Toggle key={option.value} value={option.value} title={option.title} className={styles.segment()}>
          {option.icon && <option.icon className={styles.glyph()} aria-hidden="true" />}
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
