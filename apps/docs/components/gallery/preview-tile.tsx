import type { ReactNode } from "react";

import { galleryStyles } from "./style";

type PreviewTileProps = {
  children: ReactNode;
};

const styles = galleryStyles();

export function PreviewTile({ children }: PreviewTileProps) {
  return <div className={styles.tile()}>{children}</div>;
}
