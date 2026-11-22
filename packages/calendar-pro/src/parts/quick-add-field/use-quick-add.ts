"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { dateOf } from "@cutecode/calendar/time";
import { QuickAddField, type EventDraft, type QuickAddContext, type QuickAddParser } from "@cutecode/calendar/types";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { loadQuickAddParser } from "../../quick-add/parse";
import { editedChipsOf, replaceSpan, type EditedChip } from "./fix";
import { hintOf } from "./hint";

enum ParserStatus {
  Idle = "idle",
  Loading = "loading",
  Ready = "ready",
  Failed = "failed",
}

type ParserState =
  | { status: ParserStatus.Idle }
  | { status: ParserStatus.Loading }
  | { status: ParserStatus.Ready; parse: QuickAddParser }
  | { status: ParserStatus.Failed };

export type QuickAddSetup = {
  context: QuickAddContext;
  onEventCreate: (draft: EventDraft) => void;
};

const quickAddLimits = {
  text: 300,
};

const quickAddSchema = z.object({
  text: z.string().max(quickAddLimits.text),
});

type QuickAddValues = z.infer<typeof quickAddSchema>;

function useQuickAddParser() {
  const [state, setState] = useState<ParserState>({ status: ParserStatus.Idle });
  const load = () => {
    const isStarted = state.status === ParserStatus.Loading || state.status === ParserStatus.Ready;
    if (isStarted) {
      return;
    }
    setState({ status: ParserStatus.Loading });
    loadQuickAddParser().then(
      (parse) => setState({ status: ParserStatus.Ready, parse }),
      () => setState({ status: ParserStatus.Failed }),
    );
  };
  return { state, load };
}

export function useQuickAdd({ context, onEventCreate }: QuickAddSetup) {
  const parser = useQuickAddParser();
  const form = useForm<QuickAddValues>({ resolver: zodResolver(quickAddSchema), defaultValues: { text: "" } });
  const text = useWatch({ control: form.control, name: "text" });
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const { settings } = context;
  const result = parser.state.status === ParserStatus.Ready ? parser.state.parse(text, context) : null;
  const chips = result === null ? [] : editedChipsOf(result, text, settings);
  const editing = chips.find((chip) => chip.key === editingKey) ?? null;
  const hasFailed = parser.state.status === ParserStatus.Failed;
  const draft = result?.draft ?? null;
  const isTitled = result !== null && !result.missing.includes(QuickAddField.Title);
  const create = form.handleSubmit(() => {
    if (draft === null || !isTitled) {
      return;
    }
    onEventCreate(draft);
    form.reset();
    setEditingKey(null);
  });
  const fix = (chip: EditedChip, phrase: string) => {
    form.setValue("text", replaceSpan(text, chip.span, phrase), { shouldDirty: true });
    setEditingKey(null);
  };
  const toggle = (chip: EditedChip) => setEditingKey(chip.key === editingKey ? null : chip.key);
  return {
    form,
    result,
    chips,
    editing,
    hint: hintOf({ text, result, hasFailed, settings }),
    canCreate: draft !== null && isTitled,
    today: dateOf(context.now, settings.timeZone),
    actions: { load: parser.load, create, fix, toggle, close: () => setEditingKey(null) },
  };
}
