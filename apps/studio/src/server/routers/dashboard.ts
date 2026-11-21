import { and, count, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { snippets, shareLinks, shareLinkViews, snippetUpvotes, snippetBookmarks, snippetComments, userFollows, subscriptions } from "@/db/schema";
import { router, protectedProcedure } from "../init";
import { can } from "@/lib/billing/plans";
import { getPublishQuota } from "@/lib/billing/publish-quota";

async function batchCounts(ids: string[]) {
  if (ids.length === 0) return { upvotes: {}, comments: {}, bookmarks: {} } as Record<string, Record<string, number>>;
  const [upRows, cmRows, bmRows] = await Promise.all([
    db.select({ snippetId: snippetUpvotes.snippetId, c: sql<number>`count(*)` }).from(snippetUpvotes).where(inArray(snippetUpvotes.snippetId, ids)).groupBy(snippetUpvotes.snippetId),
    db.select({ snippetId: snippetComments.snippetId, c: sql<number>`count(*)` }).from(snippetComments).where(inArray(snippetComments.snippetId, ids)).groupBy(snippetComments.snippetId),
    db.select({ snippetId: snippetBookmarks.snippetId, c: sql<number>`count(*)` }).from(snippetBookmarks).where(inArray(snippetBookmarks.snippetId, ids)).groupBy(snippetBookmarks.snippetId),
  ]);
  const toMap = (rows: { snippetId: string; c: number }[]) => Object.fromEntries(rows.map((r) => [r.snippetId, Number(r.c)]));
  return { upvotes: toMap(upRows), comments: toMap(cmRows), bookmarks: toMap(bmRows) };
}

const DAY_MS = 86_400_000;
const VIEW_DAYS = 30;

function lastDays(): string[] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return Array.from({ length: VIEW_DAYS }, (_, index) =>
    new Date(today.getTime() - (VIEW_DAYS - 1 - index) * DAY_MS).toISOString().slice(0, 10),
  );
}

async function viewsByDay(userId: string, since: string) {
  const day = sql<string>`to_char(date_trunc('day', ${shareLinkViews.viewedAt}), 'YYYY-MM-DD')`;
  return db
    .select({ day, views: count() })
    .from(shareLinkViews)
    .innerJoin(shareLinks, eq(shareLinks.id, shareLinkViews.shareLinkId))
    .innerJoin(snippets, eq(snippets.id, shareLinks.snippetId))
    .where(and(eq(snippets.userId, userId), gte(shareLinkViews.viewedAt, new Date(since))))
    .groupBy(day);
}

export const dashboardRouter = router({
  summary: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    const [followers, userSnippets] = await Promise.all([
      db.$count(userFollows, eq(userFollows.followingId, userId)),
      db.query.snippets.findMany({
        where: eq(snippets.userId, userId),
        orderBy: (snippets, { desc }) => [desc(snippets.createdAt)],
        with: {
          shareLinks: {
            columns: { slug: true, viewCount: true, visibility: true },
            orderBy: (shareLinks, { asc }) => [asc(shareLinks.createdAt)],
          },
        },
      }),
    ]);

    const ids = userSnippets.map((s) => s.id);
    const counts = await batchCounts(ids);

    const rows = userSnippets.map((s) => {
      const views = s.shareLinks.reduce((sum, l) => sum + l.viewCount, 0);
      const primary = s.shareLinks[0];
      return {
        id: s.id,
        title: s.title,
        isPublic: s.isPublic,
        createdAt: s.createdAt.toISOString(),
        views,
        upvotes: counts.upvotes[s.id] ?? 0,
        comments: counts.comments[s.id] ?? 0,
        bookmarks: counts.bookmarks[s.id] ?? 0,
        slug: primary?.slug ?? null,
        visibility: primary?.visibility ?? null,
      };
    });

    const showStats = can(ctx.user.plan, "fullAnalytics");
    const totals = {
      views: showStats ? rows.reduce((sum, r) => sum + r.views, 0) : null,
      published: rows.filter((r) => r.isPublic).length,
      upvotes: showStats ? rows.reduce((sum, r) => sum + r.upvotes, 0) : null,
      followers,
    };

    const visibleRows = rows.map((r) => ({
      ...r,
      views: showStats ? r.views : null,
      upvotes: showStats ? r.upvotes : null,
      comments: showStats ? r.comments : null,
      bookmarks: showStats ? r.bookmarks : null,
    }));

    const [sub, quota] = await Promise.all([
      db.query.subscriptions.findFirst({ where: eq(subscriptions.userId, userId) }),
      getPublishQuota(db, userId),
    ]);

    return {
      rows: visibleRows,
      quota,
      totals,
      totalSnippets: rows.length,
      plan: ctx.user.plan,
      renewsAt: sub?.currentPeriodEnd?.toISOString() ?? null,
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
      userName: ctx.user.name,
    };
  }),
  viewsByDay: protectedProcedure.query(async ({ ctx }) => {
    if (!can(ctx.user.plan, "fullAnalytics")) return null;
    const days = lastDays();
    const rows = await viewsByDay(ctx.user.id, days[0]);
    const viewsOn = new Map(rows.map((row) => [row.day, row.views]));
    return days.map((date) => ({ date, views: viewsOn.get(date) ?? 0 }));
  }),
});
