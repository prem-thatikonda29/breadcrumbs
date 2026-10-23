"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";
import { Grain } from "@/components/landing/ui";

export default function SignInPage() {
  const { signIn } = useAuthActions();

  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-paper px-5">
      <Grain opacity={0.06} />
      <Link href="/" className="absolute left-5 top-6 text-sm text-faint transition-colors duration-300 ease-soft hover:text-ink md:left-10">
        ← Breadcrumbs
      </Link>
      <div className="w-full max-w-sm rounded-[2rem] bg-ink/[0.04] p-2 ring-1 ring-line">
        <div className="rounded-[calc(2rem-0.5rem)] bg-card px-8 py-12 text-center shadow-[0_40px_80px_-48px_rgba(92,58,28,0.45),inset_0_1px_0_rgba(255,255,255,0.9)]">
          <h1 className="font-display text-[34px] leading-none tracking-[-0.03em] text-ink">Sign in</h1>
          <p className="mx-auto mt-3 max-w-[30ch] text-[15px] leading-relaxed text-muted text-balance">
            Your saved links, one click away. New here? Signing in creates your account.
          </p>
          <button
            onClick={() => signIn("google")}
            className="mt-8 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-5 py-3 text-[15px] font-medium text-card transition-all duration-300 ease-soft hover:bg-ink-2 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-card">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
            </span>
            Continue with Google
          </button>
          <p className="mt-6 text-[13px] text-faint">
            Free. We only use your Google name, email and picture.{" "}
            <Link href="/privacy" className="underline decoration-line-strong underline-offset-4 transition-colors duration-300 ease-soft hover:text-ink">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
