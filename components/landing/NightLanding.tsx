import Link from "next/link";
import { hero, steps, features, why, finalCta, sampleLinks, contactEmail } from "./copy";
import { ClosingLine, Grain, IslandNav, Marquee, PillButton, Reveal } from "./ui";

// Direction B: dark editorial. Warm espresso from top to bottom, cream type, one muted amber accent.

const MORE_SAVES = [
  { title: "A 40 minute talk on kerning", site: "youtube.com" },
  { title: "Cold brew ratios, finally explained", site: "instagram.com" },
  { title: "How small teams ship", site: "basecamp.com" },
];

export function NightLanding() {
  const saves = [...sampleLinks, ...MORE_SAVES];

  return (
    <div className="min-h-[100dvh] bg-[#16120E] font-body text-[#EDE5D8] selection:bg-[#D19A4A]/30">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#EDE5D8] focus:px-4 focus:py-2 focus:text-[#16120E]">
        Skip to content
      </a>
      <Grain opacity={0.07} />
      {/* Ambient warm light, fixed so it never repaints on scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(60% 50% at 85% 0%, rgba(209,154,74,0.10), transparent 70%), radial-gradient(50% 40% at 0% 100%, rgba(120,72,40,0.12), transparent 70%)" }}
      />
      <IslandNav
        theme={{
          pill: "bg-[#211B15]/60 ring-1 ring-[#EDE5D8]/10 shadow-[inset_0_1px_0_rgba(237,229,216,0.06)]",
          link: "text-[#A39887] hover:text-[#EDE5D8]",
          cta: "bg-[#EDE5D8] text-[#16120E] hover:bg-white",
          overlay: "bg-[#16120E]/85",
          overlayLink: "text-[#EDE5D8]",
          bar: "bg-[#EDE5D8]",
        }}
      />

      <main id="main" className="relative">
        {/* Hero: the headline carries the story */}
        <section className="mx-auto max-w-[1280px] px-5 pb-20 pt-40 md:px-10 md:pb-28 md:pt-52">
          <Reveal>
            <h1 className="max-w-[14ch] font-display text-[48px] font-light leading-[0.95] tracking-[-0.04em] text-balance md:text-[104px]">
              Watch Later was a dead end.{" "}
              <span className="italic text-[#D19A4A]">So I built my own.</span>
            </h1>
          </Reveal>
          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
            <Reveal delay={0.1} className="md:col-span-5 md:col-start-7">
              <p className="max-w-[50ch] text-[17px] leading-relaxed text-[#B8AD9C] text-pretty">{hero.subhead}</p>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <PillButton
                  href="/sign-in"
                  className="bg-[#EDE5D8] text-[#16120E] hover:bg-white focus-visible:ring-[#EDE5D8] focus-visible:ring-offset-[#16120E]"
                  iconClassName="bg-[#16120E]/10"
                >
                  {hero.cta}
                </PillButton>
                <span className="text-[13px] text-[#8A7F70]">{hero.ctaNote}</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* The kind of things people save, drifting past */}
        <Reveal delay={0.2}>
          <Marquee seconds={55} className="border-y border-[#EDE5D8]/[0.07] py-6">
            {saves.map((s) => (
              <div key={s.title} className="flex items-baseline gap-3 px-8">
                <span className="whitespace-nowrap font-display text-[26px] italic tracking-[-0.01em] text-[#EDE5D8]/85 md:text-[32px]">
                  {s.title}
                </span>
                <span className="whitespace-nowrap text-[13px] text-[#8A7F70]">{s.site}</span>
                <span aria-hidden="true" className="ml-8 h-1.5 w-1.5 rounded-full bg-[#D19A4A]/60" />
              </div>
            ))}
          </Marquee>
        </Reveal>

        {/* How it works: numbered rows */}
        <section id="how" className="mx-auto max-w-[1280px] scroll-mt-28 px-5 py-32 md:px-10 md:py-44">
          <Reveal>
            <h2 className="max-w-[16ch] font-display text-[40px] font-light leading-[1] tracking-[-0.03em] text-balance md:text-[60px]">
              One click to save. The rest can wait.
            </h2>
          </Reveal>
          <ol className="mt-16 md:mt-24">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <li className="grid gap-4 border-t border-[#EDE5D8]/[0.08] py-10 md:grid-cols-12 md:gap-10 md:py-14">
                  <span className="font-display text-[56px] font-light italic leading-none text-[#D19A4A] md:col-span-2 md:text-[72px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[26px] leading-tight tracking-[-0.02em] md:col-span-4 md:pt-3 md:text-[30px]">{step.title}</h3>
                  <p className="max-w-[52ch] text-[16px] leading-relaxed text-[#B8AD9C] md:col-span-5 md:col-start-8 md:pt-4">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Why I built this: editorial split, title stays put while the letter scrolls */}
        <section id="why" className="mx-auto max-w-[1280px] scroll-mt-28 px-5 pb-32 md:px-10 md:pb-44">
          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              <Reveal className="md:sticky md:top-32">
                <h2 className="font-display text-[44px] font-light leading-[0.95] tracking-[-0.035em] md:text-[72px]">
                  Why I <span className="italic text-[#D19A4A]">built</span> this
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              {why.paragraphs.map((p, i) => (
                <Reveal key={p} delay={0.04}>
                  <p
                    className={`mb-8 text-[19px] leading-[1.7] text-pretty ${i === 0 ? "text-[#EDE5D8] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[64px] first-letter:leading-[0.8] first-letter:text-[#D19A4A]" : "text-[#C9BFAF]"}`}
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
              <Reveal>
                <p className="text-[19px] leading-[1.7] text-[#C9BFAF]">
                  <ClosingLine
                    text={why.closing}
                    email={contactEmail}
                    linkClassName="text-[#D19A4A] underline decoration-[#D19A4A]/40 underline-offset-4 hover:decoration-[#D19A4A]"
                  />
                </p>
                <p className="mt-12 font-display text-[36px] italic text-[#D19A4A]">{why.signoff}</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Features: asymmetric bento with nested bezels */}
        <section className="mx-auto max-w-[1280px] px-5 pb-32 md:px-10 md:pb-44">
          <Reveal>
            <h2 className="font-display text-[40px] font-light leading-[1] tracking-[-0.03em] md:text-[60px]">What&apos;s in it</h2>
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-12">
            {features.map((f, i) => (
              <Reveal
                key={f.title}
                delay={(i % 2) * 0.08}
                className={i === 0 || i === 3 ? "md:col-span-7" : "md:col-span-5"}
              >
                <div className="h-full rounded-[2rem] bg-[#EDE5D8]/[0.03] p-1.5 ring-1 ring-[#EDE5D8]/[0.07]">
                  <div className="flex h-full min-h-[220px] flex-col justify-end rounded-[calc(2rem-0.375rem)] bg-[#1F1A15] p-8 shadow-[inset_0_1px_0_rgba(237,229,216,0.06)] md:p-10">
                    <h3 className="font-display text-[28px] tracking-[-0.02em]">{f.title}</h3>
                    <p className="mt-3 max-w-[44ch] text-[16px] leading-relaxed text-[#B8AD9C]">{f.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pb-36 md:px-10 md:pb-48">
          <Reveal className="grid items-end gap-10 md:grid-cols-12">
            <h2 className="font-display text-[52px] font-light leading-[0.92] tracking-[-0.045em] md:col-span-8 md:text-[112px]">
              {finalCta.title}
            </h2>
            <div className="md:col-span-3 md:col-start-10">
              <p className="text-[16px] leading-relaxed text-[#B8AD9C]">{finalCta.body}</p>
              <PillButton
                href="/sign-in"
                className="mt-8 bg-[#D19A4A] text-[#16120E] hover:bg-[#DDAA5E] focus-visible:ring-[#D19A4A] focus-visible:ring-offset-[#16120E]"
                iconClassName="bg-[#16120E]/10"
              >
                {hero.cta}
              </PillButton>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="relative mx-auto flex max-w-[1280px] items-center justify-between px-5 pb-10 text-[13px] text-[#8A7F70] md:px-10">
        <span>Built by Prem</span>
        <Link href="/privacy" className="transition-colors duration-300 hover:text-[#EDE5D8]">
          Privacy
        </Link>
      </footer>
    </div>
  );
}
