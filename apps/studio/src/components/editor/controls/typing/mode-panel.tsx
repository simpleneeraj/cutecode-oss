import { TypingMode } from "@/store/editor/editor";
import OffPanel from "./off-panel";
import RecordPanel from "./record-panel";
import ReplayPanel from "./replay-panel";

type ModePanelProps = {
  mode: TypingMode;
};

export default function ModePanel({ mode }: ModePanelProps) {
  switch (mode) {
    case TypingMode.Replay:
      return <ReplayPanel />;
    case TypingMode.Recorded:
      return <RecordPanel />;
    default:
      return <OffPanel />;
  }
}
