"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ViewsTooltip } from "./views-tooltip";
import { formatDay } from "./format-day";

type ViewsPoint = {
  date: string;
  views: number;
};

type ViewsAreaProps = {
  points: ViewsPoint[];
  isLocked: boolean;
};

const AXIS_TICK = { fill: "var(--color-muted-foreground)", fontSize: 11 };

export function ViewsArea({ points, isLocked }: ViewsAreaProps) {
  const color = isLocked ? "var(--color-muted-foreground)" : "var(--color-primary)";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
        <defs>
          <linearGradient id="views-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.24} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tick={AXIS_TICK}
          tickFormatter={formatDay}
          hide={isLocked}
        />
        <YAxis width={32} tickLine={false} axisLine={false} allowDecimals={false} tick={AXIS_TICK} hide={isLocked} />
        {!isLocked && <Tooltip content={ViewsTooltip} cursor={{ stroke: "var(--color-border)" }} />}
        <Area
          type="monotone"
          dataKey="views"
          stroke={color}
          strokeWidth={2}
          fill="url(#views-fill)"
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: "var(--color-card)", strokeWidth: 2 }}
          isAnimationActive={!isLocked}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
