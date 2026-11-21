"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SnippetSkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex flex-col gap-1.5 px-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
