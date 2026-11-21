import "server-only";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { clientIpFromHeaders } from "@/lib/client-ip";
import { db } from "@/db";
import { users } from "@/db/schema";
import type { DbUser } from "@/db/schema";
import { initTRPC, TRPCError } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export type Context = {
  user: DbUser | null;
  ip: string;
  userAgent: string;
};

export function requestIp(headers: Headers): string {
  return clientIpFromHeaders(headers);
}

export async function createContext({ req }: FetchCreateContextFnOptions): Promise<Context> {
  const ip = requestIp(req.headers);
  const userAgent = req.headers.get("user-agent") ?? "";
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return { user: null, ip, userAgent };
    const user = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
    return { user: user ?? null, ip, userAgent };
  } catch (e) {
    console.error("[createContext] error:", e);
    return { user: null, ip, userAgent };
  }
}

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    if (error.code !== "INTERNAL_SERVER_ERROR") return shape;
    console.error("[trpc] internal error:", error.cause ?? error);
    if (process.env.NODE_ENV !== "production") return shape;
    return { ...shape, message: "Internal server error", data: { ...shape.data, stack: undefined } };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { user: ctx.user } });
});

export const paginationInput = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
