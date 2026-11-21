import { GlobalIcon } from "@solar-icons/react/bold-duotone/global";
import { LockPasswordIcon } from "@solar-icons/react/bold-duotone/lock-password";
import { ShieldKeyholeMinimalisticIcon } from "@solar-icons/react/bold-duotone/shield-keyhole-minimalistic";
import { Visibility } from "./types";

export const VISIBILITY_ORDER = [Visibility.PUBLIC, Visibility.PASSCODE, Visibility.PRIVATE];

export const visibilityConfig = {
  [Visibility.PUBLIC]: {
    icon: GlobalIcon,
    label: "Public",
    sub: "Anyone with the link can view",
    isPremium: false,
  },
  [Visibility.PASSCODE]: {
    icon: LockPasswordIcon,
    label: "Passcode Protected",
    sub: "Viewers must enter a code",
    isPremium: true,
  },
  [Visibility.PRIVATE]: {
    icon: ShieldKeyholeMinimalisticIcon,
    label: "Private",
    sub: "Only visible to you",
    isPremium: true,
  },
};
