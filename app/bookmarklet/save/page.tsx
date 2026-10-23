"use client";

import { useConvexAuth } from "convex/react";
import { useState, useEffect } from "react";
import { Check, X, Loader2 } from "lucide-react";

type Status = "idle" | "saving" | "success" | "duplicate" | "error" | "unauthenticated";

function getShareParams() {
  const params = new URLSearchParams(window.location.search);
  const rawUrl = params.get("url") ?? "";
  const rawText = params.get("text") ?? "";
  return {
    url: rawUrl || rawText,
    title: params.get("title") ?? "",
  };
}

export default function BookmarkletSavePage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [savedUrl, setSavedUrl] = useState("");

  async function save() {
    const { url, title } = getShareParams();
    setSavedUrl(url);
    setStatus("saving");
    try {
      const res = await fetch("/api/bookmarklet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title }),
      });

      if (res.ok) {
        const data = await res.json();
        setStatus(data.alreadyExists ? "duplicate" : "success");
        setTimeout(() => window.close(), 1500);
      } else if (res.status === 401) {
        setStatus("unauthenticated");
      } else {
        // 400s carry a readable reason (like a bad URL); anything else gets a plain message.
        let msg = "Breadcrumbs couldn't save this page. Please try again.";
        if (res.status === 400) {
          try {
            const data = await res.json();
            if (typeof data?.error === "string") msg = data.error;
          } catch {
            // ignore parse errors
          }
        }
        setErrorMsg(msg);
        setStatus("error");
      }
    } catch {
      setErrorMsg("Couldn't reach Breadcrumbs. Check your connection and try again.");
      setStatus("error");
    }
  }

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setStatus("unauthenticated");
      return;
    }
    save();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  const icon = "flex h-12 w-12 items-center justify-center rounded-full";

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-paper p-4">
      <div className="w-full max-w-sm rounded-[1.75rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
        <div className="rounded-[calc(1.75rem-0.375rem)] bg-card px-8 py-10 text-center shadow-[0_24px_48px_-28px_rgba(92,58,28,0.4)]">
          {(status === "idle" || status === "saving") && (
            <div className="flex flex-col items-center gap-4" role="status">
              <p className="serif text-[22px] tracking-[-0.02em] text-ink">Breadcrumbs</p>
              <Loader2 className="h-7 w-7 animate-spin text-faint" strokeWidth={1.5} />
              <p className="text-sm text-muted">Saving…</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-3" role="status">
              <div className={`${icon} bg-accent text-card`}>
                <Check className="h-6 w-6" strokeWidth={2} />
              </div>
              <p className="serif text-[22px] tracking-[-0.02em] text-ink">Saved to your library</p>
              {savedUrl && (
                <p className="max-w-xs truncate text-[13px] text-faint" title={savedUrl}>
                  {savedUrl}
                </p>
              )}
            </div>
          )}

          {status === "duplicate" && (
            <div className="flex flex-col items-center gap-3" role="status">
              <div className={`${icon} bg-sunken text-muted`}>
                <Check className="h-6 w-6" strokeWidth={2} />
              </div>
              <p className="serif text-[22px] tracking-[-0.02em] text-ink">Already in your library</p>
              {savedUrl && (
                <p className="max-w-xs truncate text-[13px] text-faint" title={savedUrl}>
                  {savedUrl}
                </p>
              )}
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-3" role="alert">
              <div className={`${icon} bg-danger/10 text-danger`}>
                <X className="h-6 w-6" strokeWidth={2} />
              </div>
              <p className="serif text-[22px] tracking-[-0.02em] text-ink">That didn&apos;t save</p>
              {errorMsg && <p className="text-sm leading-relaxed text-muted">{errorMsg}</p>}
              <button
                onClick={save}
                className="mt-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-card transition-all duration-300 ease-soft hover:bg-ink-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Try again
              </button>
            </div>
          )}

          {status === "unauthenticated" && (
            <div className="flex flex-col items-center gap-3">
              <p className="serif text-[22px] tracking-[-0.02em] text-ink">You&apos;re not signed in</p>
              <p className="text-sm leading-relaxed text-muted">Sign in to Breadcrumbs in this browser, then click the bookmarklet again.</p>
              <button
                onClick={() => window.open("/sign-in", "_blank")}
                className="mt-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-card transition-all duration-300 ease-soft hover:bg-ink-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Open Breadcrumbs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
