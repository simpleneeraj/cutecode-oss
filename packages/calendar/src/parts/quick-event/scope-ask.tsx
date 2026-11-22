"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@cutecode/ui/components/button";
import { Label } from "@cutecode/ui/components/label";
import { Radio, RadioGroup } from "@cutecode/ui/components/radio-group";
import { Controller, useForm } from "react-hook-form";

import { ResponsiveDialog } from "../overlay/responsive-dialog";
import {
  ScopeRequestKind,
  scopeCopy,
  scopeDefaults,
  scopeDialogCopy,
  scopeOptions,
  scopeSchema,
  type ScopeRequest,
  type ScopeValues,
} from "./scope";
import { scopeStyles } from "./style";
import type { ChangeScope } from "../../types";

type ScopeAskProps = {
  request: ScopeRequest | null;
  isSaving: boolean;
  onChoose: (scope: ChangeScope) => void;
  onCancel: () => void;
};

type ScopeFormProps = {
  request: ScopeRequest;
  isSaving: boolean;
  onChoose: (scope: ChangeScope) => void;
};

const styles = scopeStyles();

type ScopeCardsProps = {
  value: ChangeScope;
  onChange: (scope: ChangeScope) => void;
};

function ScopeCards({ value, onChange }: ScopeCardsProps) {
  return (
    <RadioGroup aria-label={scopeCopy.description} className={styles.options()} onValueChange={onChange} value={value}>
      {scopeOptions.map((option) => (
        <Label key={option.scope} className={styles.card()}>
          <Radio value={option.scope} />
          <span className={styles.text()}>
            <span className={styles.label()}>{option.label}</span>
            <span className={styles.detail()}>{option.detail}</span>
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}

function ScopeForm({ request, isSaving, onChoose }: ScopeFormProps) {
  const { control, handleSubmit } = useForm<ScopeValues>({
    resolver: zodResolver(scopeSchema),
    defaultValues: scopeDefaults,
  });
  const isDelete = request.kind === ScopeRequestKind.Delete;

  return (
    <form className={styles.form()} onSubmit={handleSubmit((values) => onChoose(values.scope))}>
      <Controller
        control={control}
        name="scope"
        render={({ field }) => <ScopeCards onChange={field.onChange} value={field.value} />}
      />
      <div className={styles.actions()}>
        <Button
          className={styles.action()}
          disabled={isSaving}
          type="submit"
          variant={isDelete ? "destructive" : "default"}
        >
          {isDelete ? scopeCopy.delete : scopeCopy.save}
        </Button>
      </div>
    </form>
  );
}

function ScopeAsk({ request, isSaving, onChoose, onCancel }: ScopeAskProps) {
  return (
    <ResponsiveDialog copyOf={scopeDialogCopy} dismiss={{ isSaving, onClose: onCancel }} value={request}>
      {(shown) => <ScopeForm isSaving={isSaving} onChoose={onChoose} request={shown} />}
    </ResponsiveDialog>
  );
}

export { ScopeAsk };
