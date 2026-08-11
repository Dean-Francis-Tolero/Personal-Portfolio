"use client";

import { motion, useReducedMotion } from "motion/react";
import { FillerText } from "./project_placeholder_media";
import { ProjectPhotoCarousel } from "./project_photo_carousel";
import type { ProcessStep, ProcessDiagram } from "../lib/resume_data";

const FALLBACK_HEADLINE =
  "One clear, punchy sentence on the core mechanism, e.g. how a request actually moves through the system";

// "How It Works": a text slide (kicker + headline + numbered steps) followed
// by the architecture diagram in a ProjectPhotoCarousel (see
// project_photo_carousel.tsx) — tell, then show. A single-item carousel
// just renders the one diagram enlarged, no dots/index needed. The whole
// beat is skipped if the project has nothing set for it yet; the diagram
// slide specifically is skipped if only steps/headline exist and no
// diagram has been added.
export function ProjectProcess({
  headline,
  diagram,
  steps,
}: {
  headline?: string;
  diagram?: ProcessDiagram;
  steps?: ProcessStep[];
}) {
  const reduceMotion = useReducedMotion();
  const hasSteps = !!steps && steps.length > 0;
  if (!headline && !hasSteps && !diagram) return null;

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
      {(headline || hasSteps) && (
        <section
          data-slide
          className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 py-20 md:px-10"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-6 select-none text-[110px] font-bold uppercase leading-none tracking-tight text-foreground/[0.05] sm:text-[160px] md:top-2 md:text-[220px]"
          >
            Process
          </span>

          <div className="relative mx-auto w-full max-w-3xl">
            <motion.span
              {...reveal()}
              className="block text-xs font-bold uppercase tracking-[0.14em] text-muted"
            >
              How It Works
            </motion.span>

            <motion.h2
              {...reveal(0.06)}
              className="mt-4 text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl"
            >
              {headline ?? <FillerText className="inline text-inherit">{FALLBACK_HEADLINE}</FillerText>}
            </motion.h2>

            {hasSteps && (
              <div className="mt-14 flex flex-col gap-8">
                {steps!.map((step, i) => (
                  <motion.div key={i} {...reveal(0.12 + i * 0.08)} className="flex items-start gap-5">
                    <span className="select-none text-4xl font-bold leading-none text-foreground/15 tabular-nums md:text-5xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-1 text-base font-medium leading-relaxed text-muted-strong md:text-lg">
                      {step.caption}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {diagram && (
        <ProjectPhotoCarousel
          items={[{ src: diagram.src, width: diagram.width, height: diagram.height }]}
          kicker="How It Works"
        />
      )}
    </>
  );
}
