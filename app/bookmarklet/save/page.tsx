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
      } else {
        let msg = "An unexpected error occurred.";
        try {
          const data = await res.json();
          if (typeof data?.error === "string") msg = data.error;
        } catch {
          // ignore parse errors
        }
        setErrorMsg(msg);
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error. Please try again.");
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

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-8 py-10 shadow-sm text-center">
        {(status === "idle" || status === "saving") && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900">Breadcrumbs</h1>
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            <p className="text-sm text-slate-500">Saving…</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-6 w-6 text-emerald-600" strokeWidth={2.5} />
            </div>
            <p className="text-base font-semibold text-emerald-700">Saved to your inbox!</p>
            {savedUrl && (
              <p className="max-w-xs truncate text-xs text-slate-400" title={savedUrl}>
                {savedUrl}
              </p>
            )}
          </div>
        )}

        {status === "duplicate" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Check className="h-6 w-6 text-slate-400" strokeWidth={2.5} />
            </div>
            <p className="text-base font-semibold text-slate-700">Already in your inbox</p>
            {savedUrl && (
              <p className="max-w-xs truncate text-xs text-slate-400" title={savedUrl}>
                {savedUrl}
              </p>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <X className="h-6 w-6 text-red-500" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">Something went wrong</p>
              {errorMsg && (
                <p className="mt-1 text-sm text-slate-500">{errorMsg}</p>
              )}
            </div>
            <button
              onClick={save}
              className="mt-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {status === "unauthenticated" && (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-base font-semibold text-slate-900">Not signed in</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Open Breadcrumbs and sign in first, then click the bookmarklet again.
            </p>
            <button
              onClick={() => window.open("/app", "_blank")}
              className="mt-1 text-sm font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900 transition-colors"
            >
              Open Breadcrumbs →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
