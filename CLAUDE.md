@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Breadcrumbs** is a personal knowledge-tracking app built with Next.js 16 + Convex. Users save links to explore, mark them as explored, add learning notes, and export their learnings as Markdown for blog posts.

## Development

Run two terminals concurrently:

```bash
npx convex dev     # Terminal 1: Convex backend (watches convex/ folder)
npm run dev        # Terminal 2: Next.js frontend
```

First-time setup (interactive):
```bash
npx convex dev     # Authenticates and creates the Convex project
```

Deploy:
```bash
npx convex deploy  # Deploy backend
# Deploy frontend to Vercel
```

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Convex** — type-safe backend, no separate API routes needed
- **Tailwind CSS v4** — CSS-first config in `globals.css` (no `tailwind.config.js`)
- **Radix UI** primitives for accessible components
- **`@convex-dev/auth`** — Google OAuth

## Architecture

**Key principle:** No separate API routes. All backend logic lives in `convex/` as typed TypeScript functions called directly from the frontend via Convex hooks (`useQuery`, `useMutation`). The one exception is `app/api/bookmarklet/route.ts`, which the bookmarklet pop-up posts to.

**Security rules for Convex functions:** every public query/mutation must resolve the user with `getAuthUserId` and check ownership of every document it reads or writes, including referenced IDs (e.g. a target `collectionId`). Use the helpers in `convex/validate.ts` for URL, length, rating, collection-ownership and icon checks. Add a `convex-test` case in `convex/*.test.ts` for any new rule.

### Directory Structure

```
proxy.ts          # Auth redirects (Next.js 16 uses proxy.ts, not middleware.ts)
convex/           # All backend logic
  schema.ts       # Table definitions and indexes
  auth.config.ts  # Auth providers config
  auth.ts         # Auth setup (Google only)
  collections.ts  # Collections CRUD, icons, archive
  entries.ts      # Entries CRUD, explored state, reorder, bulk actions, search
  learnings.ts    # Learning notes CRUD, export query, search
  users.ts        # Current user, deleteAccount
  storage.ts      # Upload URLs, orphaned-file cleanup
  crons.ts        # Daily orphaned-upload cleanup
  validate.ts     # Shared validation/ownership helpers
  *.test.ts       # convex-test suites (run with `npm test`)
app/              # Next.js App Router pages
  layout.tsx      # Root layout with ConvexProvider + AuthProvider
  page.tsx        # / — Landing page
  app/page.tsx    # /app — Library (unexplored entries, search, bulk actions)
  collections/[id]/page.tsx   # Collection detail
  entries/[id]/page.tsx       # Entry detail + learning notes
  export/page.tsx             # Markdown export
  bookmarklet/                # Bookmarklet install page + save pop-up (also the PWA share target)
  privacy/page.tsx            # Privacy page
  sign-in/page.tsx            # Sign-in page
components/       # Shared React components
  landing/        # Landing page sections; all landing text lives in landing/copy.ts
  ui/             # Base UI primitives (Button, Dialog, etc.)
```

### Data Model

Three tables with a nested one-to-many hierarchy:

**collections** — `userId, name, color?, description?, iconStorageId?, archived?, createdAt`
- Index: `by_userId`, `by_iconStorageId`

**entries** — `userId, collectionId?, title, url, status ("not_explored" | "explored"), dateAdded, dateExplored?, notes?, order?`
- Index: `by_userId_status` (dashboard query), `by_collectionId`, `by_userId`, `by_userId_url`; search index on `title`

**learnings** — `entryId, userId, content, rating? (1–5), createdAt, updatedAt`
- Index: `by_entryId`, `by_userId`; search index on `content`

### Core Convex Functions

| Module | Functions |
|---|---|
| `collections` | `create`, `list`, `listArchived`, `update`, `archive`, `unarchive`, `remove` (cascades to entries, learnings, icon) |
| `entries` | `create`, `get`, `getUnexplored`, `getAll`, `getByCollection`, `markExplored`, `markUnexplored`, `update`, `moveToCollection`, `reorder`, `remove`, `bulkMarkExplored`, `bulkMove`, `bulkRemove`, `search` |
| `learnings` | `create`, `getByEntry`, `getUserLearnings`, `update`, `remove`, `searchEntryIds` |
| `users` | `me`, `deleteAccount` |
| `storage` | `generateUploadUrl`, `cleanupOrphanedFiles` (internal, daily cron) |

### Page Structure

- `/` — Landing page (signed-in users are redirected to `/app`)
- `/app` — Library: unexplored entries, search, [+ Add], bulk actions, account menu
- `/collections/:id` — Entries split into "Not Explored" / "Explored" sections
- `/entries/:id` — Entry detail with URL, status, and list of learning note cards
- `/export` — Select collection → preview formatted Markdown → copy/download as `.md`
- `/bookmarklet` — Bookmarklet install; `/bookmarklet/save` — save pop-up / share target
- `/privacy` — Privacy page
- `/sign-in` — Google OAuth sign-in page

### Auth Setup (required before first run)

Set in `.env.local`:
```
CONVEX_DEPLOYMENT=...        # auto-set by `npx convex dev`
NEXT_PUBLIC_CONVEX_URL=...   # auto-set by `npx convex dev`
NEXT_PUBLIC_CONTACT_EMAIL=... # optional: address behind "email me" in the landing page letter
```

Set in Convex dashboard environment variables:
```
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
SITE_URL=http://localhost:3000
```

### Export Format

Learnings export as grouped Markdown: entry title + URL, then each learning note with timestamp and star rating. Ready to paste into a blog editor.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
