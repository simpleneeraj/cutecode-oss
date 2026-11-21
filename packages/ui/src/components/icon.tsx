"use client";

import * as React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "../lib/cn";
import {
  AddSquareIcon,
  ArrowLeft01Icon,
  BirthdayCakeIcon,
  CancelCircleIcon,
  CancelSquareIcon,
  CheckmarkBadgeIcon,
  CheckmarkCircleIcon,
  CherryIcon,
  ChocolateIcon,
  CircleIcon,
  CodeIcon,
  CodeSquareIcon,
  CoffeeIcon,
  CandyIcon,
  Copy01Icon,
  CookieIcon,
  CreditCardIcon,
  CroissantIcon,
  CrownIcon,
  CupcakeIcon,
  Download02Icon,
  EyeIcon,
  FallingStarIcon,
  FavouriteIcon,
  FlowerIcon,
  GameController01Icon,
  GiftIcon,
  Globe02Icon,
  InfinityIcon,
  KeyboardIcon,
  LayoutGridIcon,
  Leaf01Icon,
  Link01Icon,
  LockPasswordIcon,
  Login01Icon,
  Logout01Icon,
  Mail01Icon,
  Moon02Icon,
  PieIcon,
  QuestionIcon,
  RedoIcon,
  RibbonIcon,
  RoseIcon,
  Settings01Icon,
  Share01Icon,
  ShieldKeyIcon,
  SparklesIcon,
  SquareIcon,
  StarIcon,
  SunsetIcon,
  Sun02Icon,
  TriangleIcon,
  Undo02Icon,
  UserGroupIcon,
  UserLoveIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons";

type IconProps = Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
  icon: string;
  width?: number | string;
  height?: number | string;
};

const BRAND: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  "ri:twitter-x-fill": ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  ),
  "ri:linkedin-fill": ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z" />
    </svg>
  ),
  "ri:facebook-circle-fill": ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.879v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10Z" />
    </svg>
  ),
  "mingcute:apple-fill": ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M17.05 12.04c-.03-2.47 2.02-3.66 2.11-3.72-1.15-1.68-2.94-1.91-3.58-1.94-1.52-.15-2.97.9-3.74.9-.77 0-1.96-.88-3.23-.86-1.66.03-3.19.97-4.04 2.46-1.72 2.99-.44 7.41 1.23 9.84.82 1.19 1.79 2.52 3.07 2.47 1.23-.05 1.7-.8 3.19-.8 1.49 0 1.91.8 3.22.77 1.33-.02 2.17-1.21 2.98-2.41.94-1.38 1.33-2.72 1.35-2.79-.03-.01-2.59-.99-2.62-3.93ZM14.6 4.84c.68-.83 1.14-1.97 1.01-3.11-.98.04-2.17.65-2.87 1.47-.63.73-1.18 1.9-1.03 3.02 1.09.09 2.21-.55 2.89-1.38Z" />
    </svg>
  ),
};

const ALIAS: Record<string, IconSvgElement> = {
  "fluent-emoji-flat:sparkles": SparklesIcon,
  "fluent-emoji:cherry": CherryIcon,
  "fluent-emoji:heart-suit": FavouriteIcon,
  "fluent-emoji:crescent-moon": Moon02Icon,
  "fluent-emoji:hot-beverage": CoffeeIcon,
  "fluent-emoji:sunset": SunsetIcon,
  "fluent-emoji:high-voltage": ZapIcon,
  "fluent-emoji:cherry-blossom": FlowerIcon,
  "fluent-emoji-flat:cherry-blossom": FlowerIcon,
  "fluent-emoji:croissant": CroissantIcon,
  "fluent-emoji:cookie": CookieIcon,
  "fluent-emoji:doughnut": CupcakeIcon,
  "fluent-emoji:pancakes": BirthdayCakeIcon,
  "fluent-emoji:pie": PieIcon,
  "fluent-emoji:cupcake": CupcakeIcon,
  "fluent-emoji:chocolate-bar": ChocolateIcon,
  "fluent-emoji:bagel": CupcakeIcon,
  "fluent-emoji:maple-leaf": Leaf01Icon,
  "fluent-emoji-flat:red-heart": FavouriteIcon,
  "fluent-emoji-flat:ribbon": RibbonIcon,
  "noto:beating-heart": FavouriteIcon,
  "noto:bouquet": FlowerIcon,
  "noto:candy": CandyIcon,
  "noto:cherry-blossom": FlowerIcon,
  "noto:envelope-with-arrow": Mail01Icon,
  "noto:heart-suit": FavouriteIcon,
  "noto:heart-with-arrow": FavouriteIcon,
  "noto:love-letter": Mail01Icon,
  "noto:ribbon": RibbonIcon,
  "noto:rose": RoseIcon,
  "noto:sparkling-heart": FavouriteIcon,
  "noto:two-hearts": FavouriteIcon,
  "noto:wrapped-gift": GiftIcon,
  "ph:circle": CircleIcon,
  "ph:square": SquareIcon,
  "ph:triangle": TriangleIcon,
  "ph:star-four-fill": StarIcon,
  "ph:flower-lotus-fill": FlowerIcon,
  "ph:shooting-star-fill": FallingStarIcon,
  "ph:confetti-fill": SparklesIcon,
  "ph:x-square-fill": CancelSquareIcon,
  "simple-icons:playstation": GameController01Icon,
  "vscode-icons:file-type-typescript-official": CodeSquareIcon,
  "pixelarticons:heart": FavouriteIcon,
  "devicon:git": CodeSquareIcon,
};

const SOLAR_BASE: Record<string, IconSvgElement> = {
  crown: CrownIcon,
  copy: Copy01Icon,
  link: Link01Icon,
  "link-minimalistic-2": Link01Icon,
  "check-circle": CheckmarkCircleIcon,
  "verified-check": CheckmarkBadgeIcon,
  share: Share01Icon,
  letter: Mail01Icon,
  "arrow-left": ArrowLeft01Icon,
  "code-square": CodeSquareIcon,
  "add-square": AddSquareIcon,
  "heart-shine": FavouriteIcon,
  "heart-pulse": FavouriteIcon,
  "heart-angle": FavouriteIcon,
  heart: FavouriteIcon,
  like: FavouriteIcon,
  infinity: InfinityIcon,
  gamepad: GameController01Icon,
  keyboard: KeyboardIcon,
  "question-circle": QuestionIcon,
  "undo-left-round": Undo02Icon,
  "undo-right-round": RedoIcon,
  "archive-down-minimlistic": Download02Icon,
  "widget-2": LayoutGridIcon,
  card: CreditCardIcon,
  "settings-minimalistic": Settings01Icon,
  "logout-3": Logout01Icon,
  "login-3": Login01Icon,
  "close-circle": CancelCircleIcon,
  circle: CircleIcon,
  square: SquareIcon,
  triangle: TriangleIcon,
  eye: EyeIcon,
  gift: GiftIcon,
  global: Globe02Icon,
  "lock-password": LockPasswordIcon,
  "shield-keyhole-minimalistic": ShieldKeyIcon,
  "moon-stars": Moon02Icon,
  "user-heart-rounded": UserLoveIcon,
  "users-group-rounded": UserGroupIcon,
  code: CodeIcon,
  sun: Sun02Icon,
  sunset: SunsetIcon,
  stars: SparklesIcon,
  "stars-minimalistic": StarIcon,
  leaf: Leaf01Icon,
};

const STYLE_SUFFIXES = ["bold-duotone", "line-duotone", "duotone", "outline", "linear", "broken", "bold", "line"];

function resolveSolar(icon: string): IconSvgElement | null {
  const colon = icon.indexOf(":");
  let rest = colon === -1 ? icon : icon.slice(colon + 1);
  for (const suffix of STYLE_SUFFIXES) {
    const tag = `-${suffix}`;
    if (rest.endsWith(tag)) {
      rest = rest.slice(0, -tag.length);
      break;
    }
  }
  return SOLAR_BASE[rest] ?? null;
}

export function Icon({ icon, className, width, height, style, strokeWidth, ...props }: IconProps) {
  const size = width ?? height;
  const iconClassName = size === undefined ? cn("size-4", className) : className;
  const stroke =
    typeof strokeWidth === "number" ? strokeWidth : strokeWidth ? Number(strokeWidth) : undefined;

  const Brand = BRAND[icon];
  if (Brand) return <Brand className={cn("inline-block size-4", className)} style={style} />;

  const aliasIcon = ALIAS[icon];
  if (aliasIcon) {
    return (
      <HugeiconsIcon icon={aliasIcon} size={size} className={iconClassName} style={style} strokeWidth={stroke} {...props} />
    );
  }

  const resolved = resolveSolar(icon);
  if (resolved) {
    return (
      <HugeiconsIcon icon={resolved} size={size} className={iconClassName} style={style} strokeWidth={stroke} {...props} />
    );
  }

  return (
    <HugeiconsIcon icon={QuestionIcon} size={size} className={iconClassName} style={style} strokeWidth={stroke} {...props} />
  );
}

export default Icon;
