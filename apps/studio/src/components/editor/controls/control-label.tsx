import { FieldLabel } from "@cutecode/ui/components/field";

export default function ControlLabel({ children }: { children: string }) {
  return <FieldLabel className="px-1 text-xs font-medium text-muted-foreground">{children}</FieldLabel>;
}
