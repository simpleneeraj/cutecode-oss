import { tv } from "tailwind-variants";

export enum OrbitRing {
  Inner = "inner",
  Middle = "middle",
  Outer = "outer",
}

export const orbitRings = [OrbitRing.Inner, OrbitRing.Middle, OrbitRing.Outer];

export const ringRatios = {
  [OrbitRing.Inner]: 0.4,
  [OrbitRing.Middle]: 0.68,
  [OrbitRing.Outer]: 0.96,
};

export const orbitStyles = tv(
  {
    slots: {
      root: "relative grid aspect-square w-full place-items-center overflow-hidden",
      ring: "absolute top-1/2 left-1/2 -translate-1/2 rounded-full border border-orbit-line",
      item: "absolute -translate-1/2",
      center: "relative z-10",
    },
    variants: {
      ring: {
        [OrbitRing.Inner]: { ring: "size-2/5" },
        [OrbitRing.Middle]: { ring: "size-17/25" },
        [OrbitRing.Outer]: { ring: "size-24/25" },
      },
    },
  },
  { twMerge: false },
);
