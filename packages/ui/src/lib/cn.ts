import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["title3", "body", "subheadline", "footnote", "caption1"],
      radius: ["control", "surface", "overlay", "icon", "field", "inherit"],
      shadow: ["rest", "raised", "press", "icon", "thumb", "glass", "focus"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
