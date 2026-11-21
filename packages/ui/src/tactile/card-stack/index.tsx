"use client";

import { motion, type PanInfo, useAnimate, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { type KeyboardEvent, type ReactNode, useState } from "react";

import { motion as motionTokens } from "../../tokens/motion";
import { PocketCard, type PocketCardProps } from "../pocket-card";
import { bringToTop, moveStack, sendTopToBack, syncStackOrder } from "./order";
import { CardStackState, cardStackMotion, cardStackStyles, cycleKeys, fanPositions, openTransition } from "./style";

type StackedCard = PocketCardProps & {
  id: string;
};

type CardStackProps = {
  cards: StackedCard[];
};

type StackPlace = {
  stackIndex: number;
  count: number;
};

type StackCardProps = {
  card: StackedCard;
  place: StackPlace;
  isReducedMotion: boolean;
  onPress: (id: string) => void;
  onSwipe: () => void;
};

type SwipeLayerProps = {
  id: string;
  isDraggable: boolean;
  isReducedMotion: boolean;
  onSwipe: () => void;
  children: ReactNode;
};

const stackStyles = cardStackStyles();

function SwipeLayer({ id, isDraggable, isReducedMotion, onSwipe, children }: SwipeLayerProps) {
  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, cardStackMotion.dragTilt.range, cardStackMotion.dragTilt.degrees);

  function endDrag(_event: unknown, info: PanInfo) {
    const isFar = Math.abs(info.offset.x) > cardStackMotion.swipeDistance;
    const isFast = Math.abs(info.velocity.x) > cardStackMotion.swipeVelocity;
    if (isFar || isFast) {
      onSwipe();
    }
  }

  return (
    <motion.div
      data-card-face={id}
      drag={isDraggable ? "x" : false}
      dragElastic={cardStackMotion.dragElastic}
      dragSnapToOrigin
      dragTransition={cardStackMotion.dragTransition}
      onDragEnd={endDrag}
      style={{ x: dragX, rotate: dragRotate }}
      transition={openTransition}
      whileHover={isReducedMotion ? undefined : cardStackMotion.hoverLift}
    >
      {children}
    </motion.div>
  );
}

function StackCard({ card: { id, ...card }, place, isReducedMotion, onPress, onSwipe }: StackCardProps) {
  const fan = fanPositions[place.stackIndex % fanPositions.length];
  const shift = {
    [CardStackState.Rest]: { x: 0, y: 0 },
    [CardStackState.Open]: { x: fan.openX, y: fan.openY },
  };
  const isTop = place.stackIndex === place.count - 1;
  const isDraggable = isTop && place.count > 1 && !isReducedMotion;
  const styles = cardStackStyles({ isDraggable });

  return (
    <motion.li
      animate={{ x: fan.x, y: fan.y, rotate: fan.rotate }}
      aria-posinset={place.count - place.stackIndex}
      aria-selected={isTop}
      aria-setsize={place.count}
      className={styles.card()}
      data-card-id={id}
      initial={false}
      onClick={() => onPress(id)}
      role="option"
      style={{ zIndex: place.stackIndex }}
      tabIndex={isTop ? 0 : -1}
      transition={isReducedMotion ? cardStackMotion.instant : openTransition}
    >
      <motion.div transition={openTransition} variants={shift}>
        <SwipeLayer id={id} isDraggable={isDraggable} isReducedMotion={isReducedMotion} onSwipe={onSwipe}>
          <PocketCard {...card} />
        </SwipeLayer>
      </motion.div>
    </motion.li>
  );
}

function useStackOrder(ids: string[], revealTop: (id: string) => void) {
  const [storedOrder, setStoredOrder] = useState(ids);
  const order = syncStackOrder(storedOrder, ids);

  function showOrder(nextOrder: string[]) {
    setStoredOrder(nextOrder);
    const nextTop = nextOrder.at(-1);
    if (nextTop !== undefined) {
      revealTop(nextTop);
    }
  }

  function cycleWithKeys(event: KeyboardEvent<HTMLUListElement>) {
    const move = cycleKeys[event.key];
    if (move === undefined) {
      return;
    }
    event.preventDefault();
    showOrder(moveStack(order, move));
  }

  function pressCard(id: string) {
    const isTop = order.at(-1) === id;
    if (!isTop) {
      showOrder(bringToTop(order, id));
    }
  }

  return { order, cycleWithKeys, pressCard, swipeTop: () => showOrder(sendTopToBack(order)) };
}

function keepFocusOnCard(list: HTMLUListElement | null, escapedId: string) {
  const isFocusInside = list?.contains(document.activeElement) ?? false;
  if (isFocusInside) {
    list?.querySelector<HTMLElement>(`[data-card-id="${escapedId}"]`)?.focus({ preventScroll: true });
  }
}

function CardStack({ cards }: CardStackProps) {
  const isReducedMotion = useReducedMotion() ?? false;
  const [scope, animate] = useAnimate<HTMLUListElement>();

  function revealTop(id: string) {
    const escapedId = CSS.escape(id);
    keepFocusOnCard(scope.current, escapedId);
    if (isReducedMotion) {
      animate(`[data-card-face="${escapedId}"]`, cardStackMotion.crossFade, motionTokens.fade);
    }
  }

  const stack = useStackOrder(cards.map((card) => card.id), revealTop);
  const noun = cards.length === 1 ? "card" : "cards";

  return (
    <motion.ul
      aria-label={`Card stack, ${cards.length} ${noun}`}
      className={stackStyles.root()}
      data-slot="card-stack"
      initial={CardStackState.Rest}
      onKeyDown={stack.cycleWithKeys}
      ref={scope}
      role="listbox"
      whileHover={isReducedMotion ? undefined : CardStackState.Open}
    >
      {cards.map((card) => (
        <StackCard
          card={card}
          isReducedMotion={isReducedMotion}
          key={card.id}
          onPress={stack.pressCard}
          onSwipe={stack.swipeTop}
          place={{ stackIndex: stack.order.indexOf(card.id), count: cards.length }}
        />
      ))}
    </motion.ul>
  );
}

export { CardStack };
