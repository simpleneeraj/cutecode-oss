"use client";

import * as React from "react";
import { useLinkedAccounts, useUser } from "@/hooks/use-auth";
import { useChangePassword, useUpdateProfile } from "@/hooks/use-auth-mutations";
import { toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";

const CREDENTIAL_PROVIDER = "credential";

const PROVIDER_LABELS: Record<string, string> = { google: "Google", github: "GitHub" };

type AccountSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AccountChanges = {
  name: string;
  currentPassword: string;
  newPassword: string;
};

function readChanges(form: HTMLFormElement): AccountChanges {
  const data = new FormData(form);
  return {
    name: String(data.get("name") ?? "").trim(),
    currentPassword: String(data.get("currentPassword") ?? ""),
    newPassword: String(data.get("newPassword") ?? ""),
  };
}

function useSaveAccount(currentName: string) {
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const saveAccount = async ({ name, currentPassword, newPassword }: AccountChanges) => {
    if (name && name !== currentName) {
      const { error } = await updateProfile.trigger(name);
      if (error) return error.message ?? "Could not update your name.";
    }
    if (newPassword) {
      const { error } = await changePassword.trigger({ currentPassword, newPassword, revokeOtherSessions: true });
      if (error) return error.message ?? "Could not change your password.";
    }
    return null;
  };

  return { saveAccount, isSaving: updateProfile.isMutating || changePassword.isMutating };
}

function useSignInMethods(isOpen: boolean) {
  const { data } = useLinkedAccounts(isOpen);
  const accounts = data?.data ?? [];
  const hasPassword = accounts.some(({ providerId }) => providerId === CREDENTIAL_PROVIDER);
  const providers = accounts
    .filter(({ providerId }) => providerId !== CREDENTIAL_PROVIDER)
    .map(({ providerId }) => PROVIDER_LABELS[providerId] ?? providerId);
  return { hasPassword, providers };
}

export default function AccountSettingsDialog({ open, onOpenChange }: AccountSettingsDialogProps) {
  const { user } = useUser();
  const { hasPassword, providers } = useSignInMethods(open);
  const currentName = user?.fullName ?? "";
  const { saveAccount, isSaving } = useSaveAccount(currentName);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = await saveAccount(readChanges(event.currentTarget));
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Account updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>Update your name and sign-in details.</DialogDescription>
        </DialogHeader>
        <Form className="contents" onSubmit={onSubmit}>
          <DialogPanel className="flex flex-col gap-4">
            <Field name="name">
              <FieldLabel>Name</FieldLabel>
              <Input name="name" defaultValue={currentName} autoComplete="name" required />
            </Field>
            <Field name="email" disabled>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" defaultValue={user?.primaryEmailAddress.emailAddress} readOnly />
              <FieldDescription>Email can&apos;t be changed.</FieldDescription>
            </Field>
            {hasPassword && (
              <>
                <Field name="currentPassword">
                  <FieldLabel>Current password</FieldLabel>
                  <Input name="currentPassword" type="password" autoComplete="current-password" />
                </Field>
                <Field name="newPassword">
                  <FieldLabel>New password</FieldLabel>
                  <Input name="newPassword" type="password" autoComplete="new-password" minLength={8} />
                  <FieldDescription>At least 8 characters. Other sessions are signed out.</FieldDescription>
                </Field>
              </>
            )}
            {providers.length > 0 && !hasPassword && (
              <p className="text-sm text-muted-foreground">Signed in with {providers.join(" and ")}.</p>
            )}
          </DialogPanel>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" type="button" />}>Cancel</DialogClose>
            <Button type="submit" disabled={isSaving}>
              Save changes
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
