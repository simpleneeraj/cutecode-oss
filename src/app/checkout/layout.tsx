import type { Metadata } from "next";
import { Link } from "@/components/link";
import { BrandMark } from "@/components/brand-mark";
import siteConfig from "@/constants/site-config";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="flex h-14 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <BrandMark />
          <span className="font-heading font-semibold tracking-tight">{siteConfig.name}</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-14">{children}</main>
    </div>
  );
}
