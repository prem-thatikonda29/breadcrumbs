"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CollectionPicker } from "@/components/CollectionPicker";
import { collectionColor } from "@/lib/collection-colors";
import { playSound } from "@/lib/sound";

type Status = "idle" | "saving" | "success" | "duplicate" | "error" | "unauthenticated";

// Pop-ups opened by older copies of the bookmarklet are 320px tall; the collection list needs more room.
const POPUP_MIN_HEIGHT = 600;

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
  const [entryId, setEntryId] = useState<Id<"entries"> | null>(null);
  const [filing, setFiling] = useState(false);
  const [filedTo, setFiledTo] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");

  const collections = useQuery(api.collections.list, isAuthenticated ? {} : "skip");
  const entry = useQuery(api.entries.get, entryId ? { entryId } : "skip");
  const moveToCollection = useMutation(api.entries.moveToCollection);

  const saved = status === "success" || status === "duplicate";
  const currentCollection = collections?.find((c) => c._id === entry?.collectionId);
  const pickable = collections?.filter((c) => c._id !== entry?.collectionId) ?? [];
  // Wait for the entry so a duplicate's current collection is known before showing the list.
  const ready = saved && collections !== undefined && entry !== undefined;
  const showPicker = ready && !filedTo && pickable.length > 0;

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
        setEntryId(data.id);
        setStatus(data.alreadyExists ? "duplicate" : "success");
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

  async function fileInto(collection: { _id: Id<"collections">; name: string }) {
    if (!entryId) return;
    setFiling(true);
    setFileError("");
    try {
      await moveToCollection({ entryId, collectionId: collection._id });
      setFiledTo(collection.name);
      // The pop-up already shows where it went; the sound confirms the drop.
      // (The automatic save on open gets no sound: browsers block audio before a click.)
      playSound("link-filed");
    } catch {
      setFileError("Couldn't add it to that collection. Try again.");
      playSound("link-file-error");
    } finally {
      setFiling(false);
    }
  }

  useEffect(() => {
    try {
      if (window.opener && window.outerHeight < POPUP_MIN_HEIGHT) {
        window.resizeTo(window.outerWidth, POPUP_MIN_HEIGHT);
      }
    } catch {
      // Some browsers refuse; the page still scrolls.
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setStatus("unauthenticated");
      return;
    }
    save();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  // Close on its own once there's nothing left to choose: after filing, or when there are no collections to pick.
  useEffect(() => {
    if (!ready) return;
    if (filedTo || pickable.length === 0) {
      const t = setTimeout(() => window.close(), filedTo ? 1200 : 1500);
      return () => clearTimeout(t);
    }
  }, [ready, filedTo, pickable.length]);

  useEffect(() => {
    if (!saved) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") window.close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saved]);

  const icon = "flex h-12 w-12 items-center justify-center rounded-full";
  const primaryButton =
    "mt-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-card transition-all duration-300 ease-soft hover:bg-ink-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-paper p-4">
      <div className="w-full max-w-sm rounded-[1.75rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
        <div
          className={`rounded-[calc(1.75rem-0.375rem)] bg-card text-center shadow-[0_24px_48px_-28px_rgba(92,58,28,0.4)] ${
            showPicker ? "px-5 py-6" : "px-8 py-10"
          }`}
        >
          {(status === "idle" || status === "saving") && (
            <div className="flex flex-col items-center gap-4" role="status">
              <p className="serif text-[22px] tracking-[-0.02em] text-ink">Breadcrumbs</p>
              <Loader2 className="h-7 w-7 animate-spin text-faint" strokeWidth={1.5} />
              <p className="text-sm text-muted">Saving…</p>
            </div>
          )}

          {saved && (
            <div className="flex flex-col items-center gap-3" role="status">
              {!showPicker && (
                <div className={`${icon} ${status === "success" || filedTo ? "bg-accent text-card" : "bg-sunken text-muted"}`}>
                  <Check className="h-6 w-6" strokeWidth={2} />
                </div>
              )}
              <p className="serif text-[22px] tracking-[-0.02em] text-ink">
                {filedTo
                  ? `Added to ${filedTo}`
                  : status === "success"
                    ? "Saved to your library"
                    : "Already in your library"}
              </p>
              {savedUrl && (
                <p className="max-w-full truncate text-[13px] text-faint" title={savedUrl}>
                  {savedUrl}
                </p>
              )}
              {status === "duplicate" && currentCollection && !filedTo && (
                <p className="inline-flex items-center gap-1.5 text-[13px] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: collectionColor(currentCollection.color) }} />
                  In {currentCollection.name}
                </p>
              )}

              {showPicker && (
                <div className="mt-2 w-full space-y-3 text-left">
                  <p className="px-1 text-[13px] font-medium text-muted">
                    {currentCollection ? "Move to another collection" : "Add to a collection"}
                  </p>
                  <CollectionPicker collections={pickable} onPick={fileInto} disabled={filing} />
                  {fileError && (
                    <p className="px-1 text-[13px] text-danger" role="alert">
                      {fileError}
                    </p>
                  )}
                  <button
                    onClick={() => window.close()}
                    className="w-full rounded-full py-2.5 text-sm text-muted transition-colors duration-300 ease-soft hover:bg-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {currentCollection ? "Keep it there" : "Leave it in the library"}
                  </button>
                </div>
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
              <button onClick={save} className={primaryButton}>
                Try again
              </button>
            </div>
          )}

          {status === "unauthenticated" && (
            <div className="flex flex-col items-center gap-3">
              <p className="serif text-[22px] tracking-[-0.02em] text-ink">You&apos;re not signed in</p>
              <p className="text-sm leading-relaxed text-muted">Sign in to Breadcrumbs in this browser, then click the bookmarklet again.</p>
              <button onClick={() => window.open("/sign-in", "_blank")} className={primaryButton}>
                Open Breadcrumbs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
