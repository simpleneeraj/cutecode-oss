import { useSetAtom } from "jotai";
import { CrownIcon } from "@hugeicons/core-free-icons";
import { exportSizeAtom } from "@/store/editor/editor";
import { usePremiumAccess } from "@/hooks/use-premium-access";
import { useSubscription } from "@/hooks/use-subscription";
import { PLANS, limit } from "@/lib/billing/plans";
import { Plan } from "@/db/schema";
import SegmentedControl from "../../controls/segmented-control";
import { ExportScale } from "./enums";
import useExportScale from "./use-export-scale";

const PAID_PLANS = [Plan.PRO, Plan.PREMIUM];

function requiredPlanName(scale: ExportScale, maxScale: number) {
  if (Number(scale) <= maxScale) return undefined;
  const plan = PAID_PLANS.find((paidPlan) => Number(scale) <= limit(paidPlan, "maxExportScale"));
  return plan && PLANS[plan].name;
}

function scaleOptions(maxScale: number) {
  return Object.values(ExportScale).map((scale) => {
    const planName = requiredPlanName(scale, maxScale);
    return {
      value: scale,
      label: `${scale}x`,
      icon: planName ? CrownIcon : undefined,
      title: planName && `Requires ${planName}`,
    };
  });
}

export default function ScaleControl() {
  const setExportSize = useSetAtom(exportSizeAtom);
  const exportSize = useExportScale();
  const { checkLimit, withAccess } = usePremiumAccess();
  const { limit: planLimit } = useSubscription();
  const options = scaleOptions(planLimit("maxExportScale"));
  const scale = options.find((option) => Number(option.value) === exportSize)?.value ?? ExportScale.X2;

  const selectScale = (next: ExportScale) => {
    withAccess(checkLimit("maxExportScale", Number(next)), () => setExportSize(Number(next)));
  };

  return <SegmentedControl label="Image scale" options={options} value={scale} onValueChange={selectScale} />;
}
