"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useMotionValue } from "motion/react";

export function useFitScale(gutter: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<HTMLDivElement | null>(null);
  const scale = useMotionValue(1);
  const height = useMotionValue<number | string>("auto");

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !content) return;
    const fit = () => {
      const ratio = Math.min(1, (container.clientWidth - gutter) / content.offsetWidth);
      scale.set(ratio);
      height.set(content.offsetHeight * ratio);
    };
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    observer.observe(content);
    return () => observer.disconnect();
  }, [content, gutter, scale, height]);

  return { containerRef, contentRef: setContent, scale, height };
}
