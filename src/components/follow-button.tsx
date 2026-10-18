"use client";

import { cn } from "@/utils/cn";
import React, { useState } from "react";
import { toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserCheckIcon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { useToggleFollow, useUserProfile } from "@/hooks/use-user";

interface FollowButtonProps {
  /** DB user ID of the person to follow */
  targetUserId: string;
  /** DB user ID of the logged-in viewer (undefined = not signed in) */
  currentUserId?: string;
  /** Initial follow state from the preview payload (avoids extra fetch) */
  initialIsFollowing?: boolean;
  /** Initial follower count */
  initialFollowerCount?: number;
  /** If true, show follower count next to the button */
  showCount?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
}

/**
 * Reusable follow/unfollow button with:
 *  - Optimistic UI
 *  - Loading spinner (no double-submit)
 *  - Auth guard
 *  - Self-follow prevention
 */
export function FollowButton({
  targetUserId,
  currentUserId,
  initialIsFollowing = false,
  initialFollowerCount = 0,
  showCount = false,
  className,
  size = "sm",
}: FollowButtonProps) {
  const [isHovering, setIsHovering] = useState(false);

  const { data: profile } = useUserProfile(targetUserId);
  const { trigger: toggleFollow, isMutating: isFollowPending } = useToggleFollow(targetUserId);

  const isFollowing = profile?.isFollowing ?? initialIsFollowing;
  const followerCount = profile?._count.followers ?? initialFollowerCount;
  const isOwnProfile = !!currentUserId && currentUserId === targetUserId;

  if (isOwnProfile) return null;

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!currentUserId) {
      toast.error("Sign in to follow users.");
      return;
    }

    if (isFollowPending) return;

    await toggleFollow().catch(() => {
      toast.error(isFollowing ? "Could not unfollow user." : "Could not follow user.");
    });
  };

  const label = isFollowing ? (isHovering ? "Unfollow" : "Following") : "Follow";

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isFollowing ? "outline" : "default"}
        size={size}
        onClick={handleClick}
        disabled={isFollowPending}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label={isFollowing ? "Unfollow this user" : "Follow this user"}
        aria-pressed={isFollowing}
        className={cn(
          "gap-1.5 transition-all",
          isFollowing && isHovering && "border-destructive text-destructive hover:bg-destructive/10",
          className,
        )}
      >
        {isFollowPending ? (
          <Spinner className="size-3.5" />
        ) : isFollowing ? (
          <HugeiconsIcon icon={UserCheckIcon} className="size-3.5" aria-hidden="true" />
        ) : (
          <HugeiconsIcon icon={UserAdd01Icon} className="size-3.5" aria-hidden="true" />
        )}
        {label}
      </Button>

      {showCount && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {followerCount.toLocaleString()} {followerCount === 1 ? "follower" : "followers"}
        </span>
      )}
    </div>
  );
}

export default FollowButton;
