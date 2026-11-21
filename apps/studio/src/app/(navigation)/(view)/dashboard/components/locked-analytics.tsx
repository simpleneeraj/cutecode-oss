"use client";

import { useSetAtom } from "jotai";
import { Card } from "@cutecode/ui/components/card";
import { Button } from "@cutecode/ui/components/button";
import { CrownIcon } from "@solar-icons/react/linear/crown";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import { ViewsArea } from "./views-area";

const PLACEHOLDER_POINTS = Array.from({ length: 30 }, (_, index) => ({
  date: String(index),
  views: 24 + index + Math.round(8 * Math.sin(index / 2.5)),
}));

export function LockedAnalytics() {
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">Views</span>
        <span className="text-sm font-medium text-foreground">See how your snippets perform day by day</span>
        <span className="text-xs text-muted-foreground">Last 30 days</span>
      </div>
      <div className="relative h-56 w-full">
        <div aria-hidden="true" className="size-full opacity-40">
          <ViewsArea points={PLACEHOLDER_POINTS} isLocked />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Button onClick={() => setPlansOpen(true)}>
            <CrownIcon className="size-4" aria-hidden="true" />
            Upgrade to Premium
          </Button>
        </div>
      </div>
    </Card>
  );
}
