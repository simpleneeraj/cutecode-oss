const currencySymbols = new Map<string, string>([
  ["USD", "$"],
  ["EUR", "€"],
  ["GBP", "£"],
  ["INR", "₹"],
  ["JPY", "¥"],
  ["CAD", "C$"],
  ["AUD", "A$"],
]);

export function formatPrice(cents: number, currency: string): string {
  const symbol = currencySymbols.get(currency);
  if (symbol) {
    const amount = (cents / 100).toFixed(2).replace(/\.00$/, "");
    return `${symbol}${amount}`;
  }
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}
