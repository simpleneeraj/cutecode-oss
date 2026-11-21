import { createHmac, timingSafeEqual } from "node:crypto";

const TOLERANCE_SECONDS = 5 * 60;

export function isWebhookPath(url: string) {
  return new URL(url).pathname.endsWith("/dodopayments/webhooks");
}

export async function hasValidWebhookSignature(request: Request, secret = process.env.DODO_PAYMENTS_WEBHOOK_KEY ?? "") {
  const id = request.headers.get("webhook-id");
  const timestamp = request.headers.get("webhook-timestamp");
  const signatures = request.headers.get("webhook-signature");
  if (!secret || !id || !timestamp || !signatures) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${await request.text()}`).digest();
  return signatures.split(" ").some((entry) => {
    const [version, signature] = entry.split(",");
    const received = Buffer.from(signature ?? "", "base64");
    return version === "v1" && received.length === expected.length && timingSafeEqual(received, expected);
  });
}
