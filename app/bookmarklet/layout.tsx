import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarklet",
  robots: { index: false, follow: false },
};

export default function BookmarkletLayout({ children }: { children: React.ReactNode }) {
  return children;
}
