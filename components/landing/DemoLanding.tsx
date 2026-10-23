import Link from "next/link";
import { hero, steps, features, why, finalCta, contactEmail } from "./copy";
import { LibraryDemo, SaveDemo } from "./demos";
import { ClosingLine, IslandNav, PillButton, Reveal } from "./ui";

// Direction C: show the product. Airy warm-neutral surfaces, soft diffused depth, forest green accent.

function Bezel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[2rem] bg-[#1C1B19]/[0.03] p-1.5 ring-1 ring-[#1C1B19]/[0.05] ${className}`}>{children}</div>;
}

function FeatureVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {[
          ["Talks to watch", "#2F6B4F"],
          ["Recipes", "#8C8981"],
          ["Fonts", "#2F6B4F"],
          ["Read this weekend", "#8C8981"],
        ].map(([name, dot]) => (
          <span key={name} className="flex items-center gap-2 rounded-xl bg-[#F4F4F1] px-3 py-2 text-[13px] text-[#1C1B19]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
            {name}
          </span>
        ))}
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="rounded-xl bg-[#F4F4F1] px-4 py-3 text-[13px] leading-relaxed text-[#45423C]">
        Use the variable axis for weight instead of shipping six files.
        <span className="mt-2 block tracking-[0.2em] text-[#2F6B4F]">●●●●○</span>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-[#F4F4F1] px-4 py-3 text-[13px] text-[#1C1B19]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 text-[#8C8981]" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-4.2-4.2" strokeLinecap="round" />
        </svg>
        garlic noodles
        <span className="ml-auto text-[12px] text-[#8C8981]">1 result</span>
      </div>
    );
  }
  return (
    <pre className="overflow-hidden rounded-xl bg-[#F4F4F1] px-4 py-3 font-mono text-[12px] leading-relaxed text-[#45423C]">
      {"# Talks to watch\n\n## Building a variable font\nyoutube.com\n> Use the variable axis..."}
    </pre>
  );
}

export function DemoLanding() {
  return (
    <div className="min-h-[100dvh] bg-[#F4F4F1] font-body text-[#1C1B19] selection:bg-[#2F6B4F]/20">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#1C1B19] focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <IslandNav
        theme={{
          pill: "bg-white/70 ring-1 ring-[#1C1B19]/[0.06] shadow-[0_16px_40px_-24px_rgba(28,27,25,0.3)]",
          link: "text-[#6E6B65] hover:text-[#1C1B19]",
          cta: "bg-[#1C1B19] text-white hover:bg-[#33312D]",
          overlay: "bg-[#F4F4F1]/90",
          overlayLink: "text-[#1C1B19]",
          bar: "bg-[#1C1B19]",
        }}
      />

      <main id="main">
        {/* Hero: split, with the save flow playing on the right */}
        <section className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-5 pb-28 pt-36 md:grid-cols-2 md:gap-12 md:px-10 md:pb-40 md:pt-44">
          <div>
            <Reveal>
              <h1 className="font-display text-[44px] font-medium leading-[1] tracking-[-0.035em] text-balance md:text-[68px]">
                Save any page in one click. Find it again when you want it.
              </h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-7 max-w-[50ch] text-[17px] leading-relaxed text-[#5C5953] text-pretty">{hero.subhead}</p>
            </Reveal>
            <Reveal delay={0.16} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <PillButton
                href="/sign-in"
                className="bg-[#2F6B4F] text-white hover:bg-[#285C44] focus-visible:ring-[#2F6B4F] focus-visible:ring-offset-[#F4F4F1]"
                iconClassName="bg-white/15"
              >
                {hero.cta}
              </PillButton>
              <span className="text-[13px] text-[#8C8981]">{hero.ctaNote}</span>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Bezel>
              <SaveDemo />
            </Bezel>
          </Reveal>
        </section>

        {/* How it works next to a library you can actually click */}
        <section id="how" className="mx-auto max-w-[1280px] scroll-mt-28 px-5 pb-32 md:px-10 md:pb-44">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
            <div className="min-w-0 md:col-span-5">
              <Reveal>
                <h2 className="font-display text-[36px] font-medium leading-[1.02] tracking-[-0.03em] text-balance md:text-[48px]">
                  How it works
                </h2>
              </Reveal>
              <ol className="mt-12 space-y-10">
                {steps.map((step, i) => (
                  <Reveal key={step.title} delay={i * 0.06}>
                    <li className="grid grid-cols-[40px_1fr] gap-5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] bg-[#2F6B4F]/[0.08] text-[15px] font-medium tabular-nums text-[#2F6B4F]">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{step.title}</h3>
                        <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-[#5C5953]">{step.body}</p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
            <Reveal delay={0.1} className="min-w-0 md:col-span-6 md:col-start-7 md:pt-4">
              <Bezel>
                <LibraryDemo />
              </Bezel>
              <p className="mt-4 text-[13px] text-[#8C8981]">Go on, tick a few off. This is how the library works.</p>
            </Reveal>
          </div>
        </section>

        {/* Features: asymmetric bento, labels sit under each tile */}
        <section className="mx-auto max-w-[1280px] px-5 pb-32 md:px-10 md:pb-44">
          <Reveal>
            <h2 className="font-display text-[36px] font-medium leading-[1.02] tracking-[-0.03em] md:text-[48px]">The rest of it</h2>
          </Reveal>
          <div className="mt-14 grid gap-x-5 gap-y-12 md:grid-cols-12">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 2) * 0.08} className={i === 0 || i === 3 ? "md:col-span-7" : "md:col-span-5"}>
                <Bezel>
                  <div className="flex min-h-[180px] items-center rounded-[calc(2rem-0.375rem)] bg-white p-8 shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                    <div className="w-full">
                      <FeatureVisual index={i} />
                    </div>
                  </div>
                </Bezel>
                <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.01em]">{f.title}</h3>
                <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-[#5C5953]">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Why I built this */}
        <section id="why" className="mx-auto max-w-[1280px] scroll-mt-28 px-5 pb-32 md:px-10 md:pb-44">
          <Reveal className="md:ml-[8.333%] md:max-w-[820px]">
            <Bezel>
              <article className="rounded-[calc(2rem-0.375rem)] bg-white px-7 py-12 shadow-[0_32px_64px_-40px_rgba(28,27,25,0.25)] md:px-14 md:py-16">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#2F6B4F] font-display text-[22px] text-white">P</span>
                  <div>
                    <h2 className="font-display text-[30px] font-medium leading-none tracking-[-0.02em] md:text-[36px]">{why.title}</h2>
                    <p className="mt-1 text-[13px] text-[#8C8981]">Prem, who made Breadcrumbs</p>
                  </div>
                </div>
                <div className="mt-10 space-y-6 text-[17px] leading-[1.75] text-[#3A3833] text-pretty">
                  {why.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  <p>
                    <ClosingLine
                      text={why.closing}
                      email={contactEmail}
                      linkClassName="text-[#2F6B4F] underline decoration-[#2F6B4F]/40 underline-offset-4 hover:decoration-[#2F6B4F]"
                    />
                  </p>
                </div>
              </article>
            </Bezel>
          </Reveal>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pb-36 md:px-10 md:pb-48">
          <Reveal className="grid items-end gap-10 md:grid-cols-12">
            <h2 className="font-display text-[48px] font-medium leading-[0.95] tracking-[-0.04em] md:col-span-7 md:text-[84px]">{finalCta.title}</h2>
            <div className="md:col-span-4 md:col-start-9">
              <p className="text-[16px] leading-relaxed text-[#5C5953]">{finalCta.body}</p>
              <PillButton
                href="/sign-in"
                className="mt-8 bg-[#2F6B4F] text-white hover:bg-[#285C44] focus-visible:ring-[#2F6B4F] focus-visible:ring-offset-[#F4F4F1]"
                iconClassName="bg-white/15"
              >
                {hero.cta}
              </PillButton>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1280px] items-center justify-between px-5 pb-10 text-[13px] text-[#8C8981] md:px-10">
        <span>Built by Prem</span>
        <Link href="/privacy" className="transition-colors duration-300 hover:text-[#1C1B19]">
          Privacy
        </Link>
      </footer>
    </div>
  );
}
