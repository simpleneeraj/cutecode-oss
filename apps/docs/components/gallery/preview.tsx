import type { ReactNode } from "react";

import { galleryStyles } from "./style";

type PreviewProps = {
  children: ReactNode;
};

const styles = galleryStyles();

export function Preview({ children }: PreviewProps) {
  return <div className={styles.frame()}>{children}</div>;
}
