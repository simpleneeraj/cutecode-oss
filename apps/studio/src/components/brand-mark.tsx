import Image from "next/image";
import { cn } from "@cutecode/ui/lib/cn";

export function BrandMark({ className, preload }: { className?: string; preload?: boolean }) {
  return (
    <Image
      src="/brand/logo-mark.svg"
      alt=""
      width={200}
      height={200}
      preload={preload}
      className={cn("size-7 shrink-0", className)}
    />
  );
}
