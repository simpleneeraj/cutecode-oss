"use client";

import { motion, useReducedMotion } from "motion/react";

import { PocketCard, type PocketCardProps } from "../pocket-card";
import { CardStackState, cardStackStyles, fanPositions, openTransition } from "./style";

type StackedCard = PocketCardProps & {
  id: string;
};

type CardStackProps = {
  cards: StackedCard[];
};

function CardStack({ cards }: CardStackProps) {
  const isReducedMotion = useReducedMotion();
  const styles = cardStackStyles();
  const hoverState = isReducedMotion ? undefined : CardStackState.Open;

  return (
    <motion.ul className={styles.root()} data-slot="card-stack" initial={CardStackState.Rest} whileHover={hoverState}>
      {cards.map(({ id, ...card }, index) => {
        const fan = fanPositions[index % fanPositions.length];
        const shift = {
          [CardStackState.Rest]: { x: 0, y: 0 },
          [CardStackState.Open]: { x: fan.openX, y: fan.openY },
        };
        return (
          <motion.li
            className={styles.card()}
            key={id}
            style={{ x: fan.x, y: fan.y, rotate: fan.rotate, zIndex: index }}
          >
            <motion.div transition={openTransition} variants={shift}>
              <PocketCard {...card} />
            </motion.div>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

export { CardStack };
