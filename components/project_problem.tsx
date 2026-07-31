"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import type Lenis from "lenis";
import { useLenis } from "./scroll_container";

// This component picks an entirely different DOM shape for reduced motion
// (no sticky wrapper / inline tall height at all, vs. the pinned structure)
// rather than just varying animation props like the rest of the deck does
// — so naively reading useReducedMotion() risks a real hydration mismatch
// if it resolves differently between the server render and the first
// client render. Pinning reduceMotion to `false` until after mount (same
// trick lib/curtain_entrance.ts uses) guarantees the first client render
// matches the server exactly; the real value only takes effect on the
// client-only re-render right after, which React handles safely.
const subscribeNoop = () => () => {};
function useMounted() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

// How far a paragraph slides while crossfading in/out, and how many of its
// trailing words start muted and flip solid one at a time (never a partial
// word) as you scroll through that paragraph's own segment — independent
// of the paragraph-to-paragraph slide/fade. Each word's flip is a quick,
// slightly delayed color transition rather than tracking scroll 1:1, on
// purpose — a snap, not a smooth continuous sweep.
const SLIDE_PX = 32;
const GRAY_TAIL_WORDS = 6;
const WORD_FLIP_CLASS = "transition-colors duration-[110ms] delay-[40ms] ease-out";

function paragraphParts(text: string) {
  const words = text.split(" ");
  if (words.length <= GRAY_TAIL_WORDS) return { lead: text, tailWords: [] as string[] };
  return {
    lead: words.slice(0, -GRAY_TAIL_WORDS).join(" "),
    tailWords: words.slice(-GRAY_TAIL_WORDS),
  };
}

function ParagraphText({
  text,
  registerWordRef,
}: {
  text: string;
  registerWordRef?: (wordIndex: number, el: HTMLSpanElement | null) => void;
}) {
  const { lead, tailWords } = paragraphParts(text);
  return (
    <>
      {lead}
      {tailWords.map((word, i) => (
        <span
          key={i}
          ref={registerWordRef ? (el) => registerWordRef(i, el) : undefined}
          className={`text-muted ${registerWordRef ? WORD_FLIP_CLASS : ""}`}
        >
          {" "}
          {word}
        </span>
      ))}
    </>
  );
}

// A long-form, first-person "why I built this" statement, one paragraph at
// a time, pinned: the outer section (`data-slide`) is `paragraphs.length`
// viewports tall, but its inner content is `sticky top-0 h-dvh` — nothing
// on screen ever moves. All paragraphs sit stacked in the exact same spot
// (a CSS grid stack: every <p> shares `grid-area: 1 / 1`, so the container
// auto-sizes to the tallest one and they overlay each other); scrolling one
// screen's worth advances which one is active, and the next one overrides
// the current one in place via a slide+crossfade rather than the page
// scrolling past it. Within that screen's worth of scroll, the active
// paragraph's last few words flip from muted to solid one whole word at a
// time, finishing right as the next paragraph takes over.
// components/project_slide_deck.tsx already knows to let normal scrolling
// happen inside any `data-slide` taller than the viewport instead of
// wheel-jacking through it, which is exactly what this wrapper needs.
export function ProjectProblem({ problem }: { problem?: string }) {
  const systemReduceMotion = useReducedMotion();
  const mounted = useMounted();
  const reduceMotion = mounted && systemReduceMotion;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const lenisRef = useLenis();

  const paragraphs = problem
    ? problem
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  useEffect(() => {
    if (reduceMotion) return;
    const wrapper = wrapperRef.current;
    if (!wrapper || paragraphs.length === 0) return;

    let cancelled = false;
    let rafId = 0;
    let attachedLenis: Lenis | null = null;

    const update = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
      const scaled = progress * paragraphs.length;
      const active = Math.min(paragraphs.length - 1, Math.floor(scaled));
      const localProgress = Math.min(1, Math.max(0, scaled - active));

      paragraphRefs.current.forEach((el, i) => {
        if (!el) return;
        const diff = i - active;
        const isActive = diff === 0;
        el.style.opacity = isActive ? "1" : "0";
        el.style.transform = isActive ? "translateY(0)" : `translateY(${diff > 0 ? SLIDE_PX : -SLIDE_PX}px)`;
        el.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      const activeWords = wordRefs.current[active] ?? [];
      const revealedCount = Math.floor(localProgress * activeWords.length);
      activeWords.forEach((el, wi) => {
        if (!el) return;
        el.style.color = wi < revealedCount ? "var(--foreground)" : "var(--muted)";
      });
    };

    const trySetup = () => {
      if (cancelled) return;
      const lenis = lenisRef?.current;
      if (!lenis) {
        rafId = requestAnimationFrame(trySetup);
        return;
      }
      attachedLenis = lenis;
      lenis.on("scroll", update);
      update();
    };
    trySetup();

    window.addEventListener("resize", update);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      attachedLenis?.off("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reduceMotion, lenisRef, paragraphs.length]);

  if (paragraphs.length === 0) return null;

  const kicker = (
    <span className="mb-8 block text-center text-xs font-bold uppercase tracking-[0.14em] text-muted">
      Why I Built This
    </span>
  );

  // Reduced motion: every paragraph laid out plainly, all at once, no
  // pinning, no extra scroll runway, no scroll-linked slide/fade/flip.
  if (reduceMotion) {
    return (
      <section
        data-slide
        className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-24 md:px-10 md:py-32"
      >
        <div className="w-full max-w-5xl">
          {kicker}
          <div className="flex flex-col gap-6">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-center text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl"
              >
                <ParagraphText text={para} />
              </p>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const wrapperVh = paragraphs.length * 100;

  return (
    <section data-slide ref={wrapperRef} className="relative" style={{ height: `${wrapperVh}vh` }}>
      <div className="sticky top-0 flex h-dvh flex-col items-center justify-center px-6 md:px-10">
        <div className="w-full max-w-5xl">
          {kicker}
          <div className="grid">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                ref={(el) => {
                  paragraphRefs.current[i] = el;
                }}
                aria-hidden={i === 0 ? "false" : "true"}
                className="[grid-area:1/1] text-center text-2xl font-medium leading-snug tracking-tight text-foreground transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-3xl md:text-4xl lg:text-5xl"
                style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? "translateY(0)" : `translateY(${SLIDE_PX}px)` }}
              >
                <ParagraphText
                  text={para}
                  registerWordRef={(wordIndex, el) => {
                    if (!wordRefs.current[i]) wordRefs.current[i] = [];
                    wordRefs.current[i][wordIndex] = el;
                  }}
                />
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
