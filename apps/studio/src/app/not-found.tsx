import type { Metadata } from "next";
import { Link } from "@/components/link";
import { Button } from "@cutecode/ui/components/button";
import { RouteIcon } from "@solar-icons/react/bold-duotone/route";
import { AddSquareIcon } from "@solar-icons/react/linear/add-square";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RouteIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle render={<h1 />}>Page not found</EmptyTitle>
          <EmptyDescription>The page you are looking for doesn&apos;t exist.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link href="/" />}>
            <AddSquareIcon aria-hidden="true" />
            Create snippet
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
