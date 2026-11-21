import { ArrowRightIcon } from "@solar-icons/react/linear/arrow-right";
import Link from "next/link";
import type { ReactNode } from "react";

import { arrowLinkStyles } from "./style";

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
};

const styles = arrowLinkStyles();

export function ArrowLink({ href, children }: ArrowLinkProps) {
  return (
    <Link className={styles.root()} href={href}>
      {children}
      <ArrowRightIcon aria-hidden="true" className={styles.icon()} />
    </Link>
  );
}
