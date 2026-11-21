import type { SponsorTier } from "@/lib/brand-presets";

export type Sponsor = {
  themeId: string;
  name: string;
  url: string;
  logo: string;
  tier: SponsorTier;
  until: string;
};

export const SPONSORS: Sponsor[] = [];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function activeSponsors(date = today()) {
  return SPONSORS.filter((sponsor) => sponsor.until >= date);
}

export function featuredSponsors() {
  return activeSponsors().filter((sponsor) => sponsor.tier !== "preset");
}

export function featuredThemeIds() {
  return featuredSponsors().map((sponsor) => sponsor.themeId);
}

export function titleSponsor() {
  return activeSponsors().find((sponsor) => sponsor.tier === "title") ?? null;
}

export function sponsorForTheme(themeId: string | undefined) {
  return activeSponsors().find((sponsor) => sponsor.themeId === themeId) ?? null;
}
