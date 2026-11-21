import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "title3",
        "body",
        "subheadline",
        "footnote",
        "caption1",
        "density-body",
        "density-callout",
        "density-subheadline",
        "density-footnote",
        "density-caption",
      ],
      radius: [
        "control",
        "surface",
        "overlay",
        "icon",
        "field",
        "inherit",
        "density-control",
        "density-field",
        "density-surface",
        "density-overlay",
      ],
      spacing: [
        "control-small",
        "control-medium",
        "control-large",
        "field",
        "row",
        "control-inset-small",
        "control-inset-medium",
        "control-inset-large",
        "row-inset",
      ],
      shadow: ["rest", "raised", "press", "icon", "thumb", "glass", "focus"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
