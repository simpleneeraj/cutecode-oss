import { FontPairing, fontPairings } from "@cutecode/ui/provider";
import {
  Archivo,
  Archivo_Black,
  DM_Mono,
  DM_Sans,
  DM_Serif_Display,
  Fira_Code,
  Fraunces,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Serif,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Nunito,
  Nunito_Sans,
  Outfit,
  Source_Sans_3,
  Space_Grotesk,
  Space_Mono,
  Zilla_Slab,
} from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], preload: false });
const sourceSans = Source_Sans_3({ subsets: ["latin"], preload: false });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], preload: false });
const inter = Inter({ subsets: ["latin"], preload: false });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", preload: false });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], preload: false });
const nunito = Nunito({ subsets: ["latin"], preload: false });
const nunitoSans = Nunito_Sans({ subsets: ["latin"], preload: false });
const firaCode = Fira_Code({ subsets: ["latin"], preload: false });
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", preload: false });
const archivo = Archivo({ subsets: ["latin"], preload: false });
const zillaSlab = Zilla_Slab({ subsets: ["latin"], weight: ["400", "600", "700"], preload: false });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], preload: false });
const outfit = Outfit({ subsets: ["latin"], preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], preload: false });
const dmSerifDisplay = DM_Serif_Display({ subsets: ["latin"], weight: "400", preload: false });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], preload: false });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ["latin"], preload: false });
const ibmPlexSerif = IBM_Plex_Serif({ subsets: ["latin"], weight: ["400", "600"], preload: false });

const loadedFamilies = new Map([
  ["Fraunces", fraunces],
  ["Source Sans 3", sourceSans],
  ["IBM Plex Mono", ibmPlexMono],
  ["Space Grotesk", spaceGrotesk],
  ["Inter", inter],
  ["Instrument Serif", instrumentSerif],
  ["JetBrains Mono", jetBrainsMono],
  ["Nunito", nunito],
  ["Nunito Sans", nunitoSans],
  ["Fira Code", firaCode],
  ["Archivo Black", archivoBlack],
  ["Archivo", archivo],
  ["Zilla Slab", zillaSlab],
  ["Space Mono", spaceMono],
  ["Outfit", outfit],
  ["DM Sans", dmSans],
  ["DM Serif Display", dmSerifDisplay],
  ["DM Mono", dmMono],
  ["IBM Plex Sans", ibmPlexSans],
  ["IBM Plex Serif", ibmPlexSerif],
]);

function swapLoadedFamilies(stack: string) {
  return stack.replace(/"([^"]+)"/g, (quoted, family: string) => loadedFamilies.get(family)?.style.fontFamily ?? quoted);
}

function renderPairingRule(pairing: FontPairing) {
  const stack = fontPairings[pairing];
  const declarations = [
    `--font-heading: ${swapLoadedFamilies(stack.fontHeading)};`,
    `--font-sans: ${swapLoadedFamilies(stack.fontSans)};`,
    `--font-serif: ${swapLoadedFamilies(stack.fontSerif)};`,
    `--font-mono: ${swapLoadedFamilies(stack.fontMono)};`,
  ];
  return `html[data-font="${pairing}"], html [data-font="${pairing}"] { ${declarations.join(" ")} }`;
}

export const fontPairingCss = Object.values(FontPairing).map(renderPairingRule).join("\n");
