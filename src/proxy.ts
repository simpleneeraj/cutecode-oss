import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { ensureRuntimeSecrets } from "@/lib/secrets";
import { CLIENT_IP_HEADER, clientIpFromHeaders } from "@/lib/client-ip";

const protectedPaths = [/^\/dashboard(\/.*)?$/, /^\/edit(\/.*)?$/, /^\/remix(\/.*)?$/];

function isProtectedPath(pathname: string) {
  return protectedPaths.some((regex) => regex.test(pathname));
}

function redirectToSignIn(request: NextRequest) {
  const url = new URL("/account/sign-in", request.url);
  url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export default async function proxy(request: NextRequest) {
  await ensureRuntimeSecrets();

  if (isProtectedPath(request.nextUrl.pathname) && !getSessionCookie(request)) {
    return redirectToSignIn(request);
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
