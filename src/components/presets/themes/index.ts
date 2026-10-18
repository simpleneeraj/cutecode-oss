import { Theme } from "@/typings/editor";
import { vercel } from "../vercel/theme";
import { rabbit } from "../rabbit/theme";
import { supabase } from "../supabase/theme";
import { tailwind } from "../tailwind/theme";
import { openai } from "../openai/theme";
import { mintlify } from "../mintlify/theme";
import { prisma } from "../prisma/theme";
import { clerk } from "../clerk/theme";
import { elevenlabs } from "../eleven-labs/theme";
import { resend } from "../resend/theme";
import { triggerdev } from "../triggerdev/theme";
import { nuxt } from "../nuxt/theme";
import { browserbase } from "../browserbase/theme";
import { cloudflare } from "../cloudflare/theme";
import { gemini } from "../gemini/theme";
import { stripe } from "../stripe/theme";
import { bitmap } from "../bitmap/theme";
import { noir } from "../noir/theme";
import { ice } from "../ice/theme";
import { sand } from "../sand/theme";
import { forest } from "../forest/theme";
import { mono } from "../mono/theme";
import { breeze } from "../breeze/theme";
import { candy } from "../candy/theme";
import { crimson } from "../crimson/theme";
import { falcon } from "../falcon/theme";
import { meadow } from "../meadow/theme";
import { midnight } from "../midnight/theme";
import { raindrop } from "../raindrop/theme";
import { sunset } from "../sunset/theme";
import { roses } from "../roses/theme";
import { claude } from "../claude/theme";
import { retroMac } from "../retro-mac/theme";
import { love } from "../love/theme";
import { valentine } from "../valentine/theme";
import { coffeeDate } from "../coffee-date/theme";
import { sunsetChill } from "../sunset-chill/theme";
import { ps6 } from "../ps6/theme";
import { auroraNights } from "../aurora-nights/theme";
import { starryNight } from "../starry-night/theme";
import { strawberryMilk } from "../strawberry-milk/theme";
import { frostedGlass } from "../frosted-glass/theme";
import { velvetNight } from "../velvet-night/theme";
import { peachyMood } from "../peachy-mood/theme";
import { neonDreams } from "../neon-dreams/theme";
import { goldenHour } from "../golden-hour/theme";
import { dusk } from "../dusk/theme";
import { fjord } from "../fjord/theme";
import { latte } from "../latte/theme";
import { neonCity } from "../neon-city/theme";
import { ember } from "../ember/theme";
import { carbonNight } from "../carbon-night/theme";
import { petal } from "../petal/theme";
import { paper } from "../paper/theme";
import { christmas } from "../christmas/theme";
import { halloween } from "../halloween/theme";
import { diwali } from "../diwali/theme";
import { newYear } from "../new-year/theme";
import { lunarNewYear } from "../lunar-new-year/theme";
import { holi } from "../holi/theme";
import { winterFrost } from "../winter-frost/theme";
import { vhs } from "../vhs/theme";
import { polaroid } from "../polaroid/theme";
import { typewriter } from "../typewriter/theme";
import { groovy70s } from "../groovy-70s/theme";
import { lofiRain } from "../lofi-rain/theme";
import { lofiRooftop } from "../lofi-rooftop/theme";
import { vinyl } from "../vinyl/theme";
import { cassette } from "../cassette/theme";

export const themes: { [index: string]: Theme } = {
  vercel,
  rabbit,
  supabase,
  tailwind,
  openai,
  mintlify,
  prisma,
  clerk,
  elevenlabs,
  resend,
  triggerdev,
  nuxt,
  browserbase,
  cloudflare,
  gemini,
  stripe,
  bitmap,
  noir,
  ice,
  sand,
  forest,
  mono,
  breeze,
  candy,
  crimson,
  falcon,
  meadow,
  midnight,
  raindrop,
  sunset,
  roses,
  claude,
  "retro-mac": retroMac,
  love,
  valentine,
  "coffee-date": coffeeDate,
  "sunset-chill": sunsetChill,
  ps6,
  "aurora-nights": auroraNights,
  "starry-night": starryNight,
  "strawberry-milk": strawberryMilk,
  "frosted-glass": frostedGlass,
  "velvet-night": velvetNight,
  "peachy-mood": peachyMood,
  "neon-dreams": neonDreams,
  "golden-hour": goldenHour,
  dusk,
  fjord,
  latte,
  "neon-city": neonCity,
  ember,
  "carbon-night": carbonNight,
  petal,
  paper,
  christmas,
  halloween,
  diwali,
  "new-year": newYear,
  "lunar-new-year": lunarNewYear,
  holi,
  "winter-frost": winterFrost,
  vhs,
  polaroid,
  typewriter,
  "groovy-70s": groovy70s,
  "lofi-rain": lofiRain,
  "lofi-rooftop": lofiRooftop,
  vinyl,
  cassette,
  // All 66 Shiki bundled themes — syntax rendered natively by Shiki
  // ...shikiThemes,
};
