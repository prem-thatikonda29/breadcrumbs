export const siteConfig = {
  name: "Breadcrumbs",
  tagline: "A place for the links you actually come back to.",
  description:
    "Save the page you're on in one click, straight from the tab. Videos, posts, articles, anything with a link, all in one list for when you have time.",
  // Set NEXT_PUBLIC_SITE_URL per environment; falls back to the production domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://breadcrumbs-rose.vercel.app",
};
