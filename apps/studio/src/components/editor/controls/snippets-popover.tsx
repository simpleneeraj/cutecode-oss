import { Fragment } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { motion } from "motion/react";
import { AltArrowDownIcon } from "@solar-icons/react/linear/alt-arrow-down";
import { ChatRoundCodeIcon } from "@solar-icons/react/linear/chat-round-code";
import { CodeScanIcon } from "@solar-icons/react/linear/code-scan";
import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";
import { ScissorsIcon } from "@solar-icons/react/linear/scissors";
import { elementContentAtom, elementLanguageAtom, updateSlideElementAtom } from "@/store/editor/editor";
import { Button } from "@cutecode/ui/components/button";
import {
  Combobox,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
} from "@cutecode/ui/components/combobox";
import { MOODS, SNIPPETS, Snippet, findSnippet, snippetPatch } from "@/components/presets/snippets";
import { dockLabel, dockPopup, dockTrigger } from "./dock-styles";

const GROUPS = MOODS.map((mood) => ({ value: mood, items: SNIPPETS.filter((snippet) => snippet.mood === mood) }));

export default function SnippetsPopover() {
  const content = useAtomValue(elementContentAtom);
  const language = useAtomValue(elementLanguageAtom);
  const update = useSetAtom(updateSlideElementAtom);

  return (
    <Combobox<Snippet>
      items={GROUPS}
      value={findSnippet(content) ?? null}
      onValueChange={(snippet) => snippet && update(snippetPatch(snippet, language))}
      itemToStringLabel={(snippet) => snippet?.name ?? ""}
      isItemEqualToValue={(item, selected) => item.id === selected.id}
    >
      <ComboboxTrigger
        aria-label="Snippets"
        render={
          <Button
            variant="ghost"
            className={dockTrigger({ shape: "label", className: "sm:justify-between" })}
            render={<motion.button whileTap={{ scale: 0.96 }} />}
          />
        }
      >
        <CodeScanIcon className="size-4.5" aria-hidden="true" />
        <AltArrowDownIcon
          className="hidden size-3.5 text-muted-foreground sm:block"
          aria-hidden="true"
        />
        <span className={dockLabel()}>Snips</span>
      </ComboboxTrigger>
      <ComboboxPopup side="top" align="center" sideOffset={8} className={dockPopup()} aria-label="Select snippet">
        <div className="border-b p-2">
          <ComboboxInput
            className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
            placeholder="Search snippets..."
            showTrigger={false}
            startAddon={<MagnifierIcon className="size-4" aria-hidden="true" />}
          />
        </div>
        <ComboboxEmpty>No snippets found.</ComboboxEmpty>
        <ComboboxList>
          {(group: (typeof GROUPS)[number]) => (
            <Fragment key={group.value}>
              <ComboboxGroup items={group.items}>
                <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
                <ComboboxCollection>
                  {(snippet: Snippet) => (
                    <ComboboxItem key={snippet.id} value={snippet}>
                      {snippet.name}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            </Fragment>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  );
}
