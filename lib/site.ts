export const siteConfig = {
  name: "Breadcrumbs",
  tagline: "A trail of everything you've learned.",
  description:
    "Save links, track what you've explored, and write notes on what matters. Export your learnings as Markdown, ready for your blog.",
  // Set NEXT_PUBLIC_SITE_URL per environment; falls back to the production domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://breadcrumbs-rose.vercel.app",
};
