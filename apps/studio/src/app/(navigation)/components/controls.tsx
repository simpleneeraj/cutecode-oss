"use client";

import { Fragment } from "react";
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
import { controlStyles } from "./style";

const fadeScale = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

const transition: Transition = { duration: 0.2, ease: "easeOut" };

const styles = controlStyles();

enum AuthState {
  PREMIUM = "premium",
  FREE = "free",
  SIGNED_OUT = "signed-out",
  LOADING_SUB = "loading-sub",
  LOADING_AUTH = "loading-auth",
}

function useAuthState() {
  const { isSignedIn, isLoaded } = useUser();
  const { isFree, isLoaded: isSubscriptionLoaded } = useSubscription();

  if (!isLoaded) return AuthState.LOADING_AUTH;
  if (!isSignedIn) return AuthState.SIGNED_OUT;
  if (!isSubscriptionLoaded) return AuthState.LOADING_SUB;
  if (!isFree) return AuthState.PREMIUM;
  return AuthState.FREE;
}

function LoadingAccount() {
  return (
    <Button variant="outline" size="icon" className={styles.iconButton()} aria-label="Loading account">
      <Spinner />
    </Button>
  );
}

function SignedOutControls() {
  const pathname = usePathname();
  const signInHref = `/account/sign-in?redirectedFrom=${encodeURIComponent(pathname ?? "/")}`;

  return (
    <Fragment>
      <Button variant="ghost" className={styles.button({ class: styles.wideOnly() })} render={<Link href="/pricing" />}>
        Pricing
      </Button>
      <Button
        variant="outline"
        aria-label="Sign in"
        className={styles.button()}
        onClick={() => trackAuth.signInClicked("header")}
        render={<Link href={signInHref} />}
      >
        <Login3Icon className={styles.icon()} aria-hidden="true" />
        <span className={styles.wideOnly()}>Sign in</span>
      </Button>
      <Menu>
        <MenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="More"
              className={styles.iconButton({ class: styles.phoneOnly() })}
            />
          }
        >
          <MenuDotsVerticalIcon className={styles.icon()} aria-hidden="true" />
        </MenuTrigger>
        <MenuPopup align="end" sideOffset={8}>
          <MenuItem render={<Link href="/pricing" />}>
            <TagIcon aria-hidden="true" />
            Plans & pricing
          </MenuItem>
        </MenuPopup>
      </Menu>
    </Fragment>
  );
}

function FreeControls() {
  const setOpen = useSetAtom(plansDialogOpenAtom);

  const openPlans = () => {
    trackUpgrade.dialogOpened("header");
    setOpen(true);
  };

  return (
    <Fragment>
      <Button
        className={styles.button({ class: styles.wideOnly() })}
        render={<motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} />}
        onClick={openPlans}
      >
        <CrownIcon className={styles.icon()} aria-hidden="true" />
        Upgrade to Premium
      </Button>
      <ProfileDropdown />
    </Fragment>
  );
}

const authControls = {
  [AuthState.LOADING_AUTH]: LoadingAccount,
  [AuthState.LOADING_SUB]: LoadingAccount,
  [AuthState.SIGNED_OUT]: SignedOutControls,
  [AuthState.FREE]: FreeControls,
  [AuthState.PREMIUM]: ProfileDropdown,
};

export default function AuthControls() {
  const authState = useAuthState();
  const Controls = authControls[authState];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={authState}
        variants={fadeScale}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
        className={styles.group()}
      >
        <Controls />
      </motion.div>
    </AnimatePresence>
  );
}
