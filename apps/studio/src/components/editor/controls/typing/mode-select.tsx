import { useAtom } from "jotai";
import { CodeIcon } from "@solar-icons/react/linear/code";
import { RecordCircleIcon } from "@solar-icons/react/linear/record-circle";
import { TextFieldFocusIcon } from "@solar-icons/react/linear/text-field-focus";
import { TypingMode, typingModeAtom } from "@/store/editor/editor";
import SegmentedControl from "../segmented-control";

const MODE_OPTIONS = [
  { label: "Off", value: TypingMode.Off, icon: CodeIcon },
  { label: "Replay", value: TypingMode.Replay, icon: TextFieldFocusIcon },
  { label: "Record", value: TypingMode.Recorded, icon: RecordCircleIcon },
];

export default function ModeSelect() {
  const [mode, setMode] = useAtom(typingModeAtom);

  return <SegmentedControl label="Typing mode" options={MODE_OPTIONS} value={mode} onValueChange={setMode} />;
}
