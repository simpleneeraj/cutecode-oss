"use client";

import { CrownIcon } from "@solar-icons/react/linear/crown";
import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";
import { TextFormatIcon } from "@solar-icons/react/linear/text-format";
import { motion } from "motion/react";
import { Button } from "@cutecode/ui/components/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@cutecode/ui/components/tooltip";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
} from "@cutecode/ui/components/combobox";
import fonts from "@/fonts/editor/fonts";
import { useAtomValue, useSetAtom } from "jotai";
import { currentElementAtom, updateSlideElementAtom } from "@/store/editor/editor";
import { BadgeVariant } from "@/typings/editor";
import { AccessLevel } from "@/typings/enums";
import { usePremiumAccess } from "@/hooks/use-premium-access";
import { Badge } from "@cutecode/ui/components/badge";
import View from "@/components/view";
import { trackEditor } from "@/lib/analytics";
import { dockLabel, dockPopup, dockTrigger } from "../dock-styles";

type FontFaceItem = {
  name: string;
  src?: string;
  variable: string;
  tags?: BadgeVariant[];
};

export default function FontFaceControl() {
  const elementState = useAtomValue(currentElementAtom);
  const updateSlideElement = useSetAtom(updateSlideElementAtom);
  const { checkAccess, withAccess } = usePremiumAccess();

  const fontFamily = elementState?.style?.fontFamily;
  const currentFont = fonts.find((f) => f.name === fontFamily) ?? null;

  const onValueChange = (font: FontFaceItem | null) => {
    if (!font) return;
    const isPremium = font.tags?.includes(BadgeVariant.PREMIUM) ?? false;
    const access = checkAccess("premiumFonts", isPremium);
    withAccess(access, () => {
      updateSlideElement({ style: { fontFamily: font.name } });
      trackEditor.fontChanged(font.name, isPremium);
    });
  };

  return (
    <Combobox<FontFaceItem>
      value={currentFont}
      onValueChange={onValueChange}
      itemToStringLabel={(item) => item?.name ?? ""}
      items={fonts}
    >
      <Tooltip>
        <ComboboxTrigger
          render={
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Font"
                  className={dockTrigger()}
                  render={<motion.button whileTap={{ scale: 0.92 }} />}
                />
              }
            />
          }
        >
          <TextFormatIcon className="size-4.5" aria-hidden="true" />
          <span className={dockLabel()}>Font</span>
        </ComboboxTrigger>
        <TooltipPopup sideOffset={8}>Font</TooltipPopup>
      </Tooltip>
      <ComboboxPopup side="top" align="center" sideOffset={8} className={dockPopup()} aria-label="Select font face">
        <div className="border-b p-2">
          <ComboboxInput
            className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
            placeholder="Search fonts..."
            showTrigger={false}
            startAddon={<MagnifierIcon className="size-4" aria-hidden="true" />}
          />
        </div>
        <ComboboxEmpty>No fonts found.</ComboboxEmpty>
        <ComboboxList>
          {(font) => {
            const isPremium = font.tags?.includes(BadgeVariant.PREMIUM) ?? false;
            const access = checkAccess("premiumFonts", isPremium);

            return (
              <ComboboxItem key={font.variable} value={font}>
                <View className="flex items-center gap-1">
                  <span className="flex-1">{font.name}</span>
                  {isPremium && (
                    <Badge
                      size="sm"
                      title="Premium font"
                      className="text-xs"
                      variant={access === AccessLevel.ALLOWED ? "outline" : "warning"}
                    >
                      <CrownIcon className="size-3" aria-hidden="true" />
                    </Badge>
                  )}
                </View>
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}
