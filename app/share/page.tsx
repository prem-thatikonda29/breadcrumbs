"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { CheckCircle, AlertCircle, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Status = "loading" | "saving" | "success" | "duplicate" | "error" | "unauthenticated";

export default function SharePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const url = searchParams.get("url") ?? "";
  const title = searchParams.get("title") ?? url;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setStatus("unauthenticated");
      return;
    }
    if (!url) {
      setStatus("error");
      setErrorMsg("No URL provided.");
      return;
    }

    setStatus("saving");

    fetch("/api/bookmarklet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus("error");
          setErrorMsg(data.error);
        } else if (data.alreadyExists) {
          setStatus("duplicate");
          setTimeout(() => router.push("/"), 1500);
        } else {
          setStatus("success");
          setTimeout(() => router.push("/"), 1500);
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Something went wrong. Please try again.");
      });
  }, [isAuthenticated, isLoading, url, title, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
      <BookOpen className="h-8 w-8 text-slate-400" />

      {(status === "loading" || status === "saving") && (
        <>
          <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          <p className="text-sm text-slate-600">Saving to your library…</p>
          {title && <p className="text-xs text-slate-400 max-w-xs truncate">{title}</p>}
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="h-6 w-6 text-green-500" />
          <p className="text-sm font-medium text-slate-800">Saved to your library!</p>
          <p className="text-xs text-slate-400">Redirecting…</p>
        </>
      )}

      {status === "duplicate" && (
        <>
          <CheckCircle className="h-6 w-6 text-slate-400" />
          <p className="text-sm font-medium text-slate-800">Already in your library</p>
          <p className="text-xs text-slate-400">Redirecting…</p>
        </>
      )}

      {status === "error" && (
        <>
          <AlertCircle className="h-6 w-6 text-red-500" />
          <p className="text-sm font-medium text-slate-800">Something went wrong</p>
          <p className="text-xs text-slate-400">{errorMsg}</p>
          <Button size="sm" variant="outline" asChild>
            <Link href="/">Go to Library</Link>
          </Button>
        </>
      )}

      {status === "unauthenticated" && (
        <>
          <p className="text-sm font-medium text-slate-800">Sign in to save links</p>
          <Button size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </>
      )}
    </div>
  );
}
