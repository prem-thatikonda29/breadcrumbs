"use client";

import { useEffect, useSyncExternalStore } from "react";
import { initSound, isSoundEnabled, subscribeSound } from "@/lib/sound";

/** Mount once near the root: arms the first-gesture audio unlock. Renders nothing. */
export function SoundInit() {
  useEffect(() => initSound(), []);
  return null;
}

/** Current sound on/off state; re-renders when it changes. Always "on" during SSR. */
export function useSoundEnabled(): boolean {
  return useSyncExternalStore(subscribeSound, isSoundEnabled, () => true);
}
