import { useAtom } from "jotai";
import { fileNameAtom } from "@/store/editor/editor";
import { Input } from "@cutecode/ui/components/input";

export default function FileNameField() {
  const [fileName, setFileName] = useAtom(fileNameAtom);

  return (
    <Input
      aria-label="File name"
      placeholder="File name"
      value={fileName}
      spellCheck={false}
      onChange={(event) => setFileName(event.target.value)}
    />
  );
}
