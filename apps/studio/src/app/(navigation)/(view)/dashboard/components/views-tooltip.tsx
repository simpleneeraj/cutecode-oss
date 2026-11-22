import type { TooltipContentProps } from "recharts";
import { formatDay } from "./format-day";
import { viewsStyles } from "./style";

const styles = viewsStyles();

export function ViewsTooltip({ active, payload, label }: TooltipContentProps) {
  const isHidden = !active || payload.length === 0;
  if (isHidden) {
    return null;
  }
  const views = Number(payload[0].value ?? 0);

  return (
    <div className={styles.tooltip()}>
      <span className={styles.tooltipDate()}>{formatDay(String(label))}</span>
      <span className={styles.tooltipValue()}>
        {views.toLocaleString("en-US")} {views === 1 ? "view" : "views"}
      </span>
    </div>
  );
}
