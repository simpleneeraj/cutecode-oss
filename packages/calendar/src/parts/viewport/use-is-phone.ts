"use client";

import { useSyncExternalStore } from "react";

type MediaStore = {
  subscribe: (onChange: () => void) => () => void;
  read: () => boolean;
};

const viewportQueries = {
  phone: "(max-width: 767px), (orientation: landscape) and (max-height: 500px)",
  phoneLandscape: "(orientation: landscape) and (max-height: 500px)",
};

function mediaStore(query: string): MediaStore {
  return {
    subscribe: (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    read: () => window.matchMedia(query).matches,
  };
}

const phoneStore = mediaStore(viewportQueries.phone);

const phoneLandscapeStore = mediaStore(viewportQueries.phoneLandscape);

function readServerMatch() {
  return false;
}

export function useIsPhone() {
  return useSyncExternalStore(phoneStore.subscribe, phoneStore.read, readServerMatch);
}

export function useIsPhoneLandscape() {
  return useSyncExternalStore(phoneLandscapeStore.subscribe, phoneLandscapeStore.read, readServerMatch);
}
