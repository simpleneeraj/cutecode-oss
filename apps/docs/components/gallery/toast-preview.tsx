"use client";

import { Button } from "@cutecode/ui/components/button";
import { ToastProvider, toastManager } from "@cutecode/ui/components/toast";

function showToast() {
  toastManager.add({ title: "Snippet saved", description: "Your changes are live.", type: "success" });
}

export function ToastPreview() {
  return (
    <ToastProvider>
      <Button onClick={showToast} variant="outline">
        Show toast
      </Button>
    </ToastProvider>
  );
}
