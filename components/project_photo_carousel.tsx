"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { toMedia } from "../lib/media";
import { animateScrollLeft } from "../lib/smooth_scroll_to";
import type { ImageDimensions } from "../lib/resume_data";

export type CarouselItem = {
  src: string;
  caption?: string;
} & ImageDimensions;

// An Apple-product-page style photo carousel, sized off each photo's own
// real pixel dimensions rather than a fixed generic box — a portrait photo
// gets a tall narrow box, a wide screenshot gets a short wide one, and
// `object-cover` never actually crops anything since each box's aspect
// ratio always matches its source exactly. Every item fills the track's
// full available height (computed by the surrounding flex layout, not a
// guessed dvh number) so real photography fills the slide instead of
// sitting in a small box surrounded by empty space — this is the limited
// set of real photos a project has, so each one is shown as big as the
// slide allows.
//
// Deliberately `<Image width height>` (real dimensions), never `fill`: a
// `fill` image is `position: absolute` and contributes zero intrinsic size
// to its flex container, so a flex item sized only by `aspect-ratio` CSS
// around an empty `fill` child collapses to 0×0 (confirmed directly — every
// photo rendered invisible under that approach). A normal sized `<img>` is
// a replaced element with real intrinsic size, so plain `h-full w-auto`
// sizes it correctly off the browser's own well-established image-sizing
// rules — no `aspect-ratio` CSS property needed at all.
//
// A single photo skips the scrollable track entirely and renders as one
// big centered hero (no dots/arrows — nothing to navigate to).
//
// Two ways to move through a multi-photo carousel, since
// project_slide_deck.tsx deliberately never wheel-jacks touch input:
// - Desktop: continuing the same wheel gesture that drives the rest of the
//   deck steps through the carousel first (see that file's own doc
//   comment), plus explicit prev/next arrow buttons — hidden at whichever
//   end there's nothing further to go.
// - Touch/drag/scrollbar: the track is a plain natively-scrollable
//   (`overflow-x-auto` + `scroll-snap-type: x mandatory`) element.
export function ProjectPhotoCarousel({
  items,
  kicker,
}: {
  items: CarouselItem[];
  kicker?: string;
}) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = items.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || total < 2) return;

    const computeActive = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      children.forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft + child.clientWidth / 2 - center);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    };

    computeActive();
    track.addEventListener("scroll", computeActive, { passive: true });
    return () => track.removeEventListener("scroll", computeActive);
  }, [total]);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    const clamped = Math.max(0, Math.min(total - 1, index));
    const child = track?.children[clamped] as HTMLElement | undefined;
    if (!track || !child) return;
    const target = child.offsetLeft - (track.clientWidth - child.clientWidth) / 2;
    animateScrollLeft(track, target, reduceMotion ? 0 : 450);
  };

  if (total === 0) return null;

  const labelRow = (kicker || total > 1) && (
    <div className="flex items-center justify-between px-6 md:px-10">
      {kicker ? (
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{kicker}</span>
      ) : (
        <span />
      )}
      {total > 1 && (
        <span className="text-xs font-bold tabular-nums text-muted">
          {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      )}
    </div>
  );

  // Single photo: one big centered hero, scaled up to whichever of the
  // slide's available width/height binds first (max-h-full/max-w-full +
  // object-contain, not object-cover) so a portrait photo never gets its
  // width force-capped to the wide container while height stays pinned
  // full — that combination previously cropped a horizontal slice out of
  // the middle of every portrait image. No scroll track / arrows / dots —
  // there's nothing to navigate to.
  if (total === 1) {
    const item = items[0];
    const media = toMedia(item.src);
    return (
      <section data-slide className="relative flex h-dvh flex-col gap-4 overflow-hidden py-10 md:py-12">
        {labelRow}
        <div className="relative flex min-h-0 flex-1 justify-center px-6 md:px-10">
          {media.isVideo ? (
            <video
              src={media.src}
              autoPlay
              loop
              muted
              playsInline
              className="h-auto max-h-full w-auto max-w-full self-center object-contain"
            />
          ) : (
            <Image
              src={media.src}
              alt=""
              width={item.width}
              height={item.height}
              className="h-auto max-h-full w-auto max-w-full self-center object-contain"
            />
          )}
        </div>
        {item.caption && (
          <p className="mx-auto max-w-xl px-6 text-center text-sm font-medium leading-relaxed text-muted-strong md:text-lg">
            {item.caption}
          </p>
        )}
      </section>
    );
  }

  return (
    <section data-slide className="relative flex h-dvh flex-col gap-4 overflow-hidden py-10 md:py-12">
      {labelRow}

      <div className="relative flex min-h-0 flex-1">
        {active > 0 && (
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => scrollToIndex(active - 1)}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-lg text-background transition-opacity hover:opacity-80 md:left-6 md:h-12 md:w-12"
          >
            ‹
          </button>
        )}

        <div
          ref={trackRef}
          data-carousel-track=""
          className="no-scrollbar flex h-full snap-x snap-mandatory gap-4 overflow-x-auto px-[12vw] md:gap-6"
        >
          {items.map((item, i) => {
            const media = toMedia(item.src);
            const isActive = i === active;
            return (
              <div key={item.src} className="relative h-full shrink-0 snap-center overflow-hidden">
                <motion.div
                  className="h-full"
                  animate={{ scale: isActive ? 1 : 0.88, opacity: isActive ? 1 : 0.45 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {media.isVideo ? (
                    <video
                      src={media.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-auto object-cover"
                    />
                  ) : (
                    <Image
                      src={media.src}
                      alt=""
                      width={item.width}
                      height={item.height}
                      className="h-full w-auto object-cover"
                    />
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>

        {active < total - 1 && (
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => scrollToIndex(active + 1)}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-lg text-background transition-opacity hover:opacity-80 md:right-6 md:h-12 md:w-12"
          >
            ›
          </button>
        )}
      </div>

      <div className="mx-auto min-h-[3.5rem] w-full max-w-xl px-6 text-center md:px-10">
        <AnimatePresence mode="wait">
          {items[active]?.caption && (
            <motion.p
              key={active}
              initial={reduceMotion ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-base font-medium leading-relaxed text-muted-strong md:text-lg"
            >
              {items[active].caption}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-foreground" : "w-1.5 bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
