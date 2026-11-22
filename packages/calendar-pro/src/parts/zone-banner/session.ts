const dismissed = new Set<string>();

const listeners = new Set<() => void>();

function readStored(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

function store(key: string) {
  try {
    window.sessionStorage.setItem(key, "dismissed");
  } catch {
    return;
  }
}

export function subscribeDismissals(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isDismissed(key: string): boolean {
  return dismissed.has(key) || readStored(key);
}

export function dismissForSession(key: string) {
  dismissed.add(key);
  store(key);
  listeners.forEach((listener) => listener());
}

export function subscribeNever() {
  return () => undefined;
}

export function readDeviceZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
