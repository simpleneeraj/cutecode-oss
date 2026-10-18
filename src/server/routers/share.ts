import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq, gt, isNull, lt, or, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";
import { generateUniqueSlug } from "@/lib/share/slug";
import { db } from "@/db";
import {
  shareLinks,
  shareLinkViews,
  snippets,
  presentations,
  snippetUpvotes,
  snippetBookmarks,
  snippetComments,
  userFollows,
  type DbShareLink,
} from "@/db/schema";
import { router, protectedProcedure, publicProcedure } from "../init";
import { createShareLinkSchema, passcodeSchema, updateShareLinkSchema } from "@/lib/schemas";
import {
  apiRateLimit,
  cacheDel,
  cacheGet,
  cacheSet,
  checkRateLimit,
  isRateLimited,
  passcodeRateLimit,
  passcodeShareRateLimit,
  recordRateLimitHit,
} from "@/lib/in-memory-store";
import { consumePublishQuota } from "@/lib/billing/publish-quota";
import { assertPremiumAssetsAllowed, assertSlideLimit } from "@/lib/billing/premium-assets";
import { can } from "@/lib/billing/plans";
import { requireCapability, requireShareVisibility } from "@/lib/billing/require-capability";
import { isShareExpired, resolveShareAccess } from "@/lib/share/access";
import { publishedContent } from "@/lib/share/published-content";

function toShareLinkDto(link: DbShareLink) {
  return {
    id: link.id,
    slug: link.slug,
    visibility: link.visibility,
    isE2EEncrypted: link.isE2EEncrypted,
    encryptionHint: link.encryptionHint,
    maxViews: link.maxViews,
    viewCount: link.viewCount,
    expiresAt: link.expiresAt,
    allowDownload: link.allowDownload,
    allowCopy: link.allowCopy,
    indexable: link.indexable,
    snippetId: link.snippetId,
    presentationId: link.presentationId,
    createdAt: link.createdAt,
    updatedAt: link.updatedAt,
  };
}

function hashViewer(viewer: string) {
  return createHash("sha256").update(viewer).digest("hex");
}

async function recordView(shareLinkId: string, viewerHash: string, passcodeUsed: boolean) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${`view:${shareLinkId}:${viewerHash}`}))`);
    const seen = await tx.query.shareLinkViews.findFirst({
      where: and(
        eq(shareLinkViews.shareLinkId, shareLinkId),
        eq(shareLinkViews.ipHash, viewerHash),
        gt(shareLinkViews.viewedAt, sql`now() - interval '24 hours'`),
      ),
      columns: { id: true },
    });
    if (seen) return true;

    const [counted] = await tx
      .update(shareLinks)
      .set({ viewCount: sql`${shareLinks.viewCount} + 1` })
      .where(
        and(
          eq(shareLinks.id, shareLinkId),
          or(isNull(shareLinks.maxViews), lt(shareLinks.viewCount, shareLinks.maxViews)),
          or(isNull(shareLinks.expiresAt), gt(shareLinks.expiresAt, sql`now()`)),
        ),
      )
      .returning({ id: shareLinks.id });
    if (!counted) return false;

    await tx.insert(shareLinkViews).values({ shareLinkId, ipHash: viewerHash, passcodeUsed });
    return true;
  });
}

export const shareRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        snippetId: z.string().optional(),
        presentationId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const links = await db.query.shareLinks.findMany({
        where: and(
          eq(shareLinks.userId, ctx.user.id),
          ...(input.snippetId ? [eq(shareLinks.snippetId, input.snippetId)] : []),
          ...(input.presentationId ? [eq(shareLinks.presentationId, input.presentationId)] : []),
        ),
        columns: {
          id: true,
          slug: true,
          visibility: true,
          isE2EEncrypted: true,
          encryptionHint: true,
          maxViews: true,
          viewCount: true,
          expiresAt: true,
          allowDownload: true,
          allowCopy: true,
          indexable: true,
          snippetId: true,
          presentationId: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: (shareLinks, { desc }) => [desc(shareLinks.createdAt)],
      });
      const showViews = can(ctx.user.plan, "fullAnalytics");
      return links.map((link) => ({ ...link, viewCount: showViews ? link.viewCount : null }));
    }),

  create: protectedProcedure.input(createShareLinkSchema).mutation(async ({ ctx, input }) => {
    const {
      snippetId,
      presentationId,
      visibility,
      passcode,
      isE2EEncrypted,
      encryptionHint,
      maxViews,
      expiresAt,
      allowDownload,
      allowCopy,
    } = input;

    requireShareVisibility(ctx.user.plan, visibility);

    const snippet = snippetId
      ? await db.query.snippets.findFirst({
          where: and(eq(snippets.id, snippetId), eq(snippets.userId, ctx.user.id)),
          with: { presentation: { columns: { elements: true, slides: true } }, shareLinks: { columns: { id: true }, limit: 1 } },
        })
      : undefined;
    if (snippetId && !snippet) throw new TRPCError({ code: "BAD_REQUEST", message: "Snippet not found" });
    if (snippet) {
      assertPremiumAssetsAllowed(ctx.user.plan, snippet.presentation.elements);
      assertSlideLimit(ctx.user.plan, snippet.presentation.slides);
    }

    if (presentationId) {
      const presentation = await db.query.presentations.findFirst({ where: and(eq(presentations.id, presentationId), eq(presentations.userId, ctx.user.id)) });
      if (!presentation) throw new TRPCError({ code: "BAD_REQUEST", message: "Presentation not found" });
    }

    const passcodeHash = passcode && visibility === "PASSCODE" ? await bcrypt.hash(passcode, 10) : null;
    const slug = await generateUniqueSlug();

    return db.transaction(async (tx) => {
      const quota = await consumePublishQuota(tx, ctx.user.id, {
        addsLiveSnippet: !!snippet && !snippet.isPublic && snippet.shareLinks.length === 0,
      });

      const [link] = await tx
        .insert(shareLinks)
        .values({
          userId: ctx.user.id,
          slug,
          targetType: snippetId ? "SNIPPET" : presentationId ? "PRESENTATION" : "COLLECTION",
          targetId: snippetId ?? presentationId ?? "",
          snippetId: snippetId ?? null,
          presentationId: presentationId ?? null,
          visibility,
          passcodeHash,
          isE2EEncrypted,
          encryptionHint: encryptionHint ?? null,
          maxViews: maxViews ?? null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          allowDownload,
          allowCopy,
          indexable: visibility === "PUBLIC",
        })
        .returning();

      return { ...toShareLinkDto(link), quota };
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string().min(1), data: updateShareLinkSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.shareLinks.findFirst({
        where: and(eq(shareLinks.id, input.id), eq(shareLinks.userId, ctx.user.id)),
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Share link not found" });
      }

      const { passcode, visibility, expiresAt, ...rest } = input.data;
      requireShareVisibility(ctx.user.plan, visibility);

      const nextVisibility = visibility ?? existing.visibility;
      if (nextVisibility === "PASSCODE" && !passcode && !existing.passcodeHash) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "A 6-digit passcode is required." });
      }

      const updateData: Record<string, unknown> = { ...rest };
      if (passcode && nextVisibility === "PASSCODE") {
        updateData.passcodeHash = await bcrypt.hash(passcode, 10);
      } else if (nextVisibility !== "PASSCODE") {
        updateData.passcodeHash = null;
      }
      if (visibility !== undefined) {
        updateData.visibility = visibility;
        updateData.indexable = visibility === "PUBLIC";
      }
      if (expiresAt !== undefined) {
        updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
      }

      const [updated] = await db
        .update(shareLinks)
        .set(updateData)
        .where(eq(shareLinks.id, input.id))
        .returning();

      await cacheDel(`shareLink:${existing.slug}`);
      return toShareLinkDto(updated);
    }),

  delete: protectedProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const existing = await db.query.shareLinks.findFirst({
      where: and(eq(shareLinks.id, input.id), eq(shareLinks.userId, ctx.user.id)),
    });

    if (!existing) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Share link not found" });
    }

    await db.delete(shareLinks).where(eq(shareLinks.id, input.id));
    await cacheDel(`shareLink:${existing.slug}`);
    return { deleted: true, id: input.id };
  }),

  preview: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        passcode: passcodeSchema.optional(),
        asVisitor: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { slug, passcode, asVisitor } = input;

      const { success } = await checkRateLimit(apiRateLimit, `preview:${ctx.ip}`);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests. Please try again later." });
      }

      const cacheKey = `shareLink:${slug}`;
      let shareLink = !ctx.user && !passcode ? await cacheGet<PreviewShareLink>(cacheKey) : null;

      if (!shareLink) {
        shareLink = await fetchShareLink(slug);
        if (shareLink?.visibility === "PUBLIC" && !ctx.user) {
          await cacheSet(cacheKey, shareLink, 30);
        }
      }

      if (!shareLink || !shareLink.snippet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Share link not found" });
      }

      const isOwner = ctx.user?.id === shareLink.userId;
      const access = resolveShareAccess({
        visibility: shareLink.visibility,
        ownerId: shareLink.userId,
        viewerId: asVisitor ? undefined : ctx.user?.id,
        hasPasscodeHash: !!shareLink.passcodeHash,
        passcode,
        expired: isShareExpired(shareLink),
      });

      if (access === "not_found") {
        throw new TRPCError({ code: "NOT_FOUND", message: "Share link not found" });
      }
      if (access === "passcode_required") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Passcode required" });
      }
      if (access === "verify_passcode") {
        await verifyPasscode(shareLink, passcode!, ctx.ip);
      }

      if (!isOwner) {
        const viewer = ctx.user ? `user:${ctx.user.id}` : `anon:${ctx.ip}|${ctx.userAgent}`;
        const counted = await recordView(shareLink.id, hashViewer(viewer), access === "verify_passcode");
        if (!counted) {
          await cacheDel(cacheKey);
          throw new TRPCError({ code: "NOT_FOUND", message: "Share link not found" });
        }
      }

      const { snippet } = shareLink;
      const publicLink = {
        id: shareLink.id,
        slug: shareLink.slug,
        userId: shareLink.userId,
        visibility: shareLink.visibility,
        viewCount: shareLink.viewCount,
        allowDownload: shareLink.allowDownload,
        allowCopy: shareLink.allowCopy,
        createdAt: shareLink.createdAt,
      };
      let userUpvoted = false;
      let userBookmarked = false;
      let isFollowing = false;
      let currentUserId: string | undefined;

      if (ctx.user) {
        currentUserId = ctx.user.id;

        const [upvote, bookmark, follow] = await Promise.all([
          db.query.snippetUpvotes.findFirst({
            where: and(eq(snippetUpvotes.snippetId, snippet.id), eq(snippetUpvotes.userId, ctx.user.id)),
          }),
          db.query.snippetBookmarks.findFirst({
            where: and(eq(snippetBookmarks.snippetId, snippet.id), eq(snippetBookmarks.userId, ctx.user.id)),
          }),
          db.query.userFollows.findFirst({
            where: and(eq(userFollows.followerId, ctx.user.id), eq(userFollows.followingId, snippet.userId)),
          }),
        ]);

        userUpvoted = !!upvote;
        userBookmarked = !!bookmark;
        isFollowing = !!follow;
      }

      return { shareLink: publicLink, snippet, userUpvoted, userBookmarked, isFollowing, currentUserId };
    }),

  analytics: protectedProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ ctx, input }) => {
    requireCapability(ctx.user.plan, "fullAnalytics");
    const link = await db.query.shareLinks.findFirst({
      where: and(eq(shareLinks.id, input.id), eq(shareLinks.userId, ctx.user.id)),
      with: {
        views: {
          orderBy: (shareLinkViews, { desc }) => [desc(shareLinkViews.viewedAt)],
          limit: 100,
          columns: { id: true, passcodeUsed: true, referer: true, viewedAt: true },
        },
      },
      columns: { id: true, slug: true, viewCount: true, maxViews: true, expiresAt: true },
    });

    if (!link) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Share link not found" });
    }

    const byDay = link.views.reduce<Record<string, number>>((acc, v) => {
      const day = v.viewedAt.toISOString().slice(0, 10);
      acc[day] = (acc[day] ?? 0) + 1;
      return acc;
    }, {});

    return {
      id: link.id,
      slug: link.slug,
      totalViews: link.viewCount,
      maxViews: link.maxViews,
      expiresAt: link.expiresAt,
      recentViews: link.views,
      viewsByDay: byDay,
    };
  }),
});

const previewLinkColumns = {
  id: true,
  slug: true,
  userId: true,
  visibility: true,
  passcodeHash: true,
  viewCount: true,
  maxViews: true,
  expiresAt: true,
  allowDownload: true,
  allowCopy: true,
  createdAt: true,
} as const;

type PreviewShareLink = Pick<DbShareLink, keyof typeof previewLinkColumns> & {
  snippet:
    | (typeof snippets.$inferSelect & {
        user: { id: string; name: string | null } | null;
        presentation: Pick<typeof presentations.$inferSelect, "id" | "name" | "width"> & ReturnType<typeof publishedContent>;
        _count: { upvotes: number; bookmarks: number; comments: number };
      })
    | null;
};

async function verifyPasscode(shareLink: PreviewShareLink, passcode: string, ip: string) {
  const ipKey = `${ip}:${shareLink.id}`;
  const [ipLimited, shareLimited] = await Promise.all([
    isRateLimited(passcodeRateLimit, ipKey),
    isRateLimited(passcodeShareRateLimit, shareLink.id),
  ]);
  if (ipLimited || shareLimited) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many passcode attempts. Please try again later." });
  }
  if (await bcrypt.compare(passcode, shareLink.passcodeHash!)) return;
  await Promise.all([recordRateLimitHit(passcodeRateLimit, ipKey), recordRateLimitHit(passcodeShareRateLimit, shareLink.id)]);
  throw new TRPCError({ code: "FORBIDDEN", message: "Invalid passcode" });
}

async function fetchShareLink(slug: string): Promise<PreviewShareLink | null> {
  const link = await db.query.shareLinks.findFirst({
    where: eq(shareLinks.slug, slug),
    columns: previewLinkColumns,
    with: {
      snippet: {
        with: {
          user: { columns: { id: true, name: true } },
          presentation: { columns: { id: true, name: true, width: true, slides: true, elements: true, slideElements: true } },
        },
      },
    },
  });

  if (!link) return null;

  if (!link.snippet) return { ...link, snippet: null };

  const { presentation, ...snippet } = link.snippet;
  const [upvotes, bookmarks, comments] = await Promise.all([
    db.$count(snippetUpvotes, eq(snippetUpvotes.snippetId, snippet.id)),
    db.$count(snippetBookmarks, eq(snippetBookmarks.snippetId, snippet.id)),
    db.$count(snippetComments, eq(snippetComments.snippetId, snippet.id)),
  ]);

  return {
    ...link,
    snippet: {
      ...snippet,
      presentation: {
        id: presentation.id,
        name: presentation.name,
        width: presentation.width,
        ...publishedContent(presentation, snippet.elementId),
      },
      _count: { upvotes, bookmarks, comments },
    },
  };
}
