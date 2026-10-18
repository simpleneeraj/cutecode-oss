import { useSetAtom } from "jotai";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { plansDialogOpenAtom } from "@/store/editor/plans";

export function LockedAnalytics() {
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);

  return (
    <Card className="flex flex-col items-center gap-4 px-6 py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon icon="solar:chart-2-bold-duotone" className="size-6" />
      </span>
      <div className="flex flex-col items-center gap-1">
        <Badge variant="outline" className="gap-1">
          <Icon icon="solar:crown-bold" className="size-3" />
          Premium
        </Badge>
        <h2 className="text-base font-semibold text-foreground">Per-snippet analytics</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          See views, upvotes and comments for every snippet and find out what performs best.
        </p>
      </div>
      <Button onClick={() => setPlansOpen(true)}>
        <Icon icon="solar:crown-linear" className="size-4" />
        Upgrade to Premium
      </Button>
    </Card>
  );
}
