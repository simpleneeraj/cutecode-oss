import type { Metadata } from "next";
import { Link } from "@/components/link";
import { BrandMark } from "@/components/brand-mark";
import siteConfig from "@/constants/site-config";
import { AuthShowcase } from "./components/auth-showcase";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh bg-background text-foreground lg:grid-cols-2">
      <div className="flex flex-col px-4 py-4 sm:px-8 sm:py-6">
        <header className="flex h-10 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandMark preload />
            <span className="font-heading font-semibold tracking-tight">{siteConfig.name}</span>
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center py-8">
          <div className="flex w-full max-w-sm flex-col gap-6">
            {children}

            <p className="text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/legal/terms" className="underline underline-offset-2 hover:text-foreground">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-foreground">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </main>
      </div>

      <AuthShowcase />
    </div>
  );
}
