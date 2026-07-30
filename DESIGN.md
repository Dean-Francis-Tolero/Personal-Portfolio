# Design system

Reference for this site's visual language. Check this before introducing any
new color, font, or layout convention — the goal is that every page reads as
one considered system, not a set of one-off decisions. Update this file
whenever a token or convention actually changes; if this file and the code
disagree, the code is right and this file is stale — fix the file.

## Color

Defined in `app/globals.css` `:root`, mapped to Tailwind utilities via
`@theme inline` (`bg-background`, `text-foreground`, `text-muted`, etc.).

| Token             | Value                     | Use                                                          |
| ------------------ | ------------------------- | ------------------------------------------------------------- |
| `--background`     | `#f2f0ef` (warm cream)     | Page background. Never pure white.                            |
| `--foreground`     | `#121212` (soft near-black)| Body text, headings, primary UI. Never pure black.             |
| `--muted`           | `#6d6d6d`                  | Secondary text. Passes WCAG AA on the cream background.        |
| `--muted-strong`    | `#7a7979`                  | Slightly heavier secondary text (e.g. nav hover) — only for large/bold text, not body copy. |
| `--rule`            | `rgba(18,18,18,0.14)`      | Hairline dividers/borders (e.g. broadsheet column rule).       |

**This palette is deliberately monochrome — no color accent.** Emphasis is
built with weight, size, spacing, and rules (borders/hairlines), not hue. A
colored accent (e.g. an oxblood/red used for the Experience page's broadsheet
kicker and pull-quotes) was tried and explicitly rejected — don't reintroduce
a color accent without asking first. If a design needs a stronger emphasis
than `--muted-strong` gives, reach for `--foreground` at heavier weight
before reaching for a new hue.

## Typography

Single typeface: **Switzer**, self-hosted via `next/font/local` in
`app/layout.tsx` (weights: Regular/Medium/Semibold/Bold, each with an italic).
Exposed as `--font-sans` / the `font-sans` Tailwind utility. No serif, no
second typeface anywhere on the site — if a design calls for a second face
(e.g. a prototype explored a serif for an editorial feel), that's a real
proposal to raise, not something to add quietly.

## Layout

- Standard reading column: `max-w-3xl mx-auto w-full px-10`, used by most
  pages (About, Resume, Projects entry body, Experience list).
- Page top padding for content below the fixed nav: `pt-40 md:pt-52`.
- The Experience entry page ("broadsheet" layout, see below) is a deliberate
  exception at `max-w-[900px] px-6 md:px-10` to give its two-column body
  enough width to breathe — not a general pattern to copy elsewhere without
  reason.
- `SOFT_MEDIA_BOX` (see below) is the standard treatment for boxed
  photography (rounded, hairline border, diffused shadow). `FULL_BLEED`
  breaks an element to full viewport width regardless of its parent's width —
  used sparingly, for genuine hero moments, not routine content images.
- The Projects entry page (`app/projects/[slug]/page.tsx`) is the visual
  counterpart to Experience's editorial broadsheet, and, unlike most of the
  site, is deliberately horizontal rather than one vertical column. It's a
  wider exception (`max-w-6xl px-6 md:px-10`, vs. the standard `max-w-3xl`
  reading column), and its images are spread across three points down the
  page instead of bunched into one block up top:
  - **Hero**: a `md:grid-cols-12` split — title, description, and the tech/
    repo/paper `.clay-chip` pills in a 5-column text block on the left, a
    single claymorphism "poster" panel (`.poster-panel`/`.poster-media` in
    `globals.css`) showing just `Project.image` in a 7-column block on the
    right. Stacks to text-above-image on mobile. A `.poster-media-placeholder`
    inset slot stands in for projects with no image yet.
  - **Figures**: any extra photos/screenshots (`Project.figures` in
    `lib/resume_data.ts` — each a `{ src, caption }` pair) render as
    `.figure-card`s via `ProjectFigures` (`components/project_figures.tsx`)
    — one figure per card, image and a short caption discussing what it
    actually shows side by side (`md:grid-cols-12`, image spanning 5
    columns, caption 7), alternating sides per figure via `md:order-*` so
    the rhythm doesn't get monotonous. Each card is a raised claymorphism
    panel (`box-shadow: var(--clay-raised)`) with the image itself pressed
    into it via `.figure-media`'s `--clay-inset-sm`, like a photo mounted in
    a frame — stronger claymorphism than the rest of the page, on purpose,
    since this is the one place meant to feel tactile. The whole card is the
    click target (`.figure-card` is a `<button>`, not just the image) and
    opens `components/lightbox.tsx`'s claymorphism modal variant
    (`.lightbox-clay`) — the figure at full scale (`object-fit: contain`,
    not cropped) in its own raised clay-inset panel next to its caption text,
    versus the plain centered-image viewer `ProjectPoster`'s hero image still
    uses (no caption to show, so no text-beside-image layout needed there).
    Figures split
    roughly in half, one group between Highlights and the write-up and one
    after it, numbered continuously across both (`startIndex` prop) so a
    project's figures still read as one sequence even though they're spread
    down the page rather than bunched into one block up top. `Project.paper`
    points at a PDF in the project's own `public/` subfolder (e.g.
    `/FLARE/Paper.pdf`) — if a project has a paper, pull its real
    figures/screenshots into `figures` (with real captions describing them)
    rather than leaving this section empty.
  - **Highlights**: its own full-width band below the hero split (3-column
    grid at `lg+`, since it has the whole container to use, not a narrower
    column).
  - **Write-up**: single-column prose (`.dossier-body`, numbered
    `.dossier-h2` sections, chip-style inline `code`), constrained to
    `max-w-3xl` inside the wider `max-w-6xl` article — so the page alternates
    wide (hero/figures/highlights) and narrow (write-up) zones rather than
    one uniform width top to bottom. Keep the write-up itself short (a few
    sections plus one pull-quote stat callout) — the figures and highlights
    are meant to carry most of the page's weight, not the prose.
- **Claymorphism, monochrome only**: `--clay-raised` / `--clay-inset` (plus
  `-sm` variants) in `globals.css` `:root` are soft dual-tone shadows — a
  light highlight (top-left) and a dark shadow (bottom-right), both very
  diffused — built only from `--foreground`/white-on-`--background`, no new
  hue. Raised = a filled/interactive element (chips, badges, the poster
  panel itself); inset = an empty/placeholder or pressed state (the "coming
  soon" image slot, a chip's hover state). This is Projects-only for now —
  a full-site claymorphism pass would be a real proposal to raise, not
  something to extend quietly to other pages.

## Static assets (`public/`)

Grouped by subject, not flat. Each project/post gets its own folder holding
every asset for that subject — logo, figures, paper — with the shared prefix
dropped since the folder name already carries it (`public/FLARE/logo.jpg`,
`public/FLARE/Architecture.png`, `public/FLARE/Paper.pdf`, not
`FLARE_logo.jpg` / `FLARE_Architecture.png` at the top level). Matches how
`public/blog/<slug>/` already worked for blog post figures — project assets
under `public/<ProjectName>/` follow the same idea. Referenced from
`lib/resume_data.ts` (`Project.image`/`figures`/`paper`) and MDX files as
absolute paths (`/FLARE/logo.jpg`). Assets that aren't tied to one
project/post (e.g. `Dean_Francis_Tolero_Resume.pdf`) stay at the `public/`
top level. Next.js special files (`favicon.ico`, `icon.png`,
`apple-icon.png`) live in `app/`, not `public/` — untouched by this
convention.

## Motion

- **Initial load**: `components/intro_loader.tsx` — a centered full-screen
  counter (0→100, `tabular-nums`, with its thin progress rule underneath)
  over `bg-background` that wipe-exits (`clipPath: inset()`, left→right)
  once, mounted in `app/layout.tsx` above
  `PageTransitionProvider`. Gated by `sessionStorage["intro-shown"]` so it
  only plays once per browser session (not on every route change — those are
  handled by the page-transition curtain below). Fully skipped when
  `useReducedMotion()` is true, same as the page-transition curtain.
- **Page transitions**: `components/page_transition.tsx` — a Framer Motion
  "curtain" (`bg-foreground` panel) covers the outgoing page, the route swaps
  underneath it, then it slides away to reveal the new page. Timing lives in
  `lib/transition_timing.ts`. Fully skipped (instant `router.push`, no
  animation) when `useReducedMotion()` is true — always respect
  `prefers-reduced-motion`, no exceptions.
- **Scrolling**: `components/scroll_container.tsx` — Lenis smooth-scroll
  wraps `{children}` in `app/layout.tsx`, synced to GSAP `ScrollTrigger` for
  any scroll-driven animation. `<body>` has `overflow-hidden`; the actual
  scrollable element is the Lenis-managed `<main>`, not `<body>` — if you need
  the scroll container in a component, use `useScrollContainer()`, don't
  assume `window`.
- Page-level content reveals (stagger/fade-in on mount) use Framer Motion
  directly in the page component, timed off `CURTAIN_CONTENT_DELAY_S` so they
  don't start until the curtain has fully cleared.

## Shared utility classes (`lib/styles.ts`)

| Export             | What it does                                                                 |
| -------------------- | ------------------------------------------------------------------------------ |
| `LINK_UNDERLINE`     | Underline that draws in on hover/focus-visible. Standard link treatment.       |
| `ROW_FILL_HOVER`     | Background/text color inverts on hover/focus-visible. Used for list rows (e.g. Experience list).|
| `SOFT_MEDIA_BOX`     | Rounded corners + hairline border + diffused shadow, for boxed photography.     |
| `FULL_BLEED`         | Breaks an element to full viewport width via `margin: calc(50% - 50vw)` — works regardless of parent width, safe under transformed ancestors (unlike a `left: 50%; translate` approach). |

## Content / MDX (`content/experience/`, `content/projects/`)

- `mdx-components.tsx` defines the **global** MDX renderers (headings,
  paragraphs, links, images, `LinkedInEmbed`, etc.) — these apply to every
  `.mdx` file by default.
- A specific page can override/extend those for just its own content by
  passing a `components` prop to the compiled MDX component (e.g.
  `<Post components={broadsheetComponents} />` in
  `app/experience/[slug]/page.tsx`). Next.js merges this with the global set
  automatically — confirmed against `node_modules/next/dist/docs`, don't
  assume standard MDX/React docs apply as-is on this Next version (see
  `AGENTS.md`).
- **Pitfall already hit once**: don't add a *plain CSS class* (in
  `globals.css`) that targets the same bare tag selectors
  (`h2`, `img`, `p`, ...) that `mdx-components.tsx` already applies Tailwind
  utility classes to — a class-scoped selector like `.my-class h2` has higher
  specificity than a lone utility class like `.text-2xl` and will silently
  win, fighting styles that look like they should already be correct. Prefer
  the local-`components`-override pattern above for page-specific MDX
  styling; reach for scoped plain CSS only for genuinely new markup you
  control end-to-end (like the broadsheet masthead).
- CSS multi-column layouts (`column-count` + `column-span: all`): every
  `column-span: all` element hard-resets the column flow and forces the
  browser to re-balance the segment before/after it independently. Too many
  spanning elements close together (e.g. spanning every heading *and* every
  image *and* every pull-quote) starves each segment of enough content to
  balance across columns, and you get a column that renders visibly empty.
  Keep spanning elements sparse — on the Experience broadsheet layout, only
  images span columns; headings and pull-quotes stay column-width.
