import { TRPCError } from "@trpc/server";
import { themes } from "@/components/presets/themes";
import fonts from "@/fonts/editor/fonts";
import { BadgeVariant } from "@/typings/editor";
import type { Plan } from "@/db/enums";
import { can } from "@/lib/billing/plans";

const FREE_THEME = "mono";
const FREE_FONT = "DM Mono";

const PREMIUM_THEMES = new Set(
  Object.values(themes)
    .filter((theme) => theme.tags?.includes(BadgeVariant.PREMIUM))
    .map((theme) => theme.id),
);

const PREMIUM_FONTS = new Set(fonts.filter((font) => font.tags?.includes(BadgeVariant.PREMIUM)).map((font) => font.name));

type ElementLike = {
  properties?: { theme?: unknown } & Record<string, unknown>;
  style?: { fontFamily?: unknown } & Record<string, unknown>;
} & Record<string, unknown>;

function asElement(value: unknown): ElementLike | null {
  return value && typeof value === "object" ? (value as ElementLike) : null;
}

function usesPremiumTheme(element: ElementLike) {
  return typeof element.properties?.theme === "string" && PREMIUM_THEMES.has(element.properties.theme);
}

function usesPremiumFont(element: ElementLike) {
  return typeof element.style?.fontFamily === "string" && PREMIUM_FONTS.has(element.style.fontFamily);
}

export function findLockedAssets(plan: Plan, elements: Record<string, unknown>) {
  const values = Object.values(elements).map(asElement).filter((element) => element !== null);
  return {
    theme: !can(plan, "premiumThemes") && values.some(usesPremiumTheme),
    font: !can(plan, "premiumFonts") && values.some(usesPremiumFont),
  };
}

export function assertPremiumAssetsAllowed(plan: Plan, elements: Record<string, unknown>) {
  const locked = findLockedAssets(plan, elements);
  if (!locked.theme && !locked.font) return;
  const what = locked.theme && locked.font ? "premium themes and fonts" : locked.theme ? "premium themes" : "premium fonts";
  throw new TRPCError({ code: "FORBIDDEN", message: `Your plan does not include ${what}. Upgrade to publish this snippet.` });
}

function stripElement(plan: Plan, element: ElementLike): ElementLike {
  const stripTheme = !can(plan, "premiumThemes") && usesPremiumTheme(element);
  const stripFont = !can(plan, "premiumFonts") && usesPremiumFont(element);
  return {
    ...element,
    ...(stripTheme && { properties: { ...element.properties, theme: FREE_THEME } }),
    ...(stripFont && { style: { ...element.style, fontFamily: FREE_FONT } }),
  };
}

export function stripPremiumAssets(plan: Plan, elements: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(elements).map(([id, value]) => {
      const element = asElement(value);
      return [id, element ? stripElement(plan, element) : value];
    }),
  );
}
