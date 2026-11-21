import { tv } from "tailwind-variants";

import { motion } from "../../tokens/motion";

export const pageControlMotion = {
  dotWidth: { rest: 8, current: 22 },
  move: motion.springSnappy,
  instant: { duration: 0 },
};

export const pageControlStyles = tv(
  {
    slots: {
      root: "glass inline-flex h-6 items-center gap-2 rounded-control edge px-3 shadow-glass",
      dot: "h-2 rounded-full bg-foreground/24 transition-colors duration-fade data-current:bg-foreground/80",
    },
  },
  { twMerge: false },
);
