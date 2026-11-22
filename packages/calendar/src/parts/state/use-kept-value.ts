"use client";

import { useState } from "react";

export function useKeptValue<Value>(current: Value | null) {
  const [kept, setKept] = useState<Value | null>(current);
  if (current !== null && current !== kept) {
    setKept(current);
  }
  const release = (isOpen: boolean) => {
    if (!isOpen && current === null) {
      setKept(null);
    }
  };
  return { shown: current ?? kept, release };
}
