import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { currentSlideIdAtom } from "@/store/editor/editor";
import { useEditorContext } from "@/store/editor/context/editor";
import type { Size } from "./types";

export default function useFrameSize() {
  const { frameRefs } = useEditorContext();
  const slideId = useAtomValue(currentSlideIdAtom);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const frame = slideId ? frameRefs.current.get(slideId) : null;
    if (!frame) return;
    const observer = new ResizeObserver(() => setSize({ width: frame.offsetWidth, height: frame.offsetHeight }));
    observer.observe(frame);
    return () => observer.disconnect();
  }, [frameRefs, slideId]);

  return size;
}
