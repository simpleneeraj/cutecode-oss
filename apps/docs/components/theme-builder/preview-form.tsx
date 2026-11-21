"use client";

import { Button } from "@cutecode/ui/components/button";
import { Card } from "@cutecode/ui/components/card";
import { Field, FieldDescription, FieldLabel } from "@cutecode/ui/components/field";
import { Input } from "@cutecode/ui/components/input";

import { themeBuilderStyles } from "./style";

const styles = themeBuilderStyles();

export function PreviewForm() {
  return (
    <Card>
      <form className={styles.form()} onSubmit={(event) => event.preventDefault()}>
        <h3 className={styles.formTitle()}>Invite a teammate</h3>
        <Field className={styles.field()}>
          <FieldLabel>Name</FieldLabel>
          <Input autoComplete="off" defaultValue="Maya Chen" />
        </Field>
        <Field className={styles.field()}>
          <FieldLabel>Email</FieldLabel>
          <Input autoComplete="off" placeholder="maya@studio.com" type="email" />
          <FieldDescription>They get a link to join.</FieldDescription>
        </Field>
        <Button type="submit">Send invite</Button>
      </form>
    </Card>
  );
}
