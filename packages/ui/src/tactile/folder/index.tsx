"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { type PointerEvent, type ReactNode, startTransition, useCallback, useId, useRef, useState, ViewTransition } from "react";

import { Tone } from "../tone";
import { closedPeek, type FolderPeek, isFolderOpen, mergePeek, tapPeek } from "./peek";
import { FolderPose, folderMotion, folderStyles } from "./style";

type FolderProps = {
  title: string;
  count: string;
  tone?: Tone;
  front?: ReactNode;
  children?: ReactNode;
};

type FolderFrontProps = {
  tone?: Tone;
  isOpen: boolean;
  children?: ReactNode;
};

const styles = folderStyles();

function useFolderTilt(isEnabled: boolean) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, folderMotion.tilt.spring);
  const rotateX = useSpring(pointerY, folderMotion.tilt.spring);

  function followPointer(event: PointerEvent<HTMLElement>) {
    const canTilt = isEnabled && event.pointerType !== "touch";
    if (!canTilt) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
    pointerX.set(offsetX * 2 * folderMotion.tilt.degreesY);
    pointerY.set(-offsetY * 2 * folderMotion.tilt.degreesX);
  }

  function resetTilt() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const style = { rotateX, rotateY, transformPerspective: folderMotion.tilt.perspective };
  return { style, followPointer, resetTilt };
}

function useOutsidePress(closeTap: () => void) {
  return useCallback(
    (element: HTMLElement | null) => {
      if (!element) {
        return;
      }
      function closeOnOutsidePress(event: globalThis.PointerEvent) {
        const isInside = event.target instanceof Node && element?.contains(event.target);
        if (!isInside) {
          closeTap();
        }
      }
      element.ownerDocument.addEventListener("pointerdown", closeOnOutsidePress);
      return () => element.ownerDocument.removeEventListener("pointerdown", closeOnOutsidePress);
    },
    [closeTap],
  );
}

function useFolderPeek() {
  const [peek, setPeek] = useState<FolderPeek>(closedPeek);
  const pressPointer = useRef("");
  const update = (change: Partial<FolderPeek>) =>
    startTransition(() => setPeek((current) => mergePeek(current, change)));
  const closeTap = useCallback(
    () => startTransition(() => setPeek((current) => mergePeek(current, { isTapped: false }))),
    [],
  );

  const handlers = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => update({ isHovered: event.pointerType !== "touch" }),
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      pressPointer.current = event.pointerType;
    },
    onClick: () => {
      const isTouch = pressPointer.current === "touch";
      if (isTouch) {
        startTransition(() => setPeek(tapPeek));
      }
    },
  };

  return { isOpen: isFolderOpen(peek), closeTap, handlers, endHover: () => update({ isHovered: false }) };
}

function FolderFront({ tone = Tone.Neutral, isOpen, children }: FolderFrontProps) {
  const transitionName = `folder-front-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const frontStyles = folderStyles({ look: tone, isOpen });

  return (
    <ViewTransition name={transitionName} update="folder-front">
      <span className={frontStyles.front()}>
        <span aria-hidden="true" className={frontStyles.tint()} />
        <span className={frontStyles.frontContent()}>{children}</span>
      </span>
    </ViewTransition>
  );
}

function Folder({ title, count, tone, front, children }: FolderProps) {
  const isReducedMotion = useReducedMotion() ?? false;
  const peek = useFolderPeek();
  const tilt = useFolderTilt(!isReducedMotion);
  const watchOutsidePress = useOutsidePress(peek.closeTap);
  const pose = peek.isOpen ? FolderPose.Open : FolderPose.Closed;

  return (
    <motion.div
      {...peek.handlers}
      animate={pose}
      className={styles.root()}
      data-slot="folder"
      data-state={pose}
      initial={false}
      onPointerLeave={() => {
        peek.endHover();
        tilt.resetTilt();
      }}
      onPointerMove={tilt.followPointer}
      ref={watchOutsidePress}
      tabIndex={-1}
      whileTap={isReducedMotion ? undefined : FolderPose.Pressed}
    >
      <motion.span className={styles.body()} variants={folderMotion.body}>
        <span aria-hidden="true" className={styles.tab()} />
        <span aria-hidden="true" className={styles.back()} />
        <motion.span className={styles.papers()} style={tilt.style}>
          {children}
        </motion.span>
        <FolderFront isOpen={peek.isOpen} tone={tone}>
          {front}
        </FolderFront>
      </motion.span>
      <span className={styles.title()}>{title}</span>
      <span className={styles.count()}>{count}</span>
    </motion.div>
  );
}

export { Folder };
