import { motion } from "motion/react";
import { useLoop } from "../scene";
import { cn } from "@cutecode/ui/lib/cn";
import styles from "./claude.module.css";

export type Building = {
  id: string;
  x: number;
  width: number;
  height: number;
};

export type SkylineLayer = {
  id: string;
  className: string;
  height: number;
  buildings: Building[];
  lit: boolean;
};

type Light = {
  id: string;
  x: number;
  y: number;
  twinkle: boolean;
  phase: number;
};

type WindowLightProps = {
  light: Light;
};

type PixelSkylineProps = {
  layer: SkylineLayer;
};

const WIDTH = 80;

function buildingLights(building: Building, height: number, offset: number) {
  const top = height - building.height;
  const lights: Light[] = [];
  for (let y = top + 2; y < height - 2; y += 3) {
    for (let x = building.x + 1; x < building.x + building.width - 1; x += 2) {
      const seed = (x * 7 + y * 13 + offset) % 5;
      if (seed === 0) continue;
      lights.push({ id: `${building.id}-${x}-${y}`, x, y, twinkle: seed === 1, phase: ((seed + x) % 10) / 10 });
    }
  }
  return lights;
}

function svgProps(height: number) {
  return {
    viewBox: `0 0 ${WIDTH} ${height}`,
    preserveAspectRatio: "xMidYMax slice",
    shapeRendering: "crispEdges",
  };
}

function WindowLight({ light }: WindowLightProps) {
  const opacity = useLoop([1, 0.2, 1], { phase: light.phase, cycles: 2 });
  if (!light.twinkle) return <rect x={light.x} y={light.y} width={1} height={1} fill="currentColor" />;
  return <motion.rect x={light.x} y={light.y} width={1} height={1} fill="currentColor" style={{ opacity }} />;
}

export default function PixelSkyline({ layer }: PixelSkylineProps) {
  const lights = layer.lit
    ? layer.buildings.flatMap((building, index) => buildingLights(building, layer.height, index))
    : [];

  return (
    <>
      <svg className={cn(styles.skyline, layer.className)} {...svgProps(layer.height)}>
        {layer.buildings.map((building) => (
          <rect
            key={building.id}
            x={building.x}
            y={layer.height - building.height}
            width={building.width}
            height={building.height}
            fill="currentColor"
          />
        ))}
      </svg>
      <svg className={cn(styles.skyline, layer.className, styles.windows)} {...svgProps(layer.height)}>
        {lights.map((light) => (
          <WindowLight key={light.id} light={light} />
        ))}
      </svg>
    </>
  );
}
