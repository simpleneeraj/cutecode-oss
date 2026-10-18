import { Metadata } from "next";
import View from "@/components/view";
import { Header } from "../../components/header";

export const metadata: Metadata = {
  title: "Preview | CuteCode",
  description: "Preview your elegant code snippets on CuteCode.",
};

const PreviewSnippetLayout = async ({ children }: React.PropsWithChildren) => {
  return (
    <View className="layout-fill relative flex-1">
      <Header title="Preview" />
      <div className="layout-scroll">{children}</div>
    </View>
  );
};

export default PreviewSnippetLayout;
