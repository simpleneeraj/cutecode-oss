"use client";

import AuthControls from "./controls";
import Navigations from "./navigation";
import { Link } from "@/components/link";
import { usePathname } from "next/navigation";
import siteConfig from "@/contstant/site-config";
import { Separator } from "@/components/ui/separator";
import ExportButton from "@/components/editor/export";
import { AnimatePresence, motion, Transition } from "motion/react";
import { BrandMark } from "@/components/brand-mark";

const transition: Transition = { duration: 0.2, ease: "easeOut" };

function Brand({ activeLabel }: { activeLabel?: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <Link href="/" className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <motion.span whileHover={{ rotate: -6, scale: 1.04 }} whileTap={{ scale: 0.94 }}>
          <BrandMark />
        </motion.span>
        <span className="hidden font-heading text-lg leading-none font-semibold tracking-tight sm:inline">{siteConfig.name}</span>
      </Link>
      <AnimatePresence mode="wait" initial={false}>
        {activeLabel && (
          <motion.span
            key={activeLabel}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={transition}
            className="hidden items-center gap-2.5 font-heading text-lg leading-none tracking-tight text-muted-foreground sm:flex"
          >
            <span aria-hidden className="text-muted-foreground/40">/</span>
            {activeLabel}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const activeTab = siteConfig.tabs.find(({ href }) => href === pathname);

  return (
    <header className="relative z-20 border-b bg-background/70 backdrop-blur-xl">
      <div className="flex h-14 w-full items-center justify-between gap-2 px-3 sm:gap-3 md:px-6">
        <Brand activeLabel={activeTab?.label} />

        <div className="flex min-w-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <Navigations />
        </div>

        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <ExportButton />
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
