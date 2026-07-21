const CURTAIN_COVER_MS = 500;
export const CURTAIN_HOLD_MS = 150;
const CURTAIN_SLIDE_MS = 550;

export const CURTAIN_COVER_S = CURTAIN_COVER_MS / 1000;
export const CURTAIN_SLIDE_S = CURTAIN_SLIDE_MS / 1000;

export const CURTAIN_COVER_EASE = [0.6, 0, 0.85, 0.35] as const;
export const CURTAIN_SLIDE_EASE = [0.65, 0, 0.35, 1] as const;

// Content entrance animation (app/page.tsx, app/projects/page.tsx) waits for
// the curtain to fully finish sliding away before it starts. This is measured
// from the moment the destination page mounts, which components/page_transition.tsx
// times to happen right as the curtain's hold phase begins (cover is already
// done by then) — so mount + hold + slide lands exactly on "fully revealed."
export const CURTAIN_CONTENT_DELAY_S = (CURTAIN_HOLD_MS + CURTAIN_SLIDE_MS) / 1000;
