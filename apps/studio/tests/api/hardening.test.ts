import { describe, it, expect, afterEach, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { db } from "@/db";
import { Plan, presentations, shareLinks, type DbUser } from "@/db/schema";
import { POST as authPost } from "@/app/api/auth/[...all]/route";
import { GET as trpcGet } from "@/app/api/trpc/[trpc]/route";
import { generateMetadata } from "@/app/(navigation)/(view)/preview/[slug]/page";
import { callerFor } from "./support/caller";
import { createUser } from "./support/factories";
import { element, insertShare, publishInput, readPresentation, shareBySlug } from "./support/content";
import { authRequest, sessionCookie } from "./support/http";
import { BASE_URL } from "./support/env";

vi.mock("@/app/(navigation)/(view)/preview/[slug]/page.client", () => ({ default: () => null }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("checkout body", () => {
  function stubDodo() {
    const bodies: string[] = [];
    const realFetch = globalThis.fetch;
    vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input instanceof Request ? input.url : String(input);
      if (!url.includes("dodopayments")) return realFetch(input, init);
      bodies.push(String(init?.body ?? ""));
      const sessionId = `cks_${randomUUID()}`;
      return Response.json({ session_id: sessionId, checkout_url: `https://checkout.test/${sessionId}` });
    });
    return bodies;
  }

  async function checkout(user: DbUser, path: string, body: object) {
    return authPost(authRequest(path, { body, cookie: await sessionCookie(user.id) }) as NextRequest);
  }

  it.each([
    ["a trial override", { slug: "premium-monthly", subscription_data: { trial_period_days: 3650 } }],
    ["a product cart", { slug: "premium-monthly", product_cart: [{ product_id: "pdt_cheap", quantity: 1 }] }],
    ["a discount", { slug: "premium-monthly", discount_code: "FREE100" }],
    ["a customer override", { slug: "premium-monthly", customer: { email: "victim@test.app" } }],
    ["no slug", { product_cart: [{ product_id: "pdt_cheap", quantity: 1 }] }],
    ["an unknown slug", { slug: "enterprise" }],
  ])("rejects %s", async (_name, body) => {
    const bodies = stubDodo();
    const response = await checkout(await createUser(), "/dodopayments/checkout-session", body);
    expect(response.status).toBe(400);
    expect(bodies).toHaveLength(0);
  });

  it("disables the legacy checkout endpoint", async () => {
    const bodies = stubDodo();
    const response = await checkout(await createUser(), "/dodopayments/checkout", { slug: "premium-monthly" });
    expect(response.status).toBe(404);
    expect(bodies).toHaveLength(0);
  });

  it("builds the payload from the slug only", async () => {
    const bodies = stubDodo();
    const user = await createUser();
    const response = await checkout(user, "/dodopayments/checkout-session", { slug: "premium-monthly" });
    expect(response.status).toBe(200);
    expect(bodies).toHaveLength(1);
    const sent = JSON.parse(bodies[0]);
    expect(sent.product_cart).toEqual([{ product_id: "pdt_test_premium_monthly", quantity: 1 }]);
    expect(sent.customer).toMatchObject({ email: user.email });
    expect(sent).not.toHaveProperty("subscription_data");
    expect(sent).not.toHaveProperty("discount_code");
  });
});

describe("security headers", () => {
  type HeaderRule = { source: string; headers: { key: string; value: string }[] };

  async function headersFor(pathname: string) {
    const config = createRequire(import.meta.url)("../../next.config.js") as { headers: () => Promise<HeaderRule[]> };
    const resolved = new Map<string, string>();
    for (const rule of await config.headers()) {
      if (!getPathMatch(rule.source)(pathname)) continue;
      for (const { key, value } of rule.headers) resolved.set(key.toLowerCase(), value);
    }
    return resolved;
  }

  it.each(["/", "/dashboard", "/account/sign-in", "/preview/abc", "/api/trpc/user.profile"])("forbids framing %s", async (pathname) => {
    const headers = await headersFor(pathname);
    expect(headers.get("x-frame-options")).toBe("DENY");
    expect(headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
  });

  it("keeps the embed route framable", async () => {
    const headers = await headersFor("/embed/abc123");
    expect(headers.has("x-frame-options")).toBe(false);
    expect(headers.get("content-security-policy")).toContain("frame-ancestors *");
  });

  it.each(["/", "/embed/abc123"])("sets the baseline headers on %s", async (pathname) => {
    const headers = await headersFor(pathname);
    expect(headers.get("strict-transport-security")).toContain("max-age=");
    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("permissions-policy")).toContain("camera=()");
    const csp = headers.get("content-security-policy") ?? "";
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain("'unsafe-eval'");
  });
});

describe("share expiry and view limits", () => {
  const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

  async function expire(linkId: string) {
    await db.update(shareLinks).set({ expiresAt: new Date(Date.now() - 60_000) }).where(eq(shareLinks.id, linkId));
  }

  it("hides an expired link from preview, metadata and remix", async () => {
    const owner = await createUser();
    const { link } = await insertShare(owner.id, { title: "Expired secret" });
    await expire(link.id);
    const visitor = await callerFor(await createUser());
    await expect((await callerFor(null)).share.preview({ slug: link.slug })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(visitor.share.preview({ slug: link.slug })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(visitor.snippet.remix({ slug: link.slug })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(JSON.stringify(await generateMetadata(params(link.slug)))).not.toContain("Expired secret");
  });

  it("still shows an expired link to its owner", async () => {
    const owner = await createUser();
    const { link } = await insertShare(owner.id);
    await expire(link.id);
    await expect((await callerFor(owner)).share.preview({ slug: link.slug })).resolves.toMatchObject({ shareLink: { id: link.id } });
  });

  it("stops serving new viewers once max views is reached", async () => {
    const owner = await createUser();
    const { link } = await insertShare(owner.id);
    await db.update(shareLinks).set({ maxViews: 2 }).where(eq(shareLinks.id, link.id));
    const first = await callerFor(null);
    await first.share.preview({ slug: link.slug });
    await (await callerFor(null)).share.preview({ slug: link.slug });
    await expect((await callerFor(null)).share.preview({ slug: link.slug })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(first.share.preview({ slug: link.slug })).resolves.toBeTruthy();
    expect((await shareBySlug(link.slug)).viewCount).toBe(2);
    expect(JSON.stringify(await generateMetadata(params(link.slug)))).not.toContain("Seeded snippet");
  });
});

describe("stored style sanitizing", () => {
  function withStyle(style: Record<string, unknown>, header?: Record<string, unknown>) {
    const input = publishInput();
    const base = input.elements[input.elementId];
    return { ...input, elements: { [input.elementId]: { ...base, style: { ...base.style, ...style }, ...(header && { header: { style: header } }) } } };
  }

  it.each([
    ["url()", { background: "url(https://tracker.test/pixel.png)" }],
    ["url() inside a gradient", { background: "linear-gradient(red, blue), url(https://tracker.test/p)" }],
    ["image-set()", { background: "image-set('https://tracker.test/p.png' 1x)" }],
    ["@import", { fontFamily: "@import 'https://tracker.test/x.css'" }],
    ["escaped url", { background: "u\\72l(https://tracker.test/p)" }],
    ["url() in another style value", { padding: "url(https://tracker.test/p)" }],
  ])("rejects %s in element styles", async (_name, style) => {
    const caller = await callerFor(await createUser(Plan.PREMIUM));
    await expect(caller.publish.publish(withStyle(style))).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects a url() in a header background", async () => {
    const caller = await callerFor(await createUser(Plan.PREMIUM));
    await expect(caller.publish.publish(withStyle({}, { background: "url(https://tracker.test/p)" }))).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects a url() synced into a presentation", async () => {
    const user = await createUser(Plan.PREMIUM);
    const { presentation } = await insertShare(user.id);
    const caller = await callerFor(user);
    const elements = { el: { ...element(), style: { background: "url(https://tracker.test/p)" } } };
    await expect(caller.presentation.sync({ id: presentation.id, data: { elements } })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.presentation.create({ elements })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it.each(["rgba(0, 0, 0, 0.5)", "#1e1e2e", "transparent", "linear-gradient(140deg, #ff0080, rgba(0, 0, 0, 0.4))"])("accepts editor background %s", async (background) => {
    const caller = await callerFor(await createUser(Plan.PREMIUM));
    await expect(caller.publish.publish(withStyle({ background }))).resolves.toMatchObject({ slug: expect.any(String) });
  });
});

describe("previews return only the published slide", () => {
  function twoSlideInput() {
    const published = `el_${randomUUID()}`;
    const draft = `el_${randomUUID()}`;
    return {
      ...publishInput(),
      elementId: published,
      elements: { [published]: element({ code: "published()" }), [draft]: element({ code: "secret_draft()" }) },
      slides: { s1: { id: "s1", name: "Published" }, s2: { id: "s2", name: "Draft" } },
      slideElements: { s1: [published], s2: [draft] },
    };
  }

  it("stores and serves only the published slide", async () => {
    const caller = await callerFor(await createUser(Plan.PREMIUM));
    const input = twoSlideInput();
    const { slug } = await caller.publish.publish(input);
    const link = await shareBySlug(slug);
    const stored = await readPresentation(link.presentationId!);
    expect(Object.keys(stored?.elements as object)).toEqual([input.elementId]);
    const preview = await (await callerFor(null)).share.preview({ slug });
    expect(JSON.stringify(preview)).not.toContain("secret_draft");
    expect(preview.snippet.presentation).toMatchObject({ slideElements: { s1: [input.elementId] } });
    expect(Object.keys(preview.snippet.presentation.slides)).toEqual(["s1"]);
  });

  it("filters legacy presentations on read in preview, explore and remix", async () => {
    const owner = await createUser();
    const { link, presentation, snippet } = await insertShare(owner.id);
    const draftId = `el_${randomUUID()}`;
    await db
      .update(presentations)
      .set({
        elements: { ...(presentation.elements as object), [draftId]: element({ code: "secret_draft()" }) },
        slideElements: { s1: [snippet.elementId], s2: [draftId] },
        slides: { s1: { id: "s1" }, s2: { id: "s2" } },
      })
      .where(eq(presentations.id, presentation.id));

    const anonymous = await callerFor(null);
    expect(JSON.stringify(await anonymous.share.preview({ slug: link.slug }))).not.toContain("secret_draft");
    expect(JSON.stringify(await anonymous.snippet.explore({}))).not.toContain("secret_draft");

    const { slug } = await (await callerFor(await createUser())).snippet.remix({ slug: link.slug });
    const remixed = await readPresentation((await shareBySlug(slug)).presentationId!);
    expect(JSON.stringify(remixed)).not.toContain("secret_draft");
  });
});

describe("internal error masking", () => {
  async function failingProfile() {
    const spy = vi.spyOn(db.query.users, "findFirst").mockRejectedValue(new Error('select "email" from "users" where id = $1'));
    const input = encodeURIComponent(JSON.stringify({ userId: "someone" }));
    const response = await trpcGet(new NextRequest(`${BASE_URL}/api/trpc/user.profile?input=${input}`, { headers: { "x-forwarded-for": "10.9.9.9" } }));
    spy.mockRestore();
    return { status: response.status, body: await response.text() };
  }

  it("hides internal error text in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { status, body } = await failingProfile();
    expect(logged).toHaveBeenCalled();
    logged.mockRestore();
    expect(status).toBe(500);
    expect(body).toContain("Internal server error");
    expect(body).not.toContain("select");
    expect(body).not.toContain("users");
  });

  it("keeps client errors readable", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const input = encodeURIComponent(JSON.stringify({ userId: "missing-user" }));
    const response = await trpcGet(new NextRequest(`${BASE_URL}/api/trpc/user.profile?input=${input}`));
    expect(response.status).toBe(404);
    expect(await response.text()).toContain("User not found");
  });
});
