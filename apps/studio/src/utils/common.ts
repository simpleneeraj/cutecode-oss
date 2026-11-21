export type refProps = "snippets" | "share-links" | string;

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function shortenUrl(url: string, ref: refProps) {
  const response = await fetch(`${BASE_URL}/api/shorten-url?url=${encodeURIComponent(url)}&ref=${ref}`).then((res) =>
    res.json(),
  );

  if (response.link) {
    return response.link as string;
  }

  console.error("Failed to shorten URL", response);

  throw new Error("Unable to shorten this link");
}
