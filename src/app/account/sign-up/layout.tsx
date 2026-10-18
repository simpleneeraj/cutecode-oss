import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free CuteCode account and start creating beautiful code screenshots in seconds.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
