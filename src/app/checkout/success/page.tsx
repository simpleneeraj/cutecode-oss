import { redirect } from "next/navigation";
import CheckoutSuccessClient from "./page.client";

type Props = {
  searchParams: Promise<{ status?: string; subscription_id?: string; email?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { status } = await searchParams;

  if (status === "failed" || status === "canceled" || status === "cancelled") {
    redirect("/checkout/failure");
  }

  return <CheckoutSuccessClient />;
}
