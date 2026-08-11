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

## Copy

No em dashes in site copy — project `description`/`problem`/`bullets`/
`future` in `lib/resume_data.ts`, `content/experience/*.mdx`, and any other
visitor-facing text (not code comments or docs like this file, which are
fine as-is). Rephrase with a period, colon, or comma instead of reaching for
an em dash — it reads as an AI writing tic and the goal is prose in the
author's own voice.

## Layout

- Standard reading column: `max-w-3xl mx-auto w-full px-10`, used by most
  pages (About, Resume, Projects entry body, Experience list).
- Page top padding for content below the fixed nav: `pt-30 md:pt-52` — the
  `pt-40` mobile value left too large a gap above the first line of content
  on phone-width screens (the fixed `Logo` only needs `top-6 h-16`, ~88px,
  cleared), so mobile was brought down to `pt-30`, matching what Resume
  already used. Desktop's `md:pt-52` is unchanged. `home_content.tsx` had
  its own bug in the same family: `pt-30` on `<main>` *and* on its direct
  child stacked into 240px of dead space at every breakpoint (padding
  doesn't collapse like margins) — fixed by keeping the child's `pt-30`
  `md:`-only, so mobile drops to a single 120px while desktop keeps its
  original 240px total unchanged.
- The Experience entry page ("broadsheet" layout, see below) is a deliberate
  exception at `max-w-[900px] px-6 md:px-10` to give its two-column body
  enough width to breathe — not a general pattern to copy elsewhere without
  reason.
- `SOFT_MEDIA_BOX` (see below) is the standard treatment for boxed
  photography elsewhere on the site (rounded, hairline border, diffused
  shadow) — e.g. the Projects listing grid, MDX images. `FULL_BLEED` breaks
  an element to full viewport width regardless of its parent's width; it's
  used for genuine hero moments elsewhere. Real photo/video on a Projects
  entry page (see `ProjectPhotoCarousel` below) uses neither: it's laid out
  within the slide's own side padding, sized off the photo's real pixel
  dimensions rather than a fixed box.
- The Projects entry page (`app/projects/[slug]/page.tsx`) is an
  Apple-product-page / Swiss-grid "scroll-reveal" template — a full replacement
  for an earlier claymorphism poster/figure-card/dossier design (retired
  entirely, no trace of `clay-*`/`poster-*`/`figure-*`/`dossier-*` remains).
  It's a seven-beat sequence — Hero → Problem → Process (How It Works) →
  Demo (In Action) → Gallery → Stats (By the Numbers) → Highlights —
  built from stacked full-screen (`min-h-dvh` — a *minimum*, not a fixed
  height: see Problem below, which is allowed to grow taller — and
  `ProjectPhotoCarousel`'s slides below, which need the opposite, a
  genuinely fixed `h-dvh`, for a different reason explained there) sections
  (unlike most of the site, which is one continuously-scrolling column),
  each one revealing once via Framer Motion `whileInView`/staggered-mount as
  it enters the viewport (never scroll-jacked/pinned at the Framer Motion
  level — plain triggered reveals, so it holds up on mobile Safari/Android
  and any desktop browser without needing scroll-linked scrubbing). Every
  reveal is skipped/instant under `useReducedMotion()`, no exceptions.
  Separately, `components/project_slide_deck.tsx` *does* wheel-jack —
  see its own doc comment for how it special-cases a slide taller than the
  viewport (Problem) so normal scrolling still works inside it. There is no
  separate MDX write-up section anymore — the old per-project
  `content/projects/*.mdx` long-form write-ups were retired along with it
  (the `.mdx` files themselves are left on disk, unused, in case their prose
  gets folded into `problem`/`bullets`/`future` later; nothing renders them
  today). The fixed `Nav` (`components/nav.tsx`,
  the `HOME`/`PROJECTS`/`RESUME`/`EXPERIENCE` link list) is hidden entirely on
  every `/projects/<slug>` route — its vertical top-right link list collided
  with this template's own top-right corner elements (project number, the
  problem photo, gallery images), and the hero's own `← Projects` link
  already covers "go back," so there's no navigation lost. `Logo`
  (`components/logo.tsx`, the small top-left home mark) stays, raised to
  `z-[60]` (up from `z-50`) so it's guaranteed to paint above this
  template's sections — those run symmetric `py-10 md:py-12` padding, full
  height, with no top clearance carved out for it. Content sitting under the
  logo (e.g. the hero's `← Projects` link at small viewports) is expected
  and fine; the logo is opaque and always wins the stack.
  - **Hero** (`components/project_hero.tsx`): text-only, full screen — back
    link ("Back to Projects") stacked directly above a massive project
    number (`lib/project_data.ts`'s `getProjectPosition`, just the index,
    e.g. `01`, not `01 / 04` — arbitrary-value `text-[120px]` up to
    `text-[400px]` at `md+`, not the standard `text-9xl` scale, tabular-nums,
    `font-normal` (deliberately not bold, unlike `Project.name` — the size
    alone carries the weight here), full-opacity `text-background` — same
    white as `Project.name`, not the dimmer `/70`-ish tones used elsewhere
    in the corners), both right-aligned
    in the top-right corner (nothing pinned top-left anymore). The number is
    deliberately oversized, at or past `Project.name`'s own scale rather
    than staying a secondary label. Huge `Project.name` (`text-6xl`
    up to `text-9xl` at `lg+`) anchored
    bottom-left, and `Project.description` + flat `.project-chip` pills
    (tech/GitHub/paper links) anchored bottom-right. Stacks to a single
    bottom-aligned column below `md`. Staggered entrance via the shared
    `useCurtainEntranceVariants()` hook (`lib/curtain_entrance.ts`, the same
    one `home_content.tsx`/`projects_content.tsx`/`resume_content.tsx` use).
    Dark: `bg-foreground`/`text-background`, the same inverted near-black
    panel the home page's SONDER footer block uses — the only other place
    on the site that inverts like this, so the hero reuses it rather than
    introducing a new tone. Chips use the `.project-chip-on-dark` modifier
    (light hairline, invert-to-cream on hover) since the plain
    `.project-chip` hairline/hover is tuned for a light background and goes
    invisible on a dark one.
  - **Problem** (`components/project_problem.tsx`): a long-form, first-person,
    conversational "why I built this" statement (`Project.problem` — a
    single string, blank lines via `\n\n` for paragraph breaks — split into
    a `paragraphs` array, not rendered as one `whitespace-pre-line` block),
    done as a **pinned, one-paragraph-at-a-time reveal**: only one paragraph
    is ever visible, each new one overriding the last in the exact same
    spot rather than the page scrolling past it — a paragraph is either the
    one showing (solid `text-foreground`) or it isn't (invisible). Each
    paragraph's own last `GRAY_TAIL_WORDS` (6, via `paragraphParts()`) start
    muted and flip solid `--foreground` one whole word at a time as you
    scroll through that paragraph's own segment, finishing right as the
    next paragraph takes over — deliberately discrete, not a smooth
    continuous sweep (an earlier version used a `background-clip: text`
    gradient for a fluid left-to-right fill; a word is now either fully
    revealed or it isn't, no partial/mid-word state). Each word gets its
    own `<span>` (`WORD_FLIP_CLASS`: `transition-colors duration-[110ms]
    delay-[40ms]`) — the small delay before each flip's quick color
    transition is what gives it a "snap" rather than gliding. Which words
    are revealed is `revealedCount = Math.floor(localProgress *
    activeWords.length)`, written straight onto each word's inline
    `color` each scroll frame — not animated by CSS/scroll-scrub itself,
    just the flip transition. Structurally: an outer
    `data-slide` wrapper with an explicit inline `height` of
    `paragraphs.length * 100vh` (one full screen of scroll per paragraph),
    and an inner `sticky top-0 h-dvh` content box that stays visually
    pinned the whole time the wrapper scrolls past underneath it — nothing
    on screen moves or shifts. All paragraphs render at once, stacked
    exactly on top of each other via a CSS grid stack (every `<p>` shares
    `[grid-area:1/1]`, so the grid auto-sizes to the tallest one); the
    active one sits at `opacity: 1, translateY(0)`, the rest at `opacity: 0`
    and slid `SLIDE_PX` (32px) in the scroll direction they're waiting in
    (not-yet-shown paragraphs below by `+32px`, already-shown ones above by
    `-32px`) — `transition-[opacity,transform] duration-500` crossfades and
    slides the next paragraph into the outgoing one's place rather than an
    instant swap. Inactive paragraphs also get `aria-hidden="true"` so
    screen readers don't hear every paragraph read out at once. Which index
    is active, each paragraph's opacity/transform/`aria-hidden`, and how
    many tail words are revealed, is plain JS, not CSS/GSAP: a
    `lenis.on("scroll", ...)` listener
    recomputes `-wrapperRect.top / (wrapperRect.height - viewportHeight)`
    on every scroll frame as overall 0–1 progress, scales that by
    `paragraphs.length` to get an active index plus a `localProgress`
    (0–1 *within* that paragraph's own one-screen segment — the fractional
    remainder), and writes the resulting styles directly via refs — no
    React state, so this never triggers a re-render.
    `project_slide_deck.tsx` already knows to let
    normal scrolling happen inside any `data-slide` taller than the
    viewport instead of wheel-jacking through it, which is exactly what
    this wrapper needs, and required no further changes. Fully inert under
    `useReducedMotion()` — and deliberately branches to a *different DOM
    shape* for that case (all paragraphs laid out plainly in a column, no
    pinning, no sticky, no inline tall `height`) rather than just varying
    animation props like most of the deck does, so `reduceMotion` itself is
    pinned to `false` until after mount (`useMounted()`, the same
    `useSyncExternalStore` trick `lib/curtain_entrance.ts` uses) — otherwise
    that structural branch is a real hydration-mismatch risk if
    `useReducedMotion()` ever resolves differently between the server
    render and the first client render. Skipped entirely when a project has
    no `problem` set yet.
  - **Process** (`components/project_process.tsx`): "How It Works" — a text
    slide (kicker + big headline + up to a few numbered steps, reusing
    Highlights' pale-Swiss-numeral treatment below) followed by the
    project's architecture diagram/screenshot as a single-photo
    `ProjectPhotoCarousel` (see below) — tell, then show. A large,
    near-invisible watermark word ("PROCESS", `text-foreground/[0.05]`) sits
    behind the text slide as its abstract-design texture, the same device
    Hero's giant page number and Highlights' pale numerals already use,
    extended here rather than inventing a new motif. `Project.processHeadline`/
    `processDiagram`/`processSteps` are each independently optional: the
    whole beat is skipped if none are set; the diagram slide specifically is
    skipped if only steps/headline exist and no diagram has been added yet.
    A missing headline with real steps present still falls back to bracketed
    `FillerText` (`components/project_placeholder_media.tsx`) rather than
    leaving that line blank — but steps themselves are never padded with
    filler entries, only what's actually in `processSteps[]` renders.
  - **Demo** (`components/project_demo.tsx`): "In Action" — the same
    text-slide-then-photos shape as Process: a kicker + headline intro slide
    (watermark word "DEMO"), followed by a single `ProjectPhotoCarousel` fed
    every `Project.demoClips[]` entry (screenshot or `.mp4/.webm/.mov` screen
    recording) as one multi-photo track, not one slide per clip. Skipped
    entirely if the project has no `demoHeadline` and no `demoClips` yet.
  - **Gallery** (`components/project_gallery.tsx`): `Project.image` first,
    then each `Project.figures[]` entry, all fed into one
    `ProjectPhotoCarousel`. This replaced an earlier single 2x2 Swiss-grid
    contact sheet (`SOFT_MEDIA_BOX` cells, `object-cover` cropping, a "+N"
    overflow tile opening a lightbox popup) once real project photography
    made a shared small grid feel like a bottleneck rather than a showcase —
    `components/lightbox.tsx` and its `.lightbox-*`/`.project-gallery-overlay`
    CSS have been deleted outright (nothing else on the site used the
    lightbox); a later editorial-split single-photo-per-slide design
    (`ProjectPhotoSlide`) was tried and rejected too, in favor of the
    Apple-product-page carousel below (`components/project_photo_slide.tsx`
    is deleted, superseded). `Project.image` is still shared with the
    Projects listing card (`project_parallax.tsx`) and OG/social metadata,
    always the project's real photo. Skipped entirely when a project has no
    image/figures.
  - **`ProjectPhotoCarousel`** (`components/project_photo_carousel.tsx`): the
    shared building block behind every real photo on a Projects entry page —
    Process's diagram, every Demo clip, every Gallery photo — modeled on how
    Apple product pages showcase a product: a horizontal strip you scroll or
    step through, each photo enlarging as it becomes active. Every photo
    carries its own real pixel dimensions (the `ImageDimensions` type on
    `Project.imageDimensions`/`ProjectFigure`/`DemoClip`/`ProcessDiagram` in
    `lib/resume_data.ts`, pulled from the actual files) so its box is sized
    off its own resolution rather than a fixed generic frame — a portrait
    phone photo gets a tall narrow box, a wide dashboard screenshot gets a
    short wide one. There are limited real photos per project, so each one
    is shown as large as the slide allows rather than boxed small with
    padding around it.
    - **One photo**: no scroll track, no arrows, no dots — just one big
      centered hero. Sized via `max-h-full max-w-full` + `object-contain`
      (never `object-cover`) so the photo's own aspect ratio always wins:
      whichever of the slide's available width/height binds first, the
      photo scales to fill that and stops, never cropped and never
      distorted to fill a mismatched box. (A first attempt forced
      `height: 100%` unconditionally, which for a portrait photo in a wide
      slide meant its width got capped to the container while height stayed
      pinned full, and `object-cover` cropped a horizontal slice out of the
      middle of the photo to force-fit that mismatched box — exactly the
      "images are cropped" bug to avoid if this is ever touched again.)
    - **Multiple photos**: a `data-carousel-track` horizontal
      `overflow-x-auto`/`scroll-snap-type: x mandatory` strip, each photo
      `h-full w-auto object-cover` (no `max-w` here, so no crop conflict —
      an item is free to be wider than the viewport, reachable by
      scrolling/paging). The active (centered) photo sits at full
      scale/opacity, inactive ones dim and shrink slightly
      (`scale`/`opacity` via Framer Motion). Left/right circular arrow
      buttons (`‹`/`›`) sit over the track; whichever side has nothing
      further to go simply doesn't render its arrow (`active > 0` /
      `active < total - 1`), rather than rendering disabled. A caption
      crossfades below the track (`AnimatePresence`) and a row of dot
      indicators sits under that; a small "NN / NN" counter sits in the
      kicker row. Since `project_slide_deck.tsx` only ever wheel-jacks
      (never touches touch/trackpad-swipe input), the same wheel gesture
      that steps through the rest of the deck also steps through a
      carousel's photos first before advancing past its slide (see that
      file's own doc comment for the `data-carousel-track` special-case);
      touch/drag/scrollbar interaction just scrolls the track natively.
      Because native `scrollTo`/`scrollBy(behavior:'smooth')` and CSS
      `scroll-behavior: smooth` silently no-op on this kind of scroll-snap
      container in some environments, stepping between photos (arrows,
      dots, and the deck's own wheel handoff) all go through a hand-rolled
      rAF tween (`lib/smooth_scroll_to.ts`'s `animateScrollLeft`, with a
      `setTimeout` safety net) rather than the native smooth-scroll APIs.

    Both variants render their `<section data-slide>` at a genuinely fixed
    `h-dvh`, not the site's usual `min-h-dvh` (see Layout above) — this is
    load-bearing, not a style choice. The photo's own sizing (`max-h-full`/
    `h-full` percentages) only resolves against a *definite* ancestor
    height; `min-h-dvh` leaves a flex-grow slide's height indefinite until
    its content is measured, which is circular for a child whose own size
    depends on that same ancestor height, and Chromium falls back to sizing
    the flex item off its content's intrinsic size instead of the viewport.
    Concretely this both let single-hero photos render taller than the
    screen (defeating `object-contain`'s whole purpose) and made
    `project_slide_deck.tsx`'s own `isTaller()` check misfire (a slide that
    should never exceed one viewport got wheel pass-through treatment
    instead of a clean wheel-jack step). Videos autoplay/loop/muted/
    `playsInline`, same as photos otherwise.
  - **Stats** (`components/project_stats.tsx`): "By the Numbers" — up to a
    few `Project.stats[]` entries (`{ value, label }`), each a giant
    `tabular-nums` figure (bigger than Highlights' pale numerals below —
    these ARE the content, not decoration) with a label underneath. Sits
    right before Highlights so the page reads outcome-first (numbers), then
    narrative (bullets/what's next). An unset stat entry (project has no
    `stats` yet) renders as a placeholder `—` with a bracketed `FillerText`
    label rather than the whole beat vanishing.
  - **Highlights** (`components/project_highlights.tsx`): the closing slide —
    only rendered if `Project.bullets` and/or `Project.future` exist. Bullets
    render as a large pale Swiss-style numeral (`text-foreground/15`) beside
    each one, 1-col mobile / 2-col `md+`, staggered reveal; an optional
    "What's Next" list of forward-looking follow-ups (`Project.future`)
    renders underneath as a plain arrow-bulleted list.

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
  assume `window`. `<body>` is sized `h-dvh`/`min-h-dvh`, never plain
  `h-screen`/`100vh` — since `<body>` itself never scrolls (only the Lenis
  `<main>` nested inside it does), it never triggers iOS Safari's
  address-bar auto-collapse, so a `100vh` measurement (which on iOS means
  "as if the address bar were already hidden") permanently overshoots the
  actually-visible area by the chrome's height. That gap under-measures the
  Lenis wrapper's scrollable range by the same amount, so touch-scrolling
  hits an artificial floor short of the real bottom of the page and
  rubber-bands — on every page, since they all share this root layout.
  `dvh` tracks the real visible viewport instead, matching every other
  scroll-relevant height in this codebase (see the Layout section above).
- Page-level content reveals (stagger/fade-in on mount) use Framer Motion
  directly in the page component, timed off `CURTAIN_CONTENT_DELAY_S` so they
  don't start until the curtain has fully cleared.

## Shared utility classes (`lib/styles.ts`)

| Export             | What it does                                                                 |
| -------------------- | ------------------------------------------------------------------------------ |
| `LINK_UNDERLINE`     | Underline that draws in on hover/focus-visible. Standard link treatment.       |
| `ROW_FILL_HOVER`     | Background/text color inverts on hover/focus-visible. Used for list rows (e.g. Experience list).|
| `SOFT_MEDIA_BOX`     | Rounded corners + hairline border + diffused shadow, for boxed photography. The Projects listing grid (`components/project_parallax.tsx`) deliberately deviates — same hairline border/shadow, sharp square corners instead — don't copy that override elsewhere without reason. |
| `FULL_BLEED`         | Breaks an element to full viewport width via `margin: calc(50% - 50vw)` — works regardless of parent width, safe under transformed ancestors (unlike a `left: 50%; translate` approach). Used sparingly, for genuine hero moments — not by `ProjectPhotoCarousel`, whose photos stay within their slide's own side padding. |

## Content / MDX (`content/experience/`)

`content/projects/*.mdx` still exists on disk but is no longer imported or
rendered anywhere — the Projects entry page's write-up section was retired
in favor of the `problem`/`bullets`/`future` fields on `Project` (see
Layout above). The patterns below now apply to `content/experience/` only.

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
