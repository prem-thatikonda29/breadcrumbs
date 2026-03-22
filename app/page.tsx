"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  animate,
} from "framer-motion";

// ─── Animation presets ────────────────────────────────────────────────────────

const ease = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// SVG fractal noise grain — client-only to avoid SSR/hydration mismatch
function NoiseOverlay() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity: 0.04 }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="hero-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M1 6.5h11M7.5 2.5l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Tilt on hover using framer-motion spring transforms
function TiltCard({
  children,
  className,
  variants,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: typeof fadeUp;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), {
    stiffness: 300,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), {
    stiffness: 300,
    damping: 28,
  });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Count from 00 → target when scrolled into view
function CountUpNumber({ target, delay = 0 }: { target: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => String(Math.round(v)).padStart(2, "0"));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, {
      duration: 0.7,
      delay,
      ease: "easeOut",
    });
    return controls.stop;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span
      ref={ref}
      className="serif text-[60px] leading-none block text-[#EAEAEA]"
      style={{ letterSpacing: "-0.02em" }}
    >
      <motion.span>{display}</motion.span>
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { scrollY } = useScroll();
  // Nav border fades in once user scrolls past hero fold
  const navBorderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <div className="bg-[#F7F6F3] text-[#111111] min-h-screen">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 bg-[#F7F6F3]/90 backdrop-blur-sm relative">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-[#EAEAEA]"
          style={{ opacity: navBorderOpacity }}
        />
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-[#111111]">
            Breadcrumbs
          </span>
          <Link
            href="/sign-in"
            className="flex items-center gap-1.5 text-xs font-medium text-[#787774] hover:text-[#111111] transition-colors duration-150"
          >
            Sign in <ArrowRight />
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20" suppressHydrationWarning>
        <NoiseOverlay />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="inline-flex items-center gap-2 px-2.5 py-1 mb-10 border border-[#e8dfc8] bg-[#FBF3DB]"
          style={{ borderRadius: "4px" }}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-[#956400]">
            Personal knowledge tool
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.08 }}
          className="serif text-[52px] sm:text-[72px] text-black mb-8 max-w-3xl"
          style={{ lineHeight: 1.04, letterSpacing: "-0.025em" }}
        >
          A trail of everything<br />
          you've learned.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.15 }}
          className="text-base text-[#787774] leading-relaxed max-w-md mb-10"
        >
          Save links, track what you've explored, write notes on what matters.
          Your reading list, finally turned into something useful.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.22 }}
        >
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#111111] text-white text-sm font-medium transition-colors duration-150 hover:bg-[#2a2a2a] active:scale-[0.98]"
            style={{ borderRadius: "5px" }}
          >
            Start for free
            <ArrowRight />
          </Link>
        </motion.div>

        {/* ── APP WINDOW MOCKUP ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.3 }}
          className="mt-16 rounded-xl border border-[#EAEAEA] overflow-hidden bg-white"
          style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.05)" }}
        >
          {/* Window chrome */}
          <div className="border-b border-[#EAEAEA] bg-[#F9F9F8] px-4 py-3 flex items-center gap-3">
            <div className="flex gap-1.5 shrink-0">
              <div className="h-2.5 w-2.5 rounded-full bg-[#EAEAEA]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#EAEAEA]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#EAEAEA]" />
            </div>
            <div className="flex-1 mx-6">
              <div className="mx-auto max-w-[220px] h-5 rounded bg-[#EAEAEA] flex items-center justify-center">
                <span
                  className="text-[10px] text-[#787774]"
                  style={{ fontFamily: "ui-monospace, 'SF Mono', monospace" }}
                >
                  breadcrumbs.app/library
                </span>
              </div>
            </div>
          </div>

          {/* App body */}
          <div className="flex" style={{ height: "300px" }}>
            {/* Sidebar */}
            <div className="hidden sm:flex w-48 border-r border-[#EAEAEA] flex-col p-3 gap-0.5 shrink-0">
              <div className="h-7 flex items-center px-3 bg-[#F7F6F3] rounded-md">
                <span className="text-xs font-medium text-[#111111]">Library</span>
              </div>
              <div className="h-7 flex items-center px-3 rounded-md">
                <span className="text-xs text-[#BBBBB8]">Export</span>
              </div>
              <div className="h-7 flex items-center px-3 rounded-md">
                <span className="text-xs text-[#BBBBB8]">Bookmarklet</span>
              </div>
              <div className="mt-4 mb-1 px-3">
                <span
                  className="text-[9px] uppercase text-[#DEDEDE]"
                  style={{ letterSpacing: "0.12em" }}
                >
                  Collections
                </span>
              </div>
              {[
                { bg: "#FBF3DB", border: "rgba(149,100,0,0.35)", label: "Design" },
                { bg: "#E1F3FE", border: "rgba(31,108,159,0.35)", label: "Engineering" },
                { bg: "#EDF3EC", border: "rgba(52,101,56,0.35)", label: "Product" },
              ].map((col) => (
                <div key={col.label} className="h-7 flex items-center px-3 gap-2 rounded-md">
                  <div
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: col.bg, border: `1px solid ${col.border}` }}
                  />
                  <span className="text-xs text-[#787774]">{col.label}</span>
                </div>
              ))}
            </div>

            {/* Entry list with hover highlight */}
            <div className="flex-1 p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#111111]">Library</span>
                <div
                  className="h-5 px-2 bg-[#111111] flex items-center justify-center"
                  style={{ borderRadius: "4px" }}
                >
                  <span className="text-[9px] text-white font-medium">+ Add</span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  {
                    title: "The Product Roadmap Fallacy",
                    domain: "medium.com",
                    time: "2 days ago",
                    explored: false,
                  },
                  {
                    title: "How Figma Builds Product",
                    domain: "figma.com",
                    time: "1 week ago",
                    explored: true,
                  },
                  {
                    title: "Shape Up — Basecamp's product methodology",
                    domain: "basecamp.com",
                    time: "3 weeks ago",
                    explored: false,
                  },
                ].map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease, delay: 0.4 + i * 0.1 }}
                    whileHover={entry.explored ? {} : { backgroundColor: "#F5F2EE" }}
                    className="rounded-lg border border-[#EAEAEA] px-4 py-2.5 flex items-start gap-3 cursor-default"
                    style={{ backgroundColor: entry.explored ? "#FAFAFA" : "#FFFFFF" }}
                  >
                    <div
                      className="h-2 w-2 mt-1 rounded-full shrink-0"
                      style={{ backgroundColor: entry.explored ? "#DEDEDE" : "#956400" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{
                          color: entry.explored ? "#DEDEDE" : "#111111",
                          textDecoration: entry.explored ? "line-through" : "none",
                        }}
                      >
                        {entry.title}
                      </p>
                      <p
                        className="text-[10px] mt-0.5"
                        style={{ color: entry.explored ? "#DEDEDE" : "#BBBBB8" }}
                      >
                        {entry.domain} · {entry.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-t border-[#EAEAEA] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10% 0px" }}
            variants={fadeUp}
          >
            <span
              className="text-[10px] uppercase text-[#555555]"
              style={{ letterSpacing: "0.14em" }}
            >
              How it works
            </span>
          </motion.div>

          {/* Staggered steps */}
          <motion.div
            className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAEAEA]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10% 0px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="sm:pr-12 pb-12 sm:pb-0">
              <CountUpNumber target={1} delay={0} />
              <h3 className="mt-5 text-sm font-semibold text-black">Save</h3>
              <p className="mt-2 text-sm text-[#787774] leading-relaxed">
                Use the one-click bookmarklet from any browser. No extension needed —
                drag it to your toolbar once and it works on every site.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="sm:px-12 py-12 sm:py-0">
              <CountUpNumber target={2} delay={0.1} />
              <h3 className="mt-5 text-sm font-semibold text-black">Explore</h3>
              <p className="mt-2 text-sm text-[#787774] leading-relaxed">
                Work through your library at your own pace. Organize by collection,
                filter by status, and mark things explored as you finish them.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="sm:pl-12 pt-12 sm:pt-0">
              <CountUpNumber target={3} delay={0.2} />
              <h3 className="mt-5 text-sm font-semibold text-black">Learn</h3>
              <p className="mt-2 text-sm text-[#787774] leading-relaxed">
                Write notes per link, rate 1–5 stars, then export a collection as
                Markdown — ready to paste into any editor or blog.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES BENTO ── */}
      <section className="border-t border-[#EAEAEA] bg-[#F7F6F3]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <motion.div
            className="mb-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10% 0px" }}
            variants={fadeUp}
          >
            <span
              className="text-[10px] uppercase text-[#555555]"
              style={{ letterSpacing: "0.14em" }}
            >
              Features
            </span>
          </motion.div>

          {/* Asymmetric bento with stagger + tilt */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-5% 0px" }}
            variants={stagger}
          >
            {/* Collections — wide */}
            <TiltCard
              variants={fadeUp}
              className="col-span-2 rounded-xl border border-[#EAEAEA] bg-white p-8"
            >
              <div className="flex flex-col sm:flex-row items-start gap-8">
                <div className="flex-1">
                  <h3 className="font-semibold text-black mb-2">Collections</h3>
                  <p className="text-sm text-[#787774] leading-relaxed">
                    Group links by topic, project, or goal. Color-code them, archive
                    when done. Your library organized the way you think — not the way an
                    app expects you to.
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                  {[
                    { bg: "#FBF3DB", border: "rgba(149,100,0,0.4)", label: "Design systems" },
                    { bg: "#E1F3FE", border: "rgba(31,108,159,0.4)", label: "Engineering" },
                    { bg: "#EDF3EC", border: "rgba(52,101,56,0.4)", label: "Product thinking" },
                  ].map((col) => (
                    <div
                      key={col.label}
                      className="flex items-center gap-2 border border-[#EAEAEA] px-3 py-2 bg-[#F9F9F8]"
                      style={{ borderRadius: "6px" }}
                    >
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: col.bg, border: `1px solid ${col.border}` }}
                      />
                      <span className="text-xs text-[#787774]">{col.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>

            {/* Markdown export — tall */}
            <TiltCard
              variants={fadeUp}
              className="row-span-2 rounded-xl border border-[#EAEAEA] bg-white p-7 flex flex-col"
            >
              <h3 className="font-semibold text-black mb-2">Markdown export</h3>
              <p className="text-sm text-[#787774] leading-relaxed">
                Export all your notes from a collection as clean Markdown. One click
                from your learnings to your blog post.
              </p>
              <div className="mt-auto pt-8">
                <div
                  className="rounded-lg border border-[#EAEAEA] bg-[#F7F6F3] p-4 space-y-1"
                  style={{
                    fontFamily: "ui-monospace, 'SF Mono', 'Geist Mono', monospace",
                    fontSize: "10px",
                    lineHeight: "1.7",
                  }}
                >
                  <p className="text-[#111111] font-medium"># Design systems</p>
                  <p className="text-[#DEDEDE]">---</p>
                  <p className="text-[#787774]">## Tokens are not a design system</p>
                  <p className="text-[#BBBBB8]">tokens.wtf · ★★★★★</p>
                  <p className="text-[#BBBBB8]">The distinction between tokens and...</p>
                </div>
              </div>
            </TiltCard>

            {/* Learning notes */}
            <TiltCard
              variants={fadeUp}
              className="rounded-xl border border-[#EAEAEA] bg-white p-7"
            >
              <h3 className="font-semibold text-black mb-2">Learning notes</h3>
              <p className="text-sm text-[#787774] leading-relaxed">
                Capture insights per link. Rate 1–5 stars to surface your best finds
                later without re-reading everything.
              </p>
            </TiltCard>

            {/* Bookmarklet */}
            <TiltCard
              variants={fadeUp}
              className="rounded-xl border border-[#EAEAEA] bg-white p-7"
            >
              <h3 className="font-semibold text-black mb-2">One-click bookmarklet</h3>
              <p className="text-sm text-[#787774] leading-relaxed">
                Save any page from any browser in one click. No extension. Drag it
                once to your toolbar — done.
              </p>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <motion.section
        className="border-t border-[#EAEAEA] bg-[#111111]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        variants={fadeUp}
      >
        <div className="max-w-5xl mx-auto px-6 py-24">
          <h2
            className="serif text-[44px] sm:text-[60px] text-white mb-5"
            style={{ lineHeight: 1.05, letterSpacing: "-0.025em" }}
          >
            Start leaving<br />
            breadcrumbs.
          </h2>
          <p className="text-sm text-[#999999] mb-10">
            Free to use. Sign in with Google.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#555555] text-white text-sm font-medium transition-colors duration-150 hover:bg-white/5 active:scale-[0.98]"
            style={{ borderRadius: "5px" }}
          >
            Get started
            <ArrowRight />
          </Link>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1E1E1E] bg-[#111111]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-[#888888] font-medium">Breadcrumbs</span>
          <span className="text-xs text-[#888888]">Built for curious minds.</span>
        </div>
      </footer>

    </div>
  );
}
