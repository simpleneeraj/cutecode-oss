import Link from "next/link";
import { Card } from "@cutecode/ui/components/card";
import { Button } from "@cutecode/ui/components/button";
import { CodeSquareIcon } from "@solar-icons/react/linear/code-square";
import { AddSquareIcon } from "@solar-icons/react/linear/add-square";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";
import { dashboardStyles } from "./style";

const styles = dashboardStyles();

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
          <Button className={styles.action()} render={<Link href="/" />}>
            <AddSquareIcon className={styles.icon()} aria-hidden="true" />
            Create a snippet
          </Button>
        </EmptyContent>
      </Empty>
    </Card>
  );
}
