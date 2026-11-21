import { z } from "zod";

export const BRAND_BUILD_FEE = 149;

const SPONSOR_TIER_IDS = ["preset", "featured", "title"] as const;

export type SponsorTier = (typeof SPONSOR_TIER_IDS)[number];

type SponsorTierPlan = {
  id: SponsorTier;
  name: string;
  monthlyFee: number;
  perks: readonly string[];
  badge: string;
};

export const SPONSOR_TIERS: readonly SponsorTierPlan[] = [
  {
    id: "preset",
    badge: "/brand/sponsors/badges/preset-mark.png",
    name: "Brand Preset",
    monthlyFee: 49,
    perks: ["Custom preset in the Brands group"],
  },
  {
    id: "featured",
    badge: "/brand/sponsors/badges/featured-mark.png",
    name: "Featured Sponsor",
    monthlyFee: 99,
    perks: ["Custom preset in the Brands group", "Pinned at the top of the picker", "Logo on the homepage and pricing"],
  },
  {
    id: "title",
    badge: "/brand/sponsors/badges/title-mark.png",
    name: "Title Sponsor",
    monthlyFee: 249,
    perks: ["Everything in Featured", "Sponsor card in the export menu", "Sponsor card on shared snippets", "One slot only"],
  },
];

export const BRAND_DURATIONS = [
  { months: 1, discount: 0 },
  { months: 3, discount: 0.1 },
  { months: 12, discount: 0.25 },
] as const;

export type BrandMonths = (typeof BRAND_DURATIONS)[number]["months"];

export function sponsorTier(tier: SponsorTier) {
  return SPONSOR_TIERS.find(({ id }) => id === tier)!;
}

export function sponsorTotal(tier: SponsorTier, months: BrandMonths) {
  const { discount } = BRAND_DURATIONS.find((duration) => duration.months === months)!;
  return BRAND_BUILD_FEE + Math.round(sponsorTier(tier).monthlyFee * months * (1 - discount));
}

export const brandRequestSchema = z.object({
  brandName: z.string().trim().min(1, "Enter your brand name.").max(100),
  website: z.url("Enter a valid URL."),
  email: z.email("Enter a valid email."),
  tier: z.enum(SPONSOR_TIER_IDS),
  months: z.union([z.literal(1), z.literal(3), z.literal(12)]),
  notes: z.string().trim().max(1000).optional(),
});

export type BrandRequest = z.infer<typeof brandRequestSchema>;
