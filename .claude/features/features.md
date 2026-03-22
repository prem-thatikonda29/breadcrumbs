# Breadcrumbs — Feature Ideas

## Discovery & Review

**1. "Random entry to explore" button**
Pick a random unexplored entry from the inbox. Good for breaking decision paralysis.

**2. Streak / stats dashboard**
How many things explored this week, total learnings written, most active collection. Motivation layer.

**3. Due dates / reminders on entries**
"I want to read this by Friday." Could just be a date field + a filter for overdue items.

**15. Pin / prioritize entries**
Pin entries to the top of the inbox so the most important ones don't get buried under newer saves. A simple `pinned` boolean field + sort order change.

**16. Progress counter on homepage**
Show a small "X explored this week" stat on the inbox page. Even a single number creates a feedback loop that makes the app feel rewarding to use.

**17. Entry aging indicator**
Visually flag entries that have been sitting unexplored for 30+ days — a subtle amber tint or "aging" badge. Nudges you to either explore or delete things you've lost interest in.

**18. Weekly email digest**
A weekly nudge email: "You have 12 unexplored entries. Here are 3 you saved a while ago." Keeps Breadcrumbs top of mind without opening the app.

---

## Navigation & Search

**19. Global search**
Search across entry titles, URLs, and learning note content from anywhere in the app. The Convex search indexes are already in place — this is mostly a UI feature. A `⌘K` command palette would be ideal.

**20. Smart filters / filter panel**
Filter the inbox by: date range, collection, explored/unexplored, entries with notes vs without, star rating. Lets you slice across all your data without needing tags or collections.

**21. Keyboard shortcuts**
Power-user navigation — `E` to mark explored, `N` to add a note, `⌘K` for search, arrow keys to move between entries. Especially useful on the inbox and collection pages.

---

## Organization

**6. Tags on entries**
Cross-collection tagging (e.g., `#ai`, `#ux`). A tag filter on the inbox would let you slice across collections.

**7. Icon or image for collections**
Let users attach an emoji icon or upload a custom image to a collection, shown in the sidebar and on the collection detail page alongside the color dot. Makes collections more visually distinct and easier to scan.

**8. Archive a collection**
Hide a completed collection from the sidebar without deleting it. Keeps the data, reduces clutter.

**9. Favicon / OG image preview on entry cards**
Fetch the favicon or OG image for the saved URL and show it as a thumbnail. Makes the inbox scannable at a glance.

**22. Collections reordering**
Drag to reorder collections in the sidebar. Right now they're sorted by creation date — letting users arrange them by priority would make the sidebar more useful.

**23. Collection goal / description**
Add a short goal or description to a collection, shown at the top of the collection page. E.g. "Goal: become proficient in Go by Q2." Adds intent and context to each collection.

**24. Link health check**
Periodically check saved URLs and flag entries where the link returns 404 or is unreachable. Dead links in your inbox are useless — surface them so you can remove or update them.

---

## Export & Sharing

**4. Export per entry** ✅
Add a copy/download button directly on the entry detail page (`/entries/[id]`) that exports just that entry's learning notes as Markdown.

**5. Public read-only share link for a collection**
Generate a shareable URL like `/share/[token]` that shows the collection's explored entries + learnings without requiring login.

---

## Reading Experience

**25. Reading mode**
Open the URL content inside the app (via a proxy or reader-mode parser) so you can read and take notes side by side without switching tabs. Big effort but transforms the core loop.

**26. Estimated read time**
Fetch the page metadata and show an estimated read time on each entry card. Helps you pick entries that fit the time you have ("I have 10 minutes, what can I read?").

**27. Highlight & clip (browser extension)**
Select text on any page and save it directly as a learning note, pre-attached to the entry. More powerful than the bookmarklet — requires a browser extension.

---

## Capture & Integrations

**12. PWA Share Target (mobile)**
Turn the app into a Progressive Web App and register it as a share target. Once installed on iOS/Android, Breadcrumbs appears in the system share sheet — share directly from YouTube, Instagram, Safari, or any app and the link lands in your inbox automatically. Requires a `manifest.json` with `share_target`, a Next.js route to receive the share, and a service worker.

**14. Public API endpoint**
A `POST /api/add` endpoint secured with a personal API key. Lets you connect from Zapier, Make, iOS Shortcuts, Android intents, Raycast, Alfred — anything that can make an HTTP request. One endpoint, infinite automation surfaces.

**28. Bulk import**
Paste a list of URLs or import a CSV from Pocket, Instapaper, or Readwise. For people switching to Breadcrumbs who don't want to start from scratch.

---

## Intelligence

**10. Auto-suggest collection on entry creation**
Based on the URL domain or title, suggest which collection the entry might belong to.

**11. AI summary of all learnings in a collection**
One-click "summarize everything I learned in this collection" using the Claude API — outputs a draft blog post.

---

## Polish & UX

**29. Dark mode**
System-aware dark mode using Tailwind's `dark:` classes. Low effort, high perceived quality.

**30. Onboarding flow**
Guide new users to create their first collection and save their first entry. Right now a blank app with no entries is confusing — a simple 3-step onboarding card on the inbox would fix that.

---

## Priority Matrix

| Priority | Feature | Effort |
|---|---|---|
| High | Mobile-friendly UI | Medium |
| High | PWA share target | Medium |
| High | Global search (⌘K) | Medium |
| High | Progress counter on homepage | Low |
| Medium | Pin / prioritize entries | Low |
| Medium | Smart filters | Medium |
| Medium | Icon/image for collections | Low |
| Medium | Archive collection | Low |
| Medium | Favicon preview on cards | Medium |
| Medium | Stats dashboard | Medium |
| Medium | Tags on entries | Medium |
| Medium | Dark mode | Low |
| Medium | Keyboard shortcuts | Medium |
| Medium | Collection goal/description | Low |
| Medium | Collections reordering | Low |
| Medium | Entry aging indicator | Low |
| Lower | Random entry button | Low |
| Lower | Public share link | Medium |
| Lower | AI summary | Medium |
| Lower | Due dates | Medium |
| Lower | Weekly email digest | Medium |
| Lower | Estimated read time | Medium |
| Lower | Reading mode | High |
| Lower | Highlight & clip | High |
| Lower | Link health check | Medium |
| Lower | Bulk import | Medium |
| Lower | Onboarding flow | Low |
| Lower | Public API endpoint | Low |
