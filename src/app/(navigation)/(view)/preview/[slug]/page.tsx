import type { Metadata } from "next";
import PreviewSnippetClient from "./page.client";
import { BASE_URL } from "@/utils/common";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { shareLinks, ShareVisibility } from "@/db/schema";
import { exposesShareDetails } from "@/lib/share/access";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getShareLinkMeta(slug: string) {
  return db.query.shareLinks.findFirst({
    where: eq(shareLinks.slug, slug),
    columns: { slug: true, visibility: true, indexable: true, expiresAt: true, maxViews: true, viewCount: true },
    with: {
      snippet: {
        columns: { title: true, description: true, tags: true },
        with: { user: { columns: { name: true } } },
      },
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const share = await getShareLinkMeta(slug);

  if (!share || !share.snippet) {
    return { title: "Snippet not found | Cool Snippets" };
  }

  if (!exposesShareDetails(share)) {
    return { title: "Protected snippet | Cool Snippets", robots: { index: false, follow: false } };
  }

  const { snippet, visibility, indexable } = share;
  const isIndexable = visibility === ShareVisibility.PUBLIC && indexable;

  const title = snippet.title ? `${snippet.title} — Cool Snippets` : "Code Snippet — Cool Snippets";

  const description =
    snippet.description ||
    (snippet.user?.name
      ? `Beautiful code snippet by ${snippet.user.name}. View, copy, or remix it on Cool Snippets.`
      : "View and share this code snippet created with Cool Snippets. Beautiful syntax highlighting, custom themes, and HD export.");

  const ogImageUrl = `${BASE_URL}/preview/${slug}/opengraph-image`;

  return {
    title,
    description,
    keywords: snippet.tags?.length ? snippet.tags : undefined,
    alternates: { canonical: `${BASE_URL}/preview/${slug}` },
    robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: "website",
      url: `${BASE_URL}/preview/${slug}`,
      siteName: "Cool Snippets",
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@iamsimpleneeraj",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PreviewSnippetPage({ params }: PageProps) {
  const { slug } = await params;
  return <PreviewSnippetClient slug={slug} />;
}
