"use client";

import { motion, useReducedMotion } from "motion/react";

// Swiss-grid spec-sheet treatment: a large pale numeral beside each bullet.
// The closing slide of the template — highlights/metrics, plus an optional
// "What's Next" list of forward-looking follow-ups underneath.
export function ProjectHighlights({
  bullets,
  future,
}: {
  bullets?: string[];
  future?: string[];
}) {
  const reduceMotion = useReducedMotion();
  const hasBullets = !!bullets && bullets.length > 0;
  const hasFuture = !!future && future.length > 0;
  if (!hasBullets && !hasFuture) return null;

  return (
    <section data-slide className="flex min-h-dvh flex-col justify-center px-6 py-20 md:px-10">
      <div className="mx-auto w-full max-w-5xl">
        {hasBullets && (
          <>
            <span className="block text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Highlights
            </span>
            <ol className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
              {bullets!.map((bullet, i) => {
                const reveal = reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-10% 0px -10% 0px" },
                      transition: {
                        duration: 0.6,
                        delay: Math.min(i, 4) * 0.08,
                        ease: [0.16, 1, 0.3, 1] as const,
                      },
                    };
                return (
                  <motion.li key={i} className="flex items-start gap-5" {...reveal}>
                    <span className="select-none text-5xl font-bold leading-none text-foreground/15 tabular-nums md:text-6xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-1 text-base font-medium leading-relaxed text-muted-strong md:text-lg">
                      {bullet}
                    </p>
                  </motion.li>
                );
              })}
            </ol>
          </>
        )}

        {hasFuture && (
          <div className={hasBullets ? "mt-16" : ""}>
            <span className="block text-xs font-bold uppercase tracking-[0.14em] text-muted">
              What&apos;s Next
            </span>
            <ul className="mt-6 flex flex-col gap-3">
              {future!.map((item, i) => {
                const reveal = reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 12 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-10% 0px -10% 0px" },
                      transition: {
                        duration: 0.5,
                        delay: i * 0.06,
                        ease: [0.16, 1, 0.3, 1] as const,
                      },
                    };
                return (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-base font-medium text-muted-strong md:text-lg"
                    {...reveal}
                  >
                    <span aria-hidden="true" className="mt-1 text-muted">
                      →
                    </span>
                    {item}
                  </motion.li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
