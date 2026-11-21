"use client";

import useSWRMutation from "swr/mutation";
import { authClient } from "@/lib/auth-client";

const SESSION_KEY = "auth-session";

type SignInInput = Parameters<typeof authClient.signIn.email>[0];
type SignUpInput = Parameters<typeof authClient.signUp.email>[0];
type ForgotPasswordInput = Parameters<typeof authClient.requestPasswordReset>[0];
type ResetPasswordInput = Parameters<typeof authClient.resetPassword>[0];
type ChangePasswordInput = Parameters<typeof authClient.changePassword>[0];

export type SocialProvider = "github" | "google";

export function useSignIn() {
  return useSWRMutation(SESSION_KEY, (_key, { arg }: { arg: SignInInput }) => authClient.signIn.email(arg));
}

export function useSignUp() {
  return useSWRMutation(SESSION_KEY, (_key, { arg }: { arg: SignUpInput }) => authClient.signUp.email(arg));
}

export function useResendVerification() {
  return useSWRMutation(SESSION_KEY, (_key, { arg }: { arg: string }) =>
    authClient.sendVerificationEmail({ email: arg }),
  );
}

export function useForgotPassword() {
  return useSWRMutation(SESSION_KEY, (_key, { arg }: { arg: ForgotPasswordInput }) =>
    authClient.requestPasswordReset(arg),
  );
}

export function useResetPassword() {
  return useSWRMutation(SESSION_KEY, (_key, { arg }: { arg: ResetPasswordInput }) => authClient.resetPassword(arg));
}

export function useSocialSignIn(provider: SocialProvider) {
  return useSWRMutation(SESSION_KEY, (_key, { arg }: { arg: string }) =>
    authClient.signIn.social({ provider, callbackURL: arg }),
  );
}

export function useUpdateProfile() {
  return useSWRMutation(SESSION_KEY, (_key, { arg }: { arg: string }) => authClient.updateUser({ name: arg }));
}

export function useChangePassword() {
  return useSWRMutation(SESSION_KEY, (_key, { arg }: { arg: ChangePasswordInput }) =>
    authClient.changePassword(arg),
  );
}
