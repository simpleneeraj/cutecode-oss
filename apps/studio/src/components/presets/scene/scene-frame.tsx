"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@cutecode/ui/lib/cn";
import { BaseFrameProps } from "@/typings/presets";
import defaultStyles from "../default/default.module.css";
import { SceneClock } from "./clock";

type SceneFrameProps = BaseFrameProps & {
  themeStyles: { readonly [key: string]: string };
  background: ReactNode;
  accent?: ReactNode;
};

export function SceneFrame({
  themeStyles,
  background,
  accent,
  padding,
  darkMode,
  transparent,
  fileName,
  onFileNameChange,
  children,
}: SceneFrameProps) {
  const sceneRef = useRef<HTMLDivElement>(null);

  return (
    <SceneClock targetRef={sceneRef}>
      <div
        ref={sceneRef}
        className={cn(themeStyles.scene, darkMode ? themeStyles.dark : themeStyles.light, transparent && themeStyles.transparent)}
        style={{ padding }}
      >
        {transparent ? <div data-ignore-in-export className={defaultStyles.transparentPattern} /> : background}
        <motion.div
          className={themeStyles.window}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {accent}
          <div className={themeStyles.header}>
            <div className={themeStyles.dots}>
              <span className={themeStyles.dot} />
              <span className={themeStyles.dot} />
              <span className={themeStyles.dot} />
            </div>
            <div className={themeStyles.fileName}>
              <input
                type="text"
                value={fileName}
                onChange={(event) => onFileNameChange(event.target.value)}
                spellCheck={false}
                tabIndex={-1}
              />
              {fileName.length === 0 ? <span data-ignore-in-export>Untitled-1</span> : null}
            </div>
          </div>
          {children}
        </motion.div>
      </div>
    </SceneClock>
  );
}
