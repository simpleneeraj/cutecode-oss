import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Download04Icon, SvgIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import usePngClipboardSupported from "../../util/usePngClipboardSupported";
import FileNameField from "./file-name-field";
import ScaleControl from "./scale-control";
import ShortcutIconButton from "./shortcut-icon-button";

type ImageSectionProps = {
  onDownloadPng: () => void;
  onCopyPng: () => void;
  onDownloadSvg: () => void;
};

export default function ImageSection({ onDownloadPng, onCopyPng, onDownloadSvg }: ImageSectionProps) {
  const isClipboardSupported = usePngClipboardSupported();

  return (
    <div className="flex flex-col gap-2">
      <ScaleControl />
      <FileNameField />
      <div className="flex gap-2">
        <Button className="flex-1" onClick={onDownloadPng}>
          <HugeiconsIcon icon={Download04Icon} aria-hidden="true" />
          Download
        </Button>
        {isClipboardSupported && (
          <ShortcutIconButton label="Copy image" icon={Copy01Icon} keys={["⌘", "C"]} onClick={onCopyPng} />
        )}
        <ShortcutIconButton label="Download SVG" icon={SvgIcon} keys={["⌘", "⇧", "S"]} onClick={onDownloadSvg} />
      </div>
    </div>
  );
}
