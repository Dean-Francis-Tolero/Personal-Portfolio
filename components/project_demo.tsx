"use client";

import { motion, useReducedMotion } from "motion/react";
import { FillerText } from "./project_placeholder_media";
import { ProjectPhotoCarousel } from "./project_photo_carousel";
import type { DemoClip } from "../lib/resume_data";

const FALLBACK_HEADLINE = "A one-line description of what's about to be shown running";

// "In Action": a short text intro (kicker + headline) followed by every
// demo clip in one ProjectPhotoCarousel (see project_photo_carousel.tsx).
// Skips entirely if the project has no headline and no clips yet.
export function ProjectDemo({
  headline,
  clips,
}: {
  headline?: string;
  clips?: DemoClip[];
}) {
  const reduceMotion = useReducedMotion();
  const hasClips = !!clips && clips.length > 0;
  if (!headline && !hasClips) return null;

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-10% 0px -10% 0px" },
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <>
      <section
        data-slide
        className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 py-20 md:px-10"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-6 select-none text-[110px] font-bold uppercase leading-none tracking-tight text-foreground/[0.05] sm:text-[160px] md:top-2 md:text-[220px]"
        >
          Demo
        </span>

        <div className="relative mx-auto w-full max-w-3xl">
          <motion.span
            {...reveal()}
            className="block text-xs font-bold uppercase tracking-[0.14em] text-muted"
          >
            In Action
          </motion.span>

          <motion.h2
            {...reveal(0.06)}
            className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl"
          >
            {headline ?? <FillerText className="inline text-inherit">{FALLBACK_HEADLINE}</FillerText>}
          </motion.h2>
        </div>
      </section>

      {hasClips && <ProjectPhotoCarousel items={clips!} kicker="In Action" />}
    </>
  );
}
