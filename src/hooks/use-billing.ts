"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/toast";

function useBilling() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  async function openPortal() {
    try {
      setIsLoading(true);
      const res = await authClient.dodopayments.customer.portal();
      if (res.data?.url) window.location.href = res.data.url;
      else toast.error(res.error?.message ?? "Something went wrong. Try again.");
    } catch {
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }

  async function openCheckout(slug: string) {
    try {
      setIsLoading(true);
      const res = await authClient.dodopayments.checkoutSession({ slug });
      if (res.data?.url) window.location.href = res.data.url;
      else toast.error(res.error?.message ?? "Something went wrong. Try again.");
    } catch {
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }

  return { openPortal, openCheckout, isLoading };
}

export default useBilling;
