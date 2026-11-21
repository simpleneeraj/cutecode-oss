import { useAtom } from "jotai";
import { TypingSpeed } from "@/lib/typing-timeline";
import { typingSpeedAtom } from "@/store/editor/editor";
import SegmentedControl from "../segmented-control";

const SPEED_OPTIONS = [
  { label: "Slow", value: TypingSpeed.Slow },
  { label: "Normal", value: TypingSpeed.Normal },
  { label: "Fast", value: TypingSpeed.Fast },
];

export default function SpeedToggle() {
  const [speed, setSpeed] = useAtom(typingSpeedAtom);

  return <SegmentedControl label="Typing speed" options={SPEED_OPTIONS} value={speed} onValueChange={setSpeed} />;
}
