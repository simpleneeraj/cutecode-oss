"use client";

import { Link } from "@/components/link";
import { Button } from "@cutecode/ui/components/button";
import { FileCorruptedIcon } from "@solar-icons/react/bold-duotone/file-corrupted";
import { AddSquareIcon } from "@solar-icons/react/linear/add-square";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";

export default function SnippetNotFound() {
  return (
    <div className="layout-fill">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileCorruptedIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle render={<h1 />}>Snippet not found</EmptyTitle>
          <EmptyDescription>It may have been deleted, expired, or the link is incorrect.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" render={<Link href="/" />}>
            <AddSquareIcon aria-hidden="true" />
            Create snippet
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
