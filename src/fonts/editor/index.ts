import { cn } from "@/utils/cn";
import localFont from "next/font/local";
import {
  Geist_Mono,
  Space_Mono,
  DM_Mono,
  Google_Sans_Code,
  Red_Hat_Mono,
  Atkinson_Hyperlegible_Mono,
  Martian_Mono,
  Azeret_Mono,
  Fragment_Mono,
  Reddit_Mono,
} from "next/font/google";

/* ------------------------------- */
/* Fonts (MUST be top-level const) */
/* ------------------------------- */

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-geist-mono",
});

const googleSansCode = Google_Sans_Code({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-google-sans-code",
  adjustFontFallback: false,
  fallback: ["monospace", "sans-serif"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-space-mono",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-dm-mono",
});

const redHatMono = Red_Hat_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-red-hat-mono",
});

const atkinsonHyperlegibleMono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-atkinson-hyperlegible-mono",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-martian-mono",
});

const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-azeret-mono",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-fragment-mono",
});

const redditMono = Reddit_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-reddit-mono",
});

const commitMono = localFont({
  src: "./commit-mono-regular.woff2",
  variable: "--font-commitmono",
  display: "swap",
  preload: false,
});

const cascadiaCode = localFont({
  src: "./cascadia-code/cascadia-code.woff2",
  variable: "--font-cascadia-code",
  display: "swap",
  preload: false,
});

const comicMono = localFont({
  src: "./comic-mono/comic-mono.ttf",
  variable: "--font-comic-mono",
  display: "swap",
  preload: false,
});

const droidSansMono = localFont({
  src: "./ligaturized/droid-sans-mono.ttf",
  variable: "--font-droid-sans-mono",
  display: "swap",
  preload: false,
});

const fantasqueSansMono = localFont({
  src: "./ligaturized/fantasque-sans-mono.ttf",
  variable: "--font-fantasque-sans-mono",
  display: "swap",
  preload: false,
});

const firaCode = localFont({
  src: "./fira-code/fira-code-regular.woff2",
  variable: "--font-fira-code-regular",
  display: "swap",
  preload: false,
});

const hachiMaruPop = localFont({
  src: "./hachi-maru-pop/hachi-maru-pop.woff",
  variable: "--font-hachi-maru-pop",
  display: "swap",
  preload: false,
});

const hack = localFont({
  src: "./ligaturized/hack.ttf",
  variable: "--font-hack",
  display: "swap",
  preload: false,
});

const haskligItalic = localFont({
  src: "./hasklig/hasklig-it.ttf",
  variable: "--font-hasklig-it",
  display: "swap",
  preload: false,
});

const haskligRegular = localFont({
  src: "./hasklig/hasklig-regular.ttf",
  variable: "--font-hasklig-regular",
  display: "swap",
  preload: false,
});

const ibmPlexMono = localFont({
  src: "./i-b-m-plex-mono/i-b-m-plex-mono.ttf",
  variable: "--font-i-b-m-plex-mono",
  display: "swap",
  preload: false,
});

const inconsolata = localFont({
  src: "./inconsolata/inconsolata.ttf",
  variable: "--font-inconsolata",
  display: "swap",
  preload: false,
});

const iosevka = localFont({
  src: "./iosevka/iosevka-regular.woff2",
  variable: "--font-iosevka-regular",
  display: "swap",
  preload: false,
});

const jetBrainsMono = localFont({
  src: "./jet-brains-mono/jet-brains-mono.ttf",
  variable: "--font-jet-brains-mono",
  display: "swap",
  preload: false,
});
const majorMonoDisplay = localFont({
  src: "./major-mono/major-mono-display.ttf",
  variable: "--font-major-mono-display",
  display: "swap",
  preload: false,
});
const monoidItalic = localFont({
  src: "./monoid/monoid-italic.ttf",
  variable: "--font-monoid-italic",
  display: "swap",
  preload: false,
});

const monoidRegular = localFont({
  src: "./monoid/monoid-regular.ttf",
  variable: "--font-monoid-regular",
  display: "swap",
  preload: false,
});

const monoidRetina = localFont({
  src: "./monoid/monoid-retina.ttf",
  variable: "--font-monoid-retina",
  display: "swap",
  preload: false,
});

const robotoMono = localFont({
  src: "./roboto-mono/roboto-mono.ttf",
  variable: "--font-roboto-mono",
  display: "swap",
  preload: false,
});

const sourceCodePro = localFont({
  src: "./source-code-pro/source-code-pro.ttf",
  variable: "--font-source-code-pro",
  display: "swap",
  preload: false,
});

const sweet = localFont({
  src: "./sweet16/sweet.ttf",
  variable: "--font-sweet",
  display: "swap",
  preload: false,
});

const syneMono = localFont({
  src: "./syne-mono/syne-mono.ttf",
  variable: "--font-syne-mono",
  display: "swap",
  preload: false,
});

const ubuntuMono = localFont({
  src: "./ubuntu-mono/ubuntu-mono.ttf",
  variable: "--font-ubuntu-mono",
  display: "swap",
  preload: false,
});

const victorMonoItalic = localFont({
  src: "./victor-mono-all/victor-mono-italic.woff2",
  variable: "--font-victor-mono-italic",
  display: "swap",
  preload: false,
});

const victorMonoRegular = localFont({
  src: "./victor-mono-all/victor-mono-regular.woff2",
  variable: "--font-victor-mono-regular",
  display: "swap",
  preload: false,
});

const xanhMonoItalic = localFont({
  src: "./xanh-mono/xanh-mono-italic.ttf",
  variable: "--font-xanh-mono-italic",
  display: "swap",
  preload: false,
});

const xanhMonoRegular = localFont({
  src: "./xanh-mono/xanh-mono-regular.ttf",
  variable: "--font-xanh-mono-regular",
  display: "swap",
  preload: false,
});

/* ------------------------------- */
/* Combined Variables              */
/* ------------------------------- */

const fontVariables = cn(
  cascadiaCode.variable,
  comicMono.variable,
  droidSansMono.variable,
  fantasqueSansMono.variable,
  firaCode.variable,
  hachiMaruPop.variable,
  hack.variable,
  haskligItalic.variable,
  haskligRegular.variable,
  ibmPlexMono.variable,
  inconsolata.variable,
  iosevka.variable,
  jetBrainsMono.variable,
  monoidItalic.variable,
  monoidRegular.variable,
  monoidRetina.variable,
  robotoMono.variable,
  sourceCodePro.variable,
  sweet.variable,
  syneMono.variable,
  ubuntuMono.variable,
  victorMonoItalic.variable,
  victorMonoRegular.variable,
  xanhMonoItalic.variable,
  xanhMonoRegular.variable,
  geistMono.variable,
  spaceMono.variable,
  dmMono.variable,
  commitMono.variable,
  majorMonoDisplay.variable,
  googleSansCode.variable,
  redHatMono.variable,
  atkinsonHyperlegibleMono.variable,
  martianMono.variable,
  azeretMono.variable,
  fragmentMono.variable,
  redditMono.variable,
);

export default fontVariables;
