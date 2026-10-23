"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Landing page demo: plays muted on a loop (browsers block autoplay with sound),
// with a button to turn sound on. Respects reduced motion by not autoplaying.
export function DemoVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const reduceMotion = useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduceMotion) video.pause();
    else video.play().catch(() => {});
  }, [reduceMotion]);

  function toggleSound() {
    const video = ref.current;
    if (!video) return;
    video.muted = !muted;
    if (muted) video.play().catch(() => {});
    setMuted(!muted);
  }

  return (
    <div className="relative overflow-hidden rounded-[calc(2.25rem-0.5rem)] bg-[#211C16]">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        controls={reduceMotion}
        aria-label={label}
        className="block aspect-video w-full"
      />
      {!reduceMotion && (
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={!muted}
          className="absolute bottom-4 right-4 rounded-full bg-[#211C16]/70 px-4 py-2 text-[13px] text-[#FBF8F1] backdrop-blur-md transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#211C16]/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBF8F1]/60"
        >
          {muted ? "Turn sound on" : "Mute"}
        </button>
      )}
    </div>
  );
}
