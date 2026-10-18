"use client";

import { Link } from "@/components/link";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PinIcon } from "@hugeicons/core-free-icons";
import { EASE_OUT } from "@/lib/motion";
import { SnippetPreview } from "@/app/(navigation)/components/snippet-preview";

export type ExploreSnippet = {
  id: string;
  title: string | null;
  description: string | null;
  tags: string[];
  createdAt: Date | string;
  elementId: string;
  user: { id: string; name: string | null } | null;
  presentation: { id: string; name: string };
  shareLinks: { slug: string }[];
  _count: { upvotes: number; bookmarks: number; comments: number };
};

type ExploreSnippetCardProps = {
  snippet: ExploreSnippet;
  index: number;
  isPinned?: boolean;
};

export function ExploreSnippetCard({ snippet, index, isPinned }: ExploreSnippetCardProps) {
  const slug = snippet.shareLinks[0]?.slug;
  const title = snippet.title || snippet.presentation.name || "Untitled snippet";
  const upvotes = snippet._count.upvotes;

  if (!slug) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3), ease: EASE_OUT }}
      data-slot="snippet-card"
      className="relative flex flex-col gap-3"
    >
      <Link href={`/preview/${slug}`} aria-label={title} className="absolute inset-0 z-0" />
      <SnippetPreview language={snippet.presentation.name} />
      <div className="flex min-w-0 flex-col gap-0.5 px-1">
        <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-foreground">
          {isPinned && (
            <HugeiconsIcon icon={PinIcon} className="size-3.5 shrink-0 text-muted-foreground" aria-label="Pinned" />
          )}
          <span className="truncate">{title}</span>
        </span>
        <span className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
          <Link
            href={snippet.user?.id ? `/u/${snippet.user.id}` : "#"}
            className="relative z-10 truncate transition-colors hover:text-foreground"
          >
            {snippet.user?.name || "Anonymous"}
          </Link>
          <span aria-hidden="true">·</span>
          <span className="shrink-0 tabular-nums">
            {upvotes} {upvotes === 1 ? "upvote" : "upvotes"}
          </span>
        </span>
      </div>
    </motion.div>
  );
}
