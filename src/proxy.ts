import { NextResponse, type NextRequest } from "next/server";
import { ensureRuntimeSecrets } from "@/lib/secrets";
import { CLIENT_IP_HEADER, clientIpFromHeaders } from "@/lib/client-ip";

const publicPaths = [
  /^\/$/,
  /^\/pricing(\/.*)?$/,
  /^\/checkout\/success(\/.*)?$/,
  /^\/checkout\/failure(\/.*)?$/,
  /^\/api\/auth(\/.*)?$/,
  /^\/api\/trpc(\/.*)?$/,
  /^\/api\/cron(\/.*)?$/,
  /^\/api\/shorten-url(\/.*)?$/,
  /^\/api\/avatar(\/.*)?$/,
  /^\/s(\/.*)?$/,
  /^\/waitlist(\/.*)?$/,
  /^\/legal\/terms(\/.*)?$/,
  /^\/legal\/privacy(\/.*)?$/,
  /^\/legal\/refund(\/.*)?$/,
  /^\/embed(\/.*)?$/,
  /^\/icon(\/.*)?$/,
  /^\/sitemap\.xml$/,
  /^\/robots\.txt$/,
  /^\/account(\/.*)?$/,
];

function isPublicPath(pathname: string) {
  return publicPaths.some((regex) => regex.test(pathname));
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  await ensureRuntimeSecrets();
  const { auth } = await import("@/lib/auth");
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session && !isPublicPath(pathname)) {
    const url = new URL("/account/sign-in", request.url);
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  const headers = new Headers(request.headers);
  headers.set(CLIENT_IP_HEADER, clientIpFromHeaders(request.headers));
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
