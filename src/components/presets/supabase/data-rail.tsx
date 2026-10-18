import { cn } from "@/utils/cn";
import Packet, { type Flow } from "./packet";
import styles from "./supabase.module.css";

export type Rail = {
  id: string;
  position: number;
  isVertical: boolean;
  flows: Flow[];
};

type DataRailProps = {
  rail: Rail;
};

export default function DataRail({ rail }: DataRailProps) {
  const placement = rail.isVertical ? { left: `${rail.position}%` } : { top: `${rail.position}%` };

  return (
    <div className={cn(styles.rail, rail.isVertical && styles.railVertical)} style={placement}>
      {rail.flows.map((flow) => (
        <Packet key={flow.id} flow={flow} isVertical={rail.isVertical} />
      ))}
    </div>
  );
}
