import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { hasValidWebhookSignature, isWebhookPath } from "@/lib/billing/webhook-signature";

const handler = toNextJsHandler(auth);

export const GET = handler.GET;

export async function POST(request: NextRequest) {
  if (isWebhookPath(request.url) && !(await hasValidWebhookSignature(request.clone()))) {
    return Response.json({ message: "Invalid webhook signature" }, { status: 401 });
  }
  return handler.POST(request);
}
