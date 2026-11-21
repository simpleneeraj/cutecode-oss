import Image from "next/image";

import { siteHeaderStyles } from "./style";

const styles = siteHeaderStyles();

export function BrandMark() {
  return (
    <span className={styles.brand()}>
      <Image alt="" className={styles.logo()} height={200} src="/brand/logo-mark.svg" width={200} />
      CuteUI
    </span>
  );
}
