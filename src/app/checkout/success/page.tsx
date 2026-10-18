import { Suspense } from "react";
import CheckoutSuccessClient, { FailedCheckoutRedirect } from "./page.client";

export default function CheckoutSuccessPage() {
  return (
    <>
      <Suspense>
        <FailedCheckoutRedirect />
      </Suspense>
      <CheckoutSuccessClient />
    </>
  );
}
