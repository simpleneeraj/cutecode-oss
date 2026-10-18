import { db } from "@/db";
import { shortUrls } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function ShortRedirect({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const rows = await db.select().from(shortUrls).where(eq(shortUrls.code, code)).limit(1);
  const row = rows[0];

  if (!row) {
    notFound();
  }

  await db.update(shortUrls).set({ clicks: sql`${shortUrls.clicks} + 1` }).where(eq(shortUrls.code, code));

  redirect(row.url);
}
