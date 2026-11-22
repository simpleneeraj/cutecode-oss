import type { Metadata } from "next";
import { Link } from "@/components/link";
import { BrandMark } from "@/components/brand-mark";
import siteConfig from "@/constants/site-config";
import { AuthShowcase } from "./components/auth-showcase";
import { authLayoutStyles } from "./components/style";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const styles = authLayoutStyles();

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.root()}>
      <div className={styles.column()}>
        <header className={styles.header()}>
          <Link href="/" className={styles.brand()}>
            <BrandMark preload />
            <span className={styles.brandName()}>{siteConfig.name}</span>
          </Link>
        </header>

        <main className={styles.main()}>
          <div className={styles.content()}>
            {children}

            <p className={styles.legal()}>
              By continuing, you agree to our{" "}
              <Link href="/legal/terms" className={styles.legalLink()}>
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className={styles.legalLink()}>
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
