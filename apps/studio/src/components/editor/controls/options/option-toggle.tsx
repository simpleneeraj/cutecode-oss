import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { MenuCheckboxItem } from "@cutecode/ui/components/menu";

type OptionToggleProps = {
  icon: IconSvgElement;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export default function OptionToggle({ icon, label, checked, onCheckedChange }: OptionToggleProps) {
  return (
    <MenuCheckboxItem
      variant="switch"
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="min-h-8 rounded-md text-sm"
    >
      <span className="flex items-center gap-2 text-sm">
        <HugeiconsIcon icon={icon} className="size-4 text-muted-foreground" aria-hidden="true" />
        {label}
      </span>
    </MenuCheckboxItem>
  );
}
