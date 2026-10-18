import { Metadata } from "next";
import View from "@/components/view";
import { Header } from "../../components/header";

export const metadata: Metadata = {
  title: "Snippets",
  description: "Preview your elegant code snippets on CuteCode.",
};

const SnippetsLayout = async ({ children }: React.PropsWithChildren) => {
  return (
    <View className="layout-fill relative flex-1 bg-muted">
      <Header title="Snippets" />
      <div className="layout-scroll">{children}</div>
    </View>
  );
};

export default SnippetsLayout;
