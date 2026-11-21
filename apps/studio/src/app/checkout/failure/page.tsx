import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCardIcon } from "@hugeicons/core-free-icons";
import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function CheckoutFailurePage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="text-muted-foreground">
          <HugeiconsIcon icon={CreditCardIcon} aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle render={<h1 />}>Payment didn&apos;t go through</EmptyTitle>
        <EmptyDescription>No charge was made and nothing changed on your account.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button render={<Link href="/pricing" />}>Try again</Button>
          <Button variant="outline" render={<Link href="/" />}>
            Back to editor
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
