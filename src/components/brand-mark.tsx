import Image from "next/image";
import { cn } from "@/utils/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt=""
      width={200}
      height={200}
      priority
      className={cn("size-7 shrink-0 rounded-lg", className)}
    />
  );
}
