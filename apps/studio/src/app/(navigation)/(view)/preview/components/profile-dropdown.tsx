"use client";

import * as React from "react";
import { Link } from "@/components/link";
import { useAuthActions, useUser } from "@/hooks/use-auth";
import { useSetAtom } from "jotai";
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from "@cutecode/ui/components/menu";
import { Avatar, AvatarFallback, AvatarImage } from "@cutecode/ui/components/avatar";
import { useSubscription } from "@/hooks/use-subscription";
import { resetEditorAtom } from "@/store/editor/editor/reset";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import useBilling from "@/hooks/use-billing";
import { Button } from "@cutecode/ui/components/button";
import { CrownIcon as CrownBoldIcon } from "@solar-icons/react/bold/crown";
import { CardIcon } from "@solar-icons/react/linear/card";
import { CrownIcon } from "@solar-icons/react/linear/crown";
import { Logout3Icon } from "@solar-icons/react/linear/logout-3";
import { SettingsMinimalisticIcon } from "@solar-icons/react/linear/settings-minimalistic";
import { TagIcon } from "@solar-icons/react/linear/tag";
import { Widget2Icon } from "@solar-icons/react/linear/widget-2";
import { PlanBadge } from "../../dashboard/components/plan-badge";
import AccountSettingsDialog from "./account-settings-dialog";
import { profileStyles } from "./style";

const styles = profileStyles();

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/refund", label: "Refunds" },
  { href: "/legal/credits", label: "Credits" },
];

export default function ProfileDropdown() {
  const { user } = useUser();
  const { openPortal } = useBilling();
  const { plan, isFree } = useSubscription();
  const { signOut } = useAuthActions();
  const [isAccountOpen, setIsAccountOpen] = React.useState(false);

  const resetEditor = useSetAtom(resetEditorAtom);
  const setPlansOpen = useSetAtom(plansDialogOpenAtom);

  const onSignOut = async () => {
    resetEditor();
    await signOut();
  };

  const { name, email, avatar, initials } = React.useMemo(() => {
    const name = user?.fullName ?? user?.username ?? "User";
    const email = user?.primaryEmailAddress?.emailAddress ?? "";
    const avatar = user?.imageUrl ?? "";
    const initials = name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 1);
    return { name, email, avatar, initials };
  }, [user]);

  return (
    <>
      <Menu>
        <MenuTrigger
          render={
            <Button variant="outline" size="icon" type="button" aria-label="Account" className={styles.trigger()} />
          }
        >
          <Avatar className={styles.avatar()}>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {!isFree && (
            <span className={styles.planDot()}>
              <CrownBoldIcon className={styles.planDotIcon()} aria-hidden="true" />
            </span>
          )}
        </MenuTrigger>

        <MenuPopup align="end" sideOffset={8} className={styles.popup()}>
          <div className={styles.identity()}>
            <Avatar className={styles.identityAvatar()}>
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className={styles.identityText()}>
              <p className={styles.name()}>{name}</p>
              <p className={styles.email()}>{email}</p>
            </div>
            {!isFree && <PlanBadge plan={plan} />}
          </div>

          <MenuSeparator />

          <MenuItem render={<Link href="/dashboard" />}>
            <Widget2Icon aria-hidden="true" />
            Dashboard
          </MenuItem>

          {!isFree && (
            <MenuItem onClick={openPortal}>
              <CardIcon aria-hidden="true" />
              Manage billing
            </MenuItem>
          )}

          <MenuItem render={<Link href="/pricing" />}>
            <TagIcon aria-hidden="true" />
            Plans & pricing
          </MenuItem>

          <MenuItem onClick={() => setIsAccountOpen(true)}>
            <SettingsMinimalisticIcon aria-hidden="true" />
            Manage account
          </MenuItem>

          {isFree && (
            <MenuItem onClick={() => setPlansOpen(true)}>
              <CrownIcon aria-hidden="true" />
              <span className={styles.stack()}>
                Upgrade plan
                <span className={styles.hint()}>Pro and Premium plans</span>
              </span>
            </MenuItem>
          )}

          <MenuSeparator />

          <MenuItem variant="destructive" onClick={onSignOut}>
            <Logout3Icon aria-hidden="true" />
            Sign out
          </MenuItem>

          <nav aria-label="Legal" className={styles.legal()}>
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.legalLink()}>
                {link.label}
              </Link>
            ))}
          </nav>
        </MenuPopup>
      </Menu>
      <AccountSettingsDialog open={isAccountOpen} onOpenChange={setIsAccountOpen} />
    </>
  );
}
