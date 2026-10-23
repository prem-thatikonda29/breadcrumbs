import Link from "next/link";
import { hero, steps, features, why, finalCta, sampleLinks, contactEmail } from "./copy";
import { ClosingLine, Grain, IslandNav, PillButton, Reveal } from "./ui";

// Direction A: warm paper. One cream palette top to bottom, ink text, a single rust accent.

const SLIP_TILT = ["md:-rotate-[3deg]", "md:rotate-[2deg]", "md:-rotate-[1deg]", "md:rotate-[1.5deg]"];

function Slip({ link, index }: { link: (typeof sampleLinks)[number]; index: number }) {
  return (
    <div
      className={`rounded-[1.75rem] bg-[#211C16]/[0.04] p-1.5 ring-1 ring-[#211C16]/[0.06] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:hover:rotate-0 ${SLIP_TILT[index % SLIP_TILT.length]} ${index > 0 ? "md:-mt-1" : ""} ${index % 2 ? "md:ml-10" : "md:mr-10"}`}
    >
      <div className="rounded-[calc(1.75rem-0.375rem)] bg-[#FBF8F1] px-6 py-5 shadow-[0_24px_48px_-28px_rgba(92,58,28,0.35),inset_0_1px_0_rgba(255,255,255,0.8)]">
        <div className="flex items-center justify-between text-[13px] text-[#857A6C]">
          <span>{link.site}</span>
          <span className="tabular-nums">{link.ago}</span>
        </div>
        <p
          className={`mt-2 font-display text-[22px] leading-snug tracking-[-0.01em] ${link.explored ? "text-[#A99E90] line-through decoration-[#A99E90]/60" : "text-[#211C16]"}`}
        >
          {link.title}
        </p>
        <p className="mt-3 text-[13px] text-[#857A6C]">
          {link.explored ? "Explored" : "Saved for later"}
        </p>
      </div>
    </div>
  );
}

export function PaperLanding() {
  return (
    <div className="min-h-[100dvh] bg-[#F3EEE4] font-body text-[#211C16] selection:bg-[#9C4A2A]/20">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#211C16] focus:px-4 focus:py-2 focus:text-[#F3EEE4]">
        Skip to content
      </a>
      <Grain opacity={0.06} />
      <IslandNav
        theme={{
          pill: "bg-[#FBF8F1]/70 ring-1 ring-[#211C16]/[0.08] shadow-[0_12px_32px_-20px_rgba(92,58,28,0.35)]",
          link: "text-[#6B6257] hover:text-[#211C16]",
          cta: "bg-[#211C16] text-[#F3EEE4] hover:bg-[#3A3128]",
          overlay: "bg-[#F3EEE4]/90",
          overlayLink: "text-[#211C16]",
          bar: "bg-[#211C16]",
        }}
      />

      <main id="main">
        {/* Hero */}
        <section className="mx-auto grid max-w-[1200px] gap-16 px-5 pb-28 pt-40 md:grid-cols-12 md:gap-10 md:px-10 md:pb-40 md:pt-48">
          <div className="md:col-span-7">
            <Reveal>
              <h1 className="font-display text-[44px] font-normal leading-[0.98] tracking-[-0.035em] text-balance md:text-[76px]">
                A place for the links you actually come back to.
              </h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-[#5E5549] text-pretty">{hero.subhead}</p>
            </Reveal>
            <Reveal delay={0.16} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <PillButton
                href="/sign-in"
                className="bg-[#9C4A2A] text-[#FBF8F1] hover:bg-[#87401F] focus-visible:ring-[#9C4A2A] focus-visible:ring-offset-[#F3EEE4]"
                iconClassName="bg-[#FBF8F1]/15"
              >
                {hero.cta}
              </PillButton>
              <a href="#why" className="text-[15px] text-[#5E5549] underline decoration-[#211C16]/20 underline-offset-[6px] transition-colors duration-300 hover:text-[#211C16] hover:decoration-[#211C16]/60">
                {hero.secondary}
              </a>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-[13px] text-[#857A6C]">{hero.ctaNote}</p>
            </Reveal>
          </div>

          <div className="flex flex-col gap-4 md:col-span-5 md:gap-0 md:pt-6">
            {sampleLinks.map((link, i) => (
              <Reveal key={link.title} delay={0.2 + i * 0.08}>
                <Slip link={link} index={i} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works: a dotted trail joins the steps */}
        <section id="how" className="mx-auto max-w-[1200px] scroll-mt-28 px-5 pb-32 md:px-10 md:pb-44">
          <div className="grid gap-14 md:grid-cols-12">
            <Reveal className="md:col-span-4">
              <h2 className="font-display text-[36px] leading-[1.02] tracking-[-0.03em] text-balance md:sticky md:top-32 md:text-[48px]">
                Three steps, then it stays out of your way.
              </h2>
            </Reveal>
            <ol className="relative md:col-span-7 md:col-start-6">
              <span aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 border-l-2 border-dotted border-[#9C4A2A]/35" />
              {steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.06} className={i < steps.length - 1 ? "pb-14" : ""}>
                  <li className="relative grid grid-cols-[56px_1fr] gap-6">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBF8F1] font-display text-[22px] italic text-[#9C4A2A] ring-1 ring-[#211C16]/[0.08]">
                      {i + 1}
                    </span>
                    <div className="pt-2">
                      <h3 className="font-display text-[26px] leading-tight tracking-[-0.02em]">{step.title}</h3>
                      <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-[#5E5549]">{step.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Features: zig-zag rows, no boxes */}
        <section className="mx-auto max-w-[1200px] px-5 pb-32 md:px-10 md:pb-44">
          <Reveal>
            <h2 className="max-w-[18ch] font-display text-[36px] leading-[1.02] tracking-[-0.03em] text-balance md:text-[48px]">
              Small on purpose. Here&apos;s what&apos;s in it.
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-12">
            {features.map((f, i) => (
              <Reveal
                key={f.title}
                delay={(i % 2) * 0.08}
                className={i % 2 ? "md:col-span-5 md:col-start-8 md:mt-24" : "md:col-span-5"}
              >
                <h3 className="font-display text-[28px] leading-tight tracking-[-0.02em]">{f.title}</h3>
                <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-[#5E5549]">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Why I built this: a letter on a sheet of paper */}
        <section id="why" className="mx-auto max-w-[1200px] scroll-mt-28 px-5 pb-32 md:px-10 md:pb-44">
          <Reveal className="mx-auto max-w-[760px] md:-rotate-[0.6deg]">
            <div className="rounded-[2.25rem] bg-[#211C16]/[0.04] p-2 ring-1 ring-[#211C16]/[0.06]">
              <article className="rounded-[calc(2.25rem-0.5rem)] bg-[#FBF8F1] px-7 py-12 shadow-[0_40px_80px_-48px_rgba(92,58,28,0.45),inset_0_1px_0_rgba(255,255,255,0.9)] md:px-16 md:py-20">
                <h2 className="font-display text-[36px] leading-none tracking-[-0.03em] md:text-[48px]">{why.title}</h2>
                <div className="mt-10 space-y-6 text-[17px] leading-[1.75] text-[#3D352C] text-pretty">
                  {why.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  <p>
                    <ClosingLine
                      text={why.closing}
                      email={contactEmail}
                      linkClassName="text-[#9C4A2A] underline decoration-[#9C4A2A]/40 underline-offset-4 hover:decoration-[#9C4A2A]"
                    />
                  </p>
                </div>
                <p className="mt-12 font-display text-[30px] italic text-[#9C4A2A]">{why.signoff}</p>
              </article>
            </div>
          </Reveal>
        </section>

        {/* Final call to action, same cream background as the rest */}
        <section className="mx-auto max-w-[1200px] px-5 pb-36 md:px-10 md:pb-48">
          <Reveal className="grid items-end gap-10 md:grid-cols-12">
            <h2 className="font-display text-[48px] leading-[0.95] tracking-[-0.04em] md:col-span-7 md:text-[88px]">
              {finalCta.title}
            </h2>
            <div className="md:col-span-4 md:col-start-9">
              <p className="text-[16px] leading-relaxed text-[#5E5549]">{finalCta.body}</p>
              <PillButton
                href="/sign-in"
                className="mt-8 bg-[#211C16] text-[#F3EEE4] hover:bg-[#3A3128] focus-visible:ring-[#211C16] focus-visible:ring-offset-[#F3EEE4]"
                iconClassName="bg-[#F3EEE4]/15"
              >
                {hero.cta}
              </PillButton>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1200px] items-center justify-between px-5 pb-10 text-[13px] text-[#857A6C] md:px-10">
        <span>Built by Prem</span>
        <Link href="/privacy" className="transition-colors duration-300 hover:text-[#211C16]">
          Privacy
        </Link>
      </footer>
    </div>
  );
}
