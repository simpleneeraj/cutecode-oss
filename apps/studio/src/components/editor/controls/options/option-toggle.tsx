import type { Icon } from "@solar-icons/react/lib/types";
import { MenuCheckboxItem } from "@cutecode/ui/components/menu";

type OptionToggleProps = {
  icon: Icon;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export default function OptionToggle({ icon: Glyph, label, checked, onCheckedChange }: OptionToggleProps) {
  return (
    <MenuCheckboxItem
      variant="switch"
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="min-h-8 rounded-md text-sm"
    >
      <span className="flex items-center gap-2 text-sm">
        <Glyph className="size-4 text-muted-foreground" aria-hidden="true" />
        {label}
      </span>
    </MenuCheckboxItem>
  );
}
