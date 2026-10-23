import type { Metadata } from "next";

// Temporary design previews for the landing page. Not linked anywhere and kept out of search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
