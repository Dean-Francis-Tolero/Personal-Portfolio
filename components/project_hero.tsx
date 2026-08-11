"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useCurtainEntranceVariants } from "../lib/curtain_entrance";
import { LINK_UNDERLINE } from "../lib/styles";
import type { Project } from "../lib/resume_data";

// Text-only, full-screen title card — an Apple-product-page corner layout
// rather than a centered block: back link + large project number stacked
// top-right, the project's name anchored bottom-left, and its brief
// description (plus tech/link chips) anchored bottom-right. Staggered
// entrance reuses the same curtain-timed choreography as the home/projects
// pages. Dark (bg-foreground/text-background), matching the home page's
// SONDER footer block — the one other place the site inverts to a solid
// near-black panel — rather than introducing a new tone.
export function ProjectHero({
  project,
  position,
}: {
  project: Project;
  position: { index: number; total: number };
}) {
  const { container, fadeRise } = useCurtainEntranceVariants();

  return (
    <motion.section
      variants={container}
      initial="initial"
      animate="animate"
      data-slide
      className="relative flex min-h-dvh flex-col bg-foreground px-6 py-10 text-background md:px-10 md:py-12"
    >
      <motion.div variants={fadeRise} className="flex flex-col items-end gap-2">
        <Link
          href="/projects"
          className={`${LINK_UNDERLINE} text-sm font-bold uppercase text-background/55 hover:text-background/80`}
        >
          Back to Projects
        </Link>
        <span className="text-[clamp(100px,24vw,420px)] font-normal leading-none tabular-nums text-background">
          {String(position.index).padStart(2, "0")}
        </span>
      </motion.div>

      <div className="flex flex-1 flex-col justify-end gap-10 pb-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <motion.h1
          variants={fadeRise}
          className="max-w-full text-[clamp(44px,32px+4vw,128px)] font-bold leading-[0.92] tracking-tight md:max-w-[56%]"
        >
          {project.name}
        </motion.h1>

        <motion.div
          variants={fadeRise}
          className="flex flex-col items-start gap-5 md:max-w-xs md:items-end md:text-right"
        >
          <p className="text-base font-medium text-background/80 md:text-lg">
            {project.description}
          </p>

          {(project.tech || project.link || project.paper) && (
            <div className="flex flex-wrap gap-3 md:justify-end">
              {project.tech?.map((t) => (
                <span key={t} className="project-chip project-chip-on-dark">
                  {t}
                </span>
              ))}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="project-chip project-chip-on-dark"
                >
                  View on GitHub
                </a>
              )}
              {project.paper && (
                <a
                  href={project.paper}
                  target="_blank"
                  rel="noreferrer"
                  className="project-chip project-chip-on-dark"
                >
                  Read the Paper
                </a>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
