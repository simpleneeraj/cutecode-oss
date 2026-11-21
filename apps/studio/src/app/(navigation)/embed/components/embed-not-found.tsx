import { HugeiconsIcon } from "@hugeicons/react";
import { FileNotFoundIcon, LinkSquare02Icon } from "@hugeicons/core-free-icons";
import siteConfig from "@/constants/site-config";
import { Button } from "@cutecode/ui/components/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@cutecode/ui/components/empty";

export function EmbedNotFound() {
  return (
    <Empty className="gap-4 p-4 md:py-4">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={FileNotFoundIcon} aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>Snippet not found</EmptyTitle>
        <EmptyDescription>It may have been deleted or the link is incorrect.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="xs" variant="ghost" render={<a href="/" target="_blank" rel="noopener noreferrer" />}>
          <HugeiconsIcon icon={LinkSquare02Icon} aria-hidden="true" />
          Open {siteConfig.name}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
