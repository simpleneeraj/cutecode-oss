"use client";

import { motion } from "motion/react";
import { useFitScale } from "@/hooks/use-fit-scale";
import { SnippetFrame } from "../../(view)/preview/components/snippet-frame";

type EmbedFrameProps = {
  elementId: string;
  element: Record<string, unknown>;
  windowWidth: number;
};

export function EmbedFrame({ elementId, element, windowWidth }: EmbedFrameProps) {
  const { containerRef, contentRef, scale, height } = useFitScale(0);

  return (
    <div ref={containerRef} className="flex w-full justify-center overflow-hidden">
      <motion.div style={{ height }}>
        <motion.div ref={contentRef} className="w-max origin-top" style={{ scale }}>
          <SnippetFrame elementId={elementId} element={element} windowWidth={windowWidth} />
        </motion.div>
      </motion.div>
    </div>
  );
}
