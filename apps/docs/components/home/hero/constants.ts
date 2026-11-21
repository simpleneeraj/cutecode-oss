import { AppIconSize } from "@cutecode/ui/tactile/app-icon/style";
import type { OrbitItem } from "@cutecode/ui/tactile/orbit";
import { OrbitRing } from "@cutecode/ui/tactile/orbit/style";
import { Tone } from "@cutecode/ui/tactile/tone";
import { ChatRoundDotsIcon } from "@solar-icons/react/bold-duotone/chat-round-dots";
import { LightbulbIcon } from "@solar-icons/react/bold-duotone/lightbulb";
import { MusicNote2Icon } from "@solar-icons/react/bold-duotone/music-note-2";
import { PaletteIcon } from "@solar-icons/react/bold-duotone/palette";

export const orbitItems: OrbitItem[] = [
  { id: "palette", icon: PaletteIcon, tone: Tone.Purple, ring: OrbitRing.Middle, angle: -140 },
  {
    id: "chat",
    icon: ChatRoundDotsIcon,
    tone: Tone.Green,
    ring: OrbitRing.Middle,
    angle: 172,
    size: AppIconSize.Small,
  },
  { id: "music", icon: MusicNote2Icon, tone: Tone.Gray, ring: OrbitRing.Middle, angle: -42 },
  {
    id: "lightbulb",
    icon: LightbulbIcon,
    tone: Tone.Yellow,
    ring: OrbitRing.Middle,
    angle: 8,
    size: AppIconSize.Small,
  },
];

export const heroChips = [
  { label: "Base UI", tone: Tone.Blue },
  { label: "Solar icons", tone: Tone.Orange },
  { label: "Apple HIG", tone: Tone.Green },
];
