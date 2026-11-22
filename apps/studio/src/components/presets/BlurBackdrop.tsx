"use client";

import { CSSProperties, useLayoutEffect, useRef, useState } from "react";

type BlurBackdropProps = {
  backgroundImage?: string;
  backgroundSize?: string;
  blurAmount?: number;
  tintColor?: string;
  tintBoxShadow?: string;
};

type Scene = {
  left: number;
  top: number;
  width: number;
  height: number;
  background: CSSProperties;
};

const coverStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  borderRadius: "inherit",
  pointerEvents: "none",
};

function findBackgroundAncestor(element: HTMLElement) {
  let node = element.parentElement;
  while (node) {
    const hasBackground = getComputedStyle(node).backgroundImage !== "none";
    if (hasBackground) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

function measureLayoutOffset(element: HTMLElement) {
  let left = 0;
  let top = 0;
  let node: Element | null = element;
  while (node instanceof HTMLElement) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return { left, top };
}

function readScene(element: HTMLElement, ancestor: HTMLElement): Scene {
  const elementOffset = measureLayoutOffset(element);
  const ancestorOffset = measureLayoutOffset(ancestor);
  const style = getComputedStyle(ancestor);
  return {
    left: ancestorOffset.left - elementOffset.left,
    top: ancestorOffset.top - elementOffset.top,
    width: ancestor.offsetWidth,
    height: ancestor.offsetHeight,
    background: {
      backgroundColor: style.backgroundColor,
      backgroundImage: style.backgroundImage,
      backgroundSize: style.backgroundSize,
      backgroundPosition: style.backgroundPosition,
      backgroundRepeat: style.backgroundRepeat,
    },
  };
}

function useScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<Scene | null>(null);

  useLayoutEffect(() => {
    const element = wrapperRef.current;
    const ancestor = element && findBackgroundAncestor(element);
    const isDetached = !element || !ancestor;
    if (isDetached) {
      return;
    }
    const update = () => setScene(readScene(element, ancestor));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    observer.observe(ancestor);
    return () => observer.disconnect();
  }, []);

  return { wrapperRef, scene };
}

export function BlurBackdrop({
  backgroundImage,
  backgroundSize,
  blurAmount = 18,
  tintColor,
  tintBoxShadow,
}: BlurBackdropProps) {
  const { wrapperRef, scene } = useScene();
  const spread = blurAmount * 2;

  return (
    <div ref={wrapperRef} aria-hidden style={coverStyle}>
      <div style={{ position: "absolute", inset: -spread, overflow: "hidden", filter: `blur(${blurAmount}px)` }}>
        {scene ? (
          <div
            style={{
              position: "absolute",
              left: scene.left + spread,
              top: scene.top + spread,
              width: scene.width,
              height: scene.height,
              ...scene.background,
              ...(backgroundImage && { backgroundImage }),
              ...(backgroundSize && { backgroundSize }),
            }}
          />
        ) : null}
      </div>
      {tintColor ? <div style={{ ...coverStyle, backgroundColor: tintColor, boxShadow: tintBoxShadow }} /> : null}
    </div>
  );
}
