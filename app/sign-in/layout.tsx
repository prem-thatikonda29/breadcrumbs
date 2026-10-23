import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

const title = "Sign in";
const description = "Sign in to Breadcrumbs with Google to pick up your reading trail.";
// Overriding openGraph drops the root opengraph-image, so point back at it.
const image = { url: "/opengraph-image", width: 1200, height: 630, alt: `${siteConfig.name}: ${siteConfig.tagline}` };

// openGraph and twitter replace the root layout's objects wholesale, so restate every field.
export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/sign-in",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${title} · ${siteConfig.name}`,
    description,
    url: "/sign-in",
    locale: "en_US",
    images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · ${siteConfig.name}`,
    description,
    images: [image],
  },
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
