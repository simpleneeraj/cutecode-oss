"use client";

import { useEffect } from "react";
import { Link } from "@/components/link";
import { Button } from "@cutecode/ui/components/button";
import { DangerTriangleIcon } from "@solar-icons/react/bold-duotone/danger-triangle";
import { Home2Icon } from "@solar-icons/react/linear/home-2";
import { RefreshIcon } from "@solar-icons/react/linear/refresh";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" className="text-destructive">
            <DangerTriangleIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>An unexpected error interrupted this page. Try again, or head back home.</EmptyDescription>
          {error.digest && <p className="mt-2 font-mono text-muted-foreground text-xs">Error ID: {error.digest}</p>}
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button onClick={() => unstable_retry()}>
              <RefreshIcon aria-hidden="true" />
              Try again
            </Button>
            <Button variant="outline" render={<Link href="/" />}>
              <Home2Icon aria-hidden="true" />
              Go home
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </main>
  );
}
