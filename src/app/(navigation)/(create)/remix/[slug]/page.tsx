import type { Metadata } from "next";
import RemixClient from "./page.client";

export const metadata: Metadata = {
  title: "Remix Snippet",
  description: "Loading snippet to remix...",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RemixPage({ params }: PageProps) {
  const { slug } = await params;
  return <RemixClient slug={slug} />;
}
