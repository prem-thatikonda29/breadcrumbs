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
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link href="/" className="text-sm text-[#787774] hover:text-[#111111] transition-colors">
          ← {siteConfig.name}
        </Link>
        <h1 className="serif mt-6 text-4xl text-[#111111]">Privacy</h1>
        <p className="mt-3 text-sm text-[#787774]">
          {siteConfig.name} is a personal project. This page explains, in plain terms, what it
          stores and how to remove it.
        </p>
        {sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-base font-semibold text-[#111111]">{section.heading}</h2>
            <ul className="mt-3 space-y-2">
              {section.body.map((line) => (
                <li key={line} className="text-sm leading-relaxed text-[#37352F]">
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
