import { createAuthClient } from "better-auth/react";
import { dodopaymentsClient } from "@dodopayments/better-auth/client";

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/auth`,
  plugins: [dodopaymentsClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
