import { BellIcon } from "@solar-icons/react/bold-duotone/bell";
import { BillListIcon } from "@solar-icons/react/bold-duotone/bill-list";
import { CardIcon } from "@solar-icons/react/bold-duotone/card";
import { CartLargeMinimalisticIcon } from "@solar-icons/react/bold-duotone/cart-large-minimalistic";
import { DumbbellIcon } from "@solar-icons/react/bold-duotone/dumbbell";
import { Home2Icon } from "@solar-icons/react/bold-duotone/home-2";
import { MusicNoteIcon } from "@solar-icons/react/bold-duotone/music-note";
import { TvIcon } from "@solar-icons/react/bold-duotone/tv";
import { Widget2Icon } from "@solar-icons/react/bold-duotone/widget-2";
import type { Icon } from "@solar-icons/react/lib/types";

import { PaymentGlyph } from "./payment";

export const paymentGlyphs: Record<PaymentGlyph, Icon> = {
  [PaymentGlyph.Home]: Home2Icon,
  [PaymentGlyph.Reminder]: BellIcon,
  [PaymentGlyph.Card]: CardIcon,
  [PaymentGlyph.Streaming]: TvIcon,
  [PaymentGlyph.Music]: MusicNoteIcon,
  [PaymentGlyph.Software]: Widget2Icon,
  [PaymentGlyph.Gym]: DumbbellIcon,
  [PaymentGlyph.Groceries]: CartLargeMinimalisticIcon,
  [PaymentGlyph.Bills]: BillListIcon,
};
