import { Link } from "@/components/link";

export default function CheckoutNote() {
  return (
    <div className="flex flex-col items-center gap-1 text-center text-xs text-muted-foreground">
      <p>Secure checkout · Cancel anytime · 7-day refund</p>
      <p>
        By upgrading you agree to the{" "}
        <Link href="/legal/terms" className="underline underline-offset-2 hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/refund" className="underline underline-offset-2 hover:text-foreground">
          Refund policy
        </Link>
        .
      </p>
    </div>
  );
}
