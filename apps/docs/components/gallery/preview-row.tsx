import type { ReactNode } from "react";

import { galleryStyles } from "./style";

type PreviewRowProps = {
  children: ReactNode;
};

const styles = galleryStyles();

export function PreviewRow({ children }: PreviewRowProps) {
  return <div className={styles.row()}>{children}</div>;
}
