import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { Plan, shareLinks, ShareVisibility } from "@/db/schema";
import sitemap from "@/app/sitemap";
import { generateMetadata } from "@/app/(navigation)/(view)/preview/[slug]/page";
import SnippetOgImage from "@/app/(navigation)/(view)/preview/[slug]/opengraph-image";
import { metadata as embedMetadata } from "@/app/(navigation)/embed/[slug]/page";
import { callerFor, randomIp } from "./support/caller";
import { createUser } from "./support/factories";
import { insertShare, PASSCODE, publishInput } from "./support/content";

vi.mock("@/app/(navigation)/(view)/preview/[slug]/page.client", () => ({ default: () => null }));
vi.mock("@/app/(navigation)/embed/[slug]/page.client", () => ({ default: () => null }));
vi.mock("next/og", () => ({
  ImageResponse: class {
    constructor(readonly element: unknown) {}
  },
}));

const SECRET = { title: "Top secret title", description: "Top secret description", tags: ["secret-tag"] };

async function denied(promise: Promise<unknown>) {
  const error = await promise.then(
    () => null,
    (reason: unknown) => reason,
  );
  expect(error).toMatchObject({ code: expect.stringMatching(/^(NOT_FOUND|FORBIDDEN)$/) });
}

async function seed(visibility: ShareVisibility) {
  const owner = await createUser(Plan.PREMIUM);
  const passcodeHash = visibility === ShareVisibility.PASSCODE ? await bcrypt.hash(PASSCODE, 4) : null;
  const seeded = await insertShare(owner.id, { visibility, passcodeHash, ...SECRET });
  return { owner, ...seeded };
}

type PreviewInput = { slug: string; passcode?: string };

function previewInput(slug: string, passcode?: string, clientIp?: string): PreviewInput {
  const input = { slug, passcode, ip: clientIp };
  return input;
}

async function preview(slug: string, { user = null, passcode, ip, clientIp }: { user?: Awaited<ReturnType<typeof createUser>> | null; passcode?: string; ip?: string; clientIp?: string } = {}) {
  const caller = await callerFor(user, ip);
  return caller.share.preview(previewInput(slug, passcode, clientIp));
}

function expectNoPasscodeHash(value: unknown, hash?: string | null) {
  const json = JSON.stringify(value);
  expect(json).not.toContain("passcodeHash");
  if (hash) expect(json).not.toContain(hash);
}

describe("share.preview: public", () => {
  it("serves a public snippet to anonymous viewers", async () => {
    const { link } = await seed(ShareVisibility.PUBLIC);
    await expect(preview(link.slug)).resolves.toMatchObject({ snippet: { title: SECRET.title } });
  });

  it("never returns a stale passcode hash on a link that went back to public", async () => {
    const { link } = await seed(ShareVisibility.PUBLIC);
    const hash = await bcrypt.hash(PASSCODE, 4);
    await db.update(shareLinks).set({ passcodeHash: hash }).where(eq(shareLinks.id, link.id));
    expectNoPasscodeHash(await preview(link.slug), hash);
  });
});

describe("share.preview: private", () => {
  it("hides a private snippet from anonymous viewers", async () => {
    const { link } = await seed(ShareVisibility.PRIVATE);
    await denied(preview(link.slug));
  });

  it("hides a private snippet from other signed-in users", async () => {
    const { link } = await seed(ShareVisibility.PRIVATE);
    await denied(preview(link.slug, { user: await createUser(Plan.PREMIUM) }));
  });

  it("serves a private snippet to its owner", async () => {
    const { link, owner } = await seed(ShareVisibility.PRIVATE);
    await expect(preview(link.slug, { user: owner })).resolves.toMatchObject({ snippet: { title: SECRET.title } });
  });

  it("refuses to remix a private snippet", async () => {
    const { link } = await seed(ShareVisibility.PRIVATE);
    const caller = await callerFor(await createUser(Plan.PREMIUM));
    await denied(caller.snippet.remix({ slug: link.slug }));
  });
});

describe("share.preview: passcode", () => {
  it("requires a passcode from anonymous viewers", async () => {
    const { link } = await seed(ShareVisibility.PASSCODE);
    await denied(preview(link.slug));
  });

  it("rejects a wrong passcode", async () => {
    const { link } = await seed(ShareVisibility.PASSCODE);
    await denied(preview(link.slug, { passcode: "000000" }));
  });

  it("accepts the right passcode without returning the hash", async () => {
    const { link } = await seed(ShareVisibility.PASSCODE);
    const result = await preview(link.slug, { passcode: PASSCODE });
    expect(result).toMatchObject({ snippet: { title: SECRET.title } });
    expectNoPasscodeHash(result, link.passcodeHash);
  });

  it("lets the owner in without a passcode and still hides the hash", async () => {
    const { link, owner } = await seed(ShareVisibility.PASSCODE);
    const result = await preview(link.slug, { user: owner });
    expectNoPasscodeHash(result, link.passcodeHash);
  });

  it("does not open a passcode link that has no hash", async () => {
    const { link } = await seed(ShareVisibility.PASSCODE);
    await db.update(shareLinks).set({ passcodeHash: null }).where(eq(shareLinks.id, link.id));
    await denied(preview(link.slug));
  });

  it("refuses to remix a passcode snippet", async () => {
    const { link } = await seed(ShareVisibility.PASSCODE);
    const caller = await callerFor(await createUser(Plan.PREMIUM));
    await denied(caller.snippet.remix({ slug: link.slug }));
  });

  it("rate-limits guesses by server IP and share, ignoring the client-supplied ip", async () => {
    const { link } = await seed(ShareVisibility.PASSCODE);
    const ip = randomIp();
    const codes: string[] = [];
    for (let attempt = 0; attempt < 30; attempt++) {
      const error = await preview(link.slug, { ip, clientIp: randomIp(), passcode: String(100000 + attempt) }).then(
        () => "OK",
        (reason: { code?: string }) => reason.code ?? "UNKNOWN",
      );
      codes.push(error);
    }
    expect(codes).toContain("TOO_MANY_REQUESTS");
    await expect(preview(link.slug, { ip, clientIp: randomIp(), passcode: PASSCODE })).rejects.toMatchObject({
      code: "TOO_MANY_REQUESTS",
    });
    await expect(preview(link.slug, { ip: randomIp(), passcode: PASSCODE })).resolves.toMatchObject({
      snippet: { title: SECRET.title },
    });
  });

  it("keeps the passcode limit per share", async () => {
    const first = await seed(ShareVisibility.PASSCODE);
    const second = await seed(ShareVisibility.PASSCODE);
    const ip = randomIp();
    for (let attempt = 0; attempt < 30; attempt++) {
      await preview(first.link.slug, { ip, passcode: String(200000 + attempt) }).catch(() => undefined);
    }
    await expect(preview(second.link.slug, { ip, passcode: PASSCODE })).resolves.toMatchObject({
      snippet: { title: SECRET.title },
    });
  });
});

describe("passcodes are exactly 6 digits", () => {
  const INVALID = ["1234", "12345", "1234567", "abcdef", "12 456", "12345a"];

  it.each(INVALID)("publish.publish rejects %j", async (passcode) => {
    const caller = await callerFor(await createUser(Plan.PREMIUM));
    await expect(caller.publish.publish(publishInput({ visibility: ShareVisibility.PASSCODE, passcode }))).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it.each(INVALID)("share.create rejects %j", async (passcode) => {
    const owner = await createUser(Plan.PREMIUM);
    const { snippet } = await insertShare(owner.id);
    const caller = await callerFor(owner);
    await expect(caller.share.create({ snippetId: snippet.id, visibility: ShareVisibility.PASSCODE, passcode })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it.each(INVALID)("share.update rejects %j", async (passcode) => {
    const owner = await createUser(Plan.PREMIUM);
    const { link } = await insertShare(owner.id);
    const caller = await callerFor(owner);
    await expect(caller.share.update({ id: link.id, data: { visibility: ShareVisibility.PASSCODE, passcode } })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("share.update refuses PASSCODE visibility without a passcode on a link that has none", async () => {
    const owner = await createUser(Plan.PREMIUM);
    const { link } = await insertShare(owner.id);
    const caller = await callerFor(owner);
    const outcome = await caller.share.update({ id: link.id, data: { visibility: ShareVisibility.PASSCODE } }).then(
      () => "updated",
      (reason: { code?: string }) => reason.code,
    );
    if (outcome === "updated") await denied(preview(link.slug));
    else expect(outcome).toBe("BAD_REQUEST");
  });

  it("publish.publish accepts a 6-digit passcode and the share opens with it", async () => {
    const caller = await callerFor(await createUser(Plan.PREMIUM));
    const { slug } = await caller.publish.publish(publishInput({ visibility: ShareVisibility.PASSCODE, passcode: PASSCODE }));
    await denied(preview(slug, { passcode: "999999" }));
    await expect(preview(slug, { passcode: PASSCODE })).resolves.toBeTruthy();
  });
});

describe("listing and crawlers", () => {
  it("explore only lists public snippets", async () => {
    await seed(ShareVisibility.PRIVATE);
    await seed(ShareVisibility.PASSCODE);
    const visible = await seed(ShareVisibility.PUBLIC);
    const caller = await callerFor(null);
    const { snippets } = await caller.snippet.explore({});
    expect(snippets.map((snippet) => snippet.id)).toEqual([visible.snippet.id]);
  });

  it("sitemap lists public shares only and never their private siblings", async () => {
    const hidden = await Promise.all([
      seed(ShareVisibility.PRIVATE),
      seed(ShareVisibility.PASSCODE),
      seed(ShareVisibility.UNLISTED),
    ]);
    const visible = await seed(ShareVisibility.PUBLIC);
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls.some((url) => url.endsWith(`/preview/${visible.link.slug}`))).toBe(true);
    for (const { link, owner } of hidden) {
      expect(urls.some((url) => url.endsWith(`/preview/${link.slug}`))).toBe(false);
      expect(urls.some((url) => url.endsWith(`/u/${owner.id}`))).toBe(false);
    }
  });

  it("embed pages are never indexed", () => {
    expect(embedMetadata.robots).toMatchObject({ index: false, follow: false });
  });
});

describe("metadata loaders", () => {
  const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

  function expectNoSecrets(value: unknown) {
    const json = JSON.stringify(value);
    expect(json).not.toContain(SECRET.title);
    expect(json).not.toContain(SECRET.description);
    expect(json).not.toContain(SECRET.tags[0]);
  }

  it("public preview metadata carries the title and is indexable", async () => {
    const { link } = await seed(ShareVisibility.PUBLIC);
    const meta = await generateMetadata(params(link.slug));
    expect(JSON.stringify(meta)).toContain(SECRET.title);
    expect(meta.robots).toMatchObject({ index: true });
  });

  it.each([ShareVisibility.PRIVATE, ShareVisibility.PASSCODE])("%s preview metadata hides the snippet and is not indexed", async (visibility) => {
    const { link } = await seed(visibility);
    const meta = await generateMetadata(params(link.slug));
    expectNoSecrets(meta);
    expect(meta.robots).not.toMatchObject({ index: true });
  });

  it("public OG image shows the title", async () => {
    const { link } = await seed(ShareVisibility.PUBLIC);
    const image = await SnippetOgImage(params(link.slug));
    expect(JSON.stringify(image)).toContain(SECRET.title);
  });

  it.each([ShareVisibility.PRIVATE, ShareVisibility.PASSCODE])("%s OG image hides the snippet", async (visibility) => {
    const { link } = await seed(visibility);
    expectNoSecrets(await SnippetOgImage(params(link.slug)));
  });
});
