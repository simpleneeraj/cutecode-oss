import { useAtomValue } from "jotai";
import React, { useMemo, useState } from "react";
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
} from "@cutecode/ui/components/combobox";
import { AltArrowDownIcon } from "@solar-icons/react/linear/alt-arrow-down";
import { CrownIcon } from "@solar-icons/react/linear/crown";
import { FireIcon } from "@solar-icons/react/linear/fire";
import { Theme, IconType, BadgeVariant } from "@/typings/editor";
import {
  elementContentAtom,
  elementIsSampleCodeAtom,
  elementThemeAtom,
  previewThemeAtom,
  updateSlideElementAtom,
} from "@/store/editor/editor";
import { useSetAtom } from "jotai";
import View from "@/components/view";
import { Badge } from "@cutecode/ui/components/badge";
import { Button } from "@cutecode/ui/components/button";
import { themes } from "@/components/presets/themes";
import { usePremiumAccess } from "@/hooks/use-premium-access";
import { groupThemes, type ThemeGroup } from "@/components/presets/themes/shared";
import Image from "next/image";
import { featuredThemeIds, sponsorForTheme } from "@/lib/sponsors";
import { sponsorTier } from "@/lib/brand-presets";
import { isPristineCode, themeChangeUpdate } from "@/components/presets/themes/samples";
import { AccessLevel } from "@/typings/enums";
import { trackEditor } from "@/lib/analytics";
import BrandRequestDialog from "@/components/brand-request/brand-request-dialog";
import { dockLabel, dockTrigger, panelButton } from "../dock-styles";
import DockSearch from "../dock-search";
import { themeStyles } from "./style";

const styles = themeStyles();

interface ThemeIconProps {
  theme: Theme;
  className?: string;
}

const isTileGlyph = (source: string) => source.endsWith("/glyph.svg");

function ThemeTile({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={styles.tile({ className })}>
      <span className={styles.tileFrame()}>{children}</span>
    </span>
  );
}

function ThemeIcon({ theme, className }: ThemeIconProps) {
  if (!theme.icon) {
    return (
      <ThemeTile className={className}>
        <span
          className={styles.gradient()}
          style={{ backgroundImage: `linear-gradient(140deg, ${theme.background?.from}, ${theme.background?.to})` }}
        />
      </ThemeTile>
    );
  }
  if (theme.icon.type === IconType.IMAGE && isTileGlyph(theme.icon.source)) {
    return (
      <img src={theme.icon.source} alt="" loading="lazy" decoding="async" className={styles.glyph({ className })} />
    );
  }
  return (
    <ThemeTile className={className}>
      <img src={theme.icon.source} alt="" loading="lazy" decoding="async" className={styles.tileImage()} />
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
        <Badge size="sm" variant="outline">
          <Image src={sponsorBadge} alt="" width={12} height={12} className={styles.sponsorLogo()} />
          {SPONSORED_GROUP}
        </Badge>
      )}
      {tags?.includes(BadgeVariant.NEW) && (
        <Badge size="sm" variant="info">
          {BadgeVariant.NEW}
        </Badge>
      )}
      {tags?.includes(BadgeVariant.POPULAR) && (
        <Badge size="sm" variant="secondary">
          <FireIcon className={styles.badgeIcon()} aria-hidden="true" />
          {BadgeVariant.POPULAR}
        </Badge>
      )}
      {tags?.includes(BadgeVariant.PREMIUM) && (
        <Badge size="sm" variant={access === AccessLevel.ALLOWED ? "outline" : "warning"} title={BadgeVariant.PREMIUM}>
          <CrownIcon className={styles.badgeIcon()} aria-hidden="true" />
        </Badge>
      )}
    </>
  );
}

function ThemeRow({ theme, access }: { theme: Theme; access: AccessLevel }) {
  return (
    <ComboboxItem value={theme}>
      <View className={styles.row()}>
        <ThemeIcon theme={theme} className={styles.rowIcon()} />
        <span className={styles.rowName()}>{theme.name}</span>
        <Badges tags={theme.tags} access={access} sponsorBadge={sponsorBadgeFor(theme.id)} />
      </View>
    </ComboboxItem>
  );
}

function ThemeTrigger() {
  return (
    <ComboboxTrigger
      aria-label="Theme"
      render={<Button variant="ghost" className={dockTrigger({ shape: "label", className: styles.trigger() })} />}
    >
      <ComboboxValue>
        {(theme) => (
          <span className={styles.value()}>
            <ThemeIcon theme={theme} className={styles.triggerIcon()} />
            <span className={styles.valueName()}>{theme.name}</span>
          </span>
        )}
      </ComboboxValue>
      <AltArrowDownIcon className={styles.chevron()} aria-hidden="true" />
      <span className={dockLabel()}>Theme</span>
    </ComboboxTrigger>
  );
}

const isPremiumTheme = (theme: Theme) => theme.tags?.includes(BadgeVariant.PREMIUM) ?? false;

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
  const setPreviewTheme = useSetAtom(previewThemeAtom);

  const onValueChange = (theme: Theme | null) => {
    if (!theme) return;
    const isPremium = isPremiumTheme(theme);
    const access = checkAccess("premiumThemes", isPremium);
    withAccess(access, () => {
      setPreviewTheme(null);
      update(themeChangeUpdate(theme, isSampleCode || isPristineCode(content)));
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
        <ThemeTrigger />
        <ComboboxPopup side="top" align="center" sideOffset={8} aria-label="Select theme">
          <DockSearch placeholder="Search themes..." />
          <ComboboxEmpty>No themes found.</ComboboxEmpty>
          <ComboboxList>
            {(group) => (
              <React.Fragment key={group.value}>
                <ComboboxGroup items={group.items}>
                  <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
                  <ComboboxCollection>
                    {(theme) => (
                      <ThemeRow
                        key={theme.id}
                        theme={theme}
                        access={checkAccess("premiumThemes", isPremiumTheme(theme))}
                      />
                    )}
                  </ComboboxCollection>
                  {group?.separator && <ComboboxSeparator />}
                </ComboboxGroup>
              </React.Fragment>
            )}
          </ComboboxList>
          <div className={styles.footer()}>
            <Button
              variant="ghost"
              size="sm"
              className={panelButton({ className: styles.footerButton() })}
              onClick={() => setIsBrandRequestOpen(true)}
            >
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
