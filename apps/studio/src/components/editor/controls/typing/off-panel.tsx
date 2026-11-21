import { useSetAtom } from "jotai";
import { motion } from "motion/react";
import { PlayIcon } from "@solar-icons/react/linear/play";
import { Button } from "@cutecode/ui/components/button";
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
        <PlayIcon aria-hidden="true" />
        Turn on Replay
      </Button>
    </div>
  );
}
