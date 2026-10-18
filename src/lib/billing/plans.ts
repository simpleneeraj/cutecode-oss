import { Plan } from "@/db/enums";
import { FREE_DAILY_PUBLISH_LIMIT, FREE_MAX_LIVE_SNIPPETS } from "./constants";

type Capabilities = {
  premiumThemes: boolean;
  premiumFonts: boolean;
  maxExportScale: number;
  watermarkRemoval: boolean;
  hdVideo: boolean;
  dailyPublishes: number;
  maxLiveSnippets: number;
  privateShares: boolean;
  fullAnalytics: boolean;
  brandKits: boolean;
  apiMonthlyRenders: number;
  maxSlides: number;
};

export type Capability = keyof Capabilities;

export type NumericCapability = {
  [Key in Capability]: Capabilities[Key] extends number ? Key : never;
}[Capability];

export type PlanPrices = { monthly: number; yearly: number };

export type PlanDefinition = Capabilities & {
  name: string;
  prices: PlanPrices;
  features: string[];
};

export const PLANS: Record<Plan, PlanDefinition> = {
  FREE: {
    name: "Free",
    prices: { monthly: 0, yearly: 0 },
    premiumThemes: false,
    premiumFonts: false,
    maxExportScale: 2,
    watermarkRemoval: false,
    hdVideo: false,
    dailyPublishes: FREE_DAILY_PUBLISH_LIMIT,
    maxLiveSnippets: FREE_MAX_LIVE_SNIPPETS,
    privateShares: false,
    fullAnalytics: false,
    brandKits: false,
    apiMonthlyRenders: 0,
    maxSlides: 3,
    features: [
      "All Classic and Brand themes",
      "PNG, SVG and copy at 1x and 2x",
      "GIF and video export with watermark",
      "Typing animation and reels up to 3 slides",
      `Publish ${FREE_DAILY_PUBLISH_LIMIT} snippets a day, up to ${FREE_MAX_LIVE_SNIPPETS} live`,
    ],
  },
  PRO: {
    name: "Pro",
    prices: { monthly: 5, yearly: 48 },
    premiumThemes: true,
    premiumFonts: true,
    maxExportScale: 3,
    watermarkRemoval: true,
    hdVideo: false,
    dailyPublishes: 30,
    maxLiveSnippets: Infinity,
    privateShares: false,
    fullAnalytics: false,
    brandKits: false,
    apiMonthlyRenders: 0,
    maxSlides: 10,
    features: [
      "Everything in Free",
      "Premium animated themes and fonts",
      "3x image export",
      "Up to 10 slides per reel",
      "No watermark on images or video",
      "Publish 30 snippets a day, unlimited live",
    ],
  },
  PREMIUM: {
    name: "Premium",
    prices: { monthly: 12, yearly: 120 },
    premiumThemes: true,
    premiumFonts: true,
    maxExportScale: 4,
    watermarkRemoval: true,
    hdVideo: true,
    dailyPublishes: 100,
    maxLiveSnippets: Infinity,
    privateShares: true,
    fullAnalytics: true,
    brandKits: true,
    apiMonthlyRenders: 0,
    maxSlides: 25,
    features: [
      "Everything in Pro",
      "4x image export",
      "HD video exports",
      "Up to 25 slides per reel",
      "Passcode and private shares",
      "Per-snippet analytics",
      "Publish 100 snippets a day",
      "Brand kits (coming soon)",
    ],
  },
};

export function can(plan: Plan, capability: Capability): boolean {
  const value = PLANS[plan][capability];
  if (typeof value === "boolean") return value;
  return value > 0;
}

export function limit(plan: Plan, capability: NumericCapability): number {
  return PLANS[plan][capability];
}

export const PLAN_ORDER: Record<Plan, number> = {
  FREE: 0,
  PRO: 1,
  PREMIUM: 2,
};

export function isPlanAtLeast(userPlan: Plan, requiredPlan: Plan): boolean {
  return PLAN_ORDER[userPlan] >= PLAN_ORDER[requiredPlan];
}

export type PlanKey = keyof typeof PLANS;
