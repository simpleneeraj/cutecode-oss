import type { Metadata } from "next";
import RemixClient from "./page.client";

export const metadata: Metadata = {
  title: "Remix Snippet",
  description: "Loading snippet to remix...",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return [];
}

export default function RemixPage() {
  return <RemixClient />;
}
