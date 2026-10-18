import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfilePageClient from "./page.client";
import { BASE_URL } from "@/utils/common";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { users, snippets } from "@/db/schema";

type PageProps = { params: Promise<{ userId: string }> };

export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

const getUserMeta = cache(async (userId: string) => {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId), columns: { name: true, id: true } });
  if (!user) return null;
  const snippetCount = await db.$count(snippets, and(eq(snippets.userId, userId), eq(snippets.isPublic, true)));
  return { ...user, snippetCount };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUserMeta(userId);
  if (!user) return { title: "User not found", robots: { index: false, follow: false } };

  const name = user.name || "Anonymous";
  const title = `${name} — CuteCode`;
  const ogImage = `${BASE_URL}/opengraph-image`;
  const description = `${name} has published ${user.snippetCount} code snippet${user.snippetCount === 1 ? "" : "s"} on CuteCode. Browse and remix their work.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${BASE_URL}/u/${userId}` },
    openGraph: {
      type: "profile",
      title,
      description,
      url: `${BASE_URL}/u/${userId}`,
      siteName: "CuteCode",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;
  const user = await getUserMeta(userId);
  if (!user) notFound();
  return <ProfilePageClient userId={userId} />;
}
