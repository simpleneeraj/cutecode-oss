"use client";

import { useSyncExternalStore } from "react";

import { customizer } from "./constants";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(customizer.phoneQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readIsPhone() {
  return window.matchMedia(customizer.phoneQuery).matches;
}

function readServerIsPhone() {
  return false;
}

export function useIsPhone() {
  return useSyncExternalStore(subscribe, readIsPhone, readServerIsPhone);
}
