export enum StackMove {
  Next = "next",
  Previous = "previous",
}

export function syncStackOrder(order: string[], ids: string[]) {
  const kept = order.filter((id) => ids.includes(id));
  const added = ids.filter((id) => !kept.includes(id));
  return [...added, ...kept];
}

export function sendTopToBack(order: string[]) {
  const top = order.at(-1);
  if (top === undefined) {
    return order;
  }
  return [top, ...order.slice(0, -1)];
}

export function bringBackToTop(order: string[]) {
  const [back, ...rest] = order;
  if (back === undefined) {
    return order;
  }
  return [...rest, back];
}

export function bringToTop(order: string[], id: string) {
  const isKnown = order.includes(id);
  if (!isKnown) {
    return order;
  }
  return [...order.filter((orderId) => orderId !== id), id];
}

export function moveStack(order: string[], move: StackMove) {
  const moves = {
    [StackMove.Next]: sendTopToBack,
    [StackMove.Previous]: bringBackToTop,
  };
  return moves[move](order);
}
