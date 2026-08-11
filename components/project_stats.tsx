"use client";

import { motion, useReducedMotion } from "motion/react";
import { FillerText } from "./project_placeholder_media";
import type { Stat } from "../lib/resume_data";

const FALLBACK_STAT_COUNT = 3;
const FALLBACK_LABEL = "Metric label, what this number represents";

// "By the Numbers" — pulls quantifiable wins out of the Highlights bullet
// list into their own visual moment: giant Swiss-style figures (bigger than
// Highlights' pale numerals — these ARE the content, not decoration) with a
// short label underneath. Sits right before Highlights so the page reads
// outcome-first (numbers) then narrative (bullets/what's next). No image
// placeholders needed here — the big font treatment IS the abstract design
// for this beat. `stats` is optional per project — unset entries render as
// a placeholder dash + bracketed filler label.
export function ProjectStats({ stats }: { stats?: Stat[] }) {
  const reduceMotion = useReducedMotion();
  const resolvedStats =
    stats && stats.length > 0
      ? stats
      : Array.from({ length: FALLBACK_STAT_COUNT }, () => undefined as Stat | undefined);

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-10% 0px -10% 0px" },
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section data-slide className="flex min-h-dvh flex-col items-center justify-center px-6 py-20 md:px-10">
      <div className="mx-auto w-full max-w-5xl text-center">
        <motion.span
          {...reveal()}
          className="block text-xs font-bold uppercase tracking-[0.14em] text-muted"
        >
          By the Numbers
        </motion.span>

        <div className="mt-14 grid grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-8">
          {resolvedStats.map((stat, i) => (
            <motion.div key={i} {...reveal(0.1 + i * 0.1)} className="flex flex-col items-center gap-3">
              <span className="text-6xl font-bold leading-none tabular-nums tracking-tight text-foreground sm:text-7xl md:text-8xl">
                {stat?.value ?? "—"}
              </span>
              {stat ? (
                <p className="text-sm font-medium uppercase tracking-[0.08em] text-muted-strong">
                  {stat.label}
                </p>
              ) : (
                <FillerText className="text-sm font-medium uppercase tracking-[0.08em]">
                  {FALLBACK_LABEL}
                </FillerText>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
