import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your CuteCode account to create and share beautiful code screenshots.",
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
