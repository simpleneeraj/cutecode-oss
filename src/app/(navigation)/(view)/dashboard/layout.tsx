import { Metadata } from "next";
import View from "@/components/view";
import Navigations from "../../components/navigation";
import { PreviewSnippetHeader } from "../preview/components/preview-snippet-header";

export const metadata: Metadata = {
  title: "Dashboard | Cool Snippets",
  description: "Your Cool Snippets creator analytics — views, upvotes, followers, and snippet performance.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <View className="layout-fill relative flex-1 bg-muted">
      <PreviewSnippetHeader title="Dashboard">
        <Navigations />
      </PreviewSnippetHeader>
      {children}
    </View>
  );
}
