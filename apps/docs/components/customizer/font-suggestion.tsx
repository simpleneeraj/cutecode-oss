"use client";

import { Button } from "@cutecode/ui/components/button";
import { type FontPairing, type Style, suggestedFontPairings } from "@cutecode/ui/provider";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { customizer, customizerMotion } from "./constants";
import { customizerStyles } from "./style";
import { SwapLabel } from "./swap-label";

type FontSuggestionProps = {
  font: FontPairing;
  style: Style;
  onFontChange: (font: FontPairing) => void;
};

const styles = customizerStyles();

export function FontSuggestion({ font, style, onFontChange }: FontSuggestionProps) {
  const isReducedMotion = useReducedMotion();
  const hiddenScale = isReducedMotion ? 1 : 0.9;
  const suggestedFont = suggestedFontPairings[style];
  const isSuggested = font === suggestedFont;
  const styleName = customizer.styleOptions[style].name;
  const suggestedName = customizer.fontLabels[suggestedFont];
  const suggestionText = isSuggested
    ? `${suggestedName} is the suggested font for ${styleName}.`
    : `${styleName} looks best with ${suggestedName}.`;

  return (
    <div className={styles.suggestion()}>
      <span className={styles.suggestionText()}>
        <SwapLabel swapKey={suggestionText}>{suggestionText}</SwapLabel>
      </span>
      <AnimatePresence initial={false}>
        {isSuggested ? null : (
          <motion.span
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: hiddenScale }}
            initial={{ opacity: 0, scale: hiddenScale }}
            transition={isReducedMotion ? customizerMotion.fade : customizerMotion.pop}
          >
            <Button onClick={() => onFontChange(suggestedFont)} size="sm" variant="tinted">
              Use {suggestedName}
            </Button>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
