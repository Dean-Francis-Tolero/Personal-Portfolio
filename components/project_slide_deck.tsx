"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";
import { useReducedMotion } from "motion/react";
import { useScrollContainer, useLenis } from "./scroll_container";

const SLIDE_DURATION_S = 0.9;

// easeInOutCubic — a plain (t) => number function, since Lenis's `easing`
// option takes that shape, not a cubic-bezier array like Framer Motion's.
const SLIDE_EASE = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Turns whatever full-screen `[data-slide]` sections exist inside it (in DOM
// order) into a wheel-jacked slide sequence: one wheel gesture advances
// exactly one slide via gsap/Observer, animated through the site's existing
// Lenis instance (`lenis.scrollTo`, not a native scrollTo, so it stays in
// sync with Lenis's own state). Deliberately scoped to `type: "wheel"` only
// — touch swipes, trackpad drags, the scrollbar, and keyboard paging are
// never captured, so the page never feels trapped and mobile never gets
// jacked at all. Which sections count as slides is discovered from the
// rendered DOM, not a hardcoded list — add/remove/reorder `data-slide`
// sections (Hero, Problem, ProjectGallery images, Highlights) and the deck
// just adapts.
//
// A slide is allowed to be taller than one viewport (the Problem section's
// long-form statement, when it needs more than one screen's worth of
// height) — while the current slide is one of those, wheel ticks are left
// alone entirely so Lenis's own listener scrolls it normally, and the deck
// only resumes jacking once the user has actually scrolled to that slide's
// far edge. Landing on a tall slide from below aligns to its bottom, not
// its top, so scrolling back up immediately continues through its content
// instead of re-triggering the jack on the very next tick.
export function ProjectSlideDeck({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useScrollContainer();
  const lenisRef = useLenis();
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reduceMotion) return;
      const container = containerRef.current;
      if (!container) return;

      let cancelled = false;
      let rafId = 0;
      let observer: Observer | null = null;

      // ScrollContainerProvider (an ancestor, in app/layout.tsx) creates its
      // Lenis instance in its own effect — which, on mount, fires *after*
      // this component's effect (child effects run before parent effects).
      // Poll a frame at a time until the ref is populated rather than
      // silently no-op-ing on a null lenis.
      const trySetup = () => {
        if (cancelled) return;
        const wrapper = wrapperRef?.current;
        const lenis = lenisRef?.current;
        if (!wrapper || !lenis) {
          rafId = requestAnimationFrame(trySetup);
          return;
        }

        const slides = Array.from(container.querySelectorAll<HTMLElement>("[data-slide]"));
        if (slides.length === 0) return;

        let currentIndex = 0;
        let animating = false;

        // A couple of px of tolerance against sub-pixel rounding, not a
        // meaningful threshold.
        const isTaller = (slide: HTMLElement) => slide.offsetHeight > wrapper.clientHeight + 2;

        const goTo = (index: number, alignToBottom = false) => {
          const clamped = Math.max(0, Math.min(slides.length - 1, index));
          if (clamped === currentIndex || animating) return;
          animating = true;
          const target = slides[clamped];
          // Entering a tall slide from below lands on its bottom edge
          // (a plain scroll-position number) instead of its top (the
          // element itself, Lenis's default for an element target) — so
          // scrolling back up from it immediately continues through its
          // content instead of the very next tick re-triggering the jack.
          const scrollTarget =
            alignToBottom && isTaller(target)
              ? target.offsetTop + target.offsetHeight - wrapper.clientHeight
              : target;
          // Lenis's own wheel handler doesn't check event.defaultPrevented —
          // it reads the raw delta and nudges scroll regardless, which would
          // otherwise fight this jump on every wheel tick that lands during
          // the animation. stop()/start() (with scrollTo's `force: true` to
          // still work while stopped) makes this jump the sole source of
          // scroll for its duration, then hands wheel/touch/etc. back to
          // Lenis exactly as before once it completes.
          lenis.stop();
          lenis.scrollTo(scrollTarget, {
            force: true,
            duration: SLIDE_DURATION_S,
            easing: SLIDE_EASE,
            onComplete: () => {
              lenis.start();
              animating = false;
              currentIndex = clamped;
            },
          });
        };

        observer = Observer.create({
          target: wrapper,
          type: "wheel",
          tolerance: 10,
          preventDefault: true,
          // Observer's deltaY > 0 means the wheel gesture is scrolling down
          // (onDown) — advance a slide; deltaY < 0 (onUp) — go back one.
          // While the current slide is taller than the viewport and its far
          // edge hasn't been reached yet, do nothing at all — Lenis's own
          // listener (unaffected by this Observer's preventDefault, per the
          // note above) already scrolls the wrapper normally for this same
          // wheel event, so "doing nothing" here is exactly "let it scroll."
          onDown: () => {
            const current = slides[currentIndex];
            if (isTaller(current)) {
              const bottomReached =
                wrapper.scrollTop + wrapper.clientHeight >= current.offsetTop + current.offsetHeight - 2;
              if (!bottomReached) return;
            }
            goTo(currentIndex + 1);
          },
          onUp: () => {
            const current = slides[currentIndex];
            if (isTaller(current)) {
              const topReached = wrapper.scrollTop <= current.offsetTop + 2;
              if (!topReached) return;
            }
            goTo(currentIndex - 1, true);
          },
        });
      };

      trySetup();

      return () => {
        cancelled = true;
        if (rafId) cancelAnimationFrame(rafId);
        observer?.kill();
      };
    },
    { dependencies: [reduceMotion], scope: containerRef }
  );

  return <div ref={containerRef}>{children}</div>;
}
