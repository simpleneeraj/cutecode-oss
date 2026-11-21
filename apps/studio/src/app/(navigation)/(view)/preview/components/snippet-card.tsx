"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FollowButton from "@/components/follow-button";
import FollowersDialog from "@/components/followers-dialog";
import { SnippetActions } from "./snippet-actions";
import type { OwnedSnippet } from "../hooks/use-snippet-preview";

type SnippetAuthor = {
  id?: string;
  name?: string | null;
};

type SnippetCardProps = {
  slug: string;
  children: React.ReactNode;
  author?: SnippetAuthor;
  title?: string | null;
  description?: string | null;
  commentCount: number;
  upvoted: boolean;
  upvoteCount: number;
  bookmarked: boolean;
  bookmarkCount: number;
  isFollowing?: boolean;
  followerCount: number;
  followingCount: number;
  currentUserId?: string;
  ownedSnippet?: OwnedSnippet;
  onUpvote: () => void;
  onBookmark: () => void;
  renderComments: () => React.ReactNode;
};

export function SnippetCard({
  slug,
  children,
  author,
  title,
  description,
  commentCount,
  upvoted,
  upvoteCount,
  bookmarked,
  bookmarkCount,
  isFollowing,
  followerCount,
  followingCount,
  currentUserId,
  ownedSnippet,
  onUpvote,
  onBookmark,
  renderComments,
}: SnippetCardProps) {
  const authorId = author?.id ?? "";

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="text-sm font-medium">{author?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="truncate text-base font-semibold tracking-tight">{title || "Untitled snippet"}</h1>
            <div className="flex min-w-0 items-center text-xs text-muted-foreground">
              <span className="me-1 truncate">{author?.name || "Anonymous"}</span>
              <FollowersDialog
                userId={authorId}
                currentUserId={currentUserId}
                followerCount={followerCount}
                followingCount={followingCount}
              />
            </div>
          </div>
          <FollowButton
            targetUserId={authorId}
            currentUserId={currentUserId}
            initialIsFollowing={isFollowing}
            initialFollowerCount={followerCount}
          />
        </div>
        {description && <p className="max-w-prose text-sm text-muted-foreground text-pretty">{description}</p>}
      </header>

      <div className="flex flex-col gap-8">{children}</div>

      <SnippetActions
        slug={slug}
        upvoted={upvoted}
        upvoteCount={upvoteCount}
        bookmarked={bookmarked}
        bookmarkCount={bookmarkCount}
        commentCount={commentCount}
        ownedSnippet={ownedSnippet}
        onUpvote={onUpvote}
        onBookmark={onBookmark}
        renderComments={renderComments}
      />
    </article>
  );
}
