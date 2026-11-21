import { useAtom } from "jotai";
import { typingHoldMsAtom } from "@/store/editor/editor";
import SegmentedControl from "../segmented-control";

const HOLD_OPTIONS = [
  { label: "1s", value: "1000" },
  { label: "2s", value: "2000" },
  { label: "3s", value: "3000" },
] as const;

export default function HoldToggle() {
  const [holdMs, setHoldMs] = useAtom(typingHoldMsAtom);
  const selectedHold = HOLD_OPTIONS.find((option) => Number(option.value) === holdMs)?.value ?? HOLD_OPTIONS[1].value;

  return (
    <SegmentedControl
      label="Hold at end"
      options={HOLD_OPTIONS}
      value={selectedHold}
      onValueChange={(value) => setHoldMs(Number(value))}
    />
  );
}
