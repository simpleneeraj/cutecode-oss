import { AnimatePresence, motion } from "motion/react";
import { Spinner } from "@cutecode/ui/components/spinner";

type ThemeLoadingPillProps = {
  isVisible: boolean;
};

export default function ThemeLoadingPill({ isVisible }: ThemeLoadingPillProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          data-ignore-in-export
          role="status"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="absolute top-3 right-3 z-50 flex items-center gap-1.5 rounded-full border bg-popover/90 px-2.5 py-1 text-popover-foreground text-xs shadow-sm"
        >
          <Spinner className="size-3" />
          Loading theme
        </motion.div>
      )}
    </AnimatePresence>
  );
}
