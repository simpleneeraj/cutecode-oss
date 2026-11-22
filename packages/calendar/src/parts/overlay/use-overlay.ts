"use client";

import { useKeptValue } from "../state/use-kept-value";
import { useIsPhone } from "../viewport/use-is-phone";

export type OverlayDismiss = {
  isSaving: boolean;
  onClose: () => void;
};

export function useOverlay<Value>(value: Value | null, dismiss: OverlayDismiss) {
  const isPhone = useIsPhone();
  const { shown, release } = useKeptValue(value);
  const isOpen = value !== null;
  const changeOpen = (open: boolean) => {
    if (!open && !dismiss.isSaving) {
      dismiss.onClose();
    }
  };
  return {
    shown,
    release,
    changeOpen,
    isSaving: dismiss.isSaving,
    isDesktopOpen: isOpen && !isPhone,
    isPhoneOpen: isOpen && isPhone,
  };
}

export type OverlayState<Value> = ReturnType<typeof useOverlay<Value>>;
