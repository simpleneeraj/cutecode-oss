import { Metadata } from "next";
import View from "@/components/view";
import { PreviewSnippetHeader } from "../preview/components/preview-snippet-header";

export const metadata: Metadata = {
  title: "Preview | Cool Snippets",
  description: "Preview your elegant code snippets on Cool Snippets.",
};

const PreviewSnippetLayout = async ({ children }: React.PropsWithChildren) => {
  return (
    <View className="layout-fill relative flex-1">
      <PreviewSnippetHeader title="Preview" />
      {children}
    </View>
  );
};

export default PreviewSnippetLayout;
