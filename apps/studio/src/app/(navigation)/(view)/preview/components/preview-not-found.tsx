"use client";

import { Link } from "@/components/link";
import { Button } from "@cutecode/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddSquareIcon, FileNotFoundIcon } from "@hugeicons/core-free-icons";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";

export default function SnippetNotFound() {
  return (
    <div className="layout-fill">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={FileNotFoundIcon} aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle render={<h1 />}>Snippet not found</EmptyTitle>
          <EmptyDescription>It may have been deleted, expired, or the link is incorrect.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" render={<Link href="/" />}>
            <HugeiconsIcon icon={AddSquareIcon} aria-hidden="true" />
            Create snippet
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
