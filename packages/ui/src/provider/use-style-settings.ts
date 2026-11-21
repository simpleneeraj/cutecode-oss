"use client";

import { useSyncExternalStore } from "react";

import {
  defaultStyleSettings,
  readStyleSettings,
  serializeStyleSettings,
  type StyleSettings,
  styleSettingsCookie,
} from ".";

const observedAttributes = ["data-style", "data-palette", "data-font"];

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: observedAttributes });
  return () => observer.disconnect();
}

function readDocumentSnapshot() {
  const { style, palette, font } = document.documentElement.dataset;
  return [style, palette, font].join(styleSettingsCookie.separator);
}

function readServerSnapshot() {
  return serializeStyleSettings(defaultStyleSettings);
}

function applyStyleSettings(settings: StyleSettings) {
  const root = document.documentElement;
  root.dataset.style = settings.style;
  root.dataset.palette = settings.palette;
  root.dataset.font = settings.font;
  const cookieValue = serializeStyleSettings(settings);
  document.cookie = `${styleSettingsCookie.name}=${cookieValue}; path=/; max-age=${styleSettingsCookie.maxAgeSeconds}; samesite=lax`;
}

export function useStyleSettings() {
  const snapshot = useSyncExternalStore(subscribe, readDocumentSnapshot, readServerSnapshot);
  const settings = readStyleSettings(snapshot);

  function updateStyleSettings(changes: Partial<StyleSettings>) {
    applyStyleSettings({ ...settings, ...changes });
  }

  return { settings, updateStyleSettings };
}
