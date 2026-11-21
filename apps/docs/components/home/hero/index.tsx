"use client";

import { Button } from "@cutecode/ui/components/button";
import { Chip } from "@cutecode/ui/tactile/chip";
import { Tone } from "@cutecode/ui/tactile/tone";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { HeroStage } from "@/components/home/hero-stage";
import { Entrance, readEntranceGroup, readEntranceItem, readEntranceLift } from "@/components/home/motion";
import { siteLinks } from "@/components/site-header/constants";

import { heroStyles } from "./style";

const styles = heroStyles();

export function Hero() {
  const isReducedMotion = useReducedMotion() ?? false;
  const item = readEntranceItem(isReducedMotion);
  const lift = readEntranceLift(isReducedMotion);

  return (
    <motion.section
      animate={Entrance.Shown}
      className={styles.root()}
      initial={Entrance.Hidden}
      variants={readEntranceGroup(isReducedMotion)}
    >
      <div className={styles.copy()}>
        <motion.div className={styles.chips()} variants={item}>
          <Chip tone={Tone.Accent}>Free and MIT licensed</Chip>
          <Chip>Base UI and Solar icons</Chip>
        </motion.div>
        <motion.h1 className={styles.title()} variants={lift}>
          UI you can almost <em className={styles.accent()}>touch</em>
        </motion.h1>
        <motion.p className={styles.lead()} variants={lift}>
          React components that feel like real objects. Folders open, cards fan out, glass catches the light. Built on
          Base UI and Apple&apos;s guidelines.
        </motion.p>
        <motion.div className={styles.actions()} variants={item}>
          <Button className={styles.action()} render={<Link href={siteLinks.components} />} size="lg">
            Browse components
          </Button>
          <Button className={styles.action()} render={<a href={siteLinks.github} />} size="lg" variant="gray">
            View on GitHub
          </Button>
        </motion.div>
      </div>
      <motion.div className={styles.stage()} variants={item}>
        <HeroStage />
      </motion.div>
    </motion.section>
  );
}
