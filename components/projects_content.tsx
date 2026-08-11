"use client";

import { motion } from "motion/react";
import { projects } from "../lib/resume_data";
import { ProjectParallax } from "./project_parallax";
import { useCurtainEntranceVariants } from "../lib/curtain_entrance";

export default function ProjectsContent() {
  const { container, fadeRise } = useCurtainEntranceVariants();

  return (
    <main>
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(18,18,18,0.06),transparent)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-0 -z-10 select-none text-[140px] font-bold uppercase leading-none tracking-tight text-foreground/[0.04] sm:text-[220px] md:-top-10 md:text-[320px]"
        >
          Work
        </span>

        <motion.div
          variants={container}
          initial="initial"
          animate="animate"
          className="max-w-7xl mx-auto w-full px-10 pt-40 md:pt-52"
        >
          <motion.h1 variants={fadeRise} className="text-4xl md:text-6xl font-bold">
            Projects
          </motion.h1>
          <motion.p variants={fadeRise} className="mt-6 max-w-xl text-lg md:text-xl font-medium text-muted">
            A collection of projects exploring software engineering ideas.
          </motion.p>
        </motion.div>
      </div>

      <ProjectParallax projects={projects} />
    </main>
  );
}
