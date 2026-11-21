import { randomUUID } from "node:crypto";
import { vi } from "vitest";
import type { DbUser } from "@/db/schema";
import { auth } from "@/lib/auth";
import { appRouter, createContext } from "@/server/trpc";

const USER_HEADER = "x-test-user-id";

let sessionStubbed = false;

function stubSession() {
  if (sessionStubbed) return;
  sessionStubbed = true;
  vi.spyOn(auth.api, "getSession").mockImplementation((async ({ headers }: { headers: Headers }) => {
    const id = headers.get(USER_HEADER);
    return id ? { user: { id }, session: { userId: id } } : null;
  }) as unknown as typeof auth.api.getSession);
}

export function randomIp() {
  const bytes = randomUUID().replace(/-/g, "").slice(0, 6);
  return `10.${parseInt(bytes.slice(0, 2), 16)}.${parseInt(bytes.slice(2, 4), 16)}.${parseInt(bytes.slice(4, 6), 16)}`;
}

async function contextFor(user: DbUser | null, ip = randomIp()) {
  stubSession();
  const headers = new Headers({ "x-forwarded-for": ip, "x-real-ip": ip });
  if (user) headers.set(USER_HEADER, user.id);
  const req = new Request("http://localhost:3000/api/trpc", { headers });
  return createContext({ req, resHeaders: new Headers(), info: {} as never });
}

export async function callerFor(user: DbUser | null, ip?: string) {
  return appRouter.createCaller(await contextFor(user, ip));
}

export type Caller = Awaited<ReturnType<typeof callerFor>>;
