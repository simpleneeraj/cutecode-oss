import { Suspense, useDeferredValue } from "react";
import dynamic from "next/dynamic";
import { useAtomValue, useSetAtom } from "jotai";
import { presetsAtom, updateSlideElementAtom } from "@/store/editor/editor";
import { BaseFrameProps } from "@/typings/presets";
import DefaultFrame from "./default";
import ThemeLoadingPill from "./theme-loading-pill";
import Editor from "../editor/textarea";
import { themes } from "./themes";

const VercelFrame = dynamic<BaseFrameProps>(() => import("./vercel"));
const RabbitFrame = dynamic<BaseFrameProps>(() => import("./rabbit"));
const SupabaseFrame = dynamic<BaseFrameProps>(() => import("./supabase"));
const OpenAIFrame = dynamic<BaseFrameProps>(() => import("./openai"));
const TailwindFrame = dynamic<BaseFrameProps>(() => import("./tailwind"));
const ClerkFrame = dynamic<BaseFrameProps>(() => import("./clerk"));
const MintlifyFrame = dynamic<BaseFrameProps>(() => import("./mintlify"));
const TriggerdevFrame = dynamic<BaseFrameProps>(() => import("./triggerdev"));
const PrismaFrame = dynamic<BaseFrameProps>(() => import("./prisma"));
const ElevenLabsFrame = dynamic<BaseFrameProps>(() => import("./eleven-labs"));
const ResendFrame = dynamic<BaseFrameProps>(() => import("./resend"));
const BrowserbaseFrame = dynamic<BaseFrameProps>(() => import("./browserbase"));
const NuxtFrame = dynamic<BaseFrameProps>(() => import("./nuxt"));
const GeminiFrame = dynamic<BaseFrameProps>(() => import("./gemini"));
const CloudflareFrame = dynamic<BaseFrameProps>(() => import("./cloudflare"));
const StripeFrame = dynamic<BaseFrameProps>(() => import("./stripe"));
const DodoPaymentsFrame = dynamic<BaseFrameProps>(() => import("./dodo-payments"));
const RosesFrame = dynamic<BaseFrameProps>(() => import("./roses"));
const ClaudeFrame = dynamic<BaseFrameProps>(() => import("./claude"));
const RetroMacFrame = dynamic<BaseFrameProps>(() => import("./retro-mac"));
const LoveFrame = dynamic<BaseFrameProps>(() => import("./love"));
const ValentineFrame = dynamic<BaseFrameProps>(() => import("./valentine"));
const CoffeeDateFrame = dynamic<BaseFrameProps>(() => import("./coffee-date"));
const SunsetChillFrame = dynamic<BaseFrameProps>(() => import("./sunset-chill"));
const PS6Frame = dynamic<BaseFrameProps>(() => import("./ps6"));
const AuroraNightsFrame = dynamic<BaseFrameProps>(() => import("./aurora-nights"));
const StarryNightFrame = dynamic<BaseFrameProps>(() => import("./starry-night"));
const StrawberryMilkFrame = dynamic<BaseFrameProps>(() => import("./strawberry-milk"));
const FrostedGlassFrame = dynamic<BaseFrameProps>(() => import("./frosted-glass"));
const VelvetNightFrame = dynamic<BaseFrameProps>(() => import("./velvet-night"));
const PeachyMoodFrame = dynamic<BaseFrameProps>(() => import("./peachy-mood"));
const NeonDreamsFrame = dynamic<BaseFrameProps>(() => import("./neon-dreams"));
const GoldenHourFrame = dynamic<BaseFrameProps>(() => import("./golden-hour"));
const ChristmasFrame = dynamic<BaseFrameProps>(() => import("./christmas"));
const HalloweenFrame = dynamic<BaseFrameProps>(() => import("./halloween"));
const DiwaliFrame = dynamic<BaseFrameProps>(() => import("./diwali"));
const NewYearFrame = dynamic<BaseFrameProps>(() => import("./new-year"));
const LunarNewYearFrame = dynamic<BaseFrameProps>(() => import("./lunar-new-year"));
const HoliFrame = dynamic<BaseFrameProps>(() => import("./holi"));
const WinterFrostFrame = dynamic<BaseFrameProps>(() => import("./winter-frost"));
const VhsFrame = dynamic<BaseFrameProps>(() => import("./vhs"));
const InstantFilmFrame = dynamic<BaseFrameProps>(() => import("./polaroid"));
const TypewriterFrame = dynamic<BaseFrameProps>(() => import("./typewriter"));
const GroovyFrame = dynamic<BaseFrameProps>(() => import("./groovy-70s"));
const LofiRainFrame = dynamic<BaseFrameProps>(() => import("./lofi-rain"));
const LofiRooftopFrame = dynamic<BaseFrameProps>(() => import("./lofi-rooftop"));
const VinylFrame = dynamic<BaseFrameProps>(() => import("./vinyl"));
const CassetteFrame = dynamic<BaseFrameProps>(() => import("./cassette"));

type PresetsProps = {
  id: string;
};

export default function Presets({ id }: PresetsProps) {
  const frame = useAtomValue(presetsAtom);
  const updateElement = useSetAtom(updateSlideElementAtom);

  const onFileNameChange = (name: string) => updateElement({ header: { properties: { title: { text: name } } } });

  return (
    <PresetFrame {...frame} themeId={id} onFileNameChange={onFileNameChange}>
      <Editor />
    </PresetFrame>
  );
}

const FRAME_REGISTRY: Record<string, React.ComponentType<BaseFrameProps>> = {
  [themes.vercel.id]: VercelFrame,
  [themes.rabbit.id]: RabbitFrame,
  [themes.supabase.id]: SupabaseFrame,
  [themes.openai.id]: OpenAIFrame,
  [themes.tailwind.id]: TailwindFrame,
  [themes.clerk.id]: ClerkFrame,
  [themes.mintlify.id]: MintlifyFrame,
  [themes.triggerdev.id]: TriggerdevFrame,
  [themes.prisma.id]: PrismaFrame,
  [themes.elevenlabs.id]: ElevenLabsFrame,
  [themes.resend.id]: ResendFrame,
  [themes.browserbase.id]: BrowserbaseFrame,
  [themes.nuxt.id]: NuxtFrame,
  [themes.gemini.id]: GeminiFrame,
  [themes.cloudflare.id]: CloudflareFrame,
  [themes.stripe.id]: StripeFrame,
  [themes["dodo-payments"].id]: DodoPaymentsFrame,
  [themes.roses.id]: RosesFrame,
  [themes.claude.id]: ClaudeFrame,
  [themes["retro-mac"].id]: RetroMacFrame,
  [themes.love.id]: LoveFrame,
  [themes.valentine.id]: ValentineFrame,
  [themes["coffee-date"].id]: CoffeeDateFrame,
  [themes["sunset-chill"].id]: SunsetChillFrame,
  [themes.ps6.id]: PS6Frame,
  [themes["aurora-nights"].id]: AuroraNightsFrame,
  [themes["starry-night"].id]: StarryNightFrame,
  [themes["strawberry-milk"].id]: StrawberryMilkFrame,
  [themes["frosted-glass"].id]: FrostedGlassFrame,
  [themes["velvet-night"].id]: VelvetNightFrame,
  [themes["peachy-mood"].id]: PeachyMoodFrame,
  [themes["neon-dreams"].id]: NeonDreamsFrame,
  [themes["golden-hour"].id]: GoldenHourFrame,
  [themes.christmas.id]: ChristmasFrame,
  [themes.halloween.id]: HalloweenFrame,
  [themes.diwali.id]: DiwaliFrame,
  [themes["new-year"].id]: NewYearFrame,
  [themes["lunar-new-year"].id]: LunarNewYearFrame,
  [themes.holi.id]: HoliFrame,
  [themes["winter-frost"].id]: WinterFrostFrame,
  [themes.vhs.id]: VhsFrame,
  [themes.polaroid.id]: InstantFilmFrame,
  [themes.typewriter.id]: TypewriterFrame,
  [themes["groovy-70s"].id]: GroovyFrame,
  [themes["lofi-rain"].id]: LofiRainFrame,
  [themes["lofi-rooftop"].id]: LofiRooftopFrame,
  [themes.vinyl.id]: VinylFrame,
  [themes.cassette.id]: CassetteFrame,
};

const PRESET_LOADERS: Record<string, () => Promise<unknown>> = {
  [themes.vercel.id]: () => import("./vercel"),
  [themes.rabbit.id]: () => import("./rabbit"),
  [themes.supabase.id]: () => import("./supabase"),
  [themes.openai.id]: () => import("./openai"),
  [themes.tailwind.id]: () => import("./tailwind"),
  [themes.clerk.id]: () => import("./clerk"),
  [themes.mintlify.id]: () => import("./mintlify"),
  [themes.triggerdev.id]: () => import("./triggerdev"),
  [themes.prisma.id]: () => import("./prisma"),
  [themes.elevenlabs.id]: () => import("./eleven-labs"),
  [themes.resend.id]: () => import("./resend"),
  [themes.browserbase.id]: () => import("./browserbase"),
  [themes.nuxt.id]: () => import("./nuxt"),
  [themes.gemini.id]: () => import("./gemini"),
  [themes.cloudflare.id]: () => import("./cloudflare"),
  [themes.stripe.id]: () => import("./stripe"),
  [themes["dodo-payments"].id]: () => import("./dodo-payments"),
  [themes.roses.id]: () => import("./roses"),
  [themes.claude.id]: () => import("./claude"),
  [themes["retro-mac"].id]: () => import("./retro-mac"),
  [themes.love.id]: () => import("./love"),
  [themes.valentine.id]: () => import("./valentine"),
  [themes["coffee-date"].id]: () => import("./coffee-date"),
  [themes["sunset-chill"].id]: () => import("./sunset-chill"),
  [themes.ps6.id]: () => import("./ps6"),
  [themes["aurora-nights"].id]: () => import("./aurora-nights"),
  [themes["starry-night"].id]: () => import("./starry-night"),
  [themes["strawberry-milk"].id]: () => import("./strawberry-milk"),
  [themes["frosted-glass"].id]: () => import("./frosted-glass"),
  [themes["velvet-night"].id]: () => import("./velvet-night"),
  [themes["peachy-mood"].id]: () => import("./peachy-mood"),
  [themes["neon-dreams"].id]: () => import("./neon-dreams"),
  [themes["golden-hour"].id]: () => import("./golden-hour"),
  [themes.christmas.id]: () => import("./christmas"),
  [themes.halloween.id]: () => import("./halloween"),
  [themes.diwali.id]: () => import("./diwali"),
  [themes["new-year"].id]: () => import("./new-year"),
  [themes["lunar-new-year"].id]: () => import("./lunar-new-year"),
  [themes.holi.id]: () => import("./holi"),
  [themes["winter-frost"].id]: () => import("./winter-frost"),
  [themes.vhs.id]: () => import("./vhs"),
  [themes.polaroid.id]: () => import("./polaroid"),
  [themes.typewriter.id]: () => import("./typewriter"),
  [themes["groovy-70s"].id]: () => import("./groovy-70s"),
  [themes["lofi-rain"].id]: () => import("./lofi-rain"),
  [themes["lofi-rooftop"].id]: () => import("./lofi-rooftop"),
  [themes.vinyl.id]: () => import("./vinyl"),
  [themes.cassette.id]: () => import("./cassette"),
};

export function preloadPreset(themeId: string) {
  return PRESET_LOADERS[themeId]?.();
}

function renderFrame(themeId: BaseFrameProps["themeId"], props: Omit<BaseFrameProps, "themeId">) {
  const Frame = (themeId && FRAME_REGISTRY[themeId]) || DefaultFrame;
  return <Frame themeId={themeId} {...props} />;
}

export function PresetFrame({ themeId, ...props }: BaseFrameProps) {
  const shownThemeId = useDeferredValue(themeId);

  return (
    <>
      <Suspense>{renderFrame(shownThemeId, props)}</Suspense>
      <span hidden data-ignore-in-export data-shown-theme={shownThemeId} />
      <ThemeLoadingPill isVisible={shownThemeId !== themeId} />
    </>
  );
}
