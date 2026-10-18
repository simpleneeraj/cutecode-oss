"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import View from "@/components/view";
import { useSharePreview } from "@/hooks/use-share";
import { PasscodeGate } from "../../(view)/preview/components/passcode-gate";
import { EmbedFrame } from "../components/embed-frame";
import { EmbedFooter } from "../components/embed-footer";
import { EmbedLoading } from "../components/embed-loading";
import { EmbedNotFound } from "../components/embed-not-found";

type Element = Record<string, unknown>;

type Presentation = {
  width?: number;
  elements?: Record<string, unknown>;
  slideElements?: Record<string, string[]>;
};

function isElement(value: unknown): value is Element {
  return typeof value === "object" && value !== null;
}

function readElements({ elements = {}, slideElements }: Presentation) {
  const elementIds = slideElements ? Object.values(slideElements).flat() : Object.keys(elements);
  return elementIds.flatMap((id) => {
    const element = elements[id];
    return isElement(element) ? [{ id, element }] : [];
  });
}

function readCode(element: Element | undefined) {
  if (typeof element?.content === "string") return element.content;
  return "";
}

export default function EmbedSnippetClient() {
  const { slug } = useParams<{ slug: string }>();
  const [passcode, setPasscode] = useState("");
  const [submittedPasscode, setSubmittedPasscode] = useState("");

  const { data, isLoading, error } = useSharePreview(slug, {
    passcode: submittedPasscode,
  });

  if (isLoading) return <EmbedLoading />;

  const trpcError = error as { data?: { code?: string } } | null;
  const requiresPasscode = trpcError?.data?.code === "FORBIDDEN";

  if (requiresPasscode) {
    return (
      <PasscodeGate
        passcode={passcode}
        invalidPasscode={!!submittedPasscode}
        onChange={setPasscode}
        onSubmit={() => setSubmittedPasscode(passcode)}
      />
    );
  }

  if (error || !data) return <EmbedNotFound />;

  const presentation: Presentation = data.snippet.presentation ?? {};
  const frames = readElements(presentation);

  return (
    <View className="layout-scroll justify-center-safe gap-3 p-4">
      {frames.map(({ id, element }) => (
        <EmbedFrame key={id} elementId={id} element={element} windowWidth={presentation.width ?? 800} />
      ))}
      <EmbedFooter slug={slug} code={readCode(frames[0]?.element)} />
    </View>
  );
}
