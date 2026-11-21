import Presets from "../presets";
import { cn } from "@cutecode/ui/lib/cn";
import React, { useContext } from "react";
import { useAtomValue } from "jotai";
import ToolbarParticle from "./Toolbar";
import ResizableFrame from "./ResizableFrame";
import styles from "@/styles/editor/Frame.module.css";
import { EditorContext } from "@/store/editor/context/editor";
import { motion, AnimatePresence, Variants } from "motion/react";
import { useFitScale } from "@/hooks/use-fit-scale";
import Watermark from "./Watermark";
import SafeZones from "./SafeZones";
import CanvasViewport from "./CanvasViewport";
import fonts from "@/fonts/editor/fonts";
import {
  CanvasSize,
  canvasSizeAtom,
  currentSlideAtom,
  elementDarkModeAtom,
  elementFontFamilyAtom,
  elementThemeAtom,
} from "@/store/editor/editor";

const toolbarVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const frameInnerVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const FIT_GUTTER = 32;

const Frame = ({ isReady = true }: { isReady?: boolean }) => {
  const { frameRefs } = useContext(EditorContext);

  const themeId = useAtomValue(elementThemeAtom);
  const darkMode = useAtomValue(elementDarkModeAtom);

  const slide = useAtomValue(currentSlideAtom);
  const canvasSize = useAtomValue(canvasSizeAtom);
  const fontFamily = useAtomValue(elementFontFamilyAtom);

  const codeFont = fonts.find((font) => font.name === fontFamily);
  const frameStyle: Record<string, string> = codeFont ? { "--code-font": `var(${codeFont.variable})` } : {};
  const isAutoSize = canvasSize === CanvasSize.Auto;
  const { containerRef, contentRef, scale } = useFitScale(FIT_GUTTER);

  const refCallback = React.useCallback(
    (el: HTMLDivElement) => {
      if (!slide) return;
      frameRefs.current.set(slide.id, el);
    },
    [slide, frameRefs],
  );

  const canvas = (
    <div id="frame" className={styles.outerFrame} data-canvas-size={canvasSize} style={frameStyle} ref={refCallback}>
      <Presets id={themeId} />
      {canvasSize === CanvasSize.Portrait && <SafeZones />}
      <Watermark />
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn(styles.frameContainer, "my-auto shrink-0 py-4 sm:py-8")}
      data-theme={darkMode ? "dark" : "light"}
    >
      <AnimatePresence mode="wait">
        {slide && (
          <motion.div
            key={slide.id}
            className="w-full flex flex-col items-center justify-center"
            initial="hidden"
            animate={isReady ? "visible" : "hidden"}
            exit="exit"
          >
            <motion.div className="flex items-center justify-center mb-4" variants={toolbarVariants}>
              <ToolbarParticle />
            </motion.div>
            <motion.div variants={frameInnerVariants}>
              {isAutoSize ? (
                <motion.div ref={contentRef} className="origin-top" style={{ scale }}>
                  <ResizableFrame>{canvas}</ResizableFrame>
                </motion.div>
              ) : (
                <CanvasViewport size={canvasSize}>{canvas}</CanvasViewport>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Frame;
