import fonts from "@/fonts/editor/fonts";
import type { Credit } from "./credit-list";

const fontCredits = fonts.map((font) => ({
  name: font.originalName,
  href: font.source_url,
  license: font.license,
  by: font.provider,
}));

export const FONT_CREDITS: Credit[] = fontCredits.filter(
  (credit, index) => fontCredits.findIndex((other) => other.href === credit.href) === index,
);

export const LIBRARY_CREDITS: Credit[] = [
  { name: "ray.so", href: "https://github.com/raycast/ray-so", license: "MIT", by: "Raycast" },
  { name: "Next.js", href: "https://nextjs.org", license: "MIT", by: "Vercel" },
  { name: "React", href: "https://react.dev", license: "MIT", by: "Meta" },
  { name: "Shiki", href: "https://shiki.style", license: "MIT" },
  { name: "Motion", href: "https://motion.dev", license: "MIT" },
  { name: "Jotai", href: "https://jotai.org", license: "MIT" },
  { name: "Radix UI", href: "https://www.radix-ui.com", license: "MIT" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com", license: "MIT" },
  { name: "Mediabunny", href: "https://mediabunny.dev", license: "MPL-2.0" },
  { name: "Hugeicons", href: "https://hugeicons.com", license: "MIT" },
];
