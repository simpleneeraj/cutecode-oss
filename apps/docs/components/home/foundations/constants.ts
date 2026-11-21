import { Tone } from "@cutecode/ui/tactile/tone";
import { HomeSmileIcon } from "@solar-icons/react/bold-duotone/home-smile";
import { StarIcon } from "@solar-icons/react/bold-duotone/star";
import { Widget5Icon } from "@solar-icons/react/bold-duotone/widget-5";

export const foundations = [
  {
    id: "base-ui",
    icon: Widget5Icon,
    tone: Tone.Blue,
    title: "Base UI inside",
    description: "Unstyled, accessible primitives handle focus, keyboard and screen readers. We add the look.",
  },
  {
    id: "solar",
    icon: StarIcon,
    tone: Tone.Orange,
    title: "Solar icons on top",
    description: "Linear glyphs for controls and Bold Duotone for app icons, wired into every component.",
  },
  {
    id: "apple-guidelines",
    icon: HomeSmileIcon,
    tone: Tone.Gray,
    title: "Apple's guidelines",
    description: "44pt targets, system colors, text styles, Reduce Motion and Reduce Transparency, light and dark.",
  },
];
