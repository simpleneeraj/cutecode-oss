import type { TooltipContentProps } from "recharts";
import { dockPopup } from "@/components/editor/controls/dock-styles";
import { formatDay } from "./format-day";

export function ViewsTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || payload.length === 0) return null;
  const views = Number(payload[0].value ?? 0);

  return (
    <div className={dockPopup({ class: "flex flex-col gap-0.5 border px-2.5 py-1.5 text-xs" })}>
      <span className="text-muted-foreground">{formatDay(String(label))}</span>
      <span className="font-medium text-foreground tabular-nums">
        {views.toLocaleString("en-US")} {views === 1 ? "view" : "views"}
      </span>
    </div>
  );
}
