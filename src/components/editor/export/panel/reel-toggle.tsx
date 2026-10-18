import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type ReelToggleProps = {
  isReel: boolean;
  onReelChange: (isReel: boolean) => void;
};

export default function ReelToggle({ isReel, onReelChange }: ReelToggleProps) {
  const switchId = useId();

  return (
    <div className="flex items-center justify-between gap-2 px-1">
      <Label htmlFor={switchId} className="font-normal text-xs">
        All slides
      </Label>
      <Switch id={switchId} checked={isReel} onCheckedChange={onReelChange} />
    </div>
  );
}
