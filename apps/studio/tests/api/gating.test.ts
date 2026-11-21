import { describe, it, expect } from "vitest";
import { TRPCError } from "@trpc/server";
import { Plan, ShareVisibility } from "@/db/schema";
import { can, limit, PLANS, type Capability } from "@/lib/billing/plans";
import { requireCapability, requireShareVisibility } from "@/lib/billing/require-capability";
import { callerFor } from "./support/caller";
import { createUser } from "./support/factories";
import {
  FREE_FONT,
  FREE_THEME,
  insertShare,
  PREMIUM_FONT,
  PREMIUM_THEME,
  publishInput,
  readPresentation,
  shareBySlug,
} from "./support/content";

const EXPECTED: Record<Plan, Record<Capability, boolean | number>> = {
  FREE: {
    premiumThemes: false,
    premiumFonts: false,
    maxExportScale: 2,
    watermarkRemoval: false,
    hdVideo: false,
    dailyPublishes: 3,
    maxLiveSnippets: 25,
    privateShares: false,
    fullAnalytics: false,
    brandKits: false,
    apiMonthlyRenders: 0,
    maxSlides: 3,
  },
  PRO: {
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
  },
  PREMIUM: {
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
  },
};

const PLAN_LIST = [Plan.FREE, Plan.PRO, Plan.PREMIUM];

const CAPABILITY_CASES = PLAN_LIST.flatMap((plan) =>
  (Object.keys(EXPECTED[plan]) as Capability[]).map((capability) => [plan, capability, EXPECTED[plan][capability]] as const),
);

describe("plan capabilities", () => {
  it("defines exactly the expected capabilities", () => {
    for (const plan of PLAN_LIST) {
      const defined = Object.keys(PLANS[plan]).filter((key) => !["name", "prices", "features"].includes(key));
      expect(defined.sort()).toEqual(Object.keys(EXPECTED[plan]).sort());
    }
  });

  it.each(CAPABILITY_CASES)("%s %s = %s", (plan, capability, expected) => {
    expect(PLANS[plan][capability]).toBe(expected);
    const allowed = typeof expected === "boolean" ? expected : expected > 0;
    expect(can(plan, capability)).toBe(allowed);
    if (typeof expected === "number") expect(limit(plan, capability as Parameters<typeof limit>[1])).toBe(expected);
  });

  it.each(CAPABILITY_CASES)("requireCapability(%s, %s) matches can()", (plan, capability) => {
    const call = () => requireCapability(plan, capability);
    if (can(plan, capability)) expect(call).not.toThrow();
    else expect(call).toThrow(expect.objectContaining({ code: "FORBIDDEN" }) as unknown as TRPCError);
  });

  it.each(
    PLAN_LIST.flatMap((plan) =>
      Object.values(ShareVisibility).map((visibility) => [plan, visibility] as const),
    ),
  )("requireShareVisibility(%s, %s)", (plan, visibility) => {
    const restricted = visibility === ShareVisibility.PRIVATE || visibility === ShareVisibility.PASSCODE;
    const call = () => requireShareVisibility(plan, visibility);
    if (restricted && plan !== Plan.PREMIUM) expect(call).toThrow(TRPCError);
    else expect(call).not.toThrow();
  });
});

describe("private shares on the server", () => {
  it.each([Plan.FREE, Plan.PRO])("%s cannot publish a private or passcode share", async (plan) => {
    const caller = await callerFor(await createUser(plan));
    await expect(caller.publish.publish(publishInput({ visibility: ShareVisibility.PRIVATE }))).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      caller.publish.publish(publishInput({ visibility: ShareVisibility.PASSCODE, passcode: "482915" })),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it.each([Plan.FREE, Plan.PRO])("%s cannot switch a share to private", async (plan) => {
    const user = await createUser(plan);
    const { link, snippet } = await insertShare(user.id);
    const caller = await callerFor(user);
    await expect(caller.share.update({ id: link.id, data: { visibility: ShareVisibility.PRIVATE } })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    await expect(caller.share.create({ snippetId: snippet.id, visibility: ShareVisibility.PRIVATE })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("Premium can publish a private share", async () => {
    const caller = await callerFor(await createUser(Plan.PREMIUM));
    const { slug } = await caller.publish.publish(publishInput({ visibility: ShareVisibility.PRIVATE }));
    expect((await shareBySlug(slug)).visibility).toBe(ShareVisibility.PRIVATE);
  });
});

type StoredElement = { properties?: { theme?: string }; style?: { fontFamily?: string } };

async function storedElement(slug: string, elementId?: string) {
  const link = await shareBySlug(slug);
  const presentation = await readPresentation(link.presentationId!);
  const elements = presentation!.elements as Record<string, StoredElement>;
  return elementId ? elements[elementId] : Object.values(elements)[0];
}

async function expectStrippedOrRejected(action: () => Promise<{ slug: string }>, elementId?: string) {
  const outcome = await action().then(
    (value) => ({ value }),
    (error: unknown) => ({ error }),
  );
  if ("error" in outcome) {
    expect(outcome.error).toMatchObject({ code: "FORBIDDEN" });
    return;
  }
  const stored = await storedElement(outcome.value.slug, elementId);
  expect(stored.properties?.theme).not.toBe(PREMIUM_THEME);
  expect(stored.style?.fontFamily).not.toBe(PREMIUM_FONT);
}

describe("premium themes and fonts", () => {
  it("Free publish with a premium theme is stripped or rejected", async () => {
    const caller = await callerFor(await createUser(Plan.FREE));
    const input = publishInput({ theme: PREMIUM_THEME });
    await expectStrippedOrRejected(() => caller.publish.publish(input), input.elementId);
  });

  it("Free publish with a premium font is stripped or rejected", async () => {
    const caller = await callerFor(await createUser(Plan.FREE));
    const input = publishInput({ fontFamily: PREMIUM_FONT });
    await expectStrippedOrRejected(() => caller.publish.publish(input), input.elementId);
  });

  it("Free re-publish of an existing snippet cannot sneak in a premium theme", async () => {
    const caller = await callerFor(await createUser(Plan.FREE));
    const first = publishInput();
    await caller.publish.publish(first);
    const second = publishInput({ elementId: first.elementId, theme: PREMIUM_THEME, fontFamily: PREMIUM_FONT });
    await expectStrippedOrRejected(() => caller.publish.publish(second), first.elementId);
  });

  it.each([Plan.PRO, Plan.PREMIUM])("%s keeps premium themes and fonts on publish", async (plan) => {
    const caller = await callerFor(await createUser(plan));
    const input = publishInput({ theme: PREMIUM_THEME, fontFamily: PREMIUM_FONT });
    const { slug } = await caller.publish.publish(input);
    expect(await storedElement(slug, input.elementId)).toMatchObject({
      properties: { theme: PREMIUM_THEME },
      style: { fontFamily: PREMIUM_FONT },
    });
  });

  it("Free keeps free themes and fonts untouched", async () => {
    const caller = await callerFor(await createUser(Plan.FREE));
    const input = publishInput();
    const { slug } = await caller.publish.publish(input);
    expect(await storedElement(slug, input.elementId)).toMatchObject({
      properties: { theme: FREE_THEME },
      style: { fontFamily: FREE_FONT },
    });
  });

  it("Free remix of a premium-themed snippet is stripped or rejected", async () => {
    const author = await createUser(Plan.PRO);
    const { link } = await insertShare(author.id, { theme: PREMIUM_THEME });
    const caller = await callerFor(await createUser(Plan.FREE));
    await expectStrippedOrRejected(() => caller.snippet.remix({ slug: link.slug }));
  });

  it("Pro remix keeps the premium theme", async () => {
    const author = await createUser(Plan.PRO);
    const { link } = await insertShare(author.id, { theme: PREMIUM_THEME });
    const caller = await callerFor(await createUser(Plan.PRO));
    const { slug } = await caller.snippet.remix({ slug: link.slug });
    expect((await storedElement(slug)).properties?.theme).toBe(PREMIUM_THEME);
  });
});

const ANALYTICS_FIELDS = ["views", "upvotes", "comments", "bookmarks"] as const;

describe("analytics fields", () => {
  async function userWithShare(plan: Plan) {
    const user = await createUser(plan);
    await insertShare(user.id);
    return { user, caller: await callerFor(user) };
  }

  it.each([Plan.FREE, Plan.PRO])("dashboard.summary strips per-snippet analytics for %s", async (plan) => {
    const { caller } = await userWithShare(plan);
    const { rows } = await caller.dashboard.summary();
    expect(rows).toHaveLength(1);
    for (const field of ANALYTICS_FIELDS) expect((rows[0] as Record<string, unknown>)[field] ?? null).toBeNull();
  });

  it("dashboard.summary includes per-snippet analytics for PREMIUM", async () => {
    const { caller } = await userWithShare(Plan.PREMIUM);
    const { rows } = await caller.dashboard.summary();
    for (const field of ANALYTICS_FIELDS) expect(typeof (rows[0] as Record<string, unknown>)[field]).toBe("number");
  });

  it.each([Plan.FREE, Plan.PRO])("share.list strips view counts for %s", async (plan) => {
    const { caller } = await userWithShare(plan);
    const links = await caller.share.list({});
    expect(links).toHaveLength(1);
    expect((links[0] as Record<string, unknown>).viewCount ?? null).toBeNull();
  });

  it("share.list includes view counts for PREMIUM", async () => {
    const { caller } = await userWithShare(Plan.PREMIUM);
    const links = await caller.share.list({});
    expect(typeof (links[0] as Record<string, unknown>).viewCount).toBe("number");
  });

  it.each([Plan.FREE, Plan.PRO])("share.analytics is forbidden for %s", async (plan) => {
    const user = await createUser(plan);
    const { link } = await insertShare(user.id);
    const caller = await callerFor(user);
    await expect(caller.share.analytics({ id: link.id })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("share.analytics works for PREMIUM owners", async () => {
    const user = await createUser(Plan.PREMIUM);
    const { link } = await insertShare(user.id);
    const caller = await callerFor(user);
    await expect(caller.share.analytics({ id: link.id })).resolves.toMatchObject({ id: link.id, totalViews: 0 });
  });
});
