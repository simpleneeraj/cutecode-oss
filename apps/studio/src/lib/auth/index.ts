import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import type { DbUser } from "@/db/schema";
import { Plan, Role } from "@/db/schema";
import { isPlanAtLeast } from "@/lib/billing/plans";

export async function getCurrentUser(): Promise<DbUser | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return null;
    return (await db.query.users.findFirst({ where: eq(users.id, session.user.id) })) ?? null;
  } catch (err) {
    console.error("[getCurrentUser] Error fetching user:", err);
    return null;
  }
}

export async function requireAuth(): Promise<DbUser> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/account/sign-in");

  const user = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
  if (!user) redirect("/account/sign-in");

  return user;
}

export async function requireRole(role: Role): Promise<DbUser> {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error(`Forbidden: requires role "${role}"`);
  }
  return user;
}

export async function requireSubscription(plan: Plan): Promise<DbUser> {
  const user = await requireAuth();
  if (!isPlanAtLeast(user.plan, plan)) {
    redirect("/pricing");
  }
  return user;
}
