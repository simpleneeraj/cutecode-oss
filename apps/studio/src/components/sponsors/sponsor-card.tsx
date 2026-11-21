import { cn } from "@cutecode/ui/lib/cn";
import Image from "next/image";
import { titleSponsor } from "@/lib/sponsors";
import { sponsorTier } from "@/lib/brand-presets";

export default function SponsorCard({ className }: { className?: string }) {
  const sponsor = titleSponsor();
  if (!sponsor) return null;

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="sponsored noopener"
      className={cn("flex items-center gap-2 rounded-md border p-2 text-xs transition-colors hover:bg-accent/50", className)}
    >
      <img src={sponsor.logo} alt="" loading="lazy" decoding="async" className="size-5 shrink-0 object-contain" />
      <span className="min-w-0 flex-1 truncate text-foreground">{sponsor.name}</span>
      <Image src={sponsorTier("title").badge} alt="" width={20} height={20} className="size-5 rounded" />
      <span className="text-muted-foreground">Sponsor</span>
    </a>
  );
}
