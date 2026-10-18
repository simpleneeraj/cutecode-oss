import { useRouter } from "next/navigation";
import { toast } from "@/components/toast";
import { ShareVisibility } from "@/db/schema";
import { useShareMutations } from "@/hooks/use-share";
import { useSnippetMutations } from "@/hooks/use-snippet";
import type { OwnedSnippet } from "./use-snippet-preview";

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useOwnerActions(snippet: OwnedSnippet) {
  const router = useRouter();
  const { updateShare } = useShareMutations();
  const { togglePin, deleteSnippet } = useSnippetMutations();
  const isPublic = snippet.visibility === ShareVisibility.PUBLIC;

  const toggleVisibility = async () => {
    const visibility = isPublic ? ShareVisibility.UNLISTED : ShareVisibility.PUBLIC;
    try {
      await updateShare(snippet.shareLinkId, { visibility });
      toast.success(isPublic ? "Snippet is now unlisted." : "Snippet is now public.");
    } catch (error) {
      toast.error(errorMessage(error, "Could not change visibility."));
    }
  };

  const togglePinned = async () => {
    try {
      const { pinned } = await togglePin(snippet.id);
      toast.success(pinned ? "Pinned to your profile." : "Unpinned from your profile.");
    } catch (error) {
      toast.error(errorMessage(error, "Could not update pin."));
    }
  };

  const removeSnippet = async () => {
    try {
      await deleteSnippet(snippet.id);
      toast.success("Snippet deleted.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete snippet."));
    }
  };

  return { isPublic, toggleVisibility, togglePinned, removeSnippet };
}
