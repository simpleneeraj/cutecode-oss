import Link from "next/link";
import { Card } from "@cutecode/ui/components/card";
import { Button } from "@cutecode/ui/components/button";
import { CodeSquareIcon } from "@solar-icons/react/bold/code-square";
import { AddSquareIcon } from "@solar-icons/react/linear/add-square";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";

export function DashboardEmptyState() {
  return (
    <Card>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CodeSquareIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No snippets yet</EmptyTitle>
          <EmptyDescription>Publish a snippet from the editor and its analytics will show up here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link href="/" />}>
            <AddSquareIcon className="size-4" aria-hidden="true" />
            Create a snippet
          </Button>
        </EmptyContent>
      </Empty>
    </Card>
  );
}
