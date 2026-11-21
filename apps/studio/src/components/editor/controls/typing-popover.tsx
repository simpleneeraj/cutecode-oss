import { useAtomValue } from "jotai";
import { KeyboardIcon } from "@solar-icons/react/linear/keyboard";
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
      icon={KeyboardIcon}
      hasDot={isOn}
    >
      <TypingControl />
    </DockPopover>
  );
}
