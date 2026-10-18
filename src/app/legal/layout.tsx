import { Link } from "@/components/link";
import { BrandMark } from "@/components/brand-mark";
import LegalNav from "./components/legal-nav";

type LegalLayoutProps = {
  children: React.ReactNode;
};

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <BrandMark className="size-6" />
            CuteCode
          </Link>
          <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Open editor
          </Link>
        </div>
      </header>
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:flex-row md:gap-16 md:py-16">
        <LegalNav />
        <article className="prose prose-sm prose-neutral min-w-0 max-w-2xl flex-1 dark:prose-invert prose-headings:tracking-tight prose-h1:mb-2 prose-h1:text-3xl prose-h1:font-semibold prose-h2:mt-10 prose-h2:mb-3 prose-h2:text-lg prose-h2:font-semibold prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:font-medium prose-a:text-foreground prose-a:underline-offset-2 prose-strong:text-foreground">
          {children}
        </article>
      </div>
    </div>
  );
}
