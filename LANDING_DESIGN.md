# Landing Page Redesign — Warm & Earthy Theme

---

## Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `cream-bg` | `#faf7f2` | Page background, section alternates |
| `white` | `#ffffff` | Card backgrounds, nav |
| `stone-900` | `#1c1917` | Primary text, footer bg |
| `stone-600` | `#57534e` | Body text, secondary |
| `stone-400` | `#a8a29e` | Muted / helper text |
| `stone-200` | `#e7e5e4` | Borders, dividers |
| `amber-600` | `#d97706` | Primary CTA button, icon accents |
| `amber-100` | `#fef3c7` | Icon bg tint, badge bg |
| `amber-900` | `#78350f` | CTA banner bg (gradient start) |
| `amber-500` | `#f59e0b` | Step circles, highlights |

### Typography

| Use | Style |
|---|---|
| H1 (hero) | `text-5xl sm:text-6xl font-bold tracking-tight` stone-900 |
| H2 (section) | `text-2xl font-bold` stone-900 |
| Body | `text-sm` / `text-base` stone-600 `leading-relaxed` |
| Badge / label | `text-xs` stone-500 |

### Component Styles

| Component | Class |
|---|---|
| Cards | `rounded-2xl border border-stone-200 bg-white p-6 shadow-sm` |
| Primary CTA button | `bg-amber-600 hover:bg-amber-700 text-white` |
| Badge pill | `rounded-full border border-amber-200 bg-amber-50 text-amber-700 px-3 py-1 text-xs` |
| Step circle | `h-10 w-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center` |
| Dashed connector | `border-t-2 border-dashed border-amber-300 flex-1 mx-4 mt-5` |

---

## Page Sections (top → bottom)

---

### 1. Nav Bar

- **Background**: `bg-white/90 backdrop-blur-sm`, sticky top, `border-b border-stone-200`
- **Left**: `<BookOpen>` icon in `text-amber-600` + "Breadcrumbs" in stone-900 bold
- **Right**: "Sign in" outline button → `/sign-in`

```
┌─────────────────────────────────────────────────────────────┐
│  📖 Breadcrumbs                              [  Sign in  ]  │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Hero — Split Layout

**Layout**: Two columns on `md+` (`grid md:grid-cols-2 gap-16`), stacked on mobile.

**Left — Text**
- Amber badge pill: `Personal knowledge tracker`
- H1: **"Stop losing tabs. Start building knowledge."**
- Subtext (stone-600): *"Breadcrumbs is a personal learning tracker. Save links, explore them at your own pace, and capture what you actually learned — all in one place."*
- CTA row:
  - Amber button: "Get started free →" → `/sign-in`
  - Ghost link: "See how it works ↓" (anchor to how-it-works section)

**Right — App Mockup Card**
- Outer: `rounded-xl bg-stone-100 shadow-2xl shadow-stone-200 overflow-hidden`
- Top chrome bar: three colored dots (red/yellow/green) + fake URL bar with `breadcrumbs.app/app`
- Inner app UI:
  - Header row: "Library" label + dim "+ Add" stub button
  - 3 mock entry rows:
    1. "The Product Roadmap Fallacy" — amber left border — medium.com — 2 days ago
    2. ~~"How Figma Builds"~~ — faint border, strikethrough — figma.com — 1 week ago *(explored)*
    3. "Shape Up by Basecamp" — amber left border — basecamp.com — 3 weeks ago

```
┌────────────────────────────────────────────────────────────────────┐
│                                    ┌──────────────────────────────┐│
│  Personal knowledge tracker        │ ● ● ●  breadcrumbs.app/app  ││
│                                    ├──────────────────────────────┤│
│  Stop losing tabs.                 │  Library              + Add  ││
│  Start building                    │ ──────────────────────────── ││
│  knowledge.                        │ ▌ The Product Roadmap...     ││
│                                    │   medium.com · 2 days ago    ││
│  Save links, explore them at       │ ──────────────────────────── ││
│  your own pace, and capture        │   ~~How Figma Builds~~  ✓   ││
│  what you actually learned.        │   figma.com · 1 week ago     ││
│                                    │ ──────────────────────────── ││
│  [Get started free →]  See how ↓  │ ▌ Shape Up by Basecamp       ││
│                                    │   basecamp.com · 3 weeks ago ││
│                                    └──────────────────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```

---

### 3. How It Works — 3 Steps

- **Background**: `bg-white`, `border-t border-stone-200`
- Section H2: "How it works"
- Subtitle: "Three steps. No friction." (stone-500, text-sm)
- Layout: `sm:grid-cols-3 gap-10`, centered text per column
- Between steps (desktop only): dashed amber horizontal connector (`border-t-2 border-dashed border-amber-300`)

| # | Title | Description |
|---|---|---|
| 1 | **Save** | Use the bookmarklet or PWA to save any link in one click — from any browser or device. |
| 2 | **Explore** | Work through your library at your own pace. Organize into collections, mark things explored as you go. |
| 3 | **Learn** | Write learning notes per link. Rate 1–5 stars. Export your collection as Markdown for your blog. |

```
        ①                  - - - - - -                  ②                  - - - - - -                  ③
   [amber circle]                                   [amber circle]                                   [amber circle]
      Save                                            Explore                                           Learn
  Use the bookmarklet                           Work through your                               Write learning notes
  or PWA to save any                            library at your own                             per link. Rate 1–5
  link in one click.                            pace. Mark explored.                            stars. Export as MD.
```

---

### 4. Features Grid — 2×2 Cards

- **Background**: `#faf7f2` (cream), `border-t border-stone-200`
- Section H2: "Everything you need"
- Subtitle: "Built for the way curious people actually learn."
- Layout: `sm:grid-cols-2 gap-5`

| Icon | Title | Description |
|---|---|---|
| `FolderOpen` (amber) | **Collections** | Group links by topic or project. Color-code, add icons, and archive when you're done. |
| `FileText` (amber) | **Learning notes** | Write insights as you explore each link. Star ratings help you resurface the best ones. |
| `Bookmark` (amber) | **One-click bookmarklet** | Save from any browser with one click — no extension needed. Drag to bookmarks bar, done. |
| `Check` (amber) | **Markdown export** | Export everything you've learned from a collection as clean Markdown — paste into your blog. |

Each card:
```
┌──────────────────────────────────────┐
│  ┌──────┐                            │
│  │  🗂  │  ← amber-100 bg box       │
│  └──────┘                            │
│  Collections                         │
│  Group links by topic or project...  │
└──────────────────────────────────────┘
```

---

### 5. CTA Banner

- **Background**: `bg-gradient-to-r from-amber-900 to-stone-900`
- H2 (white): "Start leaving breadcrumbs."
- Subtext (stone-400): "Free to use. Sign in with Google. Takes 10 seconds."
- Button: white outline `border-white/30 text-white hover:bg-white/10` → `/sign-in`

```
┌─────────────────────────────────────────────────────────────────┐
│                  ████████████████████████████████               │
│             Start leaving breadcrumbs.                          │
│          Free to use. Sign in with Google. Takes 10 seconds.    │
│                     [  Get started  →  ]                        │
│                  ████████████████████████████████               │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6. Footer

- **Background**: `bg-stone-900`, `border-t border-stone-800`
- Left: `<BookOpen>` in `text-amber-600` + "Breadcrumbs" in `text-stone-400 font-medium text-sm`
- Right: "Built for curious minds." in `text-stone-600 text-xs`

```
┌─────────────────────────────────────────────────────────────────┐
│  📖 Breadcrumbs                      Built for curious minds.   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Files to Modify

| File | Change |
|---|---|
| `app/page.tsx` | Full replacement with warm/earthy TSX |
| `app/globals.css` | `--background: #faf7f2` · `--foreground: #1c1917` |
| `app/layout.tsx` | `theme-color` meta → `#78350f` |
