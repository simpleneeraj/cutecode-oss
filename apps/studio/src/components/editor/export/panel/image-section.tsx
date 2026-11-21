import { CopyIcon } from "@solar-icons/react/linear/copy";
import { DownloadIcon } from "@solar-icons/react/linear/download";
import { FileCodeIcon } from "@solar-icons/react/linear/file-code";
import { Button } from "@cutecode/ui/components/button";
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
          <DownloadIcon aria-hidden="true" />
          Download
        </Button>
        {isClipboardSupported && (
          <ShortcutIconButton label="Copy image" icon={CopyIcon} keys={["⌘", "C"]} onClick={onCopyPng} />
        )}
        <ShortcutIconButton label="Download SVG" icon={FileCodeIcon} keys={["⌘", "⇧", "S"]} onClick={onDownloadSvg} />
      </div>
    </div>
  );
}
