import { useSetAtom } from "jotai";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { KeyboardIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { TypingMode, typingModeAtom } from "@/store/editor/editor";

export default function OffPanel() {
  const setMode = useSetAtom(typingModeAtom);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        Code appears all at once. Turn on Replay to type it out character by character.
      </p>
      <Button
        size="sm"
        variant="secondary"
        className="self-start"
        onClick={() => setMode(TypingMode.Replay)}
        render={<motion.button whileTap={{ scale: 0.96 }} />}
      >
        <HugeiconsIcon icon={KeyboardIcon} aria-hidden="true" />
        Try Replay
      </Button>
    </div>
  );
}
