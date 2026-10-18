import { BASE_URL } from "@/utils/common";
import type { MetadataRoute } from "next";
import { and, desc, eq, exists, gt, isNull, lt, max, or } from "drizzle-orm";
import { db } from "@/db";
import { shareLinks, snippets, ShareVisibility } from "@/db/schema";

const MAX_DYNAMIC_ENTRIES = 5000;

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE_URL, changeFrequency: "daily", priority: 1 },
  { url: `${BASE_URL}/pricing`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE_URL}/legal/terms`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/legal/privacy`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/legal/refund`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/legal/credits`, changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [previews, authors] = await Promise.all([
    db
      .select({ slug: shareLinks.slug, updatedAt: shareLinks.updatedAt })
      .from(shareLinks)
      .innerJoin(snippets, eq(shareLinks.snippetId, snippets.id))
      .where(
        and(
          eq(shareLinks.visibility, ShareVisibility.PUBLIC),
          eq(shareLinks.indexable, true),
          eq(snippets.isPublic, true),
          or(isNull(shareLinks.expiresAt), gt(shareLinks.expiresAt, new Date())),
          or(isNull(shareLinks.maxViews), lt(shareLinks.viewCount, shareLinks.maxViews)),
        ),
      )
      .orderBy(desc(shareLinks.updatedAt))
      .limit(MAX_DYNAMIC_ENTRIES),
    db
      .select({ userId: snippets.userId, lastModified: max(snippets.updatedAt) })
      .from(snippets)
      .where(
        and(
          eq(snippets.isPublic, true),
          exists(
            db
              .select({ id: shareLinks.id })
              .from(shareLinks)
              .where(and(eq(shareLinks.snippetId, snippets.id), eq(shareLinks.visibility, ShareVisibility.PUBLIC))),
          ),
        ),
      )
      .groupBy(snippets.userId)
      .limit(MAX_DYNAMIC_ENTRIES),
  ]);

  return [
    ...staticRoutes,
    ...previews.map(({ slug, updatedAt }) => ({
      url: `${BASE_URL}/preview/${slug}`,
      lastModified: updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...authors.map(({ userId, lastModified }) => ({
      url: `${BASE_URL}/u/${userId}`,
      lastModified: lastModified ?? undefined,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
