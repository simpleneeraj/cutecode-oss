"use client";

import type { Resource } from "@cutecode/calendar/types";
import { motion as motionTokens } from "@cutecode/ui/tokens/motion";
import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

import { ResourceGlyph } from "../resource-header/glyph";
import { resourcePickerStyles } from "./style";

type ResourcePickerProps = {
  label: string;
  resources: Resource[];
  value: string | null;
  onValueChange: (resourceId: string) => void;
};

const instantTransition = { duration: 0 };

function ResourcePicker({ label, resources, value, onValueChange }: ResourcePickerProps) {
  const thumbId = useId();
  const isReducedMotion = useReducedMotion() ?? false;
  const transition = isReducedMotion ? instantTransition : motionTokens.springSnappy;

  return (
    <div aria-label={label} className={resourcePickerStyles().root()} data-slot="resource-picker" role="group">
      {resources.map((resource) => {
        const isSelected = resource.id === value;
        const styles = resourcePickerStyles({ isSelected });
        return (
          <button
            key={resource.id}
            aria-pressed={isSelected}
            className={styles.option()}
            onClick={() => onValueChange(resource.id)}
            type="button"
          >
            {isSelected && <motion.span className={styles.thumb()} layoutId={thumbId} transition={transition} />}
            <ResourceGlyph isRound resource={resource} />
            <span className={styles.name()}>{resource.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export { ResourcePicker };
