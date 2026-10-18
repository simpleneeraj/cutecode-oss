import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background text-foreground">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 px-4 py-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" fill="none" className="size-4.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 9L11 12L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-xl">Cool Snippets</span>
        </Link>

        {children}

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to Cool Snippets&apos;s{" "}
          <Link href="/legal/terms" className="underline underline-offset-2 hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
