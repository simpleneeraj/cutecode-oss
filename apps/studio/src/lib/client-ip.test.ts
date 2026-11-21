import { describe, expect, it } from "vitest";
import { clientIpFromHeaders } from "./client-ip";

describe("clientIpFromHeaders", () => {
  it("prefers the CloudFront viewer address without its port", () => {
    const headers = new Headers({ "cloudfront-viewer-address": "203.0.113.7:51234", "x-forwarded-for": "1.1.1.1" });
    expect(clientIpFromHeaders(headers)).toBe("203.0.113.7");
  });

  it("strips the port from an IPv6 viewer address", () => {
    const headers = new Headers({ "cloudfront-viewer-address": "[2001:db8::1]:443" });
    expect(clientIpFromHeaders(headers)).toBe("2001:db8::1");
  });

  it("takes the last x-forwarded-for hop so a spoofed first entry is ignored", () => {
    const headers = new Headers({ "x-forwarded-for": "6.6.6.6, 198.51.100.4" });
    expect(clientIpFromHeaders(headers)).toBe("198.51.100.4");
  });

  it("returns unknown for garbage", () => {
    expect(clientIpFromHeaders(new Headers({ "x-forwarded-for": "not-an-ip" }))).toBe("unknown");
    expect(clientIpFromHeaders(new Headers())).toBe("unknown");
  });
});
