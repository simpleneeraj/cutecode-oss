import { Metadata } from "next";
import View from "@/components/view";
import Navigations from "../../components/navigation";
import { PreviewSnippetHeader } from "../preview/components/preview-snippet-header";

export const metadata: Metadata = {
  title: "Preview | Cool Snippets",
  description: "Preview your elegant code snippets on Cool Snippets.",
};

const SnippetsLayout = async ({ children }: React.PropsWithChildren) => {
  return (
    <View className="layout-fill relative flex-1 bg-muted">
      <PreviewSnippetHeader title="Snippets">
        <Navigations />
      </PreviewSnippetHeader>
      {children}
    </View>
  );
};

export default SnippetsLayout;
