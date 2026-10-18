"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { Link } from "@/components/link";
import { useAuthActions, useUser } from "@/hooks/use-auth";
import { useSetAtom } from "jotai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSubscription } from "@/hooks/use-subscription";
import { resetEditorAtom } from "@/store/editor/editor/reset";
import { plansDialogOpenAtom } from "@/store/editor/plans";
import useBilling from "@/hooks/use-billing";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tag01Icon } from "@hugeicons/core-free-icons";
import PremiumBadge from "./premium-badge";

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
  const { signOut, openUserProfile } = useAuthActions();

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
                !isFree && "ring-2 ring-warning/40 ring-offset-1 ring-offset-background",
              )}
            >
              <Avatar className="size-full">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              {!isFree && (
                <span className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-foreground ring-2 ring-background">
                  <Icon icon="solar:crown-bold" className="size-2.5 text-background" />
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
            <Icon icon="solar:widget-2-linear" className="size-4" />
            Dashboard
          </DropdownMenuItem>

          {!isFree && (
            <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2" onClick={openPortal}>
              <Icon icon="solar:card-linear" className="size-4" />
              Manage billing
            </DropdownMenuItem>
          )}

          <DropdownMenuItem render={<Link href="/pricing" />} className="cursor-pointer gap-2.5 px-2 py-2">
            <HugeiconsIcon icon={Tag01Icon} className="size-4" aria-hidden="true" />
            Plans & pricing
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2" onClick={() => openUserProfile()}>
            <Icon icon="solar:settings-minimalistic-linear" className="size-4" />
            Manage account
          </DropdownMenuItem>

          {isFree && (
            <DropdownMenuItem className="cursor-pointer gap-2.5 px-2 py-2" onClick={() => setPlansOpen(true)}>
              <Icon icon="solar:crown-linear" className="size-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Upgrade plan</span>
                <span className="text-xs text-muted-foreground">Pro and Premium plans</span>
              </div>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" className="cursor-pointer gap-2.5 px-2 py-2" onClick={onSignOut}>
            <Icon icon="solar:logout-3-linear" className="size-4" />
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
    </div>
  );
}
