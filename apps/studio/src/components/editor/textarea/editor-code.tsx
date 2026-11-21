import { useAtomValue } from "jotai";
import { sceneExportTimeAtom } from "@/components/presets/scene";
import { typingTimelineAtom } from "@/store/editor/editor";
import type { Language } from "../util/languages";
import HighlightedCode from "./highlighted-code";
import TypedCode from "./typed-code";

type EditorCodeProps = {
  code: string;
  language: Language | null;
  isEditing: boolean;
};

export default function EditorCode({ code, language, isEditing }: EditorCodeProps) {
  const timeline = useAtomValue(typingTimelineAtom);
  const exportTime = useAtomValue(sceneExportTimeAtom);
  const isTyping = timeline !== null && (!isEditing || exportTime !== null);

  if (!isTyping) return <HighlightedCode code={code} selectedLanguage={language} />;
  return <TypedCode timeline={timeline} language={language} />;
}
