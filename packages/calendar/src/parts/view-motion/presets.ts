import { motion as motionTokens } from "@cutecode/ui/tokens/motion";

export enum SwitchKind {
  Initial = "initial",
  Native = "native",
  Motion = "motion",
}

export const viewSwitchMotion = {
  full: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: motionTokens.springGentle,
  },
  reduced: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: motionTokens.fade,
  },
};

export const viewSwitchKeyframes = {
  rise: { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0px)"] },
  fadeOut: { opacity: [1, 0] },
};
