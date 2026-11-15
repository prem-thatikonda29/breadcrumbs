import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cueNames, type UISFXOptions, type UISFXPlayer } from "uisfx";
import {
  SOUND_CUES,
  SOUND_PACK,
  SOUND_PREF_KEY,
  __setSoundFactory,
  disposeSound,
  initSound,
  isSoundEnabled,
  playSound,
  setSoundEnabled,
  stopAllSounds,
  type SoundEvent,
} from "./sound";

function makeFakePlayer(options: UISFXOptions) {
  let enabled = options.enabled ?? true;
  const calls: string[] = [];
  const player = {
    unlock: vi.fn(async () => {
      calls.push("unlock");
      return true;
    }),
    play: vi.fn((cue: string) => {
      calls.push(`play:${cue}`);
      return { stop: () => {}, ended: Promise.resolve() };
    }),
    preload: vi.fn(async () => {}),
    setPack: vi.fn(),
    getPack: () => options.pack!,
    setVolume: vi.fn(),
    getVolume: () => options.volume ?? 1,
    setEnabled: vi.fn((v: boolean) => {
      calls.push(`setEnabled:${v}`);
      enabled = v;
    }),
    isEnabled: () => enabled,
    stopAll: vi.fn(() => calls.push("stopAll")),
    destroy: vi.fn(async () => {}),
  } satisfies UISFXPlayer;
  return { player, calls };
}

type Fake = ReturnType<typeof makeFakePlayer>;
let fakes: Fake[] = [];
let lastOptions: UISFXOptions | undefined;
let storage: Map<string, string>;
let fakeWindow: EventTarget & { localStorage: Pick<Storage, "getItem" | "setItem"> };

const flush = () => new Promise((r) => setTimeout(r, 0));

function gesture(type: "pointerdown" | "keydown" = "pointerdown") {
  fakeWindow.dispatchEvent(new Event(type));
}

beforeEach(() => {
  fakes = [];
  storage = new Map();
  fakeWindow = Object.assign(new EventTarget(), {
    localStorage: {
      getItem: (k: string) => storage.get(k) ?? null,
      setItem: (k: string, v: string) => void storage.set(k, v),
    },
  });
  vi.stubGlobal("window", fakeWindow);
  __setSoundFactory((options) => {
    lastOptions = options;
    const fake = makeFakePlayer(options);
    fakes.push(fake);
    return fake.player;
  });
});

afterEach(async () => {
  await disposeSound();
  __setSoundFactory(null);
  vi.unstubAllGlobals();
});

describe("cue mapping", () => {
  test("every product event maps to a real uisfx cue", () => {
    for (const cue of Object.values(SOUND_CUES)) expect(cueNames).toContain(cue);
  });

  test("outcomes use semantic cues", () => {
    expect(SOUND_CUES["link-saved"]).toBe("success");
    expect(SOUND_CUES["link-duplicate"]).toBe("info");
    expect(SOUND_CUES["link-error"]).toBe("error");
    expect(SOUND_CUES["collection-created"]).toBe("success");
    expect(SOUND_CUES["collection-error"]).toBe("error");
    expect(SOUND_CUES["link-filed"]).toBe("drop");
  });

  test("plays the mapped cue once unlocked", async () => {
    initSound();
    gesture();
    await flush();
    for (const [event, cue] of Object.entries(SOUND_CUES)) {
      fakes[0].player.play.mockClear();
      playSound(event as SoundEvent);
      expect(fakes[0].player.play).toHaveBeenCalledTimes(1);
      expect(fakes[0].player.play).toHaveBeenCalledWith(cue);
    }
  });

  test("uses the zen pack and the app's preference key", () => {
    isSoundEnabled();
    expect(lastOptions?.pack).toBe(SOUND_PACK);
    expect(SOUND_PACK).toBe("zen");
    expect(lastOptions?.preferences?.key).toBe(SOUND_PREF_KEY);
    expect(lastOptions?.volume).toBe(0.7);
  });
});

describe("unlocking", () => {
  test("drops cues before the first gesture instead of queueing them", async () => {
    initSound();
    expect(playSound("link-saved")).toBeNull();
    gesture();
    await flush();
    // The earlier cue was not replayed late.
    expect(fakes[0].player.play).not.toHaveBeenCalled();
    expect(playSound("link-saved")).not.toBeNull();
  });

  test("pointer then keyboard unlocks only once", async () => {
    initSound();
    gesture("pointerdown");
    await flush();
    gesture("keydown");
    gesture("pointerdown");
    await flush();
    expect(fakes[0].player.unlock).toHaveBeenCalledTimes(1);
  });

  test("keyboard alone unlocks", async () => {
    initSound();
    gesture("keydown");
    await flush();
    expect(playSound("link-error")).not.toBeNull();
  });

  test("remounting (Strict Mode) keeps one player and one set of listeners", async () => {
    const cleanup1 = initSound();
    cleanup1();
    initSound();
    initSound();
    gesture();
    await flush();
    expect(fakes).toHaveLength(1);
    expect(fakes[0].player.unlock).toHaveBeenCalledTimes(1);
  });

  test("cleanup before any gesture leaves audio locked", async () => {
    const cleanup = initSound();
    cleanup();
    gesture();
    await flush();
    expect(playSound("link-saved")).toBeNull();
  });
});

describe("sound preference", () => {
  test("muting stops everything first, then disables", async () => {
    initSound();
    gesture();
    await flush();
    setSoundEnabled(false);
    const { calls } = fakes[0];
    expect(calls.indexOf("stopAll")).toBeGreaterThan(-1);
    expect(calls.indexOf("stopAll")).toBeLessThan(calls.indexOf("setEnabled:false"));
    expect(playSound("link-saved")).toBeNull();
    expect(isSoundEnabled()).toBe(false);
  });

  test("a saved 'off' preference is honoured on the next load", async () => {
    storage.set(SOUND_PREF_KEY, JSON.stringify({ pack: "zen", volume: 0.4, enabled: false }));
    isSoundEnabled();
    expect(lastOptions?.enabled).toBe(false);
    expect(lastOptions?.volume).toBe(0.4);
    initSound();
    gesture();
    await flush();
    expect(playSound("link-saved")).toBeNull();
  });

  test("turning sound on confirms with toggle-on and unlocks from that click", async () => {
    storage.set(SOUND_PREF_KEY, JSON.stringify({ enabled: false }));
    setSoundEnabled(true);
    expect(fakes[0].player.unlock).toHaveBeenCalledTimes(1);
    expect(fakes[0].player.play).toHaveBeenCalledWith("toggle-on");
    await flush();
    expect(playSound("link-saved")).not.toBeNull();
  });

  test("corrupt stored preferences fall back to defaults", () => {
    storage.set(SOUND_PREF_KEY, "{not json");
    expect(isSoundEnabled()).toBe(true);
    expect(lastOptions?.volume).toBe(0.7);
  });
});

describe("lifecycle", () => {
  test("sign-out stopAll reaches the player", () => {
    isSoundEnabled();
    stopAllSounds();
    expect(fakes[0].player.stopAll).toHaveBeenCalled();
  });

  test("dispose destroys the player", async () => {
    isSoundEnabled();
    const p = fakes[0].player;
    await disposeSound();
    expect(p.destroy).toHaveBeenCalledTimes(1);
  });
});

describe("server rendering", () => {
  test("never creates a player or plays without a window", () => {
    vi.stubGlobal("window", undefined);
    expect(typeof window).toBe("undefined");
    expect(playSound("link-saved")).toBeNull();
    expect(isSoundEnabled()).toBe(true);
    initSound()();
    setSoundEnabled(false);
    stopAllSounds();
    expect(fakes).toHaveLength(0);
  });
});
