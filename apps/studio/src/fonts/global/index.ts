import { cn } from "@cutecode/ui/lib/cn";
import { Kablammo, Nothing_You_Could_Do, Delius, Cabin_Sketch } from "next/font/google";

/* ------------------------------- */
/* App Fonts                       */
/* ------------------------------- */

const kablammo = Kablammo({ subsets: ["latin"], weight: "variable", variable: "--kablammo", preload: false });

const nothingYouCouldDo = Nothing_You_Could_Do({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--nothing-you-could-do",
  preload: false,
});
const delius = Delius({ weight: ["400"], subsets: ["latin"], variable: "--delius", preload: false });
const cabinSketch = Cabin_Sketch({ weight: ["400", "700"], subsets: ["latin"], variable: "--cabin-sketch", preload: false });

export default cn(kablammo.variable, nothingYouCouldDo.variable, delius.variable, cabinSketch.variable);
