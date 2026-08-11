"use client";

import { motion } from "motion/react";
import { projects } from "../lib/resume_data";
import { ProjectParallax } from "./project_parallax";
import { useCurtainEntranceVariants } from "../lib/curtain_entrance";

export default function ProjectsContent() {
  const { container, fadeRise } = useCurtainEntranceVariants();

  return (
    <main className="relative overflow-hidden">
      {/* Two soft washes bracketing the page, not fixed to the viewport —
          each scrolls with the content, so the top one recedes behind you
          as you scroll down and the bottom one only comes into view near
          the end of the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[50vh] bg-gradient-to-b from-foreground/10 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[50vh] bg-gradient-to-t from-foreground/10 to-transparent"
      />

      <motion.div
        variants={container}
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto w-full px-10 pt-30 md:pt-52"
      >
        <motion.h1 variants={fadeRise} className="text-4xl md:text-6xl font-bold">
          Projects
        </motion.h1>
        <motion.p variants={fadeRise} className="mt-6 max-w-xl text-lg md:text-xl font-medium text-muted">
          A collection of projects exploring software engineering ideas.
        </motion.p>
      </motion.div>

      <ProjectParallax projects={projects} />
    </main>
  );
}
