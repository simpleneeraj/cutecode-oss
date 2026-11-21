"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSetAtom } from "jotai";
import { CrownIcon } from "@solar-icons/react/linear/crown";
import { Login3Icon } from "@solar-icons/react/linear/login-3";
import { MenuDotsVerticalIcon } from "@solar-icons/react/linear/menu-dots-vertical";
import { TagIcon } from "@solar-icons/react/linear/tag";
import { Button } from "@cutecode/ui/components/button";
import { Spinner } from "@cutecode/ui/components/spinner";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@cutecode/ui/components/menu";
import { useUser } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import { AnimatePresence, motion, Transition } from "motion/react";
import ProfileDropdown from "../(view)/preview/components/profile-dropdown";
import { trackAuth, trackUpgrade } from "@/lib/analytics";

const fadeScale = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

const transition: Transition = { duration: 0.2, ease: "easeOut" };

enum AuthState {
  PREMIUM = "premium",
  FREE = "free",
  SIGNED_OUT = "signed-out",
  LOADING_SUB = "loading-sub",
  LOADING_AUTH = "loading-auth",
}

export default function AuthControls() {
  const { isSignedIn, isLoaded } = useUser();
  const { isFree, isLoaded: subLoaded } = useSubscription();
  const setOpen = useSetAtom(plansDialogOpenAtom);
  const pathname = usePathname();
  const signInHref = `/account/sign-in?redirectedFrom=${encodeURIComponent(pathname ?? "/")}`;

  const stateKey = React.useMemo(() => {
    if (!isLoaded) return AuthState.LOADING_AUTH;
    if (!isSignedIn) return AuthState.SIGNED_OUT;
    if (!subLoaded) return AuthState.LOADING_SUB;
    if (!isFree) return AuthState.PREMIUM;
    return AuthState.FREE;
  }, [isLoaded, isSignedIn, subLoaded, isFree]);

  const content = React.useMemo(() => {
    switch (stateKey) {
      case AuthState.LOADING_AUTH:
      case AuthState.LOADING_SUB:
        return (
          <Button variant="outline" size="icon" aria-label="Loading account">
            <Spinner />
          </Button>
        );

      case AuthState.SIGNED_OUT:
        return (
          <>
            <Button variant="ghost" className="hidden sm:inline-flex" render={<Link href="/pricing" />}>
              Pricing
            </Button>
            <Button
              variant="outline"
              aria-label="Sign in"
              onClick={() => trackAuth.signInClicked("header")}
              render={<Link href={signInHref} />}
            >
              <Login3Icon className="size-3.5" />
              <span className="hidden sm:inline">Sign in</span>
            </Button>
            <Menu>
              <MenuTrigger render={<Button variant="ghost" size="icon" aria-label="More" className="sm:hidden" />}>
                <MenuDotsVerticalIcon aria-hidden="true" />
              </MenuTrigger>
              <MenuPopup align="end" sideOffset={8}>
                <MenuItem render={<Link href="/pricing" />}>
                  <TagIcon aria-hidden="true" />
                  Plans & pricing
                </MenuItem>
              </MenuPopup>
            </Menu>
          </>
        );
      case AuthState.FREE:
        return (
          <div className="flex items-center gap-2">
            <Button
              className="hidden sm:inline-flex"
              render={<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} />}
              onClick={() => {
                trackUpgrade.dialogOpened("header");
                setOpen(true);
              }}
            >
              <CrownIcon className="size-3.5" />
              Upgrade to Premium
            </Button>
            <ProfileDropdown />
          </div>
        );

      case AuthState.PREMIUM:
        return <ProfileDropdown />;
    }
  }, [stateKey, setOpen, signInHref]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stateKey}
        variants={fadeScale}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        className="flex items-center gap-2"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
