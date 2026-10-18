import { Skeleton } from "@/components/ui/skeleton";

export function PreviewLoading() {
  return (
    <div
      className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10"
      aria-busy="true"
      aria-label="Loading snippet"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-7 w-36 rounded-lg" />
        <Skeleton className="h-7 w-48 rounded-lg" />
      </div>
    </div>
  );
}
