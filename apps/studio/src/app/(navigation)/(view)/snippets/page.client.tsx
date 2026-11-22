"use client";

import { useState } from "react";
import { useSetAtom } from "jotai";
import { resetEditorAtom } from "@/store/editor/editor";
import { Link } from "@/components/link";
import { AddSquareIcon } from "@solar-icons/react/linear/add-square";
import { CodeSquareIcon } from "@solar-icons/react/linear/code-square";
import { useSnippetList } from "@/hooks/use-snippet";
import { Button } from "@cutecode/ui/components/button";
import { Card } from "@cutecode/ui/components/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";
import { SnippetCard, type Snippet } from "./components/snippet-card";
import { SnippetSkeletonCard } from "./components/snippet-skeleton-card";
import { BrowsePagination } from "../../components/browse-pagination";
import { snippetsStyles } from "./style";

const listing = {
  pageSize: 12,
  skeletonKeys: Array.from({ length: 6 }, (_, i) => `skeleton-${i}`),
};

const styles = snippetsStyles();

function SnippetsEmpty() {
  return (
    <Card>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CodeSquareIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No snippets yet</EmptyTitle>
          <EmptyDescription>Publish from the editor and your snippets will show up here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm" className={styles.emptyAction()} render={<Link href="/" />}>
            Open editor
          </Button>
        </EmptyContent>
      </Empty>
    </Card>
  );
}

function SnippetsGrid({ snippets, isLoading }: { snippets: Snippet[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className={styles.grid()} aria-busy="true">
        {listing.skeletonKeys.map((key) => (
          <SnippetSkeletonCard key={key} />
        ))}
      </div>
    );
  }
  const isEmpty = snippets.length === 0;
  if (isEmpty) {
    return <SnippetsEmpty />;
  }
  return (
    <div className={styles.grid()}>
      {snippets.map((snippet, index) => (
        <SnippetCard key={snippet.id} snippet={snippet} index={index} />
      ))}
    </div>
  );
}

export default function SnippetsPageClient() {
  const [page, setPage] = useState(1);
  const resetEditor = useSetAtom(resetEditorAtom);
  const { data, isLoading } = useSnippetList({ page, limit: listing.pageSize });

  const snippets = data?.snippets ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / listing.pageSize);

  return (
    <div className={styles.root()}>
      <div className={styles.header()}>
        <div className={styles.heading()}>
          <h1 className={styles.title()}>Snippets</h1>
          <p className={styles.subtitle()}>Everything you have published.</p>
        </div>
        <Button className={styles.action()} onClick={resetEditor} render={<Link href="/" />}>
          <AddSquareIcon className={styles.icon()} aria-hidden="true" />
          New snippet
        </Button>
      </div>

      <SnippetsGrid snippets={snippets} isLoading={isLoading} />

      <BrowsePagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
