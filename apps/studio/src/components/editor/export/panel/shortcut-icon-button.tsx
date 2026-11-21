import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";

type ShortcutIconButtonProps = {
  label: string;
  icon: IconSvgElement;
  keys: readonly string[];
  onClick: () => void;
};

export default function ShortcutIconButton({ label, icon, keys, onClick }: ShortcutIconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon" aria-label={label} onClick={onClick} />}>
        <HugeiconsIcon icon={icon} aria-hidden="true" />
      </TooltipTrigger>
      <TooltipPopup className="flex items-center gap-2">
        {label}
        <KbdGroup>
          {keys.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
        </KbdGroup>
      </TooltipPopup>
    </Tooltip>
  );
}
