import { useState } from "react";

export default function useHeldValue<T>(value: T, isOpen: boolean) {
  const [heldValue, setHeldValue] = useState(value);
  if (isOpen && value !== heldValue) setHeldValue(value);
  return isOpen ? value : heldValue;
}
