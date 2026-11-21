import { CardStack } from "@cutecode/ui/tactile/card-stack";
import { StickyNote } from "@cutecode/ui/tactile/sticky-note";

import { DesignsFolder } from "@/components/home/demo-objects/designs-folder";
import { PhotosFolder } from "@/components/home/demo-objects/photos-folder";
import { TicketFace } from "@/components/home/demo-objects/ticket-face";
import { NotificationDeck } from "@/components/home/notification-deck";

import { ChromeDemo } from "./chrome-demo";
import { launchTicket, pocketCards, TileSpan } from "./constants";
import { IconsDemo } from "./icons-demo";
import { objectsBentoStyles } from "./style";
import { WindowDemo } from "./window-demo";

const styles = objectsBentoStyles();

export const objectTiles = [
  {
    id: "folder",
    name: "Folder",
    line: "Opens on hover or tap. Papers peek out from behind frosted glass.",
    hint: "Hover or tap",
    span: TileSpan.Five,
    demo: (
      <div className={styles.folders()}>
        <DesignsFolder />
        <PhotosFolder />
      </div>
    ),
  },
  {
    id: "notification-stack",
    name: "Notification stack",
    line: "Glass cards that stack like iOS and fan out into a list.",
    hint: "Tap the stack",
    span: TileSpan.Seven,
    demo: (
      <div className={styles.deck()}>
        <NotificationDeck />
      </div>
    ),
  },
  {
    id: "card-stack",
    name: "Card stack",
    line: "Pocket cards that spread to show what is inside.",
    hint: "Swipe or tap",
    span: TileSpan.Four,
    demo: (
      <div className={styles.stack()}>
        <CardStack cards={pocketCards} />
      </div>
    ),
  },
  {
    id: "app-icon",
    name: "App icon",
    line: "Real squircles with Solar glyphs.",
    span: TileSpan.Half,
    demo: <IconsDemo />,
  },
  {
    id: "sticky-note",
    name: "Sticky note",
    line: "Tape, tilt and a soft curl.",
    span: TileSpan.Half,
    demo: (
      <div className={styles.note()}>
        <StickyNote>Ship the folder on Friday.</StickyNote>
      </div>
    ),
  },
  {
    id: "ticket",
    name: "Ticket",
    line: "Notches, a tear line and a barcode.",
    span: TileSpan.Four,
    demo: (
      <div className={styles.ticket()}>
        <TicketFace {...launchTicket} />
      </div>
    ),
  },
  {
    id: "tab-bar",
    name: "Tab bar and page control",
    line: "Floating glass, sized for thumbs.",
    span: TileSpan.Five,
    demo: <ChromeDemo />,
  },
  { id: "window", name: "Window", line: "A macOS frame for demos.", span: TileSpan.Three, demo: <WindowDemo /> },
];
