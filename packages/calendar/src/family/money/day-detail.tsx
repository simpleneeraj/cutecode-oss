import { formatPlainDate } from "../../locale";
import { ContentSwap } from "../../parts/view-motion/content-swap";
import type { PlainDate, ViewSettings } from "../../types";
import { moneyCopy } from "./copy";
import { paymentGlyphs } from "./glyphs";
import { formatAmount, paymentDetail, type Payment } from "./payment";
import { moneyStyles, paymentRowStyles } from "./style";

type DayDetailProps = {
  date: PlainDate;
  payments: Payment[];
  settings: ViewSettings;
  currency: string;
};

type PaymentRowProps = {
  payment: Payment;
  amount: string;
};

const styles = moneyStyles();

const rowStyles = paymentRowStyles();

function PaymentRow({ payment, amount }: PaymentRowProps) {
  const Glyph = paymentGlyphs[payment.glyph];

  return (
    <li className={rowStyles.root()} data-slot="payment-row">
      <span aria-hidden="true" className={rowStyles.glyph()}>
        <Glyph className={rowStyles.glyphIcon()} />
      </span>
      <span className={rowStyles.text()}>
        <span className={rowStyles.title()}>{payment.title}</span>
        <small className={rowStyles.detail()}>{paymentDetail(payment)}</small>
      </span>
      <b className={rowStyles.amount()}>{amount}</b>
    </li>
  );
}

function NothingDue() {
  return (
    <div className={rowStyles.empty()} data-slot="payment-empty">
      <strong className={rowStyles.emptyTitle()}>{moneyCopy.nothingDue}</strong>
      <span className={rowStyles.emptyText()}>{moneyCopy.tapAnother}</span>
    </div>
  );
}

function DayDetail({ date, payments, settings, currency }: DayDetailProps) {
  const title = formatPlainDate(date, settings, { weekday: "long", month: "short", day: "numeric" });

  return (
    <section aria-label={title} data-slot="money-day-detail">
      <ContentSwap swapKey={`${date}|${payments.length}`}>
        <h3 className={styles.dayTitle()}>{title}</h3>
        {payments.length === 0 ? (
          <NothingDue />
        ) : (
          <ul className={styles.list()}>
            {payments.map((payment) => (
              <PaymentRow
                key={payment.id}
                amount={formatAmount(payment.amountCents, settings, currency)}
                payment={payment}
              />
            ))}
          </ul>
        )}
      </ContentSwap>
    </section>
  );
}

export { DayDetail };
