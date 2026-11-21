import type { ReactNode } from "react";

import { stickyNoteStyles } from "./style";

type StickyNoteProps = {
  children: ReactNode;
};

function StickyNote({ children }: StickyNoteProps) {
  const styles = stickyNoteStyles();

  return (
    <div className={styles.root()} data-slot="sticky-note">
      <span aria-hidden="true" className={styles.tape()} />
      {children}
    </div>
  );
}

export { StickyNote };
