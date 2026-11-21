import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@cutecode/ui/components/select";
import { VideoFormat } from "./enums";
import type { VideoFormatOption } from "./types";

type FormatControlProps = {
  formats: readonly VideoFormatOption[];
  value: VideoFormat;
  onValueChange: (value: VideoFormat) => void;
};

export default function FormatControl({ formats, value, onValueChange }: FormatControlProps) {
  return (
    <Select items={formats} value={value} onValueChange={(next) => next !== null && onValueChange(next)}>
      <SelectTrigger aria-label="Video format" className="min-w-0 flex-1">
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {formats.map((format) => (
          <SelectItem key={format.value} value={format.value}>
            {format.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}
