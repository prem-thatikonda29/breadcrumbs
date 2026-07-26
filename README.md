# Breadcrumbs

A personal knowledge tool — save links, write notes, and export collections as Markdown.

**Live at:** [breadcrumbs-rose.vercel.app](https://breadcrumbs-rose.vercel.app)

## Features

- **One-click bookmarklet** — Save any page from any browser. No extension needed.
- **Collections** — Group links by topic, project, or goal. Color-code and archive when done.
- **Learning notes** — Write insights per link, rate 1–5 stars to surface your best finds.
- **Markdown export** — Export a collection's notes as clean Markdown, ready for your blog.
- **Explore tracking** — Mark links as explored, filter by status, work through your library at your own pace.
- **Google auth** — Sign in with Google. Your data, your library.

## Tech Stack

- Next.js 16 (App Router) + React 19
- Convex (type-safe backend)
- Tailwind CSS v4
- Radix UI (accessible components)
- Framer Motion (animations)
- dnd-kit (drag and drop)

## Getting Started

First-time setup requires two terminals running concurrently:

```sh
# Terminal 1: Convex backend
npx convex dev

# Terminal 2: Next.js frontend
npm run dev
```

The first `npx convex dev` run will authenticate and create your Convex project interactively.

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/                  # Next.js App Router pages
  page.tsx            # / — Dashboard inbox (unexplored entries)
  collections/[id]/   # Collection detail
  entries/[id]/       # Entry detail + learning notes
  export/             # Markdown export
  sign-in/            # Google OAuth sign-in
components/           # Shared React components
  ui/                 # Base UI primitives (Button, Dialog, etc.)
convex/               # Backend logic (all typed TypeScript)
  schema.ts           # Table definitions and indexes
  collections.ts      # Collections CRUD
  entries.ts          # Entries CRUD + markExplored
  learnings.ts        # Learning notes CRUD
lib/                  # Shared utilities
```

## Data Model

Three tables with a one-to-many hierarchy:

- **collections** — `userId, name, color?, createdAt`
- **entries** — `userId, collectionId, title, url, status, dateAdded, dateExplored?`
- **learnings** — `entryId, userId, content, rating? (1–5), createdAt, updatedAt`

## Auth Setup

Google OAuth credentials are configured in the Convex dashboard:

```
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
SITE_URL=http://localhost:3000
```

## Deploy

```sh
npx convex deploy   # Deploy backend
# Deploy frontend to Vercel
```

## License

MIT
