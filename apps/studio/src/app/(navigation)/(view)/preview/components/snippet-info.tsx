import { Button } from "@cutecode/ui/components/button";
import { CheckIcon } from "@solar-icons/react/linear/check";
import { CopyIcon } from "@solar-icons/react/linear/copy";

type SnippetInfoProps = {
  language: string | null;
  viewCount: number;
  copied: boolean;
  onCopy: () => void;
};

const SnippetInfo = ({ language, viewCount, copied, onCopy }: SnippetInfoProps) => {
  return (
    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        {language && <span className="font-mono">{language}</span>}
        {language && <span aria-hidden="true">·</span>}
        <span className="tabular-nums">
          {viewCount.toLocaleString()} {viewCount === 1 ? "view" : "views"}
        </span>
      </span>
      <Button size="xs" variant="ghost" onClick={onCopy} aria-label={copied ? "Copied" : "Copy code"}>
        {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
};

export default SnippetInfo;
