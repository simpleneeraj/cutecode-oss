"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { Entrance, entranceViewport, readEntranceGroup, readEntranceLift } from "@/components/home/motion";

import { sectionHeadingStyles } from "./style";

type SectionHeadingProps = {
  eyebrow: ReactNode;
  title: string;
  lead: string;
  isCentered?: boolean;
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, lead, isCentered, children }: SectionHeadingProps) {
  const isReducedMotion = useReducedMotion() ?? false;
  const item = readEntranceLift(isReducedMotion);
  const styles = sectionHeadingStyles({ isCentered });

  return (
    <motion.div
      className={styles.root()}
      initial={Entrance.Hidden}
      variants={readEntranceGroup(isReducedMotion)}
      viewport={entranceViewport}
      whileInView={Entrance.Shown}
    >
      <motion.span className={styles.eyebrow()} variants={item}>
        {eyebrow}
      </motion.span>
      <motion.h2 className={styles.title()} variants={item}>
        {title}
      </motion.h2>
      <motion.p className={styles.lead()} variants={item}>
        {lead}
      </motion.p>
      {children ? (
        <motion.div className={styles.extra()} variants={item}>
          {children}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
