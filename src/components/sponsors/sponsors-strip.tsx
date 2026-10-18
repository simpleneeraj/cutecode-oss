import { cn } from "@/utils/cn";
import { featuredSponsors } from "@/lib/sponsors";

export default function SponsorsStrip({ className }: { className?: string }) {
  const sponsors = featuredSponsors();
  if (sponsors.length === 0) return null;

  return (
    <aside aria-label="Sponsors" className={cn("flex flex-wrap items-center gap-x-6 gap-y-2", className)}>
      <span className="text-xs text-muted-foreground">Sponsors</span>
      {sponsors.map((sponsor) => (
        <a
          key={sponsor.themeId}
          href={sponsor.url}
          target="_blank"
          rel="sponsored noopener"
          title={sponsor.name}
          className="opacity-70 transition-opacity hover:opacity-100"
        >
          <img src={sponsor.logo} alt={sponsor.name} loading="lazy" decoding="async" className="h-5 w-auto" />
        </a>
      ))}
    </aside>
  );
}
