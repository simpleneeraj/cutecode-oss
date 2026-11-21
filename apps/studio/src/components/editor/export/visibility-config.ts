import { Visibility } from "./types";

export const VISIBILITY_ORDER = [Visibility.PUBLIC, Visibility.PASSCODE, Visibility.PRIVATE];

export const visibilityConfig = {
  [Visibility.PUBLIC]: {
    icon: "solar:global-bold-duotone",
    label: "Public",
    sub: "Anyone with the link can view",
    isPremium: false,
  },
  [Visibility.PASSCODE]: {
    icon: "solar:lock-password-bold-duotone",
    label: "Passcode Protected",
    sub: "Viewers must enter a code",
    isPremium: true,
  },
  [Visibility.PRIVATE]: {
    icon: "solar:shield-keyhole-minimalistic-bold-duotone",
    label: "Private",
    sub: "Only visible to you",
    isPremium: true,
  },
};
