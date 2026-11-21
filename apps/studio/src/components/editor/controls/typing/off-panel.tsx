import { useSetAtom } from "jotai";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { TypingMode, typingModeAtom } from "@/store/editor/editor";

export default function OffPanel() {
  const setMode = useSetAtom(typingModeAtom);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        Your code shows up all at once. Replay types it out for you, one character at a time.
      </p>
      <Button
        size="sm"
        variant="secondary"
        className="self-start"
        onClick={() => setMode(TypingMode.Replay)}
        render={<motion.button whileTap={{ scale: 0.96 }} />}
      >
        <HugeiconsIcon icon={PlayIcon} aria-hidden="true" />
        Turn on Replay
      </Button>
    </div>
  );
}
