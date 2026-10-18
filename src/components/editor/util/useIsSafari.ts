import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () =>
  navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") <= -1;
const getServerSnapshot = () => false;

export default function useIsSafari() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
