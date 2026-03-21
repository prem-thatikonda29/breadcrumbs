"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Sidebar } from "@/components/Sidebar";
import { useEffect, useRef, useState } from "react";
import { Bookmark, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookmarkletPage() {
  const _collections = useQuery(api.collections.list);
  const anchorContainerRef = useRef<HTMLDivElement>(null);
  const [rawCode, setRawCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const origin = window.location.origin;
    const js =
      `javascript:(function(){var u=encodeURIComponent(location.href);var t=encodeURIComponent(document.title);window.open('${origin}/bookmarklet/save?url='+u+'&title='+t,'breadcrumbs','width=480,height=320,resizable=no,scrollbars=no');})();`;

    // Build the anchor entirely outside React — React 19 blocks javascript: URLs
    // at the synthetic event level even with preventDefault, so we bypass it entirely.
    if (anchorContainerRef.current) {
      const a = document.createElement("a");
      a.href = js;
      a.draggable = true;
      a.title = "Drag me to your bookmarks bar";
      a.className =
        "inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 transition-colors cursor-grab active:cursor-grabbing select-none";
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
      svg.style.color = "rgb(100 116 139)"; // slate-500
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z");
      svg.appendChild(path);

      const text = document.createTextNode("Breadcrumbs");
      a.appendChild(svg);
      a.appendChild(text);
      anchorContainerRef.current.appendChild(a);
    }

    setRawCode(js);
  }, []);

  async function handleCopyCode() {
    await navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="h-6 w-6 text-slate-500" />
              Bookmarklet
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Save any page to your inbox in one click — no extension needed.
            </p>
          </div>

          {/* Step 1 — Install */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                1
              </span>
              <h2 className="text-base font-semibold text-slate-900">Install</h2>
            </div>
            <p className="text-sm text-slate-500 mb-5">
              Drag this button to your browser&apos;s bookmark bar.
            </p>
            <div className="flex items-center gap-4">
              {/* Anchor injected via DOM in useEffect — React 19 blocks javascript: URLs in JSX */}
              <div ref={anchorContainerRef} />
              <p className="text-xs text-slate-400">
                Drag the button above to your bookmarks bar
              </p>
            </div>
          </div>

          {/* Step 2 — Use */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                2
              </span>
              <h2 className="text-base font-semibold text-slate-900">Use</h2>
            </div>
            <p className="text-sm text-slate-500">
              Navigate to any page, click the <strong className="font-medium text-slate-700">Breadcrumbs</strong> bookmark, and the URL is instantly saved to your inbox.
            </p>
          </div>

          {/* Note */}
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4 mb-6">
            <p className="text-sm text-amber-800">
              Make sure you&apos;re signed in to Breadcrumbs in the same browser. On mobile browsers, bookmarklets are not supported.
            </p>
          </div>

          {/* Raw code */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Raw bookmarklet code
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                disabled={!rawCode}
                className="gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="p-5">
              <code className="block text-xs text-slate-700 font-mono break-all leading-relaxed whitespace-pre-wrap">
                {rawCode || "Loading…"}
              </code>
            </div>
            <div className="px-5 pb-4">
              <p className="text-xs text-slate-400">
                You can manually create a bookmark in your browser and paste this as the URL if drag-and-drop doesn&apos;t work.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
