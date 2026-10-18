"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, Bookmark01Icon, ChatIcon, CodeSquareIcon, MagicWandIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { EmbedDialog } from "./embed-dialog";
import { ShareDialog } from "./share-dialog";
import MoreOptions from "./more-options";
import type { OwnedSnippet } from "../hooks/use-snippet-preview";

type SnippetActionsProps = {
  slug: string;
  upvoted?: boolean;
  upvoteCount: number;
  bookmarked?: boolean;
  bookmarkCount: number;
  commentCount: number;
  ownedSnippet?: OwnedSnippet;
  onUpvote: () => void;
  onBookmark: () => void;
  renderComments: () => React.ReactNode;
};

export function SnippetActions({
  slug,
  upvoted,
  upvoteCount,
  bookmarked,
  bookmarkCount,
  commentCount,
  ownedSnippet,
  onUpvote,
  onBookmark,
  renderComments,
}: SnippetActionsProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [isRemixing, setIsRemixing] = useState(false);

  const handleRemix = () => {
    setIsRemixing(true);
    window.location.href = `/remix/${slug}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1" aria-label="Engagement" role="group">
          <Toggle
            size="sm"
            pressed={!!upvoted}
            onPressedChange={onUpvote}
            aria-label={upvoted ? "Remove upvote" : "Upvote"}
          >
            <HugeiconsIcon icon={FavouriteIcon} aria-hidden="true" />
            <span className="tabular-nums">{upvoteCount}</span>
          </Toggle>
          <Toggle
            size="sm"
            pressed={commentsOpen}
            onPressedChange={setCommentsOpen}
            aria-label={commentsOpen ? "Hide comments" : "Show comments"}
            aria-expanded={commentsOpen}
          >
            <HugeiconsIcon icon={ChatIcon} aria-hidden="true" />
            <span className="tabular-nums">{commentCount}</span>
          </Toggle>
          <Toggle
            size="sm"
            pressed={!!bookmarked}
            onPressedChange={onBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <HugeiconsIcon icon={Bookmark01Icon} aria-hidden="true" />
            <span className="tabular-nums">{bookmarkCount}</span>
          </Toggle>
        </div>

        <div className="flex items-center gap-1">
          <ShareDialog slug={slug} />
          <Button variant="ghost" size="sm" onClick={() => setEmbedOpen(true)} aria-label="Embed">
            <HugeiconsIcon icon={CodeSquareIcon} aria-hidden="true" />
            <span className="max-sm:hidden">Embed</span>
          </Button>
          {ownedSnippet && <MoreOptions slug={slug} snippet={ownedSnippet} />}
          <Button size="sm" className="ms-1" onClick={handleRemix} disabled={isRemixing} aria-label="Remix in editor">
            {isRemixing ? <Spinner /> : <HugeiconsIcon icon={MagicWandIcon} aria-hidden="true" />}
            {isRemixing ? "Remixing..." : "Remix"}
          </Button>
        </div>
      </div>

      {commentsOpen && renderComments()}

      <EmbedDialog slug={slug} open={embedOpen} onOpenChange={setEmbedOpen} />
    </div>
  );
}
