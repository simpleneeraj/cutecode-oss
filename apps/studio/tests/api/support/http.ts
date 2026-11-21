import { createHmac, randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import { CLIENT_IP_HEADER } from "@/lib/client-ip";
import { AUTH_SECRET, BASE_URL, WEBHOOK_SECRET } from "./env";

export const WEBHOOK_URL = `${BASE_URL}/api/auth/dodopayments/webhooks`;

function webhookSignature(id: string, timestamp: string, body: string, secret = WEBHOOK_SECRET) {
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  return `v1,${createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64")}`;
}

export function webhookRequest(payload: object, { secret = WEBHOOK_SECRET, id = `msg_${randomUUID()}` } = {}) {
  const body = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  return new Request(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "webhook-id": id,
      "webhook-timestamp": timestamp,
      "webhook-signature": webhookSignature(id, timestamp, body, secret),
    },
    body,
  });
}

export async function sessionCookie(userId: string) {
  const context = await auth.$context;
  const session = await context.internalAdapter.createSession(userId);
  const signature = createHmac("sha256", AUTH_SECRET).update(session.token).digest("base64");
  return `better-auth.session_token=${encodeURIComponent(`${session.token}.${signature}`)}`;
}

export function authRequest(path: string, { body, ip, cookie }: { body?: object; ip?: string; cookie?: string } = {}) {
  const headers = new Headers({ "content-type": "application/json", origin: BASE_URL });
  if (ip) headers.set(CLIENT_IP_HEADER, ip);
  if (cookie) headers.set("cookie", cookie);
  return new Request(`${BASE_URL}/api/auth${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body ?? {}),
  });
}
