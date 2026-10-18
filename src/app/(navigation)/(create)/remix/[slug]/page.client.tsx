"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { editorAtom } from "@/store/editor/editor/core";
import { currentSlideIdAtom, currentElementIdAtom } from "@/store/editor/editor/selection";
import { useShareLoad, type SharePreviewOutput } from "@/hooks/use-share";
import { nanoid } from "nanoid";
import { toast } from "@/components/toast";
import type { EditorState } from "@/typings/editor";
import Frame from "@/components/editor/Frame";
import Controls from "@/components/editor/controls";

type Presentation = SharePreviewOutput["snippet"]["presentation"];

function toRemixState(presentation: Presentation): EditorState {
  const oldElements = presentation.elements as EditorState["elements"];
  const oldToNewId: Record<string, string> = {};
  const elements: EditorState["elements"] = {};

  for (const [oldId, element] of Object.entries(oldElements)) {
    const newId = nanoid();
    oldToNewId[oldId] = newId;
    elements[newId] = { ...element, id: newId };
  }

  const slideElements: EditorState["slideElements"] = {};
  for (const [slideId, elementIds] of Object.entries(presentation.slideElements ?? {})) {
    slideElements[slideId] = elementIds.map((id) => oldToNewId[id] || id);
  }

  return { slides: presentation.slides as EditorState["slides"], elements, slideElements };
}

export default function RemixClient() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const setEditor = useSetAtom(editorAtom);
  const setCurrentSlideId = useSetAtom(currentSlideIdAtom);
  const setCurrentElementId = useSetAtom(currentElementIdAtom);
  const [hasRemixed, setHasRemixed] = useState(false);

  const failRemix = () => {
    toast.error("Could not load snippet for remixing");
    router.replace("/", { scroll: false });
  };

  const startRemix = (data: SharePreviewOutput) => {
    const presentation = data.snippet?.presentation;
    if (!presentation) return failRemix();
    if (!presentation.slides || !presentation.elements) return;

    const remixState = toRemixState(presentation);
    setEditor(remixState);

    const firstSlideId = Object.keys(remixState.slides)[0];
    if (firstSlideId) {
      setCurrentSlideId(firstSlideId);
      const firstElementId = remixState.slideElements[firstSlideId]?.[0];
      if (firstElementId) setCurrentElementId(firstElementId);
    }

    toast.success("Snippet loaded for remixing");
    setHasRemixed(true);
  };

  const { data, error } = useShareLoad(slug, { onSuccess: startRemix, onError: failRemix });
  const hasFailed = !!error || (!!data && !data.snippet?.presentation);

  if (!hasRemixed && !hasFailed) {
    return (
      <div className="h-full w-full layout-fill flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground text-sm font-medium">Preparing snippet for remix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-fill">
      <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <Frame />
      </div>
      <Controls />
    </div>
  );
}
