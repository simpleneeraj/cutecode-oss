import { useAtomValue } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { TypingMode, typingModeAtom } from "@/store/editor/editor";
import DurationFooter from "./duration-footer";
import ModePanel from "./mode-panel";
import ModeSelect from "./mode-select";

const fade = { duration: 0.16, ease: "easeOut" } as const;

export default function TypingControl() {
  const mode = useAtomValue(typingModeAtom);

  return (
    <motion.section layout aria-labelledby="typing-title" className="flex w-64 flex-col gap-2 px-1">
      <motion.header layout="position" className="flex flex-col gap-0.5">
        <h2 id="typing-title" className="text-sm font-medium">
          Typing animation
        </h2>
        <p className="text-xs text-muted-foreground">Make your code type itself in GIF and video exports.</p>
      </motion.header>
      <motion.div layout="position">
        <ModeSelect />
      </motion.div>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={mode}
          layout="position"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={fade}
        >
          <ModePanel mode={mode} />
        </motion.div>
      </AnimatePresence>
      {mode !== TypingMode.Off && <DurationFooter />}
    </motion.section>
  );
}
