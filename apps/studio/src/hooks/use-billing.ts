"use client";

import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/toast";

type RedirectResponse = {
  data?: { url?: string } | null;
  error?: { message?: string } | null;
};

function followRedirect({ data, error }: RedirectResponse) {
  if (data?.url) window.location.href = data.url;
  else toast.error(error?.message ?? "Something went wrong. Try again.");
}

function useBilling() {
  const router = useRouter();
  const portal = useSWRMutation("billing.portal", () => authClient.dodopayments.customer.portal());
  const checkout = useSWRMutation("billing.checkout", (_key, { arg }: { arg: string }) =>
    authClient.dodopayments.checkoutSession({ slug: arg }),
  );

  async function redirectWith(request: Promise<RedirectResponse>) {
    try {
      followRedirect(await request);
    } catch {
      router.push("/");
    }
  }

  return {
    openPortal: () => redirectWith(portal.trigger()),
    openCheckout: (slug: string) => redirectWith(checkout.trigger(slug)),
    isLoading: portal.isMutating || checkout.isMutating,
  };
}

export default useBilling;
