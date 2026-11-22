"use client";

import React, { useState } from "react";
import type { SWRInfiniteResponse } from "swr/infinite";
import { Dialog, DialogTrigger, DialogPopup, DialogHeader, DialogTitle, DialogPanel } from "@cutecode/ui/components/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@cutecode/ui/components/avatar";
import { Button } from "@cutecode/ui/components/button";
import { Spinner } from "@cutecode/ui/components/spinner";
import { useUserFollowers, useUserFollowing, type UserFollowersOutput } from "@/hooks/use-user";

export type FollowUser = UserFollowersOutput["users"][number];
import FollowButton from "@/components/follow-button";
import { Badge } from "@cutecode/ui/components/badge";
import View from "./view";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@cutecode/ui/components/tabs";
import { Plan } from "@/db/schema";
import { avatarUrl } from "@/lib/avatar";

function UserRow({ user, currentUserId }: { user: FollowUser; currentUserId?: string }) {
  const avatarSrc = user.name ? avatarUrl(user.name) : undefined;

  const handle = user.name?.replace(/\s+/g, "").toLowerCase() || "user";

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback className="text-sm font-medium">{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium truncate">{user.name || "Anonymous"}</p>
          {user.plan !== Plan.FREE && (
            <Badge variant="secondary" size="sm" className="shrink-0">
              {user.plan}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">@{handle}</p>
        <p className="text-xs text-muted-foreground">
          {user._count.followers.toLocaleString()} follower{user._count.followers !== 1 ? "s" : ""}
        </p>
      </div>

      <FollowButton
        targetUserId={user.id}
        currentUserId={currentUserId}
        initialIsFollowing={user.isFollowing}
        initialFollowerCount={user._count.followers}
      />
    </div>
  );
}

type ConnectionListProps = {
  connections: SWRInfiniteResponse<UserFollowersOutput>;
  emptyMessage: string;
  currentUserId?: string;
};

function ConnectionList({ connections, emptyMessage, currentUserId }: ConnectionListProps) {
  const { data: pages, size, setSize, isLoading } = connections;
  const users = pages?.flatMap((page) => page.users) ?? [];
  const nextCursor = pages?.at(-1)?.nextCursor;
  const isLoadingMore = isLoading || (!!pages && pages[size - 1] === undefined);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="size-5 text-muted-foreground" />
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col">
      {users.map((u) => (
        <UserRow key={u.id} user={u} currentUserId={currentUserId} />
      ))}
      {nextCursor && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 mx-auto"
          disabled={isLoadingMore}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore ? <Spinner className="size-4" /> : "Load more"}
        </Button>
      )}
    </div>
  );
}

function FollowersList({ userId, currentUserId }: { userId: string; currentUserId?: string }) {
  const followers = useUserFollowers(userId);
  return <ConnectionList connections={followers} emptyMessage="No followers yet." currentUserId={currentUserId} />;
}

function FollowingList({ userId, currentUserId }: { userId: string; currentUserId?: string }) {
  const following = useUserFollowing(userId);
  return (
    <ConnectionList connections={following} emptyMessage="Not following anyone yet." currentUserId={currentUserId} />
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────

enum Tab {
  Followers = "followers",
  Following = "following",
}

interface FollowersDialogProps {
  userId: string;
  currentUserId?: string;
  followerCount: number;
  followingCount: number;
}

export function FollowersDialog({ userId, currentUserId, followerCount, followingCount }: FollowersDialogProps) {
  const [tab, setTab] = useState<Tab>(Tab.Followers);
  const [open, setOpen] = useState(false);

  const onOpenTabs = (tab: Tab) => {
    setOpen(true);
    setTab(tab);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger> */}
      <View className="flex">
        <Button size={"xs"} variant={"ghost"} onClick={() => onOpenTabs(Tab.Followers)}>
          <span>
            <strong className="text-foreground tabular-nums">{followerCount.toLocaleString()}</strong>{" "}
            {followerCount === 1 ? "follower" : "followers"}
          </span>
        </Button>
        <Button size={"xs"} variant={"ghost"} onClick={() => onOpenTabs(Tab.Following)}>
          <span>
            <strong className="text-foreground tabular-nums">{followingCount.toLocaleString()}</strong> following
          </span>
        </Button>
      </View>
      {/* </DialogTrigger> */}
      <Tabs value={tab} onValueChange={setTab}>
        <DialogPopup className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Connections</DialogTitle>
            <TabsList>
              <TabsTab value={Tab.Followers}>{Tab.Followers}</TabsTab>
              <TabsTab value={Tab.Following}>{Tab.Following}</TabsTab>
            </TabsList>
          </DialogHeader>
          <DialogPanel className="max-h-[60vh] overflow-y-auto pr-1">
            <TabsPanel value={Tab.Followers}>
              <FollowersList userId={userId} currentUserId={currentUserId} />
            </TabsPanel>
            <TabsPanel value={Tab.Following}>
              <FollowingList userId={userId} currentUserId={currentUserId} />
            </TabsPanel>
          </DialogPanel>
        </DialogPopup>
      </Tabs>
    </Dialog>
  );
}

export default FollowersDialog;
