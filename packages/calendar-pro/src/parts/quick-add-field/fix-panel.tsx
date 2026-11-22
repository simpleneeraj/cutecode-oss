"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@cutecode/ui/components/button";
import { Input } from "@cutecode/ui/components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FixKind, fixCopy, fixKindOf, textPhrase, type EditedChip } from "./fix";
import { choiceOptions, currentKeyOf, type FixContext } from "./options";
import { fixOptionStyles, fixPanelStyles } from "./style";

type FixPanelProps = {
  chip: EditedChip;
  source: FixContext;
  onFix: (chip: EditedChip, phrase: string) => void;
};

const textFixSchema = z.object({
  value: z.string().max(200),
});

type TextFixValues = z.infer<typeof textFixSchema>;

const panelCopy = {
  done: "Done",
  pick: (field: string) => `Pick ${field.toLowerCase()}`,
  edit: (field: string) => `Edit ${field.toLowerCase()}`,
};

const styles = fixPanelStyles();

function ChoiceStrip({ chip, source, onFix }: FixPanelProps) {
  const options = choiceOptions(chip.field, source);
  const currentKey = chip.isMissing ? null : currentKeyOf(chip.field, source.draft);
  const label = panelCopy.pick(fixCopy.fields[chip.field]);

  return (
    <div aria-label={label} className={styles.strip()} role="group">
      {options.map((option) => (
        <button
          key={option.key}
          aria-pressed={option.key === currentKey}
          className={fixOptionStyles({ isSelected: option.key === currentKey })}
          onClick={() => onFix(chip, option.phrase)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function TextFix({ chip, onFix }: Omit<FixPanelProps, "source">) {
  const { register, handleSubmit } = useForm<TextFixValues>({
    resolver: zodResolver(textFixSchema),
    defaultValues: { value: chip.label },
  });
  const label = panelCopy.edit(fixCopy.fields[chip.field]);

  return (
    <form className={styles.form()} onSubmit={handleSubmit(({ value }) => onFix(chip, textPhrase(chip.field, value)))}>
      <Input aria-label={label} autoFocus className={styles.input()} {...register("value")} />
      <Button size="sm" type="submit" variant="tinted">
        {panelCopy.done}
      </Button>
    </form>
  );
}

function FixPanel({ chip, source, onFix }: FixPanelProps) {
  const isChoice = fixKindOf(chip.field) === FixKind.Choice;

  return (
    <div className={styles.root()}>
      <span className={styles.title()}>{fixCopy.fields[chip.field]}</span>
      {isChoice ? (
        <ChoiceStrip chip={chip} onFix={onFix} source={source} />
      ) : (
        <TextFix key={chip.key} chip={chip} onFix={onFix} />
      )}
    </div>
  );
}

export { FixPanel };
