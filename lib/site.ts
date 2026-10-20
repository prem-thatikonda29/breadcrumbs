export const siteConfig = {
  name: "Breadcrumbs",
  tagline: "A trail of everything you've learned.",
  // Keep under ~125 characters: social previews truncate longer descriptions.
  description:
    "Save links, track what you've explored, and write notes on what matters. Export it all as Markdown.",
  // Set NEXT_PUBLIC_SITE_URL per environment; falls back to the production domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://breadcrumbs-rose.vercel.app",
};
