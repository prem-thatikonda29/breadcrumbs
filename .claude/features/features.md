# Breadcrumbs — Feature Ideas

## Discovery & Review

**1. "Random entry to explore" button**
Pick a random unexplored entry from the inbox. Good for breaking decision paralysis.

**2. Streak / stats dashboard**
How many things explored this week, total learnings written, most active collection. Motivation layer.

**3. Due dates / reminders on entries**
"I want to read this by Friday." Could just be a date field + a filter for overdue items.

---

## Export & Sharing

**4. Export per entry**
Add a copy/download button directly on the entry detail page (`/entries/[id]`) that exports just that entry's learning notes as Markdown. The current export page only works at the collection level — this lets you grab notes for a single article without going through the export page.

**5. Public read-only share link for a collection**
Generate a shareable URL like `/share/[token]` that shows the collection's explored entries + learnings without requiring login.

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

---

## Intelligence

**10. Auto-suggest collection on entry creation**
Based on the URL domain or title, suggest which collection the entry might belong to.

**11. AI summary of all learnings in a collection**
One-click "summarize everything I learned in this collection" using the Claude API — outputs a draft blog post.

---

## Priority Matrix

| Priority | Feature | Effort |
|---|---|---|
| High | Export per entry | Low |
| Medium | Icon/image for collections | Low |
| Medium | Archive collection | Low |
| Medium | Favicon preview on cards | Medium |
| Medium | Stats dashboard | Medium |
| Medium | Tags on entries | Medium |
| Lower | Random entry button | Low |
| Lower | Public share link | Medium |
| Lower | AI summary | Medium |
| Lower | Due dates | Medium |
