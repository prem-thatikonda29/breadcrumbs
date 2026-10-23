// Shared landing copy, written in Prem's voice. Keep it plain: no em dashes, no jargon.

export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

export const hero = {
  subhead:
    "Breadcrumbs saves the page you're on, straight from the tab. Videos, posts, articles, font sites, anything with a link. When you have time, it's all in one list, and you can tick things off as you get to them.",
  cta: "Start saving links",
  ctaNote: "Free. Sign in with Google.",
  secondary: "Why I built this",
};

export const steps = [
  {
    title: "Put the button in your browser",
    body: "Drag the Breadcrumbs bookmarklet to your bookmarks bar. On your phone, add Breadcrumbs to your home screen and it shows up when you tap Share.",
  },
  {
    title: "Click it on anything worth keeping",
    body: "A YouTube video, an Instagram post, an article for the weekend. One click and it's saved. You never leave the page.",
  },
  {
    title: "Come back when you have time",
    body: "Everything waits in your library. Mark things as explored once you've gone through them, and jot down what you took away if you feel like it.",
  },
];

export const features = [
  {
    title: "Collections",
    body: "Sort links into piles like Design, Recipes or Talks to watch. Give each one a color and an icon so you can spot it fast.",
  },
  {
    title: "Notes on each link",
    body: "Write a few lines about what you got out of something, and rate it so the good ones are easy to find later.",
  },
  {
    title: "Search everything",
    body: "One search box looks through your link titles and your notes.",
  },
  {
    title: "Take it with you",
    body: "Export a collection's notes as Markdown whenever you want them somewhere else.",
  },
];

export const why = {
  title: "Why I built this",
  paragraphs: [
    "Most of what I wanted to keep was scattered. YouTube videos, Instagram posts, articles, the odd font I liked. Watch Later on YouTube was a dead end for me. I'd add videos and never go back. My saved posts on Instagram went the same way.",
    "The other option was pasting links into my notes app, and I never kept that up. I wanted to save something from the tab I was already on, without switching apps.",
    "So I built Breadcrumbs around a bookmarklet. One click from any page and the link is saved. That was the part that made it stick.",
    "And I actually go back to it. I've rewatched YouTube videos from my list and found font links again when I needed them, including Erode, the font these headings are set in.",
  ],
  closing:
    "It's free, and I want to keep it this simple. If there's something you'd like added, email me and I'll try to add it as soon as I can.",
  signoff: "Prem",
};

export const finalCta = {
  title: "Start your own trail.",
  body: "It takes about ten seconds to sign in and drag the button to your bookmarks bar.",
};

export const sampleLinks = [
  { title: "Building a variable font from scratch", site: "youtube.com", ago: "2 days ago", explored: false },
  { title: "Erode | Fontshare", site: "fontshare.com", ago: "5 days ago", explored: true },
  { title: "15 minute garlic noodles", site: "instagram.com", ago: "1 week ago", explored: false },
  { title: "Shape Up: Stop running in circles", site: "basecamp.com", ago: "3 weeks ago", explored: true },
];
