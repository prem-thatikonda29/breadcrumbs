"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

// A single quiet confirmation, for outcomes the screen doesn't otherwise show
// (a dialog closing after a save). Don't use it where a message is already visible.

type Listener = (message: string) => void;
const listeners = new Set<Listener>();

export function toast(message: string) {
  for (const l of listeners) l(message);
}

export function Toaster() {
  const [item, setItem] = useState<{ id: number; message: string } | null>(null);

  useEffect(() => {
    const listener: Listener = (message) => setItem({ id: Date.now(), message });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <ToastPrimitive.Provider duration={2800} swipeDirection="down">
      {item && (
        <ToastPrimitive.Root
          key={item.id}
          onOpenChange={(open) => !open && setItem(null)}
          className="flex items-center gap-2.5 rounded-full bg-ink py-2.5 pl-3.5 pr-5 text-sm text-card shadow-[0_24px_48px_-24px_rgba(92,58,28,0.6)] data-[state=open]:animate-[toast-in_300ms_var(--ease-soft)] data-[state=closed]:animate-[toast-out_200ms_ease-in] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=end]:animate-[toast-out_200ms_ease-in]"
        >
          <Check className="h-4 w-4 text-card/70" strokeWidth={1.75} aria-hidden />
          <ToastPrimitive.Title>{item.message}</ToastPrimitive.Title>
        </ToastPrimitive.Root>
      )}
      <ToastPrimitive.Viewport className="toast-viewport fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center outline-none" />
    </ToastPrimitive.Provider>
  );
}
