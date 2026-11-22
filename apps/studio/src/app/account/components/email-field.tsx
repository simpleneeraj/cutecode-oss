import { Field, FieldError, FieldLabel } from "@cutecode/ui/components/field";
import { Input } from "@cutecode/ui/components/input";

type EmailFieldProps = {
  value: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
  isAutoFocused?: boolean;
};

export function EmailField({ value, onChange, isDisabled, isAutoFocused }: EmailFieldProps) {
  return (
    <Field name="email">
      <FieldLabel>Email address</FieldLabel>
      <Input
        type="email"
        placeholder="you@example.com"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        autoComplete="email"
        disabled={isDisabled}
        autoFocus={isAutoFocused}
      />
      <FieldError match="valueMissing">Please enter your email address.</FieldError>
      <FieldError match="typeMismatch">Please enter a valid email address.</FieldError>
    </Field>
  );
}
