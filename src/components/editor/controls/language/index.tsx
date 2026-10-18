import React, { useMemo } from "react";
import { Language, LANGUAGES } from "../../util/languages";
import useHotkeys from "../../../../utils/useHotkeys";
import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxEmpty,
  ComboboxPopup,
  ComboboxInput,
} from "@/components/ui/combobox";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Search01Icon, SourceCodeIcon } from "@hugeicons/core-free-icons";
import { useAtomValue, useSetAtom } from "jotai";
import { currentElementAtom, updateSlideElementAtom } from "@/store/editor/editor";
import { trackEditor } from "@/lib/analytics";
import { dockLabel, dockPopup, dockTrigger } from "../dock-styles";

type LanguageItem = {
  id: string;
  name: string;
  language: Language | null;
};

const AUTO_DETECT_ITEM: LanguageItem = {
  id: "auto-detect",
  name: "Auto-Detect",
  language: null,
};

const LanguageControl: React.FC = () => {
  const elementState = useAtomValue(currentElementAtom);
  const updateSlideElement = useSetAtom(updateSlideElementAtom);

  const language = elementState?.properties?.language;

  const items: LanguageItem[] = useMemo(() => {
    const languageItems = Object.entries(LANGUAGES).map(([key, lang]) => ({
      id: key,
      name: lang.name,
      language: lang,
    }));
    return [AUTO_DETECT_ITEM, ...languageItems];
  }, []);

  const currentValue = useMemo(() => {
    if (!language) return AUTO_DETECT_ITEM;
    return items.find((item) => item.language?.name === language) ?? AUTO_DETECT_ITEM;
  }, [language, items]);

  useHotkeys("l", (event) => {
    event.preventDefault();
  });

  return (
    <Combobox<LanguageItem>
        items={items}
        value={currentValue}
        onValueChange={(item) => {
          if (item) {
            updateSlideElement({
              properties: {
                language: item.language?.name,
              },
            });
            trackEditor.languageChanged(item.language?.name ?? "auto");
          }
        }}
        itemToStringLabel={(item) => item?.name ?? ""}
      >
        <ComboboxTrigger
          aria-label="Language"
          render={
            <Button
              variant="ghost"
              className={dockTrigger({ shape: "label", className: "sm:max-w-36 sm:justify-between" })}
              render={<motion.button whileTap={{ scale: 0.96 }} />}
            />
          }
        >
          <HugeiconsIcon icon={SourceCodeIcon} className="size-4.5 sm:hidden" aria-hidden="true" />
          <span className="hidden truncate sm:inline">
            <ComboboxValue>{(value) => value?.name ?? "Auto-Detect"}</ComboboxValue>
          </span>
          <HugeiconsIcon icon={ArrowDown01Icon} className="hidden size-3.5 text-muted-foreground sm:block" aria-hidden="true" />
          <span className={dockLabel()}>Code</span>
        </ComboboxTrigger>
        <ComboboxPopup side="top" align="center" sideOffset={8} className={dockPopup()}>
          <div className="border-b p-2">
            <ComboboxInput
              className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
              placeholder="Search..."
              showTrigger={false}
              startAddon={<HugeiconsIcon icon={Search01Icon} className="size-4" aria-hidden="true" />}
            />
          </div>
          <ComboboxEmpty>No languages found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.id} value={item}>
                {item.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
  );
};

export default LanguageControl;
