"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/components/link";
import { cn } from "@cutecode/ui/lib/cn";

const LEGAL_PAGES = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/refund", label: "Refunds" },
  { href: "/legal/credits", label: "Credits" },
];

export default function LegalNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Legal" className="md:sticky md:top-24 md:w-40 md:self-start">
      <ul className="flex gap-1 overflow-x-auto md:flex-col">
        {LEGAL_PAGES.map((page) => (
          <li key={page.href}>
            <Link
              href={page.href}
              aria-current={pathname === page.href ? "page" : undefined}
              className={cn(
                "flex h-8 items-center rounded-lg px-3 text-sm whitespace-nowrap transition-colors",
                pathname === page.href ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {page.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
