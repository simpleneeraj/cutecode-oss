"use client";

import React from "react";
import { MotionConfig, motion } from "motion/react";
import View from "@/components/view";
import { Header } from "../components/header";
import PublishSnippet from "@/components/editor/export/publish-snippet";

const drift = { duration: 24, repeat: Infinity, ease: "easeInOut" } as const;

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="dot-grid absolute inset-0" />
      <motion.div
        className="absolute -top-1/5 -left-1/8 size-160 rounded-full bg-radial from-foreground/6 to-transparent to-70%"
        animate={{ x: [0, 55, 0], y: [0, 35, 0] }}
        transition={drift}
      />
      <motion.div
        className="absolute -right-1/8 -bottom-1/5 size-130 rounded-full bg-radial from-foreground/6 to-transparent to-70%"
        animate={{ x: [0, -45, 0], y: [0, -30, 0] }}
        transition={{ ...drift, duration: 28 }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 size-105 -translate-1/2 rounded-full bg-radial from-foreground/3 to-transparent to-70%"
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
        transition={{ ...drift, duration: 18 }}
      />
    </div>
  );
}

export default function CodeLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <View className="layout-fill relative isolate overflow-hidden">
        <Backdrop />
        <Header actions={<PublishSnippet />} />
        {children}
      </View>
    </MotionConfig>
  );
}
