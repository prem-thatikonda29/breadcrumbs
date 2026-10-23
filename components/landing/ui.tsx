"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const EASE = [0.32, 0.72, 0, 1] as const;

// Heavy fade-up with a blur that resolves as the element enters the viewport.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 48, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

// Pill button with its arrow nested in its own circle.
export function PillButton({
  href,
  children,
  className,
  iconClassName,
}: {
  href: string;
  children: React.ReactNode;
  className: string;
  iconClassName: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[15px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 ${iconClassName}`}
      >
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

// Fixed, non-interactive film grain. Never attached to a scrolling container.
export function Grain({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

type NavTheme = {
  pill: string;
  link: string;
  cta: string;
  overlay: string;
  overlayLink: string;
  bar: string;
};

const NAV_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#why", label: "Why I built this" },
];

// Floating island nav. On small screens the hamburger morphs into an X and opens a full-screen menu.
export function IslandNav({ theme }: { theme: NavTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
        <div className={`flex w-full max-w-3xl items-center justify-between gap-6 rounded-full py-2 pl-5 pr-2 backdrop-blur-xl ${theme.pill}`}>
          <Link href="/" className="font-display text-lg font-medium tracking-tight">
            Breadcrumbs
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className={`text-sm transition-colors duration-300 ${theme.link}`}>
                {l.label}
              </a>
            ))}
          </div>
          <Link
            href="/sign-in"
            className={`hidden rounded-full px-4 py-2 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] md:inline-flex ${theme.cta}`}
          >
            Sign in
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="relative h-10 w-10 md:hidden"
          >
            <span
              className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${theme.bar} ${open ? "rotate-45" : "-translate-y-[4px]"}`}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${theme.bar} ${open ? "-rotate-45" : "translate-y-[4px]"}`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className={`fixed inset-0 z-40 flex flex-col justify-center px-8 backdrop-blur-3xl md:hidden ${theme.overlay}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {[...NAV_LINKS, { href: "/sign-in", label: "Sign in" }].map((l, i) => (
              <div key={l.href} className="overflow-hidden">
                <motion.a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 font-display text-4xl tracking-tight ${theme.overlayLink}`}
                  initial={{ y: 48, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.05 }}
                >
                  {l.label}
                </motion.a>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// The letter's last line, with "email me" linked when a contact address is configured.
export function ClosingLine({ text, email, linkClassName }: { text: string; email: string; linkClassName: string }) {
  const [before, after] = text.split("email me");
  if (!email || after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <a href={`mailto:${email}`} className={linkClassName}>
        email me
      </a>
      {after}
    </>
  );
}
