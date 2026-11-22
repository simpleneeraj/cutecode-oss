import { FieldLabel } from "@cutecode/ui/components/field";

export default function ControlLabel({ children }: { children: string }) {
  return <FieldLabel className="font-medium text-density-footnote text-muted-foreground">{children}</FieldLabel>;
}
