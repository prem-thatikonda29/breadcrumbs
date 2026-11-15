// UI sound effects. One shared, browser-only player for the whole app.
//
// Rules this module enforces:
// - Nothing is created or played on the server.
// - Nothing plays until the person has clicked, tapped or pressed a key on this page.
//   Cues that arrive before that are dropped, not queued.
// - The on/off preference lives in localStorage and applies everywhere at once,
//   including the bookmarklet pop-up (same origin).

import { createUISFX, type CueName, type PlayingSFX, type UISFXOptions, type UISFXPlayer } from "uisfx";

export const SOUND_PACK = "zen" as const;
export const SOUND_PREF_KEY = "breadcrumbs:sound";
export const DEFAULT_VOLUME = 0.7;

/** Product events that make a sound, and the cue each one uses. */
export const SOUND_CUES = {
  "link-saved": "success",
  "link-duplicate": "info",
  "link-error": "error",
  "collection-created": "success",
  "collection-error": "error",
  "link-filed": "drop",
  "link-file-error": "error",
  "sound-on": "toggle-on",
} as const satisfies Record<string, CueName>;

export type SoundEvent = keyof typeof SOUND_CUES;

type Factory = (options: UISFXOptions) => UISFXPlayer;

let factory: Factory = createUISFX;
let player: UISFXPlayer | null = null;
let unlocked = false;
let unlockListenersAttached = false;
const listeners = new Set<() => void>();
// Capture phase so a handler calling stopPropagation can't swallow the unlock gesture.
const CAPTURE: AddEventListenerOptions = { capture: true };

function emit() {
  for (const l of listeners) l();
}

function getPlayer(): UISFXPlayer | null {
  if (typeof window === "undefined") return null;
  if (!player) {
    // The player reads saved volume/enabled from SOUND_PREF_KEY and writes changes back.
    // Only the pack is forced; volume and enabled fall back to defaults when nothing is saved.
    let saved: { volume?: unknown; enabled?: unknown } = {};
    try {
      saved = JSON.parse(window.localStorage.getItem(SOUND_PREF_KEY) ?? "{}");
    } catch {
      // Storage blocked or corrupt: use defaults.
    }
    player = factory({
      pack: SOUND_PACK,
      volume: typeof saved.volume === "number" ? saved.volume : DEFAULT_VOLUME,
      enabled: typeof saved.enabled === "boolean" ? saved.enabled : true,
      preferences: { key: SOUND_PREF_KEY },
    });
  }
  return player;
}

function handleGesture() {
  const p = getPlayer();
  if (!p || unlocked) return;
  // Called synchronously inside the pointer/key handler so the browser treats it as user intent.
  p.unlock().then((ok) => {
    if (ok) {
      unlocked = true;
      detachUnlockListeners();
    }
  });
}

function detachUnlockListeners() {
  if (!unlockListenersAttached) return;
  window.removeEventListener("pointerdown", handleGesture, CAPTURE);
  window.removeEventListener("keydown", handleGesture, CAPTURE);
  unlockListenersAttached = false;
}

/**
 * Wait for the first genuine gesture, then unlock Web Audio. Safe to call repeatedly
 * (remounts, Strict Mode). Returns a cleanup that removes the listeners.
 */
export function initSound(): () => void {
  if (typeof window === "undefined" || unlocked) return () => {};
  if (!unlockListenersAttached) {
    window.addEventListener("pointerdown", handleGesture, CAPTURE);
    window.addEventListener("keydown", handleGesture, CAPTURE);
    unlockListenersAttached = true;
  }
  return detachUnlockListeners;
}

/** Play the cue for a product event. Returns null when muted, locked, or on the server. */
export function playSound(event: SoundEvent): PlayingSFX | null {
  const p = getPlayer();
  if (!p || !unlocked || !p.isEnabled()) return null;
  return p.play(SOUND_CUES[event]);
}

export function isSoundEnabled(): boolean {
  return getPlayer()?.isEnabled() ?? true;
}

export function setSoundEnabled(enabled: boolean) {
  const p = getPlayer();
  if (!p) return;
  if (!enabled) {
    // Silence anything in flight before muting so the switch takes effect at once.
    p.stopAll();
    p.setEnabled(false);
  } else {
    p.setEnabled(true);
    // This runs inside the click that turned sound on, so it also counts as the unlock gesture.
    if (!unlocked) handleGesture();
    p.play(SOUND_CUES["sound-on"]);
  }
  emit();
}

export function stopAllSounds() {
  player?.stopAll();
}

export function subscribeSound(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Final teardown. Also used by tests to reset module state. */
export async function disposeSound() {
  if (typeof window !== "undefined") detachUnlockListeners();
  const p = player;
  player = null;
  unlocked = false;
  listeners.clear();
  if (p) await p.destroy();
}

/** Test hook: swap the uisfx factory for a fake. */
export function __setSoundFactory(next: Factory | null) {
  factory = next ?? createUISFX;
}
