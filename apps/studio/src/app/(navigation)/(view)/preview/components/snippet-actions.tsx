"use client";

import React, { useState } from "react";
import { BookmarkIcon } from "@solar-icons/react/linear/bookmark";
import { ChatRoundDotsIcon } from "@solar-icons/react/linear/chat-round-dots";
import { CodeSquareIcon } from "@solar-icons/react/linear/code-square";
import { HeartIcon } from "@solar-icons/react/linear/heart";
import { MagicWandIcon } from "@solar-icons/react/linear/magic-wand";
import { Button } from "@cutecode/ui/components/button";
import { Spinner } from "@cutecode/ui/components/spinner";
import { Toggle } from "@cutecode/ui/components/toggle";
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
            <HeartIcon aria-hidden="true" />
            <span className="tabular-nums">{upvoteCount}</span>
          </Toggle>
          <Toggle
            size="sm"
            pressed={commentsOpen}
            onPressedChange={setCommentsOpen}
            aria-label={commentsOpen ? "Hide comments" : "Show comments"}
            aria-expanded={commentsOpen}
          >
            <ChatRoundDotsIcon aria-hidden="true" />
            <span className="tabular-nums">{commentCount}</span>
          </Toggle>
          <Toggle
            size="sm"
            pressed={!!bookmarked}
            onPressedChange={onBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <BookmarkIcon aria-hidden="true" />
            <span className="tabular-nums">{bookmarkCount}</span>
          </Toggle>
        </div>

        <div className="flex items-center gap-1">
          <ShareDialog slug={slug} />
          <Button variant="ghost" size="sm" onClick={() => setEmbedOpen(true)} aria-label="Embed">
            <CodeSquareIcon aria-hidden="true" />
            <span className="max-sm:hidden">Embed</span>
          </Button>
          {ownedSnippet && <MoreOptions slug={slug} snippet={ownedSnippet} />}
          <Button size="sm" className="ms-1" onClick={handleRemix} disabled={isRemixing} aria-label="Remix in editor">
            {isRemixing ? <Spinner /> : <MagicWandIcon aria-hidden="true" />}
            {isRemixing ? "Remixing..." : "Remix"}
          </Button>
        </div>
      </div>

      {commentsOpen && renderComments()}

      <EmbedDialog slug={slug} open={embedOpen} onOpenChange={setEmbedOpen} />
    </div>
  );
}
