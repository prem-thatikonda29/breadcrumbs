# How I Built Breadcrumbs (and Used It to Write About Building It)

I saved links constantly. Articles, videos and posts about AI tools, system design, startup advice bla bla bla. I told myself I'd check them out later.

I never read them later. And on the rare occasion I did, I forgot what I learned by next week.

Breadcrumbs fixes that loop.

## The Flow

1. **Save** a link → lands in your inbox
2. **Read** it → mark as explored
3. **Write** what you learned → optional star rating
4. **Export** → get a Markdown doc of everything you learned from a collection, ready to paste into a blog

Collections keep things organized by topic. Each one becomes its own mini-learning archive.

## Why Convex

I needed a backend — database, auth, file storage, real-time updates — without the overhead. No REST endpoints, no Supabase AGAIN, no gluing five services together.

Convex lets you write backend logic as plain TypeScript functions and call them directly from React. No fetch. No routes. Types flow end-to-end. `useQuery` is reactive by default — the UI just updates when data changes, no WebSocket plumbing needed.

At first I thought — isn't this just Supabase or Firebase? But the difference is where the logic lives. Supabase gives you a database and exposes it. Convex gives you a server and lets you write real code on it. When I needed to cascade delete a collection with all its entries and learnings, I just wrote a loop in TypeScript. No triggers. No stored procedures. Just a function.

It also handles auth, file storage, and full-text search natively. One thing instead of five.

## The Meta Layer

I saved articles about backend design, real-time systems, and full-stack development while building Breadcrumbs. As I read them, I'd write down what they taught me.

When I sat down to write this post, I opened Breadcrumbs, hit export on my Learning collection, and got a Markdown doc of everything I'd actually retained. That became the skeleton of this post.

Breadcrumbs doesn't just help you save knowledge. It helps you ship it.

---

It's live at [breadcrumbs-rose.vercel.app](https://breadcrumbs-rose.vercel/app). If you save links and never read them — or read them and never remember them — it's worth trying.
