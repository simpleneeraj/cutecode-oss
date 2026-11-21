"use client";

import { ToastProvider, toastManager, type ToastPosition } from "@cutecode/ui/components/toast";

const DEFAULT_TIMEOUT = 2000;

type ToastOptions = { id?: string; description?: string; duration?: number };

function addTyped(type: string, title: string, opts?: ToastOptions) {
  return toastManager.add({
    title,
    description: opts?.description,
    type,
    id: opts?.id,
    timeout: opts?.duration ?? DEFAULT_TIMEOUT,
  });
}

export const toast = {
  loading(title: string, opts?: ToastOptions) {
    return toastManager.add({
      title,
      description: opts?.description,
      type: "loading",
      id: opts?.id,
      timeout: 0,
    });
  },
  success(title: string, opts?: ToastOptions) {
    if (opts?.id) {
      toastManager.update(opts.id, { title, description: opts.description, type: "success", timeout: opts.duration ?? DEFAULT_TIMEOUT });
      return opts.id;
    }
    return addTyped("success", title, opts);
  },
  error(title: string, opts?: ToastOptions) {
    if (opts?.id) {
      toastManager.update(opts.id, { title, description: opts.description, type: "error", timeout: opts.duration ?? DEFAULT_TIMEOUT });
      return opts.id;
    }
    return addTyped("error", title, opts);
  },
  info(title: string, opts?: ToastOptions) {
    return addTyped("info", title, opts);
  },
  warning(title: string, opts?: ToastOptions) {
    return addTyped("warning", title, opts);
  },
  dismiss(id?: string) {
    toastManager.close(id);
  },
};

type ToasterProps = {
  position?: ToastPosition;
};

function Toaster({ position = "top-center" }: ToasterProps) {
  return <ToastProvider position={position} />;
}

export { Toaster };
