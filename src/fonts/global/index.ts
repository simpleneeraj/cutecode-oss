import { cn } from "@/utils/cn";
import { Kablammo, Nothing_You_Could_Do, Delius, Cabin_Sketch, Bricolage_Grotesque } from "next/font/google";

/* ------------------------------- */
/* App Fonts                       */
/* ------------------------------- */

const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz"],
});

const kablammo = Kablammo({ subsets: ["latin"], weight: "variable", variable: "--kablammo" });

const nothingYouCouldDo = Nothing_You_Could_Do({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--nothing-you-could-do",
});
const delius = Delius({ weight: ["400"], subsets: ["latin"], variable: "--delius" });
const cabinSketch = Cabin_Sketch({ weight: ["400", "700"], subsets: ["latin"], variable: "--cabin-sketch" });

// Applied at the root layout so portaled overlays (dialog/sheet titles) inherit the heading font.
export const headingFontVariable = fontHeading.variable;

export default cn(
  kablammo.variable,
  nothingYouCouldDo.variable,
  delius.variable,
  cabinSketch.variable,
  fontHeading.variable,
);
