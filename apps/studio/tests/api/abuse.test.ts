import { describe, it, expect } from "vitest";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { Plan, shareLinks, snippetUpvotes, ShareVisibility } from "@/db/schema";
import bcrypt from "bcryptjs";
import { POST } from "@/app/api/auth/[...all]/route";
import { sendResetPassword } from "@/lib/ses";
import { callerFor, randomIp } from "./support/caller";
import { createUser } from "./support/factories";
import { insertShare, PASSCODE, publishInput } from "./support/content";
import { authRequest } from "./support/http";

async function statuses(count: number, request: () => Request) {
  const codes: number[] = [];
  for (let index = 0; index < count; index++) codes.push((await POST(request() as NextRequest)).status);
  return codes;
}

describe("auth endpoint rate limits", () => {
  it("throttles repeated sign-in attempts from one IP", async () => {
    const ip = randomIp();
    const codes = await statuses(10, () =>
      authRequest("/sign-in/email", { ip, body: { email: "nobody@test.app", password: "wrong-password" } }),
    );
    expect(codes).toContain(429);
  });

  it("throttles repeated sign-up attempts from one IP", async () => {
    const ip = randomIp();
    const codes = await statuses(10, () =>
      authRequest("/sign-up/email", { ip, body: { email: `${randomIp()}@test.app`, password: "short", name: "x" } }),
    );
    expect(codes).toContain(429);
  });

  it("limits password reset emails from one IP", async () => {
    const user = await createUser();
    const ip = randomIp();
    const before = (sendResetPassword as unknown as { mock: { calls: unknown[] } }).mock.calls.length;
    const codes = await statuses(10, () =>
      authRequest("/request-password-reset", { ip, body: { email: user.email, redirectTo: "/account/reset-password" } }),
    );
    expect(codes).toContain(429);
    const sent = (sendResetPassword as unknown as { mock: { calls: unknown[] } }).mock.calls.length - before;
    expect(sent).toBeLessThanOrEqual(3);
  });
});

async function viewCount(linkId: string) {
  const row = await db.query.shareLinks.findFirst({ where: eq(shareLinks.id, linkId) });
  return row?.viewCount ?? 0;
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 300));

describe("view inflation", () => {
  it("counts repeated views from the same viewer once", async () => {
    const owner = await createUser();
    const { link } = await insertShare(owner.id);
    const ip = randomIp();
    for (let index = 0; index < 5; index++) {
      const caller = await callerFor(null, ip);
      await caller.share.preview({ slug: link.slug });
    }
    await settle();
    expect(await viewCount(link.id)).toBeLessThanOrEqual(1);
  });

  it("does not count failed passcode attempts as views", async () => {
    const owner = await createUser(Plan.PREMIUM);
    const { link } = await insertShare(owner.id, {
      visibility: ShareVisibility.PASSCODE,
      passcodeHash: await bcrypt.hash(PASSCODE, 4),
    });
    for (let index = 0; index < 3; index++) {
      const caller = await callerFor(null);
      await caller.share.preview({ slug: link.slug, passcode: "000000" }).catch(() => undefined);
      await caller.share.preview({ slug: link.slug }).catch(() => undefined);
    }
    await settle();
    expect(await viewCount(link.id)).toBe(0);
  });

  it("does not count private share probes as views", async () => {
    const owner = await createUser(Plan.PREMIUM);
    const { link } = await insertShare(owner.id, { visibility: ShareVisibility.PRIVATE });
    const caller = await callerFor(null);
    await caller.share.preview({ slug: link.slug }).catch(() => undefined);
    await settle();
    expect(await viewCount(link.id)).toBe(0);
  });
});

describe("upvote inflation", () => {
  it("toggling twice leaves no upvote", async () => {
    const owner = await createUser();
    const { snippet } = await insertShare(owner.id);
    const caller = await callerFor(await createUser());
    await expect(caller.snippet.toggleUpvote({ snippetId: snippet.id })).resolves.toMatchObject({ upvoted: true, count: 1 });
    await expect(caller.snippet.toggleUpvote({ snippetId: snippet.id })).resolves.toMatchObject({ upvoted: false, count: 0 });
  });

  it("parallel upvotes from one user count at most once", async () => {
    const owner = await createUser();
    const { snippet } = await insertShare(owner.id);
    const caller = await callerFor(await createUser());
    await Promise.allSettled(Array.from({ length: 6 }, () => caller.snippet.toggleUpvote({ snippetId: snippet.id })));
    expect(await db.$count(snippetUpvotes, eq(snippetUpvotes.snippetId, snippet.id))).toBeLessThanOrEqual(1);
  });

  it("rate-limits upvote spam", async () => {
    const owner = await createUser();
    const { snippet } = await insertShare(owner.id);
    const caller = await callerFor(await createUser());
    const codes: string[] = [];
    for (let index = 0; index < 35; index++) {
      codes.push(
        await caller.snippet.toggleUpvote({ snippetId: snippet.id }).then(
          () => "OK",
          (error: { code?: string }) => error.code ?? "UNKNOWN",
        ),
      );
    }
    expect(codes).toContain("TOO_MANY_REQUESTS");
  });

  it("cannot upvote a private snippet of another user", async () => {
    const owner = await createUser(Plan.PREMIUM);
    const { snippet } = await insertShare(owner.id, { visibility: ShareVisibility.PRIVATE });
    const caller = await callerFor(await createUser());
    await expect(caller.snippet.toggleUpvote({ snippetId: snippet.id })).rejects.toMatchObject({
      code: expect.stringMatching(/^(NOT_FOUND|FORBIDDEN)$/),
    });
  });
});

describe("write rate limits", () => {
  it("rate-limits comment spam", async () => {
    const owner = await createUser();
    const { snippet } = await insertShare(owner.id);
    const caller = await callerFor(await createUser());
    const codes: string[] = [];
    for (let index = 0; index < 25; index++) {
      codes.push(
        await caller.snippet.addComment({ snippetId: snippet.id, content: `spam ${index}` }).then(
          () => "OK",
          (error: { code?: string }) => error.code ?? "UNKNOWN",
        ),
      );
    }
    expect(codes).toContain("TOO_MANY_REQUESTS");
  });

  it("rate-limits publish bursts even when re-publishing", async () => {
    const caller = await callerFor(await createUser(Plan.PREMIUM));
    const input = publishInput();
    const codes: string[] = [];
    for (let index = 0; index < 12; index++) {
      codes.push(
        await caller.publish.publish(input).then(
          () => "OK",
          (error: { code?: string }) => error.code ?? "UNKNOWN",
        ),
      );
    }
    expect(codes).toContain("TOO_MANY_REQUESTS");
  });

  it("rate-limits follow toggling", async () => {
    const target = await createUser();
    const caller = await callerFor(await createUser());
    const codes: string[] = [];
    for (let index = 0; index < 35; index++) {
      codes.push(
        await caller.user.toggleFollow({ targetUserId: target.id }).then(
          () => "OK",
          (error: { code?: string }) => error.code ?? "UNKNOWN",
        ),
      );
    }
    expect(codes).toContain("TOO_MANY_REQUESTS");
  });
});
