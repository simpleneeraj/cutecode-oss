import { isIP } from "node:net";

export const CLIENT_IP_HEADER = "x-client-ip";

function parseIp(value: string | null | undefined): string {
  const candidate = value?.trim();
  if (!candidate) return "unknown";
  return isIP(candidate) === 0 ? "unknown" : candidate.toLowerCase();
}

function stripPort(address: string): string {
  return address.replace(/^\[(.+)\]:\d+$/, "$1").replace(/^([^:]+):\d+$/, "$1");
}

export function clientIpFromHeaders(headers: Headers): string {
  const viewer = headers.get("cloudfront-viewer-address");
  if (viewer) return parseIp(stripPort(viewer.trim()));
  const forwarded = headers.get("x-forwarded-for")?.split(",").pop();
  if (forwarded?.trim()) return parseIp(forwarded);
  return parseIp(headers.get("x-real-ip"));
}
