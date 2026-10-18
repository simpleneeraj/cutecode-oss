import { useAtomValue } from "jotai";
import { CursorTextIcon } from "@hugeicons/core-free-icons";
import { TypingMode, typingModeAtom } from "@/store/editor/editor";
import DockPopover from "./dock-popover";
import TypingControl from "./typing";

export default function TypingPopover() {
  const mode = useAtomValue(typingModeAtom);
  const isOn = mode !== TypingMode.Off;

  return (
    <DockPopover
      label="Typing animation"
      mobileLabel="Type"
      icon={CursorTextIcon}
      hasDot={isOn}
    >
      <TypingControl />
    </DockPopover>
  );
}
