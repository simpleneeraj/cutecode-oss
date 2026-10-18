import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { shortUrls } from "@/db/schema";
import { nanoid } from "nanoid";
import { BASE_URL } from "@/utils/common";
import { CLIENT_IP_HEADER } from "@/lib/client-ip";
import { apiRateLimit, checkRateLimit } from "@/lib/in-memory-store";
import { logger } from "@/lib/logger";

const ALLOWED_HOSTS = new Set(["localhost", "coolsnippets.fun", "www.coolsnippets.fun"]);

function isUniqueViolation(error: unknown): boolean {
  const code = (e: unknown) => (e && typeof e === "object" && "code" in e ? e.code : undefined);
  return code(error) === "23505" || code((error as { cause?: unknown } | null)?.cause) === "23505";
}

export async function GET(req: NextRequest) {
  const { success } = await checkRateLimit(apiRateLimit, `shorten:${req.headers.get(CLIENT_IP_HEADER) ?? "unknown"}`);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const urlQuery = req.nextUrl.searchParams.get("url");
  const ref = req.nextUrl.searchParams.get("ref")?.slice(0, 64) ?? null;

  if (!urlQuery) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(urlQuery);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const allowed = ALLOWED_HOSTS.has(target.hostname) || target.hostname === req.nextUrl.hostname;
  if (!allowed) {
    return NextResponse.json({ error: "Unable to shorten this link" }, { status: 400 });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = nanoid(7);
    try {
      await db.insert(shortUrls).values({ code, url: target.href, ref });
      return NextResponse.json({ link: `${BASE_URL}/s/${code}` });
    } catch (error) {
      if (isUniqueViolation(error)) continue;
      logger.error({ err: error }, "[shorten-url] insert failed");
      break;
    }
  }

  return NextResponse.json({ error: "Unable to shorten this link" }, { status: 500 });
}
