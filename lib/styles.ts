export const LINK_UNDERLINE =
  "relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 focus-visible:after:scale-x-100";

export const ROW_FILL_HOVER =
  "transition-colors duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background";

// Apple-esque media box: soft rounded corners, a hairline edge, and a diffused
// shadow instead of a hard drop shadow. Shared so cards and hero images match.
export const SOFT_MEDIA_BOX =
  "overflow-hidden rounded-[28px] border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]";

// Breaks an element out to full viewport width regardless of how narrow its
// parent column is. The calc() (not a transform) means it stays correct
// under ancestors with their own transforms (the curtain page transition,
// Framer Motion content reveals, etc.).
export const FULL_BLEED = "w-screen mx-[calc(50%-50vw)]";
