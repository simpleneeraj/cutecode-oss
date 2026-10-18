import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq, desc, inArray, lt, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  snippets,
  presentations,
  shareLinks,
  snippetUpvotes,
  snippetBookmarks,
  snippetComments,
  users,
} from "@/db/schema";
import { router, protectedProcedure, publicProcedure, paginationInput } from "../init";
import { createSnippetSchema, updateSnippetSchema } from "@/lib/schemas";
import { socialRateLimit, commentRateLimit, checkRateLimit, cacheDel } from "@/lib/in-memory-store";
import { consumePublishQuota } from "@/lib/billing/publish-quota";
import { assertPremiumAssetsAllowed, stripPremiumAssets } from "@/lib/billing/premium-assets";
import { isShareExhausted, isShareExpired } from "@/lib/share/access";
import { publishedContent } from "@/lib/share/published-content";
import { generateUniqueSlug } from "@/lib/share/slug";

async function attachCounts(ids: string[]) {
  if (ids.length === 0) return { upvotes: {} as Record<string, number>, bookmarks: {} as Record<string, number>, comments: {} as Record<string, number> };
  const [upRows, bmRows, cmRows] = await Promise.all([
    db.select({ snippetId: snippetUpvotes.snippetId, c: sql<number>`count(*)` }).from(snippetUpvotes).where(inArray(snippetUpvotes.snippetId, ids)).groupBy(snippetUpvotes.snippetId),
    db.select({ snippetId: snippetBookmarks.snippetId, c: sql<number>`count(*)` }).from(snippetBookmarks).where(inArray(snippetBookmarks.snippetId, ids)).groupBy(snippetBookmarks.snippetId),
    db.select({ snippetId: snippetComments.snippetId, c: sql<number>`count(*)` }).from(snippetComments).where(inArray(snippetComments.snippetId, ids)).groupBy(snippetComments.snippetId),
  ]);
  const toMap = (rows: { snippetId: string; c: number }[]) => Object.fromEntries(rows.map((r) => [r.snippetId, Number(r.c)]));
  return { upvotes: toMap(upRows), bookmarks: toMap(bmRows), comments: toMap(cmRows) };
}

const liveSharedSnippet = sql`EXISTS (SELECT 1 FROM share_links WHERE share_links.snippet_id = ${snippets.id} AND share_links.visibility = 'PUBLIC' AND (share_links.expires_at IS NULL OR share_links.expires_at > now()) AND (share_links.max_views IS NULL OR share_links.view_count < share_links.max_views))`;

async function findSocialSnippet(snippetId: string, viewerId: string | undefined) {
  const snippet = await db.query.snippets.findFirst({
    where: and(
      eq(snippets.id, snippetId),
      or(
        ...(viewerId ? [eq(snippets.userId, viewerId)] : []),
        and(
          eq(snippets.isPublic, true),
          liveSharedSnippet,
        ),
      ),
    ),
  });
  if (!snippet) throw new TRPCError({ code: "NOT_FOUND", message: "Snippet not found" });
  return snippet;
}

export const snippetRouter = router({
  list: protectedProcedure.input(paginationInput).query(async ({ ctx, input }) => {
    const { page, limit } = input;
    const offset = (page - 1) * limit;

    const rows = await db.query.snippets.findMany({
      where: eq(snippets.userId, ctx.user.id),
      with: {
        presentation: { columns: { id: true, name: true } },
        shareLinks: { columns: { slug: true, visibility: true }, orderBy: (shareLinks, { asc }) => [asc(shareLinks.createdAt)], limit: 1 },
      },
      orderBy: (snippets, { desc }) => [desc(snippets.createdAt)],
      offset,
      limit,
    });

    const counts = await attachCounts(rows.map((r) => r.id));
    const snippetList = rows.map((r) => ({
      ...r,
      _count: { upvotes: counts.upvotes[r.id] ?? 0, bookmarks: counts.bookmarks[r.id] ?? 0 },
    }));

    const total = await db.$count(snippets, eq(snippets.userId, ctx.user.id));

    return { snippets: snippetList, total, page, limit };
  }),

  explore: publicProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(48).default(24),
        sort: z.enum(["recent", "popular"]).default("recent"),
        language: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, limit, sort, language } = input;
      const offset = (page - 1) * limit;

      const base = db
        .select({
          id: snippets.id,
          title: snippets.title,
          description: snippets.description,
          tags: snippets.tags,
          createdAt: snippets.createdAt,
          elementId: snippets.elementId,
          userId: users.id,
          userName: users.name,
          presentationId: presentations.id,
          presentationName: presentations.name,
          presentationElements: presentations.elements,
          slug: sql<string | null>`(SELECT slug FROM share_links WHERE share_links.snippet_id = ${snippets.id} AND share_links.visibility = 'PUBLIC' AND (share_links.expires_at IS NULL OR share_links.expires_at > now()) AND (share_links.max_views IS NULL OR share_links.view_count < share_links.max_views) ORDER BY created_at ASC LIMIT 1)`,
        })
        .from(snippets)
        .innerJoin(users, eq(snippets.userId, users.id))
        .innerJoin(presentations, eq(snippets.presentationId, presentations.id))
        .where(
          and(
            eq(snippets.isPublic, true),
            liveSharedSnippet,
            ...(language
              ? [sql`EXISTS (SELECT 1 FROM jsonb_each(${presentations.elements}) WHERE value->>'language' = ${language})`]
              : []),
          ),
        );

      const rows = await (sort === "popular"
        ? base.orderBy(sql`(SELECT COUNT(*) FROM snippet_upvotes WHERE snippet_upvotes.snippet_id = ${snippets.id}) DESC`)
        : base.orderBy(desc(snippets.createdAt))
      ).limit(limit).offset(offset);

      const ids = rows.map((r) => r.id);
      const counts = await attachCounts(ids);

      const snippetList = rows.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        tags: r.tags,
        createdAt: r.createdAt,
        elementId: r.elementId,
        user: { id: r.userId, name: r.userName },
        presentation: {
          id: r.presentationId,
          name: r.presentationName,
          elements: publishedContent({ elements: r.presentationElements }, r.elementId).elements,
        },
        shareLinks: r.slug ? [{ slug: r.slug }] : [],
        _count: {
          upvotes: counts.upvotes[r.id] ?? 0,
          bookmarks: counts.bookmarks[r.id] ?? 0,
          comments: counts.comments[r.id] ?? 0,
        },
      }));

      const totalRows = await db
        .select({ c: sql<number>`count(DISTINCT ${snippets.id})` })
        .from(snippets)
        .innerJoin(presentations, eq(snippets.presentationId, presentations.id))
        .where(
          and(
            eq(snippets.isPublic, true),
            liveSharedSnippet,
            ...(language
              ? [sql`EXISTS (SELECT 1 FROM jsonb_each(${presentations.elements}) WHERE value->>'language' = ${language})`]
              : []),
          ),
        );

      const total = Number(totalRows[0]?.c ?? 0);
      return { snippets: snippetList, total, page, limit };
    }),

  get: protectedProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ ctx, input }) => {
    const snippet = await db.query.snippets.findFirst({
      where: and(eq(snippets.id, input.id), eq(snippets.userId, ctx.user.id)),
      with: { presentation: { columns: { id: true, name: true, elements: true } } },
    });

    if (!snippet) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Snippet not found" });
    }

    const elements = snippet.presentation.elements as Record<string, unknown>;
    const element = elements[snippet.elementId] ?? null;

    return { ...snippet, element };
  }),

  create: protectedProcedure.input(createSnippetSchema).mutation(async ({ ctx, input }) => {
    const presentation = await db.query.presentations.findFirst({
      where: and(eq(presentations.id, input.presentationId), eq(presentations.userId, ctx.user.id)),
    });

    if (!presentation) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Presentation not found" });
    }

    const elements = presentation.elements as Record<string, unknown>;
    if (!elements[input.elementId]) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Element not found in presentation" });
    }

    if (input.isPublic) assertPremiumAssetsAllowed(ctx.user.plan, elements);

    return db.transaction(async (tx) => {
      const quota = input.isPublic ? await consumePublishQuota(tx, ctx.user.id, { addsLiveSnippet: true }) : null;

      const [snippet] = await tx
        .insert(snippets)
        .values({
          userId: ctx.user.id,
          presentationId: input.presentationId,
          elementId: input.elementId,
          title: input.title,
          tags: input.tags ?? [],
          isPublic: input.isPublic ?? false,
        })
        .returning();

      return { ...snippet, quota };
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string().min(1), data: updateSnippetSchema }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.snippets.findFirst({
        where: and(eq(snippets.id, input.id), eq(snippets.userId, ctx.user.id)),
        with: { presentation: { columns: { elements: true } }, shareLinks: { columns: { id: true }, limit: 1 } },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Snippet not found" });
      }

      const becomesPublic = input.data.isPublic === true && !existing.isPublic;
      if (becomesPublic) assertPremiumAssetsAllowed(ctx.user.plan, existing.presentation.elements);

      return db.transaction(async (tx) => {
        const quota = becomesPublic
          ? await consumePublishQuota(tx, ctx.user.id, { addsLiveSnippet: existing.shareLinks.length === 0 })
          : null;

        const [updated] = await tx
          .update(snippets)
          .set({
            ...(input.data.title !== undefined && { title: input.data.title }),
            ...(input.data.tags !== undefined && { tags: input.data.tags }),
            ...(input.data.isPublic !== undefined && { isPublic: input.data.isPublic }),
          })
          .where(eq(snippets.id, input.id))
          .returning();

        return { ...updated, quota };
      });
    }),

  delete: protectedProcedure.input(z.object({ id: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const existing = await db.query.snippets.findFirst({
      where: and(eq(snippets.id, input.id), eq(snippets.userId, ctx.user.id)),
    });

    if (!existing) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Snippet not found" });
    }

    const links = await db.transaction(async (tx) => {
      const deletedLinks = await tx
        .delete(shareLinks)
        .where(and(eq(shareLinks.snippetId, input.id), eq(shareLinks.userId, ctx.user.id)))
        .returning({ slug: shareLinks.slug });
      await tx.delete(snippets).where(eq(snippets.id, input.id));
      return deletedLinks;
    });
    await Promise.all(links.map(({ slug }) => cacheDel(`shareLink:${slug}`)));
    return { deleted: true, id: input.id };
  }),

  toggleUpvote: protectedProcedure
    .input(z.object({ snippetId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { snippetId } = input;

      const { success } = await checkRateLimit(socialRateLimit, `upvote:${ctx.user.id}`);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests. Slow down." });
      }

      await findSocialSnippet(snippetId, ctx.user.id);

      const links = await db.query.shareLinks.findMany({ where: eq(shareLinks.snippetId, snippetId), columns: { slug: true } });
      const bustCache = () => Promise.all(links.map(({ slug }) => cacheDel(`shareLink:${slug}`)));

      const existing = await db.query.snippetUpvotes.findFirst({
        where: and(eq(snippetUpvotes.snippetId, snippetId), eq(snippetUpvotes.userId, ctx.user.id)),
      });

      if (existing) {
        await db.delete(snippetUpvotes).where(eq(snippetUpvotes.id, existing.id));
        await bustCache();
        const count = await db.$count(snippetUpvotes, eq(snippetUpvotes.snippetId, snippetId));
        return { upvoted: false, count };
      }

      await db.insert(snippetUpvotes).values({ snippetId, userId: ctx.user.id });
      await bustCache();
      const count = await db.$count(snippetUpvotes, eq(snippetUpvotes.snippetId, snippetId));
      return { upvoted: true, count };
    }),

  toggleBookmark: protectedProcedure
    .input(z.object({ snippetId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { snippetId } = input;

      const { success } = await checkRateLimit(socialRateLimit, `bookmark:${ctx.user.id}`);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many requests. Slow down." });
      }

      await findSocialSnippet(snippetId, ctx.user.id);

      const links = await db.query.shareLinks.findMany({ where: eq(shareLinks.snippetId, snippetId), columns: { slug: true } });
      const bustCache = () => Promise.all(links.map(({ slug }) => cacheDel(`shareLink:${slug}`)));

      const existing = await db.query.snippetBookmarks.findFirst({
        where: and(eq(snippetBookmarks.snippetId, snippetId), eq(snippetBookmarks.userId, ctx.user.id)),
      });

      if (existing) {
        await db.delete(snippetBookmarks).where(eq(snippetBookmarks.id, existing.id));
        await bustCache();
        const count = await db.$count(snippetBookmarks, eq(snippetBookmarks.snippetId, snippetId));
        return { bookmarked: false, count };
      }

      await db.insert(snippetBookmarks).values({ snippetId, userId: ctx.user.id });
      await bustCache();
      const count = await db.$count(snippetBookmarks, eq(snippetBookmarks.snippetId, snippetId));
      return { bookmarked: true, count };
    }),

  listComments: publicProcedure
    .input(
      z.object({
        snippetId: z.string().min(1),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await findSocialSnippet(input.snippetId, ctx.user?.id);
      const take = 20;
      const cursor = input.cursor
        ? await db.query.snippetComments.findFirst({
            where: and(eq(snippetComments.id, input.cursor), eq(snippetComments.snippetId, input.snippetId)),
            columns: { id: true, createdAt: true },
          })
        : undefined;
      const comments = await db.query.snippetComments.findMany({
        where: and(
          eq(snippetComments.snippetId, input.snippetId),
          ...(cursor
            ? [
                or(
                  lt(snippetComments.createdAt, cursor.createdAt),
                  and(eq(snippetComments.createdAt, cursor.createdAt), lt(snippetComments.id, cursor.id)),
                ),
              ]
            : []),
        ),
        orderBy: (snippetComments, { desc }) => [desc(snippetComments.createdAt), desc(snippetComments.id)],
        limit: take,
        with: { user: { columns: { id: true, name: true } } },
      });

      const nextCursor = comments.length === take ? comments[comments.length - 1].id : null;
      return { comments, nextCursor };
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        snippetId: z.string().min(1),
        content: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { success } = await checkRateLimit(commentRateLimit, `comment:${ctx.user.id}`);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many comments. Slow down." });
      }

      await findSocialSnippet(input.snippetId, ctx.user.id);

      const [comment] = await db
        .insert(snippetComments)
        .values({ snippetId: input.snippetId, userId: ctx.user.id, content: input.content.trim() })
        .returning();

      const withUser = await db.query.snippetComments.findFirst({
        where: eq(snippetComments.id, comment.id),
        with: { user: { columns: { id: true, name: true } } },
      });
      return withUser;
    }),

  remix: protectedProcedure.input(z.object({ slug: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    const shareLink = await db.query.shareLinks.findFirst({
      where: eq(shareLinks.slug, input.slug),
      with: { snippet: { with: { presentation: true } } },
    });

    if (!shareLink || !shareLink.snippet) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Snippet not found" });
    }

    if (shareLink.visibility !== "PUBLIC" || isShareExpired(shareLink) || isShareExhausted(shareLink)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Can only remix public snippets" });
    }

    const snippet = shareLink.snippet;
    const presentation = snippet.presentation;
    const content = publishedContent(presentation, snippet.elementId);

    return db.transaction(async (tx) => {
      const quota = await consumePublishQuota(tx, ctx.user.id, { addsLiveSnippet: true });

      const [newPresentation] = await tx
        .insert(presentations)
        .values({
          userId: ctx.user.id,
          name: `${presentation.name} (Remixed)`,
          width: presentation.width,
          slides: content.slides,
          elements: stripPremiumAssets(ctx.user.plan, content.elements),
          slideElements: content.slideElements,
        })
        .returning();

      const [newSnippet] = await tx
        .insert(snippets)
        .values({
          userId: ctx.user.id,
          presentationId: newPresentation.id,
          elementId: snippet.elementId,
          title: snippet.title ? `${snippet.title} (Remixed)` : null,
          description: snippet.description,
          tags: snippet.tags,
          isPublic: true,
        })
        .returning();

      const newSlug = await generateUniqueSlug();
      await tx.insert(shareLinks).values({
        userId: ctx.user.id,
        slug: newSlug,
        targetType: "SNIPPET",
        targetId: newSnippet.id,
        snippetId: newSnippet.id,
        presentationId: newPresentation.id,
        visibility: "PUBLIC",
      });

      return { slug: newSlug, quota };
    });
  }),
});
