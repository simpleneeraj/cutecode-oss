import { Theme, IconType } from "@/typings/editor";
import { convertToShikiTheme } from "../themes/shared";

export const tailwind: Theme = {
  id: "tailwind",
  name: "Tailwind",
  background: {
    from: "#36B6F0",
    to: "#36B6F0",
  },
  icon: { type: IconType.IMAGE, source: "/editor/assets/tailwind/logo.svg" },
  partner: true,
  group: "Brands",
  sample: {
    language: "TSX",
    fileName: "pricing-card.tsx",
    icon: "https://raw.githubusercontent.com/simpleneeraj/vscode-material-icon-theme/main/icons/tailwindcss.svg",
    code: 'export function PricingCard() {\n  return (\n    <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5">\n      <h3 className="text-base font-semibold text-slate-900">Pro</h3>\n      <p className="mt-4 text-4xl font-bold tracking-tight text-slate-900">$29</p>\n      <button className="mt-6 w-full rounded-lg bg-sky-500 px-4 py-2 text-white hover:bg-sky-600">\n        Get started\n      </button>\n    </div>\n  );\n}',
  },
  lineNumbers: true,
  font: "fira-code",
  syntax: {
    light: convertToShikiTheme({
      foreground: "#000",
      highlightBorder: "#0484C7",
      highlight: "rgba(25,147,211,0.10)",
      highlightHover: "rgba(25,147,211,0.06)",
    }),
    dark: convertToShikiTheme({
      foreground: "#fff",
      highlightBorder: "#C1B2F9",
      highlight: "rgba(193,178,249,0.12)",
      highlightHover: "rgba(193,178,249,0.07)",
    }),
  },
};
