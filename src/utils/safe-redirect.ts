const PLACEHOLDER_ORIGIN = "http://same-origin.invalid";

export function safeRedirectPath(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || /[\\\u0000-\u001f]/.test(value)) return fallback;
  const url = new URL(value, PLACEHOLDER_ORIGIN);
  if (url.origin !== PLACEHOLDER_ORIGIN || value.startsWith("//")) return fallback;
  return `${url.pathname}${url.search}${url.hash}`;
}
