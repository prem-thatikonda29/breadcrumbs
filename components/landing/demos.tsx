"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sampleLinks } from "./copy";
import { EASE } from "./ui";

const SPRING = { type: "spring", stiffness: 100, damping: 20 } as const;

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

// Loops through: a page is open, the Breadcrumbs bookmark is clicked, a confirmation shows,
// and the link lands at the top of the library.
export function SaveDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 1700);
    return () => clearInterval(id);
  }, [reduce]);

  const shown = reduce ? 3 : step;
  const library = shown === 3 ? sampleLinks : sampleLinks.slice(1);

  return (
    <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-white shadow-[0_32px_64px_-32px_rgba(28,27,25,0.25),inset_0_1px_0_rgba(255,255,255,1)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-[#1C1B19]/[0.06] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1C1B19]/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#1C1B19]/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#1C1B19]/10" />
        </div>
        <div className="flex-1 truncate rounded-full bg-[#F4F4F1] px-3 py-1 text-[11px] text-[#6E6B65]">youtube.com/watch?v=variable-fonts</div>
      </div>
      {/* Bookmarks bar */}
      <div className="flex items-center gap-2 border-b border-[#1C1B19]/[0.06] px-4 py-2 text-[11px] text-[#6E6B65]">
        <motion.span
          animate={shown === 1 ? { scale: 0.94, backgroundColor: "rgba(47,107,79,0.14)" } : { scale: 1, backgroundColor: "rgba(47,107,79,0.06)" }}
          transition={SPRING}
          className="rounded-md px-2 py-1 font-medium text-[#2F6B4F]"
        >
          Breadcrumbs
        </motion.span>
        <span className="rounded-md px-2 py-1">Recipes</span>
        <span className="hidden rounded-md px-2 py-1 sm:inline">Docs</span>
      </div>

      <div className="relative grid min-h-[300px] grid-cols-1 sm:grid-cols-[1fr_auto]">
        {/* The page being saved */}
        <div className="relative p-5">
            {/* Confirmation */}
            <AnimatePresence>
              {shown === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute left-1/2 top-8 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#1C1B19] px-4 py-2 text-[12px] text-white shadow-[0_12px_24px_-12px_rgba(28,27,25,0.6)]"
                >
                  <Check className="h-3.5 w-3.5 text-[#8FD3B0]" />
                  Saved to Breadcrumbs
                </motion.div>
              )}
            </AnimatePresence>

          <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-[#2A2925] to-[#45423C]">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
              <span className="ml-1 h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-white/80" />
            </span>
          </div>
          <p className="mt-4 font-display text-[19px] leading-snug tracking-[-0.01em] text-[#1C1B19]">{sampleLinks[0].title}</p>
          <p className="mt-1 text-[12px] text-[#6E6B65]">Type Talks · 41 min</p>
        </div>

        {/* Library panel */}
        <div className="border-t border-[#1C1B19]/[0.06] bg-[#FAFAF8] p-4 sm:w-[230px] sm:border-l sm:border-t-0">
          <p className="mb-3 text-[11px] font-medium text-[#1C1B19]">Library</p>
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {library.map((link, i) => (
                <motion.li
                  key={link.title}
                  layout
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={SPRING}
                  className={`rounded-lg px-3 py-2 ${shown === 3 && i === 0 ? "bg-[#2F6B4F]/[0.08] ring-1 ring-[#2F6B4F]/20" : "bg-white ring-1 ring-[#1C1B19]/[0.05]"}`}
                >
                  <p className={`truncate text-[11px] font-medium ${link.explored ? "text-[#A8A59E] line-through" : "text-[#1C1B19]"}`}>{link.title}</p>
                  <p className="text-[10px] text-[#8C8981]">{link.site}</p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

      </div>
    </div>
  );
}

// A small, real interaction: tick links off and watch them settle to the bottom.
export function LibraryDemo() {
  const [explored, setExplored] = useState<Set<string>>(
    () => new Set(sampleLinks.filter((l) => l.explored).map((l) => l.title))
  );

  const ordered = [...sampleLinks].sort(
    (a, b) => Number(explored.has(a.title)) - Number(explored.has(b.title))
  );

  function toggle(title: string) {
    setExplored((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <div className="rounded-[calc(2rem-0.375rem)] bg-white p-5 shadow-[0_32px_64px_-32px_rgba(28,27,25,0.2),inset_0_1px_0_rgba(255,255,255,1)] md:p-7">
      <div className="mb-5 flex items-baseline justify-between">
        <p className="font-display text-[22px] tracking-[-0.01em] text-[#1C1B19]">Talks to watch</p>
        <p className="text-[13px] tabular-nums text-[#6E6B65]">
          {explored.size} of {sampleLinks.length} explored
        </p>
      </div>
      <ul className="space-y-2">
        {ordered.map((link) => {
          const done = explored.has(link.title);
          return (
            <motion.li key={link.title} layout transition={SPRING}>
              <button
                type="button"
                onClick={() => toggle(link.title)}
                aria-pressed={done}
                className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left ring-1 ring-[#1C1B19]/[0.05] transition-colors duration-300 hover:bg-[#F4F4F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B4F] active:scale-[0.99]"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${done ? "bg-[#2F6B4F] text-white" : "ring-1 ring-[#1C1B19]/20 text-transparent group-hover:text-[#1C1B19]/30"}`}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-[15px] transition-colors duration-300 ${done ? "text-[#A8A59E] line-through" : "text-[#1C1B19]"}`}>{link.title}</span>
                  <span className="block text-[12px] text-[#8C8981]">
                    {link.site} · {link.ago}
                  </span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
