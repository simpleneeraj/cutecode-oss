import { Button } from "@cutecode/ui/components/button";
import { Chip } from "@cutecode/ui/tactile/chip";
import { InstallCommand } from "@cutecode/ui/tactile/install-command";
import { Orbit } from "@cutecode/ui/tactile/orbit";
import Link from "next/link";
import type { ReactNode } from "react";

import { siteLinks } from "@/components/site-header/constants";

import { heroChips, orbitItems } from "./constants";
import { heroStyles } from "./style";

type HeroProps = {
  children: ReactNode;
};

const styles = heroStyles();

export function Hero({ children }: HeroProps) {
  return (
    <section className={styles.root()}>
      <div className={styles.orbit()}>
        <Orbit items={orbitItems} />
      </div>
      {children}
      <div className={styles.content()}>
        <div className={styles.chips()}>
          {heroChips.map((chip) => (
            <Chip key={chip.label} tone={chip.tone}>
              {chip.label}
            </Chip>
          ))}
        </div>
        <h1 className={styles.title()}>
          UI you can almost <em className={styles.accent()}>touch</em>
        </h1>
        <p className={styles.lead()}>
          A React component library where folders, stacks and app icons feel like real objects. Built on Base UI, with
          Solar icons, following Apple&apos;s Human Interface Guidelines.
        </p>
        <div className={styles.actions()}>
          <Button className={styles.action()} render={<Link href={siteLinks.components} />} size="lg">
            Browse Components
          </Button>
          <Button className={styles.action()} render={<a href={siteLinks.github} />} size="lg" variant="gray">
            View on GitHub
          </Button>
        </div>
        <div className={styles.install()}>
          <InstallCommand item="@cutecode/folder" />
        </div>
      </div>
    </section>
  );
}
