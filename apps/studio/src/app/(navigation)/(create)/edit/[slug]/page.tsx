import type { Metadata } from "next";
import EditClient from "./page.client";

export const metadata: Metadata = {
  title: "Edit Snippet",
  description: "Loading snippet to edit...",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return [];
}

export default function EditPage() {
  return <EditClient />;
}
