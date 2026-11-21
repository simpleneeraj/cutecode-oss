import type { ReactNode } from "react";
import { Field } from "@cutecode/ui/components/field";
import ControlLabel from "../control-label";

type SettingRowProps = {
  label: string;
  children: ReactNode;
};

export default function SettingRow({ label, children }: SettingRowProps) {
  return (
    <Field className="gap-1.5">
      <ControlLabel>{label}</ControlLabel>
      {children}
    </Field>
  );
}
