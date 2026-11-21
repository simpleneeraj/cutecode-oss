"use client";

import { AnimatePresence, motion } from "motion/react";

import { DesignsFolder } from "@/components/home/demo-objects/designs-folder";
import { homeMotion } from "@/components/home/motion";

import { PreviewTab } from "./constants";
import { FolderCode } from "./folder-code";
import { docsTeaserStyles } from "./style";

type PreviewStageProps = {
  tab: PreviewTab;
};

const styles = docsTeaserStyles();

export function PreviewStage({ tab }: PreviewStageProps) {
  const isPreview = tab === PreviewTab.Preview;

  return (
    <div className={styles.stage()}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ opacity: 1 }}
          className={styles.stageContent({ isPreview })}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={tab}
          transition={homeMotion.fade}
        >
          {isPreview ? <DesignsFolder /> : <FolderCode />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
