import { Metadata } from "next";
import View from "@/components/view";
import { Header } from "../../components/header";

export const metadata: Metadata = {
  title: "Dashboard | CuteCode",
  description: "Your CuteCode creator analytics — views, upvotes, followers, and snippet performance.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <View className="layout-fill relative flex-1 bg-muted">
      <Header title="Dashboard" />
      <div className="layout-scroll">{children}</div>
    </View>
  );
}
