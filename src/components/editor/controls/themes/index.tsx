import { useAtomValue } from "jotai";
import React, { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxList,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxItem,
  ComboboxSeparator,
  ComboboxValue,
  ComboboxEmpty,
  ComboboxPopup,
  ComboboxCollection,
  ComboboxInput,
} from "@/components/ui/combobox";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Search01Icon, Fire02Icon, CrownIcon } from "@hugeicons/core-free-icons";
import { Theme, IconType, BadgeVariant } from "@/typings/editor";
import { elementContentAtom, elementIsSampleCodeAtom, elementThemeAtom, updateSlideElementAtom } from "@/store/editor/editor";
import { motion } from "motion/react";
import { cn } from "@/utils/cn";
import { useSetAtom } from "jotai";
import View from "@/components/view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { themes } from "@/components/presets/themes";
import { usePremiumAccess } from "@/hooks/use-premium-access";
import { groupThemes, type ThemeGroup } from "@/components/presets/themes/shared";
import Image from "next/image";
import { featuredThemeIds, sponsorForTheme } from "@/lib/sponsors";
import { sponsorTier } from "@/lib/brand-presets";
import { isPristineCode, sampleUpdate } from "@/components/presets/themes/samples";
import { AccessLevel } from "@/typings/enums";
import { trackEditor } from "@/lib/analytics";
import BrandRequestDialog from "@/components/brand-request/brand-request-dialog";
import { dockLabel, dockPopup, dockTrigger } from "../dock-styles";

interface ThemeIconProps {
  theme: Theme;
  className?: string;
}

const isTileGlyph = (source: string) => source.endsWith("/glyph.svg");

function ThemeTile({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("shrink-0 p-px", className)}>
      <span className="grid size-full place-items-center overflow-hidden rounded-md bg-muted ring-1 ring-border ring-inset">
        {children}
      </span>
    </span>
  );
}

function ThemeIcon({ theme, className }: ThemeIconProps) {
  if (!theme.icon) {
    return (
      <ThemeTile className={className}>
        <span
          className="size-full"
          style={{ backgroundImage: `linear-gradient(140deg, ${theme.background?.from}, ${theme.background?.to})` }}
        />
      </ThemeTile>
    );
  }
  if (theme.icon.type === IconType.IMAGE && isTileGlyph(theme.icon.source)) {
    return <img src={theme.icon.source} alt="" loading="lazy" decoding="async" className={cn("shrink-0", className)} />;
  }
  if (theme.icon.type === IconType.IMAGE) {
    return (
      <ThemeTile className={className}>
        <img src={theme.icon.source} alt="" loading="lazy" decoding="async" className="size-3/5 object-contain" />
      </ThemeTile>
    );
  }
  return (
    <ThemeTile className={className}>
      <Icon icon={theme.icon.source} className="size-3/5" />
    </ThemeTile>
  );
}

const SPONSORED_GROUP = "Sponsored";

function pinSponsored(groups: ThemeGroup[], sponsoredIds: string[]) {
  const isSponsored = (theme: Partial<Theme>) => sponsoredIds.includes(theme.id ?? "");
  const sponsored = groups.flatMap((group) => group.items.filter(isSponsored));
  if (sponsored.length === 0) return groups;
  const rest = groups
    .map((group) => ({ ...group, items: group.items.filter((theme) => !isSponsored(theme)) }))
    .filter((group) => group.items.length > 0);
  return [{ value: SPONSORED_GROUP, items: sponsored }, ...rest];
}

function sponsorBadgeFor(themeId: string) {
  const sponsor = sponsorForTheme(themeId);
  return sponsor && sponsor.tier !== "preset" ? sponsorTier(sponsor.tier).badge : undefined;
}

function Badges({ tags, access, sponsorBadge }: { tags?: Theme["tags"]; access: AccessLevel; sponsorBadge?: string }) {
  return (
    <>
      {sponsorBadge && (
        <Badge className="gap-1 text-xs" size="sm" variant="success">
          <Image src={sponsorBadge} alt="" width={12} height={12} className="size-3 rounded-[3px]" />
          {SPONSORED_GROUP}
        </Badge>
      )}
      {tags?.includes(BadgeVariant.NEW) && (
        <Badge className="text-xs" size="sm" variant="info">
          {BadgeVariant.NEW}
        </Badge>
      )}
      {tags?.includes(BadgeVariant.POPULAR) && (
        <Badge className="text-xs" size="sm" variant="error">
          <HugeiconsIcon icon={Fire02Icon} className="size-3" aria-hidden="true" />
          {BadgeVariant.POPULAR}
        </Badge>
      )}
      {tags?.includes(BadgeVariant.PREMIUM) && (
        <Badge size="sm" variant={access === AccessLevel.ALLOWED ? "outline" : "warning"} title={BadgeVariant.PREMIUM}>
          <HugeiconsIcon icon={CrownIcon} className="size-3" aria-hidden="true" />
        </Badge>
      )}
    </>
  );
}

const ThemeControl: React.FC = () => {
  const update = useSetAtom(updateSlideElementAtom);
  const themeId = useAtomValue(elementThemeAtom);
  const content = useAtomValue(elementContentAtom);
  const isSampleCode = useAtomValue(elementIsSampleCodeAtom);

  const sponsoredIds = useMemo(() => featuredThemeIds(), []);
  const groupedThemes = useMemo(() => pinSponsored(groupThemes(themes), sponsoredIds), [sponsoredIds]);
  const allThemes = useMemo(() => Object.values(themes), []);
  const currentTheme = useMemo(() => allThemes.find((t) => t.id === themeId) ?? themes.mono, [themeId, allThemes]);

  const { checkAccess, withAccess } = usePremiumAccess();
  const [isBrandRequestOpen, setIsBrandRequestOpen] = useState(false);

  const onValueChange = (theme: Theme | null) => {
    if (!theme) return;
    const isPremium = theme.tags?.includes(BadgeVariant.PREMIUM) ?? false;
    const access = checkAccess("premiumThemes", isPremium);
    withAccess(access, () => {
      if (theme.sample && (isSampleCode || isPristineCode(content))) {
        const sample = sampleUpdate(theme);
        update({ ...sample, properties: { ...sample.properties, theme: theme.id } });
      } else {
        update({ properties: { theme: theme.id } });
      }
      trackEditor.themeChanged(theme.id, isPremium);
    });
  };
  return (
    <>
      <Combobox<Theme>
        items={groupedThemes}
        value={currentTheme}
        onValueChange={onValueChange}
        itemToStringLabel={(theme) => theme?.name ?? ""}
        isItemEqualToValue={(item, selected) => item.id === selected.id}
      >
        <ComboboxTrigger
          aria-label="Theme"
          render={
            <Button
              variant="ghost"
              className={dockTrigger({ shape: "label", className: "max-w-44 justify-between" })}
              render={<motion.button whileTap={{ scale: 0.96 }} />}
            />
          }
        >
          <ComboboxValue>
            {(theme) => (
              <span className="flex min-w-0 items-center gap-2">
                <ThemeIcon theme={theme} className="size-4.5" />
                <span className="hidden truncate sm:inline">{theme.name}</span>
              </span>
            )}
          </ComboboxValue>
          <HugeiconsIcon icon={ArrowDown01Icon} className="hidden size-3.5 text-muted-foreground sm:block" aria-hidden="true" />
          <span className={dockLabel()}>Theme</span>
        </ComboboxTrigger>
        <ComboboxPopup side="top" align="center" sideOffset={8} className={dockPopup()} aria-label="Select theme">
          <div className="border-b p-2">
            <ComboboxInput
              className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
              placeholder="Search themes..."
              showTrigger={false}
              startAddon={<HugeiconsIcon icon={Search01Icon} className="size-4" aria-hidden="true" />}
            />
          </div>
          <ComboboxEmpty>No themes found.</ComboboxEmpty>
          <ComboboxList>
            {(group) => (
              <React.Fragment key={group.value}>
                <ComboboxGroup items={group.items}>
                  <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
                  <ComboboxCollection>
                    {(theme) => {
                      const isPremium = theme.tags?.includes(BadgeVariant.PREMIUM) ?? false;
                      return (
                        <ComboboxItem key={theme.id} value={theme}>
                          <View className="flex flex-row items-center gap-2 text-start">
                            <ThemeIcon theme={theme} className="size-5" />
                            {theme.name}
                            <Badges
                              tags={theme?.tags}
                              access={checkAccess("premiumThemes", isPremium)}
                              sponsorBadge={sponsorBadgeFor(theme.id)}
                            />
                          </View>
                        </ComboboxItem>
                      );
                    }}
                  </ComboboxCollection>
                  {group?.separator && <ComboboxSeparator />}
                </ComboboxGroup>
              </React.Fragment>
            )}
          </ComboboxList>
          <div className="border-t p-2">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => setIsBrandRequestOpen(true)}>
              Become a sponsor
            </Button>
          </div>
        </ComboboxPopup>
      </Combobox>
      <BrandRequestDialog open={isBrandRequestOpen} onOpenChange={setIsBrandRequestOpen} />
    </>
  );
};

export default ThemeControl;
