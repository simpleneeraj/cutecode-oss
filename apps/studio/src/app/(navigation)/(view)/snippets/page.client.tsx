"use client";

import { useState } from "react";
import { useSetAtom } from "jotai";
import { resetEditorAtom } from "@/store/editor/editor";
import { Link } from "@/components/link";
import { AddSquareIcon } from "@solar-icons/react/linear/add-square";
import { CodeSquareIcon } from "@solar-icons/react/linear/code-square";
import { useSnippetList } from "@/hooks/use-snippet";
import { Button } from "@cutecode/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";
import { SnippetCard, type Snippet } from "./components/snippet-card";
import { SnippetSkeletonCard } from "./components/snippet-skeleton-card";
import { BrowsePagination } from "../../components/browse-pagination";

const PAGE_SIZE = 12;
const GRID = "grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3";
const SKELETON_KEYS = Array.from({ length: 6 }, (_, i) => `skeleton-${i}`);

function SnippetsEmpty() {
  return (
    <Empty className="py-24">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CodeSquareIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No snippets yet</EmptyTitle>
        <EmptyDescription>Publish from the editor and your snippets will show up here.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" render={<Link href="/" />}>
          Open editor
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function SnippetsGrid({ snippets, isLoading }: { snippets: Snippet[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className={GRID} aria-busy="true">
        {SKELETON_KEYS.map((key) => (
          <SnippetSkeletonCard key={key} />
        ))}
      </div>
    );
  }
  if (snippets.length === 0) return <SnippetsEmpty />;
  return (
    <div className={GRID}>
      {snippets.map((snippet, index) => (
        <SnippetCard key={snippet.id} snippet={snippet} index={index} />
      ))}
    </div>
  );
}

export default function SnippetsPageClient() {
  const [page, setPage] = useState(1);
  const resetEditor = useSetAtom(resetEditorAtom);
  const { data, isLoading } = useSnippetList({ page, limit: PAGE_SIZE });

  const snippets = data?.snippets ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-10">
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Snippets</h1>
          <p className="text-sm text-muted-foreground">Everything you have published.</p>
        </div>
        <Button onClick={resetEditor} render={<Link href="/" />}>
          <AddSquareIcon aria-hidden="true" />
          New snippet
        </Button>
      </div>

      <SnippetsGrid snippets={snippets} isLoading={isLoading} />

      <BrowsePagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
