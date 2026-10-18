"use client";
import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddSquareIcon, Route01Icon } from "@hugeicons/core-free-icons";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={Route01Icon} aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>The page you are looking for doesn&apos;t exist.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link href="/" />}>
            <HugeiconsIcon icon={AddSquareIcon} aria-hidden="true" />
            Create snippet
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
