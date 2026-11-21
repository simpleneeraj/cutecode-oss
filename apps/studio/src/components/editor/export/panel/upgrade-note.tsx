import { useSetAtom } from "jotai";
import { CrownIcon } from "@solar-icons/react/linear/crown";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import { Button } from "@cutecode/ui/components/button";

export default function UpgradeNote() {
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-warning/8 px-2.5 py-1.5 text-xs">
      <CrownIcon className="size-3.5 text-warning-foreground" aria-hidden="true" />
      <span className="text-muted-foreground">Watermarked · Go Pro to remove it</span>
      <Button variant="link" size="xs" className="ml-auto px-0 text-foreground" onClick={() => setPlansOpen(true)}>
        Upgrade
      </Button>
    </div>
  );
}
