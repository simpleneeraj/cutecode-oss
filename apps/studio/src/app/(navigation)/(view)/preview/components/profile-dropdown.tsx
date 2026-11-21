"use client";

import * as React from "react";
import { cn } from "@cutecode/ui/lib/cn";
import { Link } from "@/components/link";
import { useAuthActions, useUser } from "@/hooks/use-auth";
import { useSetAtom } from "jotai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@cutecode/ui/components/menu";
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
import PremiumBadge from "./premium-badge";
import AccountSettingsDialog from "./account-settings-dialog";

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/refund", label: "Refunds" },
  { href: "/legal/credits", label: "Credits" },
];

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function ProfileDropdown({ className, ...props }: ProfileDropdownProps) {
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
    <div className={cn("relative", className)} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              type="button"
              className={cn(
                "relative flex size-8 items-center justify-center rounded-full p-0 outline-none",
                !isFree && "ring-1 ring-warning/60 ring-offset-2 ring-offset-background",
              )}
            >
              <Avatar className="size-full">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              {!isFree && (
                <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-linear-to-b from-warning to-warning-foreground ring-2 ring-background">
                  <CrownBoldIcon className="size-2.5 text-background" />
                </span>
              )}
            </Button>
          }
        />

        <DropdownMenuContent align="end" sideOffset={8} className="flex w-64 flex-col gap-1 p-1.5">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <Avatar className="size-9">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>

            {!isFree && <PremiumBadge plan={plan} />}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem render={<Link href="/dashboard" />} className="cursor-pointer gap-2.5 px-2 py-2">
            <Widget2Icon className="size-4" />
            Dashboard
          </DropdownMenuItem>

          {!isFree && (
            <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2" onClick={openPortal}>
              <CardIcon className="size-4" />
              Manage billing
            </DropdownMenuItem>
          )}

          <DropdownMenuItem render={<Link href="/pricing" />} className="cursor-pointer gap-2.5 px-2 py-2">
            <TagIcon className="size-4" aria-hidden="true" />
            Plans & pricing
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2" onClick={() => setIsAccountOpen(true)}>
            <SettingsMinimalisticIcon className="size-4" />
            Manage account
          </DropdownMenuItem>

          {isFree && (
            <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2" onClick={() => setPlansOpen(true)}>
              <CrownIcon className="size-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Upgrade plan</span>
                <span className="text-xs text-muted-foreground">Pro and Premium plans</span>
              </div>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" className="cursor-pointer gap-2.5 px-2 py-2" onClick={onSignOut}>
            <Logout3Icon className="size-4" />
            Sign out
          </DropdownMenuItem>

          <nav aria-label="Legal" className="flex flex-wrap gap-x-3 gap-y-1 px-2 pt-1 pb-1.5 text-xs text-muted-foreground">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </DropdownMenuContent>
      </DropdownMenu>
      <AccountSettingsDialog open={isAccountOpen} onOpenChange={setIsAccountOpen} />
    </div>
  );
}
