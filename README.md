# Breadcrumbs

A personal read-later tracker. Save links from anywhere, mark them explored as you get through them, and keep short notes on what you learned.

**Live at:** [breadcrumbs-rose.vercel.app](https://breadcrumbs-rose.vercel.app)

## Why I built it

I kept saving links and never coming back to them. Breadcrumbs is my take on a read-later list that tracks whether you actually got through each link (*explored* or not) and what you took away from it. It's a personal project and portfolio piece, not a commercial product.

## Features

- **Save from anywhere:** a one-click bookmarklet on desktop, and a PWA share target so Breadcrumbs shows up in the phone share sheet.
- **Library:** unexplored links first, with a toggle to show explored ones. Search covers titles and note contents. Select several links to mark them explored, move them or delete them.
- **Collections:** group links by topic with a color, an icon and a description. Drag to reorder links, and archive a collection when you're done with it.
- **Learning notes:** notes on each link, each with a 1–5 star rating.
- **Markdown export:** export a whole collection, or a single link's notes, as Markdown.
- **Your data stays yours:** Google sign-in, only your account can read your data, and you can delete your account in one step. See the [privacy page](https://breadcrumbs-rose.vercel.app/privacy).

## How it's built

- **Next.js 16** (App Router) and **React 19** on Vercel. Route protection lives in `proxy.ts`, which replaces `middleware.ts` in Next 16.
- **Convex** for the database, backend functions, file storage and scheduled jobs. There are no separate API routes; the frontend calls typed Convex functions directly. The one exception is `app/api/bookmarklet`, which the bookmarklet pop-up posts to.
- **`@convex-dev/auth`** with Google OAuth.
- **Tailwind CSS v4**, **Radix UI**, **Framer Motion** and **dnd-kit** for the UI.

Things worth looking at:

- **Ownership checks on every function.** Each query and mutation resolves the signed-in user and checks that every document it touches is theirs, including referenced ones. For example, adding a note checks that the link is yours, and moving a link checks that the target collection is yours.
- **Input validation** (`convex/validate.ts`):
  - links must be http or https;
  - ratings are whole numbers from 1 to 5;
  - text fields have length limits;
  - collection icons must be new image uploads under 1 MB.
- **Storage hygiene.** Replacing or deleting a collection icon deletes the file. A daily scheduled job (`convex/crons.ts`) removes uploads that were never attached to a collection.
- **Tests.** `convex-test` and Vitest cover the ownership rules, the validation, icon handling and account deletion (`convex/*.test.ts`).
- **CI.** GitHub Actions runs lint, type-checks for the app and the Convex functions, and the tests on every PR.

## Getting started

Run two terminals:

```sh
npx convex dev   # Convex backend: creates the project on first run and watches convex/
npm run dev      # Next.js on http://localhost:3000
```

Set these in the Convex dashboard's environment variables:

```
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
SITE_URL=http://localhost:3000
```

### Checks

```sh
npm run lint
npx tsc --noEmit -p . && npx tsc --noEmit -p convex
npm test
```

## Project structure

```
proxy.ts              # Auth redirects (Next 16 proxy, formerly middleware)
app/
  page.tsx            # / landing page
  app/page.tsx        # /app library (signed in)
  collections/[id]/   # Collection detail, drag-to-reorder
  entries/[id]/       # Link detail and learning notes
  export/             # Markdown export
  bookmarklet/        # Bookmarklet install page, plus the save pop-up
  api/bookmarklet/    # POST endpoint the bookmarklet pop-up calls
  privacy/            # Privacy page
  sign-in/            # Google sign-in
components/           # App components; ui/ holds base primitives
convex/
  schema.ts           # Tables and indexes
  auth.ts             # Google provider
  collections.ts      # Collections, icons, archive
  entries.ts          # Links: CRUD, explored state, bulk actions, search
  learnings.ts        # Learning notes
  users.ts            # Current user, account deletion
  storage.ts          # Upload URLs, orphaned-file cleanup
  crons.ts            # Daily cleanup job
  validate.ts         # Shared validation and ownership helpers
```

## Deploy

```sh
npx convex deploy   # backend
```

The frontend deploys to Vercel from `main`. Set `NEXT_PUBLIC_SITE_URL` (for example `https://breadcrumbs-rose.vercel.app`) so canonical URLs, the sitemap and Open Graph tags use the right domain.

## License

MIT
