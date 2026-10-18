import { useAtom } from "jotai";
import { Cancel01Icon, KeyboardIcon, RecordIcon } from "@hugeicons/core-free-icons";
import { TypingMode, typingModeAtom } from "@/store/editor/editor";
import SegmentedControl from "../segmented-control";

const MODE_OPTIONS = [
  { label: "Off", value: TypingMode.Off, icon: Cancel01Icon },
  { label: "Replay", value: TypingMode.Replay, icon: KeyboardIcon },
  { label: "Record", value: TypingMode.Recorded, icon: RecordIcon },
];

export default function ModeSelect() {
  const [mode, setMode] = useAtom(typingModeAtom);

  return <SegmentedControl label="Typing mode" options={MODE_OPTIONS} value={mode} onValueChange={setMode} />;
}
