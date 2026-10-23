import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What ${siteConfig.name} stores about you and how to delete it.`,
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    heading: "What we store",
    body: [
      "When you sign in with Google, we receive your name, email address and profile picture. We use them only to identify your account and show your avatar.",
      "Everything you add: collections (name, color, description, icon), saved links (title, URL, notes, explored status and dates) and learning notes with their ratings.",
      "Sign-in session tokens, kept in cookies so you stay signed in.",
    ],
  },
  {
    heading: "Where it lives",
    body: [
      "Your data is stored with Convex, which runs the app's database, file storage and backend. The website is hosted on Vercel.",
      "Your data is only readable by your account. There's no public profile or sharing.",
    ],
  },
  {
    heading: "What we don't do",
    body: [
      "No ads, no analytics or tracking scripts, and we never sell or share your data.",
    ],
  },
  {
    heading: "Deleting your data",
    body: [
      "In the app, open the account menu (your avatar, top right) and choose Delete account. This permanently deletes your collections, links, notes, icons and sign-in records straight away.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh] bg-paper">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link href="/" className="text-sm text-faint transition-colors duration-300 ease-soft hover:text-ink">
          ← {siteConfig.name}
        </Link>
        <h1 className="serif mt-6 text-[44px] leading-none tracking-[-0.03em] text-ink">Privacy</h1>
        <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-muted">
          {siteConfig.name} is a personal project. This page explains, in plain terms, what it
          stores and how to remove it.
        </p>
        {sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="serif text-[24px] tracking-[-0.02em] text-ink">{section.heading}</h2>
            <ul className="mt-3 space-y-2">
              {section.body.map((line) => (
                <li key={line} className="max-w-[62ch] text-[15px] leading-relaxed text-ink-2">
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
