import type { Metadata } from "next";
import EditClient from "./page.client";

export const metadata: Metadata = {
  title: "Edit Snippet — CuteCode",
  description: "Loading snippet to edit...",
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditPage({ params }: PageProps) {
  const { slug } = await params;
  return <EditClient slug={slug} />;
}
