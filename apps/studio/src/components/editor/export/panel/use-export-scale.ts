import { useAtomValue } from "jotai";
import { exportSizeAtom } from "@/store/editor/editor";
import { useSubscription } from "@/hooks/use-subscription";

export default function useExportScale() {
  const exportSize = useAtomValue(exportSizeAtom);
  const { limit } = useSubscription();
  return Math.min(exportSize, limit("maxExportScale"));
}
