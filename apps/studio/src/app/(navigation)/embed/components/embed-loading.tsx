import View from "@/components/view";
import { Skeleton } from "@/components/ui/skeleton";

export function EmbedLoading() {
  return (
    <View className="layout-fill items-center justify-center gap-3 p-4" aria-busy="true">
      <Skeleton className="aspect-video w-full max-w-xl rounded-2xl" />
      <Skeleton className="h-4 w-40" />
    </View>
  );
}
