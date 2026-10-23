"use client";

import { AppShell } from "@/components/AppShell";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const subscribeNoop = () => () => {};

function bookmarkletCode(origin: string) {
  return `javascript:(function(){var u=encodeURIComponent(location.href);var t=encodeURIComponent(document.title);window.open('${origin}/bookmarklet/save?url='+u+'&title='+t,'breadcrumbs','width=480,height=320,resizable=no,scrollbars=no');})();`;
}

export default function BookmarkletPage() {
  const anchorContainerRef = useRef<HTMLDivElement>(null);
  const origin = useSyncExternalStore(subscribeNoop, () => window.location.origin, () => "");
  const rawCode = origin ? bookmarkletCode(origin) : "";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!rawCode) return;
    const js = rawCode;

    // Build the anchor entirely outside React: React 19 blocks javascript: URLs
    // at the synthetic event level even with preventDefault, so we bypass it entirely.
    if (anchorContainerRef.current) {
      anchorContainerRef.current.innerHTML = "";
      const a = document.createElement("a");
      a.href = js;
      a.draggable = true;
      a.title = "Drag me to your bookmarks bar";
      a.className =
        "inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-card shadow-[0_12px_24px_-12px_rgba(156,74,42,0.7)] transition-all duration-300 ease-soft hover:bg-accent-hover active:scale-[0.98] cursor-grab active:cursor-grabbing select-none";
      a.addEventListener("click", (e) => e.preventDefault());

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("width", "16");
      svg.setAttribute("height", "16");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2");
      svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round");
      svg.style.color = "currentColor";
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z");
      svg.appendChild(path);

      const text = document.createTextNode("Breadcrumbs");
      a.appendChild(svg);
      a.appendChild(text);
      anchorContainerRef.current.appendChild(a);
    }
  }, [rawCode]);

  async function handleCopyCode() {
    await navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const step = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 font-display text-[17px] italic text-accent";

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-6 sm:px-6 sm:pt-12">
          <h1 className="serif text-[36px] leading-none tracking-[-0.03em] text-ink sm:text-[44px]">Save from anywhere</h1>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-muted">
            One click from the tab you&apos;re on and the link lands in your library. No extension to install.
          </p>

          <section className="mt-10">
            <h2 className="text-[13px] font-medium text-faint">On a computer</h2>
            <ol className="mt-4 space-y-6">
              <li className="flex gap-4">
                <span className={step}>1</span>
                <div className="min-w-0 flex-1 pt-1">
                  <p className="text-[15px] font-medium text-ink">Drag this button to your bookmarks bar</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">If the bar is hidden, press Ctrl+Shift+B (Cmd+Shift+B on a Mac) first.</p>
                  {/* Anchor injected via DOM in useEffect, because React 19 blocks javascript: URLs in JSX */}
                  <div ref={anchorContainerRef} className="mt-4 min-h-11" />
                </div>
              </li>
              <li className="flex gap-4">
                <span className={step}>2</span>
                <div className="pt-1">
                  <p className="text-[15px] font-medium text-ink">Click it on any page you want to keep</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    A small window confirms the save and closes itself. You need to be signed in to Breadcrumbs in the same browser.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <div className="mt-8 rounded-[1.75rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
            <video
              src="/bookmarklet-demo.mp4"
              poster="/bookmarklet-demo-poster.jpg"
              controls
              playsInline
              aria-label="Saving a YouTube video with the bookmarklet"
              className="w-full rounded-[calc(1.75rem-0.375rem)] bg-card"
            />
          </div>

          <section className="mt-12">
            <h2 className="text-[13px] font-medium text-faint">On your phone</h2>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-ink-2">
              Bookmarklets don&apos;t work in phone browsers, so use the share sheet instead. Open Breadcrumbs in your phone&apos;s browser and add it to your home screen. After that,
              tap Share in YouTube, Instagram or any app and pick Breadcrumbs.
            </p>
          </section>

          <details className="group mt-12 rounded-2xl bg-card ring-1 ring-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 text-sm text-muted transition-colors duration-300 ease-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              Dragging doesn&apos;t work? Add it by hand
              <span className="text-faint transition-transform duration-300 ease-soft group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="border-t border-line px-5 pb-5 pt-4">
              <p className="text-sm leading-relaxed text-muted">Create a new bookmark, name it Breadcrumbs, and paste this as its URL.</p>
              <code className="mt-3 block max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-sunken/60 p-4 font-mono text-[12px] leading-relaxed text-ink-2">
                {rawCode || "Loading…"}
              </code>
              <Button variant="outline" size="sm" onClick={handleCopyCode} disabled={!rawCode} className="mt-3">
                {copied ? <Check className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />}
                {copied ? "Copied" : "Copy code"}
              </Button>
            </div>
          </details>
        </div>
      </main>
    </AppShell>
  );
}
