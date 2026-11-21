import { useAtom } from "jotai";
import { VIDEO_LENGTH_OPTIONS, videoLengthMsAtom } from "@/store/editor/editor";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@cutecode/ui/components/select";
import { formatSeconds } from "./format-seconds";

const LENGTH_ITEMS = VIDEO_LENGTH_OPTIONS.map((ms) => ({ value: ms, label: formatSeconds(ms) }));

export default function DurationControl() {
  const [lengthMs, setLengthMs] = useAtom(videoLengthMsAtom);

  return (
    <Select items={LENGTH_ITEMS} value={lengthMs} onValueChange={(value) => value !== null && setLengthMs(value)}>
      <SelectTrigger aria-label="Video duration" className="min-w-0 flex-1">
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {LENGTH_ITEMS.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
