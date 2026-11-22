"use client";

import { useSetAtom } from "jotai";
import { Button } from "@cutecode/ui/components/button";
import { CardTitle } from "@cutecode/ui/components/card";
import { CrownIcon } from "@solar-icons/react/linear/crown";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import { ViewsArea } from "./views-area";
import { ViewsCard } from "./views-card";
import { dashboardStyles, viewsStyles } from "./style";

const placeholderPoints = Array.from({ length: 30 }, (_, index) => ({
  date: String(index),
  views: 24 + index + Math.round(8 * Math.sin(index / 2.5)),
}));

const styles = viewsStyles();
const layout = dashboardStyles();

export function LockedAnalytics() {
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);

  return (
    <ViewsCard summary={<CardTitle className={styles.prompt()}>See how your snippets perform day by day</CardTitle>}>
      <div aria-hidden="true" className={styles.placeholder()}>
        <ViewsArea points={placeholderPoints} isLocked />
      </div>
      <div className={styles.overlay()}>
        <Button className={layout.action()} onClick={() => setPlansOpen(true)}>
          <CrownIcon className={layout.icon()} aria-hidden="true" />
          Upgrade to Premium
        </Button>
      </div>
    </ViewsCard>
  );
}
