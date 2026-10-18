import React, { PropsWithChildren, useLayoutEffect, useRef } from "react";
import { motion, useMotionValue } from "motion/react";
import styles from "@/styles/editor/Frame.module.css";
import { cn } from "@/utils/cn";
import { CANVAS_DIMENSIONS, type FixedCanvasSize } from "@/store/editor/editor";

type CanvasViewportProps = PropsWithChildren<{
  size: FixedCanvasSize;
}>;

export default function CanvasViewport({ size, children }: CanvasViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scale = useMotionValue(1);
  const { width, height } = CANVAS_DIMENSIONS[size];

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(([entry]) => scale.set(entry.contentRect.width / width));
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [scale, width]);

  const canvasVariables: Record<string, string> = {
    "--canvas-width": `${width}px`,
    "--canvas-aspect": `${width} / ${height}`,
  };

  return (
    <div ref={viewportRef} className={cn(styles.canvasViewport, "drop-shadow-2xl dark:drop-shadow-sm dark:drop-shadow-foreground/25")} style={canvasVariables}>
      <motion.div className={styles.canvasScaler} style={{ scale }}>
        {children}
      </motion.div>
    </div>
  );
}
