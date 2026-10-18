import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => Boolean(window.navigator && window.navigator.clipboard && typeof ClipboardItem === "function");
const getServerSnapshot = () => false;

export default function usePngClipboardSupported() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
