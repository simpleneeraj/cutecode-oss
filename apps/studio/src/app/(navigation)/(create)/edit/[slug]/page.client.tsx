"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { currentElementIdAtom, currentSlideIdAtom, editorAtom, windowWidthAtom } from "@/store/editor/editor";
import { dispatchPublishSnippetAtom } from "@/components/editor/export/store";
import { Visibility } from "@/components/editor/export/types";
import { useShareLoad, type SharePreviewOutput } from "@/hooks/use-share";
import { toast } from "@/components/toast";
import { Spinner } from "@/components/ui/spinner";
import type { EditorState } from "@/typings/editor";
import Frame from "@/components/editor/Frame";
import Controls from "@/components/editor/controls";

type PublishedSnippet = SharePreviewOutput["snippet"];

function toEditorState({ presentation }: PublishedSnippet): EditorState {
  return {
    slides: presentation.slides as EditorState["slides"],
    elements: presentation.elements as EditorState["elements"],
    slideElements: presentation.slideElements,
  };
}

function toDialogVisibility(visibility: string) {
  return Object.values(Visibility).find((option) => option === visibility);
}

function useLoadSnippet() {
  const setEditor = useSetAtom(editorAtom);
  const setCurrentSlideId = useSetAtom(currentSlideIdAtom);
  const setCurrentElementId = useSetAtom(currentElementIdAtom);
  const setWindowWidth = useSetAtom(windowWidthAtom);
  const dispatchPublish = useSetAtom(dispatchPublishSnippetAtom);

  return (snippet: PublishedSnippet, visibility: string) => {
    const editorState = toEditorState(snippet);
    const dialogVisibility = toDialogVisibility(visibility);
    setEditor(editorState);
    setCurrentSlideId(Object.keys(editorState.slideElements)[0] ?? null);
    setCurrentElementId(snippet.elementId);
    setWindowWidth(snippet.presentation.width);
    dispatchPublish({
      title: snippet.title ?? "",
      description: snippet.description ?? "",
      tags: snippet.tags,
      ...(dialogVisibility && { visibility: dialogVisibility }),
    });
  };
}

export default function EditClient() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const loadSnippet = useLoadSnippet();
  const [isLoaded, setIsLoaded] = useState(false);

  const failEdit = () => {
    toast.error("Could not load snippet for editing");
    router.replace("/");
  };

  const startEdit = (data: SharePreviewOutput) => {
    if (!data.snippet) return failEdit();
    if (data.currentUserId !== data.snippet.userId) return router.replace(`/remix/${slug}`);
    loadSnippet(data.snippet, data.shareLink.visibility);
    setIsLoaded(true);
    toast.success("Snippet loaded for editing");
  };

  useShareLoad(slug, { onSuccess: startEdit, onError: failEdit });

  if (!isLoaded) {
    return (
      <div className="layout-fill flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">Preparing snippet for editing...</p>
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
