"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, Transition } from "motion/react";
import { Toolbar, ToolbarActions, ToolbarBrand } from "@cutecode/ui/tactile/toolbar";
import { Link } from "@/components/link";
import { BrandMark } from "@/components/brand-mark";
import siteConfig from "@/constants/site-config";
import AuthControls from "./controls";
import { MainLinks, MainTabBar } from "./navigation";
import { headerStyles } from "./style";

const transition: Transition = { duration: 0.2, ease: "easeOut" };

const styles = headerStyles();

function Brand({ activeLabel }: { activeLabel?: string }) {
  return (
    <Fragment>
      <ToolbarBrand href="/" render={<Link href="/" />}>
        <motion.span className={styles.brandMark()} whileHover={{ rotate: -6, scale: 1.04 }} whileTap={{ scale: 0.94 }}>
          <BrandMark preload />
        </motion.span>
        <span className={styles.brandName()}>{siteConfig.name}</span>
      </ToolbarBrand>
      <AnimatePresence mode="wait" initial={false}>
        {activeLabel && (
          <motion.span
            key={activeLabel}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={transition}
            className={styles.location()}
          >
            <span aria-hidden="true" className={styles.locationDivider()}>
              /
            </span>
            {activeLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </Fragment>
  );
}

type HeaderProps = {
  title?: string;
  actions?: React.ReactNode;
};

export function Header({ title, actions }: HeaderProps) {
  const pathname = usePathname() ?? "/";
  const activeTab = siteConfig.tabs.find(({ href }) => href === pathname);

  return (
    <Fragment>
      <div className={styles.root()}>
        <Toolbar>
          <Brand activeLabel={title ?? activeTab?.label} />
          <MainLinks pathname={pathname} />
          <ToolbarActions>
            {actions}
            <AuthControls />
          </ToolbarActions>
        </Toolbar>
      </div>
      <div className={styles.tabBar()}>
        <span className={styles.tabBarInset()}>
          <MainTabBar pathname={pathname} />
        </span>
      </div>
    </Fragment>
  );
}
