"use client";

import { Link } from "@/components/link";
import { motion } from "motion/react";
import { ShareVisibility } from "@/db/schema";
import { SnippetPreview } from "../../../components/snippet-preview";

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

function visibilityLabel(visibility: string) {
  switch (visibility) {
    case ShareVisibility.PUBLIC:
      return "Public";
    case ShareVisibility.UNLISTED:
      return "Unlisted";
    case ShareVisibility.PASSCODE:
      return "Protected";
    default:
      return "Private";
  }
}

export type Snippet = {
  id: string;
  title: string | null;
  isPublic: boolean;
  createdAt: Date | string;
  presentation: { id: string; name: string };
  shareLinks: { slug: string; visibility: string }[];
};

export function SnippetCard({ snippet, index }: { snippet: Snippet; index: number }) {
  const slug = snippet.shareLinks[0]?.slug;
  const visibility =
    snippet.shareLinks[0]?.visibility ?? (snippet.isPublic ? ShareVisibility.PUBLIC : ShareVisibility.PRIVATE);
  const title = snippet.title || snippet.presentation.name || "Untitled snippet";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link href={`/preview/${slug}`} data-slot="snippet-card" className="flex flex-col gap-3">
        <SnippetPreview language={snippet.presentation.name} />
        <div className="flex min-w-0 flex-col gap-0.5 px-1">
          <span className="truncate text-sm font-medium text-foreground">{title}</span>
          <span className="truncate text-xs text-muted-foreground">
            {visibilityLabel(visibility)} · {formatDate(snippet.createdAt)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
