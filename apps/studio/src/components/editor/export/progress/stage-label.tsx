import { AnimatePresence, motion } from "motion/react";

type StageLabelProps = {
  text: string;
};

export default function StageLabel({ text }: StageLabelProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={text}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="block truncate"
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}
