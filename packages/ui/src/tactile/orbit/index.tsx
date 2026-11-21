import type { Icon } from "@solar-icons/react/lib/types";
import type { ReactNode } from "react";

import { AppIcon } from "../app-icon";
import type { AppIconSize } from "../app-icon/style";
import type { Tone } from "../tone";
import { type OrbitRing, orbitRings, orbitStyles, ringRatios } from "./style";

type OrbitItem = {
  id: string;
  icon: Icon;
  ring: OrbitRing;
  angle: number;
  tone?: Tone;
  size?: AppIconSize;
};

type OrbitProps = {
  items: OrbitItem[];
  children?: ReactNode;
};

function placeOnRing(ring: OrbitRing, angle: number) {
  const radians = (angle * Math.PI) / 180;
  const radius = ringRatios[ring] * 50;
  return { left: `${50 + Math.cos(radians) * radius}%`, top: `${50 + Math.sin(radians) * radius}%` };
}

function Orbit({ items, children }: OrbitProps) {
  const styles = orbitStyles();

  return (
    <div className={styles.root()} data-slot="orbit">
      {orbitRings.map((ring) => (
        <span aria-hidden="true" className={orbitStyles({ ring }).ring()} key={ring} />
      ))}
      {items.map((item) => (
        <span aria-hidden="true" className={styles.item()} key={item.id} style={placeOnRing(item.ring, item.angle)}>
          <AppIcon icon={item.icon} size={item.size} tone={item.tone} />
        </span>
      ))}
      <div className={styles.center()}>{children}</div>
    </div>
  );
}

export { Orbit, type OrbitItem };
