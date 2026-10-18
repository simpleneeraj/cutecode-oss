import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfilePageClient from "./page.client";
import { BASE_URL } from "@/utils/common";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, snippets } from "@/db/schema";

type PageProps = { params: Promise<{ userId: string }> };

async function getUserMeta(userId: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId), columns: { name: true, id: true } });
  if (!user) return null;
  const snippetCount = await db.$count(snippets, eq(snippets.userId, userId));
  return { ...user, snippetCount };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUserMeta(userId);
  if (!user) return { title: "User not found | Cool Snippets" };

  const name = user.name || "Anonymous";
  const title = `${name} — Cool Snippets`;
  const description = `${name} has published ${user.snippetCount} code snippet${user.snippetCount === 1 ? "" : "s"} on Cool Snippets. Browse and remix their work.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/u/${userId}` },
    openGraph: { title, description, url: `${BASE_URL}/u/${userId}`, siteName: "Cool Snippets" },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;
  const user = await getUserMeta(userId);
  if (!user) notFound();
  return <ProfilePageClient userId={userId} />;
}
