"use client";

import { Notification } from "@cutecode/ui/tactile/notification";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { heroNotifications } from "@/components/home/demo-objects/constants";
import { homeMotion } from "@/components/home/motion";

import { deckPoses, notificationDeckStyles, readDepthLayer } from "./style";

function readPose(isOpen: boolean, depth: number) {
  if (isOpen) {
    return deckPoses.open;
  }
  return deckPoses.closed[depth] ?? deckPoses.closed.at(-1);
}

export function NotificationDeck() {
  const [isOpen, setIsOpen] = useState(false);
  const isReducedMotion = useReducedMotion() ?? false;
  const transition = isReducedMotion ? homeMotion.stillFade : homeMotion.springSnappy;
  const cards = heroNotifications.slice(0, deckPoses.closed.length);
  const styles = notificationDeckStyles({ isOpen });
  const toggleLabel = isOpen ? "Stack the notifications" : `Show all ${cards.length} notifications`;

  return (
    <div className={styles.root()}>
      <motion.ol className={styles.list()} layout={!isReducedMotion} transition={transition}>
        {cards.map(({ id, ...notification }, depth) => (
          <motion.li
            className={styles.item({ class: readDepthLayer(depth) })}
            key={id}
            layout={!isReducedMotion}
            transition={transition}
          >
            <motion.div
              animate={readPose(isOpen, depth)}
              className={styles.card()}
              initial={false}
              transition={transition}
            >
              <Notification {...notification} />
            </motion.div>
          </motion.li>
        ))}
      </motion.ol>
      <button
        aria-expanded={isOpen}
        aria-label={toggleLabel}
        className={styles.toggle()}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      />
    </div>
  );
}
