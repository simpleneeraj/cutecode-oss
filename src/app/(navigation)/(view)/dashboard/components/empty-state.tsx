import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export function DashboardEmptyState() {
  return (
    <Card>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon icon="solar:code-square-bold" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No snippets yet</EmptyTitle>
          <EmptyDescription>Publish a snippet from the editor and its analytics will show up here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link href="/" />}>
            <Icon icon="solar:add-square-linear" className="size-4" aria-hidden="true" />
            Create a snippet
          </Button>
        </EmptyContent>
      </Empty>
    </Card>
  );
}
