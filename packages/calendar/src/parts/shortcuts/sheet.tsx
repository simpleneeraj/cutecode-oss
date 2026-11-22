"use client";

import { Kbd, KbdGroup } from "@cutecode/ui/components/kbd";

import { platformOf, shortcutGroups, type ShortcutGroup } from "../../keyboard";
import type { TextDirection } from "../../types";
import { ResponsiveDialog, type DialogCopy } from "../overlay/responsive-dialog";
import { shortcutSheetStyles } from "./style";

type ShortcutSheetProps = {
  isOpen: boolean;
  direction: TextDirection;
  onClose: () => void;
};

const sheetCopy: DialogCopy = {
  title: "Keyboard shortcuts",
  description: "Move around the calendar and edit events without a pointer.",
};

const styles = shortcutSheetStyles();

function copyOfSheet(): DialogCopy {
  return sheetCopy;
}

type ShortcutGroupListProps = {
  group: ShortcutGroup;
};

function ShortcutGroupList({ group }: ShortcutGroupListProps) {
  return (
    <section aria-label={group.title} className={styles.group()}>
      <h3 className={styles.title()}>{group.title}</h3>
      <dl className={styles.rows()}>
        {group.rows.map((row) => (
          <div key={row.label} className={styles.row()}>
            <dt className={styles.label()}>{row.label}</dt>
            <dd className={styles.keys()}>
              <KbdGroup>
                {row.keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </KbdGroup>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ShortcutList({ direction }: Pick<ShortcutSheetProps, "direction">) {
  const groups = shortcutGroups(platformOf(navigator.userAgent), direction);
  return (
    <div className={styles.body()}>
      {groups.map((group) => (
        <ShortcutGroupList key={group.title} group={group} />
      ))}
    </div>
  );
}

function ShortcutSheet({ isOpen, direction, onClose }: ShortcutSheetProps) {
  return (
    <ResponsiveDialog copyOf={copyOfSheet} dismiss={{ isSaving: false, onClose }} value={isOpen ? sheetCopy : null}>
      {() => <ShortcutList direction={direction} />}
    </ResponsiveDialog>
  );
}

export { ShortcutSheet };
